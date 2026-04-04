'use server';

import connectDB from '@/lib/db';
import Comment from '@/models/Comment';
import Blog from '@/models/Blog';
import Notification from '@/models/Notification';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

const MOCK_MODE = process.env.MOCK_MODE === 'true';

export async function addComment(blogId: string, content: string, slug: string) {
   const session = await getServerSession(authOptions);
   if (!session) throw new Error("Unauthorized");
   
   if (MOCK_MODE) {
      const newComment = {
         _id: `mock-comment-${Math.random().toString(36).substr(2, 5)}`,
         blog: blogId,
         author: {
            _id: (session.user as any).id,
            name: session.user?.name || 'Anonymous',
            image: session.user?.image || '/default-avatar.png'
         },
         content,
         createdAt: new Date().toISOString()
      };
      return JSON.parse(JSON.stringify(newComment));
   }

   await connectDB();
   const newComment = new Comment({
      blog: blogId,
      author: (session.user as any).id,
      content,
   });
   
   await newComment.save();
   
   try {
      const blog = await Blog.findById(blogId).select('author');
      if (blog && blog.author.toString() !== (session.user as any).id.toString()) {
         const newNotif = new Notification({
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
   if (MOCK_MODE) {
      return []; // Return empty for mock mode
   }
   await connectDB();
   const comments = await Comment.find({ blog: blogId })
       .populate('author', 'name image')
       .sort({ createdAt: -1 })
       .lean();
   return JSON.parse(JSON.stringify(comments));
}
