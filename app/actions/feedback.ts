'use server';

import connectDB from '@/lib/db';
import Feedback from '@/models/Feedback';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function submitFeedback(data: {
  ratings: { speed: number; editor: number; upload: number; mobile: number };
  comment: string;
}) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error('Unauthorized');

  await connectDB();
  const feedback = new Feedback({
    user: (session.user as any).id,
    ratings: data.ratings,
    comment: data.comment,
  });

  await feedback.save();
  revalidatePath('/admin');
  return { success: true };
}

export async function getAllFeedback() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== 'ADMIN') throw new Error('Unauthorized');

  await connectDB();
  const feedbacks = await Feedback.find({})
    .populate('user', 'name email prn image')
    .sort({ createdAt: -1 })
    .lean();
    
  return JSON.parse(JSON.stringify(feedbacks));
}
