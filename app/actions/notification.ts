'use server';

import connectDB from '@/lib/db';
import Notification from '@/models/Notification';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function getUserNotifications() {
  const session = await getServerSession(authOptions);
  if (!session) return [];

  await connectDB();
  const userId = (session.user as any).id;

  const notifications = await Notification.find({ recipient: userId })
    .populate('sender', 'name image')
    .populate('blog', 'title slug')
    .sort({ createdAt: -1 })
    .limit(30)
    .lean();

  return JSON.parse(JSON.stringify(notifications));
}

export async function markNotificationsAsRead() {
  const session = await getServerSession(authOptions);
  if (!session) return;

  await connectDB();
  const userId = (session.user as any).id;

  await Notification.updateMany(
    { recipient: userId, isRead: false },
    { $set: { isRead: true } }
  );
}
