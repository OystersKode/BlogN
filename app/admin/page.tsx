'use client';

import { useEffect, useState } from 'react';
import { getAllUsers, getAllBlogs, deleteUser, updateUserRole, toggleStaffPick } from '@/app/actions/admin';
import Navbar from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Loader2, Trash2, UserCog, BookOpen, Users, Star } from 'lucide-react';
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
    <div className="min-h-screen bg-[#fafbfc] dark:bg-slate-950 transition-colors">
      <Navbar />
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
         <div className="mb-12">
            <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight transition-colors">Admin Console</h1>
            <p className="text-gray-500 dark:text-gray-400 font-medium">Platform management and user moderation.</p>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
           {/* Users Management */}
           <section className="space-y-6">
             <div className="flex items-center gap-2 text-xl font-bold text-gray-800 dark:text-gray-200 transition-colors">
                <Users size={24} className="text-blue-500 dark:text-blue-400" />
                Users ({users.length})
             </div>
             <div className="space-y-4 transition-colors">
               {users.map((u) => (
                 <Card key={u._id} className="p-4 flex items-center justify-between border-none shadow-sm dark:shadow-none bg-white dark:bg-slate-900 hover:shadow-md transition-all">
                   <div className="flex items-center gap-3">
                     <Image src={u.image || '/default-avatar.png'} alt={u.name} width={40} height={40} className="rounded-full ring-2 ring-gray-50 dark:ring-white/5 transition-colors" />
                     <div>
                       <p className="font-bold text-sm text-gray-900 dark:text-white transition-colors">{u.name}</p>
                       <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors">{u.email}</p>
                     </div>
                   </div>
                   <div className="flex items-center gap-2">
                     <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tight transition-colors ${u.role === 'ADMIN' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400'}`}>
                       {u.role}
                     </span>
                     <Button 
                         variant="ghost" 
                         size="icon" 
                         className="text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
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
           <section className="space-y-6 transition-colors">
             <div className="flex items-center gap-2 text-xl font-bold text-gray-800 dark:text-gray-200 transition-colors">
                <BookOpen size={24} className="text-blue-500 dark:text-blue-400 transition-colors" />
                All Blogs ({blogs.length})
             </div>
             <div className="space-y-4 transition-colors">
               {blogs.map((b) => (
                 <Card key={b._id} className="p-4 flex items-center justify-between border-none shadow-sm dark:shadow-none bg-white dark:bg-slate-900 hover:shadow-md transition-all">
                   <div className="flex flex-col">
                     <p className="font-bold text-sm truncate max-w-[250px] text-gray-900 dark:text-white transition-colors">{b.title}</p>
                     <p className="text-xs text-gray-500 dark:text-gray-400 italic transition-colors">by {b.author.name}</p>
                   </div>
                   <div className="flex items-center gap-2 transition-colors">
                     <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tight transition-colors ${b.status === 'PUBLISHED' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'}`}>
                       {b.status}
                     </span>
                     <Button 
                         variant="ghost" 
                         size="icon" 
                         className={`${b.isStaffPick ? 'text-yellow-500 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20' : 'text-gray-400 dark:text-gray-500 hover:text-yellow-500 dark:hover:text-yellow-400 hover:bg-gray-100 dark:hover:bg-slate-800'} transition-colors`}
                         onClick={async () => {
                             await toggleStaffPick(b._id.toString());
                             fetchData();
                         }}
                         title={b.isStaffPick ? "Remove Staff Pick" : "Mark as Staff Pick"}
                     >
                       <Star size={16} className={b.isStaffPick ? 'fill-current' : ''} />
                     </Button>
                     <Button 
                         variant="ghost" 
                         size="icon" 
                         className="text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
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
