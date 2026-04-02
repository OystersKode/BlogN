'use server';

import connectDB from '@/lib/db';
import Blog from '@/models/Blog';
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
  revalidatePath('/');
  return { slug: newBlog.slug };
}

export async function getBlogs() {
  await connectDB();
  const blogs = await Blog.find({ status: 'PUBLISHED' }).populate('author', 'name image').sort({ createdAt: -1 }).lean();
  return JSON.parse(JSON.stringify(blogs));
}

export async function getBlogBySlug(slug: string) {
  await connectDB();
  const blog = await Blog.findOne({ slug }).populate('author', 'name image bio socials').lean();
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
