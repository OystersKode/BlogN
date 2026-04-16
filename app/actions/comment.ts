'use server';

import connectDB from '@/lib/db';
import CommentModel from '@/models/Comment';
import Blog from '@/models/Blog';
import NotificationModel from '@/models/Notification';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function addComment(blogId: string, content: string, slug: string) {
   const session = await getServerSession(authOptions);
   if (!session) throw new Error("Unauthorized");
   
   await connectDB();
   const newComment = new CommentModel({
      blog: blogId,
      author: (session.user as any).id,
      content,
   });
   
   await newComment.save();
   
   try {
      const blog = await Blog.findById(blogId).select('author');
      if (blog && blog.author.toString() !== (session.user as any).id.toString()) {
         const newNotif = new NotificationModel({
            recipient: blog.author,
            sender: (session.user as any).id,
            type: 'COMMENT',
            blog: blog._id
         });
         await newNotif.save();
      }
   } catch (err) {
      console.error('Failed to dispatch comment notification', err);
   }

   revalidatePath(`/blog/${slug}`);
   return JSON.parse(JSON.stringify(newComment));
}

export async function getComments(blogId: string) {
   await connectDB();
   const comments = await CommentModel.find({ blog: blogId })
       .populate('author', 'name image')
       .sort({ createdAt: -1 })
       .lean();
   return JSON.parse(JSON.stringify(comments));
}
