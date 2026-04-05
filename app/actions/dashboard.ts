'use server';

import connectDB from '@/lib/db';
import Blog from '@/models/Blog';
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
    await Blog.deleteOne({ _id: id, author: (session.user as any).id });
    revalidatePath('/dashboard');
}
