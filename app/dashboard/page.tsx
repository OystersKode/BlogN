'use client';

import { useEffect, useState } from 'react';
import { getUserBlogs, deleteUserBlog } from '@/app/actions/dashboard';
import Navbar from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Loader2, Trash2, Edit2, PlusCircle, BookOpen, Layers } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const DashboardPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      fetchData();
    }
  }, [session, status]);

  const fetchData = async () => {
    try {
      const b = await getUserBlogs();
      setBlogs(b);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
      if(confirm('Delete blog permanently?')) {
          await deleteUserBlog(id);
          fetchData();
      }
  };

  if (loading) return <div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-950 transition-colors"><Loader2 className="h-8 w-8 animate-spin text-blue-600 dark:text-blue-400" /></div>;

  return (
    <div className="min-h-screen bg-[#fafbfc] dark:bg-slate-950 transition-colors">
      <Navbar />
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-16">
           <div className="space-y-2">
              <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight transition-colors">Your Dashboard</h1>
              <p className="text-gray-500 dark:text-gray-400 font-medium tracking-tight transition-colors">Manage your stories, drafts and publications.</p>
           </div>
           <Link href="/editor">
             <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold px-8 h-12 rounded-full shadow-lg hover:shadow-xl transition-all">
               <PlusCircle className="mr-2 h-5 w-5" /> Write New Story
             </Button>
           </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-16 transition-colors">
           <Card className="p-8 border-none bg-blue-600 dark:bg-blue-900/40 text-white shadow-xl shadow-blue-100 dark:shadow-none rounded-3xl transition-colors">
              <BookOpen className="h-8 w-8 mb-4 opacity-50" />
              <div className="text-4xl font-black">{blogs.filter(b => b.status === 'PUBLISHED').length}</div>
              <div className="text-sm font-bold uppercase tracking-widest opacity-70">Published Articles</div>
           </Card>
           <Card className="p-8 border-none bg-white dark:bg-slate-900 text-gray-900 dark:text-white shadow-xl shadow-gray-100 dark:shadow-none rounded-3xl transition-colors">
              <Layers className="h-8 w-8 mb-4 text-blue-600 dark:text-blue-400" />
              <div className="text-4xl font-black">{blogs.filter(b => b.status === 'DRAFT').length}</div>
              <div className="text-sm font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">Total Drafts</div>
           </Card>
           <Card className="p-8 border-none bg-white dark:bg-slate-900 text-gray-900 dark:text-white shadow-xl shadow-gray-100 dark:shadow-none rounded-3xl group transition-colors">
              <div className="text-6xl mb-2 group-hover:scale-110 transition-transform">🚀</div>
              <div className="text-sm font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mt-4 transition-colors">Keep Writing!</div>
           </Card>
        </div>

        {/* Blogs List */}
        <div className="space-y-8 transition-colors">
          <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-2 transition-colors">
            Recent Activity
            <div className="h-1.5 w-12 bg-blue-600 dark:bg-blue-400 rounded-full" />
          </h2>
          
          {blogs.length > 0 ? (
            <div className="grid grid-cols-1 gap-6">
              {blogs.map((b) => (
                <Card key={b._id} className="p-6 flex flex-col md:flex-row items-center justify-between border-none shadow-sm dark:shadow-none hover:shadow-xl dark:hover:bg-slate-800 transition-all duration-300 group bg-white dark:bg-slate-900 rounded-3xl">
                  <div className="flex flex-col md:flex-row items-center gap-6 w-full md:w-auto">
                    <div className="relative h-24 w-40 rounded-2xl overflow-hidden shadow-md dark:shadow-none flex-shrink-0 transition-colors">
                      {b.coverImage ? (
                        <Image src={b.coverImage} alt={b.title} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gray-50 dark:bg-slate-800 flex items-center justify-center text-2xl font-black text-gray-200 dark:text-slate-700 uppercase tracking-tighter transition-colors">
                          No Img
                        </div>
                      )}
                    </div>
                    <div className="text-center md:text-left space-y-2 max-w-md">
                      <h3 className="font-extrabold text-xl text-gray-900 dark:text-white line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{b.title}</h3>
                      <div className="flex items-center justify-center md:justify-start gap-4 transition-colors">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest transition-colors ${b.status === 'PUBLISHED' ? 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400' : 'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'}`}>
                          {b.status}
                        </span>
                        <span className="text-xs text-gray-400 dark:text-gray-500 font-bold uppercase tracking-tight italic transition-colors">
                           Created {new Date(b.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mt-6 md:mt-0 pt-6 md:pt-0 border-t md:border-t-0 border-gray-50 dark:border-white/5 w-full md:w-auto justify-center transition-colors">
                    <Link href={`/blog/${b.slug}`}>
                      <Button variant="ghost" size="sm" className="font-bold text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-4 rounded-full transition-colors">
                        View Post
                      </Button>
                    </Link>
                    <Link href={`/editor/${b._id}`}>
                      <Button variant="ghost" size="icon" className="text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                        <Edit2 size={18} />
                      </Button>
                    </Link>
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        onClick={() => handleDelete(b._id)}
                    >
                      <Trash2 size={18} />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-32 bg-white dark:bg-slate-900 rounded-[3rem] shadow-xl shadow-gray-100/50 dark:shadow-none border border-gray-50 dark:border-white/5 space-y-6 transition-colors">
               <div className="text-7xl">✍️</div>
               <div className="space-y-2">
                 <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight transition-colors">Your story starts here.</h3>
                 <p className="text-gray-400 dark:text-gray-500 font-medium italic transition-colors">You haven't published any blogs yet.</p>
               </div>
               <Link href="/editor">
                 <Button className="mt-4 bg-gray-900 dark:bg-white text-white dark:text-slate-900 font-bold h-12 px-10 rounded-full hover:bg-blue-600 dark:hover:bg-gray-200 transition-colors shadow-lg hover:shadow-blue-200 dark:hover:shadow-none">
                    Get Started
                 </Button>
               </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
