'use server';

import connectDB from '@/lib/db';
import User from '@/models/User';
import Blog from '@/models/Blog';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function getAllUsers() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== 'ADMIN') throw new Error('Unauthorized');

  await connectDB();
  const users = await User.find({}).sort({ createdAt: -1 }).lean();
  return JSON.parse(JSON.stringify(users));
}

export async function getAllBlogs() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== 'ADMIN') throw new Error('Unauthorized');

  await connectDB();
  const blogs = await Blog.find({}).populate('author', 'name email').sort({ createdAt: -1 }).lean();
  return JSON.parse(JSON.stringify(blogs));
}

export async function updateUserRole(userId: string, role: 'USER' | 'ADMIN') {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'ADMIN') throw new Error('Unauthorized');
  
    await connectDB();
    await User.findByIdAndUpdate(userId, { role });
    revalidatePath('/admin');
}

export async function deleteUser(userId: string) {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'ADMIN') throw new Error('Unauthorized');
  
    await connectDB();
    await User.findByIdAndDelete(userId);
    revalidatePath('/admin');
}

export async function toggleStaffPick(blogId: string) {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'ADMIN') throw new Error('Unauthorized');
  
    await connectDB();
    const blog = await Blog.findById(blogId);
    if (!blog) throw new Error('Blog not found');
    
    blog.isStaffPick = !blog.isStaffPick;
    await blog.save();
    revalidatePath('/');
    revalidatePath('/admin');
}
