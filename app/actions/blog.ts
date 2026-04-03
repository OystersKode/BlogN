'use server';

import connectDB from '@/lib/db';
import Blog from '@/models/Blog';
import User from '@/models/User';
import Notification from '@/models/Notification';
import Comment from '@/models/Comment';
import { slugify, estimateReadingTime } from '@/lib/utils';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function createBlog(formData: any) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    throw new Error('Not authenticated');
  }

  await connectDB();

  const { title, content, coverImage, status } = formData;
  const slug = `${slugify(title)}-${Math.random().toString(36).substr(2, 5)}`;
  const readingTime = estimateReadingTime(content);

  const newBlog = new Blog({
    title,
    slug,
    content,
    coverImage,
    author: (session.user as any).id,
    status,
    readingTime,
  });

  await newBlog.save();

  // Notification engine hook: alert followers of new post
  try {
     const authorUserData = await User.findById(newBlog.author).select('followers');
     if (authorUserData && authorUserData.followers && authorUserData.followers.length > 0) {
        const notifications = authorUserData.followers.map((followerId: string) => ({
           recipient: followerId,
           sender: newBlog.author,
           type: 'NEW_POST',
           blog: newBlog._id,
        }));
        await Notification.insertMany(notifications);
     }
  } catch (err) {
     console.error('Failed to dispatch notifications', err);
  }

  revalidatePath('/');
  return { slug: newBlog.slug };
}

export async function getBlogs(feedType = 'all') {
  await connectDB();
  const session = await getServerSession(authOptions);
  
  let matchQuery: any = { status: 'PUBLISHED' };

  if (session && feedType === 'following') {
     const userObj = await User.findById((session.user as any).id).select('following').lean();
     matchQuery.author = { $in: userObj?.following || [] };
  } else if (feedType === 'staff') {
     matchQuery.isStaffPick = true;
  }

  const blogs = await Blog.find(matchQuery).populate('author', 'name image').sort({ createdAt: -1 }).lean();
  
  // Aggregate comment counts for the fetched blogs globally
  const blogIds = blogs.map((b: any) => b._id);
  const commentCounts = await Comment.aggregate([
     { $match: { blog: { $in: blogIds } } },
     { $group: { _id: '$blog', count: { $sum: 1 } } }
  ]);
  const commentMap: Record<string, number> = {};
  commentCounts.forEach(c => { commentMap[c._id.toString()] = c.count; });
  
  if (session) {
      const user = await User.findById((session.user as any).id).select('bookmarks').lean();
      const bookmarks = (user?.bookmarks || []).map((b: any) => b.toString());
      const userId = (session.user as any).id;
      
      blogs.forEach((b: any) => {
         b.isBookmarkedByMe = bookmarks.includes(b._id.toString());
         b.likesCount = b.likes?.length || 0;
         b.isLikedByMe = (b.likes || []).map((id: any) => id.toString()).includes(userId);
         b.commentsCount = commentMap[b._id.toString()] || 0;
      });
  } else {
      blogs.forEach((b: any) => {
         b.likesCount = b.likes?.length || 0;
         b.commentsCount = commentMap[b._id.toString()] || 0;
      });
  }
  
  return JSON.parse(JSON.stringify(blogs));
}

export async function getBlogBySlug(slug: string) {
  await connectDB();
  const blog = await Blog.findOne({ slug }).populate('author', 'name image bio socials').lean();
  if (!blog) return null;
  
  const session = await getServerSession(authOptions);
  if (session) {
      const user = await User.findById((session.user as any).id).select('bookmarks following').lean();
      blog.isBookmarkedByMe = (user?.bookmarks || []).map((b: any) => b.toString()).includes(blog._id.toString());
      blog.likesCount = blog.likes?.length || 0;
      blog.isLikedByMe = (blog.likes || []).map((id: any) => id.toString()).includes((session.user as any).id);
      blog.isFollowingAuthor = (user?.following || []).map((b: any) => b.toString()).includes(blog.author._id.toString());
  } else {
      blog.likesCount = blog.likes?.length || 0;
  }
  
  return JSON.parse(JSON.stringify(blog));
}

export async function deleteBlog(id: string) {
  const session = await getServerSession(authOptions);
  
  if (!session || (session.user as any).role !== 'ADMIN') {
    throw new Error('Not authorized');
  }

  await connectDB();
  await Blog.findByIdAndDelete(id);
  revalidatePath('/');
}

export async function toggleBookmark(blogId: string) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");
  
  await connectDB();
  const user = await User.findById((session.user as any).id);
  const isBookmarked = user.bookmarks.includes(blogId);
  
  if (isBookmarked) {
    user.bookmarks.pull(blogId);
  } else {
    user.bookmarks.push(blogId);
  }
  
  await user.save();
  revalidatePath('/');
  revalidatePath('/bookmarks');
  return { isBookmarked: !isBookmarked };
}

export async function getBookmarks() {
  const session = await getServerSession(authOptions);
  if (!session) return [];
  
  await connectDB();
  const user = await User.findById((session.user as any).id).populate({
    path: 'bookmarks',
    populate: { path: 'author', select: 'name image' }
  }).lean();
  
  if (!user || (!user.bookmarks)) return [];
  
  const bookmarks = user.bookmarks.map((b: any) => {
      b.isBookmarkedByMe = true;
      b.likesCount = b.likes?.length || 0;
      b.isLikedByMe = (b.likes || []).map((id: any) => id.toString()).includes((session.user as any).id.toString());
      return b;
  });
  
  return JSON.parse(JSON.stringify(bookmarks));
}

export async function toggleLike(blogId: string) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");
  
  await connectDB();
  const blog = await Blog.findById(blogId);
  if (!blog) throw new Error("Blog not found");
  
  const userId = (session.user as any).id;
  const isLiked = blog.likes.includes(userId);
  
  if (isLiked) {
    blog.likes.pull(userId);
  } else {
    blog.likes.push(userId);
    
    // Notification engine hook: alert author of like
    try {
       if (blog.author.toString() !== userId.toString()) {
          const newNotif = new Notification({
             recipient: blog.author,
             sender: userId,
             type: 'LIKE',
             blog: blog._id
          });
          await newNotif.save();
       }
    } catch (err) {
       console.error('Failed to dispatch like notification', err);
    }
  }
  
  await blog.save();
  revalidatePath('/');
  revalidatePath(`/blog/${blog.slug}`);
  return { isLiked: !isLiked, likesCount: blog.likes.length };
}

export async function getStaffPicks() {
  await connectDB();
  const blogs = await Blog.find({ isStaffPick: true, status: 'PUBLISHED' })
    .populate('author', 'name image')
    .sort({ updatedAt: -1 })
    .limit(5)
    .lean();
  return JSON.parse(JSON.stringify(blogs));
}
