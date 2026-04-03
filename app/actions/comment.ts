'use server';

import connectDB from '@/lib/db';
import Comment from '@/models/Comment';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function addComment(blogId: string, content: string, slug: string) {
   const session = await getServerSession(authOptions);
   if (!session) throw new Error("Unauthorized");
   
   await connectDB();
   const newComment = new Comment({
      blog: blogId,
      author: (session.user as any).id,
      content,
   });
   
   await newComment.save();
   revalidatePath(`/blog/${slug}`);
   return JSON.parse(JSON.stringify(newComment));
}

export async function getComments(blogId: string) {
   await connectDB();
   const comments = await Comment.find({ blog: blogId })
       .populate('author', 'name image')
       .sort({ createdAt: -1 })
       .lean();
   return JSON.parse(JSON.stringify(comments));
}
