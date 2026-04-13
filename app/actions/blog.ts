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

  // De-proxy the input data from React 19's client reference system
  const data = JSON.parse(JSON.stringify(formData));
  const { title, content, coverImage, status, coAuthors } = data;
  const slug = `${slugify(title)}-${Math.random().toString(36).substr(2, 5)}`;
  const readingTime = estimateReadingTime(content);

  // Validate co-authors exist and cap at 3
  const validCoAuthors: string[] = [];
  if (Array.isArray(coAuthors) && coAuthors.length > 0) {
    const found = await User.find({ _id: { $in: coAuthors.slice(0, 3) } }).select('_id').lean();
    found.forEach((u: any) => validCoAuthors.push(String(u._id)));
  }

  const newBlog = await Blog.create({
    title,
    slug,
    content,
    coverImage,
    author: String((session.user as any).id),
    status,
    readingTime,
    coAuthors: validCoAuthors,
  });

  // Notification engine hook: alert followers of new post
  try {
      const authorUserData = await User.findById(newBlog.author).select('followers');
      if (authorUserData && authorUserData.followers && authorUserData.followers.length > 0) {
         const authorIdStr = String(newBlog.author);
         const blogIdStr = String(newBlog._id);
         const notifications = authorUserData.followers.map((followerId: any) => ({
            recipient: String(followerId),
            sender: authorIdStr,
            type: 'NEW_POST',
            blog: blogIdStr,
         }));
         await Notification.insertMany(notifications);
      }
  } catch (err) {
      console.error('Failed to dispatch notifications', err);
  }

  revalidatePath('/');
  return { slug: String(newBlog.slug) };
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

  const blogs = await Blog.find(matchQuery)
    .populate('author', 'name image')
    .populate({ path: 'coAuthors', select: 'name image prn', options: { strictPopulate: false } })
    .sort({ createdAt: -1 })
    .select('-content')
    .lean();
  
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
  const blog = await Blog.findOne({ slug })
    .populate('author', 'name image bio socials')
    .populate({ path: 'coAuthors', select: 'name image prn', options: { strictPopulate: false } })
    .lean();
  if (!blog) return null;

  // Guard: if the author user was deleted, treat the blog as not found
  // to prevent crashes when accessing blog.author.name / blog.author._id
  if (!blog.author || !(blog.author as any)._id) return null;
  
  const session = await getServerSession(authOptions);
  if (session) {
      const user = await User.findById((session.user as any).id).select('bookmarks following').lean();
      blog.isBookmarkedByMe = (user?.bookmarks || []).map((b: any) => b.toString()).includes(blog._id.toString());
      blog.likesCount = blog.likes?.length || 0;
      blog.isLikedByMe = (blog.likes || []).map((id: any) => id.toString()).includes((session.user as any).id);
      blog.isFollowingAuthor = (user?.following || []).map((b: any) => b.toString()).includes((blog.author as any)._id.toString());
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
  if (!user) throw new Error("User not found");
  
  const blogIdStr = blogId.toString();
  const isBookmarked = (user.bookmarks || []).map((id: any) => id.toString()).includes(blogIdStr);
  
  if (isBookmarked) {
    user.bookmarks = (user.bookmarks || []).filter((id: any) => id.toString() !== blogIdStr);
  } else {
    user.bookmarks.push(blogIdStr as any);
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
  return { isLiked: !isLiked, likesCount: Number(blog.likes.length) };
}

export async function getStaffPicks() {
  await connectDB();
  const blogs = await Blog.find({ isStaffPick: true, status: 'PUBLISHED' })
    .populate('author', 'name image')
    .populate({ path: 'coAuthors', select: 'name image prn', options: { strictPopulate: false } })
    .sort({ updatedAt: -1 })
    .limit(5)
    .lean();
  return JSON.parse(JSON.stringify(blogs));
}

export async function getBlogById(id: string) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error('Not authenticated');

  await connectDB();
  const blog = await Blog.findById(id)
    .populate('author', 'name image bio socials')
    .populate({ path: 'coAuthors', select: 'name image prn', options: { strictPopulate: false } })
    .lean();

  if (!blog) return null;

  // Security check: Only author or co-authors can edit
  const userId = (session.user as any).id;
  const isAuthor = blog.author._id.toString() === userId.toString();
  const isCoAuthor = (blog.coAuthors || []).some((ca: any) => String(ca._id) === String(userId));

  if (!isAuthor && !isCoAuthor) {
    throw new Error('Not authorized to edit this blog');
  }

  return JSON.parse(JSON.stringify(blog));
}

export async function updateBlog(id: string, data: any) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error('Not authenticated');

  await connectDB();
  const blog = await Blog.findById(id);
  if (!blog) throw new Error('Blog not found');

  // Security check: Only primary author can update meta/status/co-authors
  const userId = (session.user as any).id;
  if (blog.author.toString() !== userId.toString()) {
     throw new Error('Only the primary author can update the blog metadata');
  }

  const { title, content, coverImage, status, coAuthors } = data;
  const readingTime = estimateReadingTime(content);

  // Validate co-authors exist and cap at 3
  const validCoAuthors: string[] = [];
  if (Array.isArray(coAuthors) && coAuthors.length > 0) {
    const found = await User.find({ _id: { $in: coAuthors.slice(0, 3) } }).select('_id').lean();
    found.forEach((u: any) => validCoAuthors.push(String(u._id)));
  }

  blog.title = title;
  blog.content = content;
  blog.coverImage = coverImage;
  blog.status = status;
  blog.readingTime = readingTime;
  blog.coAuthors = validCoAuthors;

  await blog.save();
  revalidatePath('/');
  revalidatePath(`/blog/${blog.slug}`);
  revalidatePath('/dashboard');
  
  return { slug: String(blog.slug) };
}

