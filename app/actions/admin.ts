'use server';

import connectDB from '@/lib/db';
import User from '@/models/User';
import Blog from '@/models/Blog';
import CommentModel from '@/models/Comment';
import NotificationModel from '@/models/Notification';
import Feedback from '@/models/Feedback';
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
  const blogs = await Blog.find({})
    .populate('author', 'name email prn')
    .populate({ path: 'coAuthors', select: 'name email prn', options: { strictPopulate: false } })
    .sort({ createdAt: -1 })
    .lean();
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
    
    // Prevent self-deletion
    if (userId === (session.user as any).id) {
        throw new Error('You cannot delete your own account while logged in. Please have another admin perform this action.');
    }
    
    // 1. Get all blogs by this user to clean up their comments later
    const userBlogs = await Blog.find({ author: userId }).select('_id');
    const blogIds = userBlogs.map(b => b._id);

    // 2. Comprehensive Cascading Delete & Cleanup
    await Promise.all([
        // Delete user's primary blogs
        Blog.deleteMany({ author: userId }),
        // Cleanup co-author and likes references on all blogs
        Blog.updateMany({}, { $pull: { coAuthors: userId, likes: userId } }),
        // Delete user's comments
        CommentModel.deleteMany({ author: userId }),
        // Delete all comments on the user's blogs
        CommentModel.deleteMany({ blog: { $in: blogIds } }),
        // Delete notifications involving the user OR their blogs
        NotificationModel.deleteMany({ 
            $or: [
                { recipient: userId }, 
                { sender: userId },
                { blog: { $in: blogIds } }
            ] 
        }),
        // Scrub the user from all other users' followers/following lists
        User.updateMany({}, { $pull: { followers: userId, following: userId } }),
        // Delete user's feedback/reports
        Feedback.deleteMany({ user: userId }),
        // Finally, delete the user itself
        User.findByIdAndDelete(userId)
    ]);

    revalidatePath('/admin');
    revalidatePath('/');
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

export async function getExportableBlogs() {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'ADMIN') throw new Error('Unauthorized');
  
    await connectDB();
    const blogs = await Blog.find({ status: 'PUBLISHED' })
        .populate('author', 'name prn email')
        .populate({ path: 'coAuthors', select: 'name prn email', options: { strictPopulate: false } })
        .sort({ createdAt: -1 })
        .lean();

    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';

    const rows: any[] = [];

    blogs.forEach((b: any) => {
        const blogMeta = {
            title: b.title,
            link: `${baseUrl}/blog/${b.slug}`,
            submittedAt: b.createdAt
        };

        // Leader row
        rows.push({
            prn: b.author?.prn || 'N/A',
            name: b.author?.name || 'Unknown',
            role: 'Leader',
            ...blogMeta
        });

        // Co-author rows
        (b.coAuthors || []).forEach((ca: any) => {
            rows.push({
                prn: ca?.prn || 'N/A',
                name: ca?.name || 'Unknown',
                role: 'Member',
                ...blogMeta
            });
        });
    });

    return JSON.parse(JSON.stringify(rows));
}

