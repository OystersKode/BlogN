'use server';

import connectDB from '@/lib/db';
import Blog from '@/models/Blog';
import User from '@/models/User';
import CommentModel from '@/models/Comment';
import NotificationModel from '@/models/Notification';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function getUserBlogs() {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error('Unauthorized');

  await connectDB();
  const userId = (session.user as any).id;
  const blogs = await Blog.find({
    $or: [{ author: userId }, { coAuthors: userId }]
  })
    .populate('author', 'name image')
    .populate({ path: 'coAuthors', select: 'name image prn', options: { strictPopulate: false } })
    .sort({ createdAt: -1 })
    .lean();
  return JSON.parse(JSON.stringify(blogs));
}

export async function deleteUserBlog(id: string) {
    const session = await getServerSession(authOptions);
    if (!session) throw new Error('Unauthorized');
  
    await connectDB();
    const userId = (session.user as any).id;

    // Verify ownership and perform cleanup
    const blog = await Blog.findOne({ _id: id, author: userId });
    if (!blog) throw new Error('Blog not found or unauthorized');

    await Promise.all([
        Blog.deleteOne({ _id: id }),
        CommentModel.deleteMany({ blog: id }),
        NotificationModel.deleteMany({ blog: id }),
        User.updateMany({}, { $pull: { bookmarks: id } })
    ]);

    revalidatePath('/dashboard');
    revalidatePath('/');
}
