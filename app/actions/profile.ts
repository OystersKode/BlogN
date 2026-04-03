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

export async function updateUserProfile(data: { bio: string; prn: string; twitter: string; github: string; website: string }) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error('Unauthorized');

  await connectDB();
  
  await User.findByIdAndUpdate((session.user as any).id, {
    bio: data.bio,
    prn: data.prn,
    socials: {
      twitter: data.twitter,
      github: data.github,
      website: data.website
    }
  });

  revalidatePath('/profile');
  return { success: true };
}

export async function getPublicUser(id: string) {
  await connectDB();
  const user = await User.findById(id).lean();
  if (!user) return null;
  
  const session = await getServerSession(authOptions);
  let isFollowing = false;
  if (session) {
      const activeUser = await User.findById((session.user as any).id).lean();
      isFollowing = (activeUser?.following || []).map((id: any) => id.toString()).includes(user._id.toString());
  }

  const pUser = JSON.parse(JSON.stringify(user));
  pUser.isFollowing = isFollowing;
  pUser.followersCount = user.followers?.length || 0;
  pUser.followingCount = user.following?.length || 0;
  return pUser;
}

export async function toggleFollow(targetUserId: string) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");

  await connectDB();
  const activeUserId = (session.user as any).id;
  if (activeUserId === targetUserId) throw new Error("Cannot follow yourself");

  const [activeUser, targetUser] = await Promise.all([
    User.findById(activeUserId),
    User.findById(targetUserId)
  ]);

  const isFollowing = activeUser.following.includes(targetUserId);

  if (isFollowing) {
    activeUser.following.pull(targetUserId);
    targetUser.followers.pull(activeUserId);
  } else {
    activeUser.following.push(targetUserId);
    targetUser.followers.push(activeUserId);
  }

  await Promise.all([activeUser.save(), targetUser.save()]);
  revalidatePath(`/user/${targetUserId}`);
  revalidatePath('/profile');
  return { isFollowing: !isFollowing, followersCount: targetUser.followers.length };
}

export async function getPublicUserNetwork(id: string) {
  await connectDB();
  const user = await User.findById(id)
    .populate('followers', 'name image prn bio')
    .populate('following', 'name image prn bio')
    .lean();

  if (!user) return { followers: [], following: [] };

  return {
    followers: JSON.parse(JSON.stringify(user.followers || [])),
    following: JSON.parse(JSON.stringify(user.following || []))
  };
}
