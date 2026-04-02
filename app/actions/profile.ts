'use server';

import connectDB from '@/lib/db';
import User from '@/models/User';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function getUserProfile() {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error('Unauthorized');

  await connectDB();
  const user = await User.findById((session.user as any).id).lean();
  return JSON.parse(JSON.stringify(user));
}

export async function updateUserProfile(data: { bio: string; twitter: string; github: string; website: string }) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error('Unauthorized');

  await connectDB();
  
  await User.findByIdAndUpdate((session.user as any).id, {
    bio: data.bio,
    socials: {
      twitter: data.twitter,
      github: data.github,
      website: data.website
    }
  });

  revalidatePath('/profile');
  return { success: true };
}
