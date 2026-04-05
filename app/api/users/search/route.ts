import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import User from '@/models/User';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const q = req.nextUrl.searchParams.get('q')?.trim();
  if (!q || q.length < 2) {
    return NextResponse.json([]);
  }

  await connectDB();
  const regex = new RegExp(q, 'i');
  const currentUserId = (session.user as any).id;

  const users = await User.find({
    _id: { $ne: currentUserId }, // exclude the searching user themselves
    $or: [{ name: regex }, { prn: regex }],
  })
    .select('_id name image prn')
    .limit(8)
    .lean();

  return NextResponse.json(JSON.parse(JSON.stringify(users)));
}
