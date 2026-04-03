'use server';

import connectDB from '@/lib/db';
import Blog from '@/models/Blog';
import User from '@/models/User';

export async function searchPlatform(query: string) {
  if (!query) return { users: [], blogs: [] };
  
  await connectDB();
  const regex = new RegExp(query, 'i');
  
  const [users, blogs] = await Promise.all([
     User.find({
        $or: [{ name: regex }, { prn: regex }, { email: regex }]
     }).select('name image prn bio followers following').lean(),
     
     Blog.find({
        $or: [{ title: regex }, { category: regex }],
        status: 'PUBLISHED'
     }).populate('author', 'name image').lean()
  ]);
  
  return {
     users: JSON.parse(JSON.stringify(users)),
     blogs: JSON.parse(JSON.stringify(blogs))
  };
}
