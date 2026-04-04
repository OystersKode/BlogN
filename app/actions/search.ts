'use server';

import connectDB from '@/lib/db';
import Blog from '@/models/Blog';
import User from '@/models/User';

import { MOCK_BLOGS, MOCK_USERS } from '@/lib/mock-data';

const MOCK_MODE = process.env.MOCK_MODE === 'true';

export async function searchPlatform(query: string) {
  if (!query) return { users: [], blogs: [] };
  
  if (MOCK_MODE) {
    const regex = new RegExp(query, 'i');
    const filteredUsers = MOCK_USERS.filter((u: any) => regex.test(u.name) || (u.prn && regex.test(u.prn)));
    const filteredBlogs = MOCK_BLOGS.filter((b: any) => 
       (regex.test(b.title) || (b.category && regex.test(b.category))) && b.status === 'PUBLISHED'
    );
    
    return {
       users: JSON.parse(JSON.stringify(filteredUsers)),
       blogs: JSON.parse(JSON.stringify(filteredBlogs))
    };
  }

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
