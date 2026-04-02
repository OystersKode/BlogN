'use client';

import { useEffect, useState } from 'react';
import { getAllUsers, getAllBlogs, deleteUser, updateUserRole } from '@/app/actions/admin';
import Navbar from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Loader2, Trash2, UserCog, BookOpen, Users } from 'lucide-react';
import Image from 'next/image';

const AdminDashboard = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated' || (session && (session.user as any).role !== 'ADMIN')) {
      router.push('/');
    } else if (status === 'authenticated') {
      fetchData();
    }
  }, [session, status]);

  const fetchData = async () => {
    try {
      const [u, b] = await Promise.all([getAllUsers(), getAllBlogs()]);
      setUsers(u);
      setBlogs(b);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-black text-gray-900 mb-12 flex items-center gap-2">
           <UserCog className="text-blue-600" /> Admin Console
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Users Management */}
          <section className="space-y-6">
            <div className="flex items-center gap-2 text-xl font-bold text-gray-800">
               <Users size={24} className="text-blue-500" />
               Users ({users.length})
            </div>
            <div className="space-y-4">
              {users.map((u) => (
                <Card key={u._id} className="p-4 flex items-center justify-between border-none shadow-sm hover:shadow-md transition">
                  <div className="flex items-center gap-3">
                    <Image src={u.image || '/default-avatar.png'} alt={u.name} width={40} height={40} className="rounded-full" />
                    <div>
                      <p className="font-bold text-sm">{u.name}</p>
                      <p className="text-xs text-gray-500">{u.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${u.role === 'ADMIN' ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-600'}`}>
                      {u.role}
                    </span>
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-red-500 hover:bg-red-50"
                        onClick={async () => {
                            if(confirm('Delete user?')) {
                                await deleteUser(u._id);
                                fetchData();
                            }
                        }}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </section>

          {/* Blogs Management */}
          <section className="space-y-6">
            <div className="flex items-center gap-2 text-xl font-bold text-gray-800">
               <BookOpen size={24} className="text-blue-500" />
               All Blogs ({blogs.length})
            </div>
            <div className="space-y-4">
              {blogs.map((b) => (
                <Card key={b._id} className="p-4 flex items-center justify-between border-none shadow-sm hover:shadow-md transition">
                  <div className="flex flex-col">
                    <p className="font-bold text-sm truncate max-w-[250px]">{b.title}</p>
                    <p className="text-xs text-gray-500 italic">by {b.author.name}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${b.status === 'PUBLISHED' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                      {b.status}
                    </span>
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-red-500 hover:bg-red-50"
                        // Add delete blog action here if needed
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
