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

  if (loading) return <div className="h-screen flex items-center justify-center bg-gray-50"><Loader2 className="h-8 w-8 animate-spin text-blue-600" /></div>;

  return (
    <div className="min-h-screen bg-[#fafbfc]">
      <Navbar />
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-16">
           <div className="space-y-2">
              <h1 className="text-4xl font-black text-gray-900 tracking-tight">Your Dashboard</h1>
              <p className="text-gray-500 font-medium tracking-tight">Manage your stories, drafts and publications.</p>
           </div>
           <Link href="/editor">
             <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold px-8 h-12 rounded-full shadow-lg hover:shadow-xl transition-all">
               <PlusCircle className="mr-2 h-5 w-5" /> Write New Story
             </Button>
           </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-16">
           <Card className="p-8 border-none bg-blue-600 text-white shadow-xl shadow-blue-100 rounded-3xl">
              <BookOpen className="h-8 w-8 mb-4 opacity-50" />
              <div className="text-4xl font-black">{blogs.filter(b => b.status === 'PUBLISHED').length}</div>
              <div className="text-sm font-bold uppercase tracking-widest opacity-70">Published Articles</div>
           </Card>
           <Card className="p-8 border-none bg-white text-gray-900 shadow-xl shadow-gray-100 rounded-3xl">
              <Layers className="h-8 w-8 mb-4 text-blue-600" />
              <div className="text-4xl font-black">{blogs.filter(b => b.status === 'DRAFT').length}</div>
              <div className="text-sm font-bold uppercase tracking-widest text-gray-400">Total Drafts</div>
           </Card>
           <Card className="p-8 border-none bg-white text-gray-900 shadow-xl shadow-gray-100 rounded-3xl group">
              <div className="text-6xl mb-2 group-hover:scale-110 transition-transform">🚀</div>
              <div className="text-sm font-bold uppercase tracking-widest text-gray-400 mt-4">Keep Writing!</div>
           </Card>
        </div>

        {/* Blogs List */}
        <div className="space-y-8">
          <h2 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            Recent Activity
            <div className="h-1.5 w-12 bg-blue-600 rounded-full" />
          </h2>
          
          {blogs.length > 0 ? (
            <div className="grid grid-cols-1 gap-6">
              {blogs.map((b) => (
                <Card key={b._id} className="p-6 flex flex-col md:flex-row items-center justify-between border-none shadow-sm hover:shadow-xl transition-all duration-300 group bg-white rounded-3xl">
                  <div className="flex flex-col md:flex-row items-center gap-6 w-full md:w-auto">
                    <div className="relative h-24 w-40 rounded-2xl overflow-hidden shadow-md flex-shrink-0">
                      {b.coverImage ? (
                        <Image src={b.coverImage} alt={b.title} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gray-50 flex items-center justify-center text-2xl font-black text-gray-200 uppercase tracking-tighter">
                          No Img
                        </div>
                      )}
                    </div>
                    <div className="text-center md:text-left space-y-2 max-w-md">
                      <h3 className="font-extrabold text-xl text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">{b.title}</h3>
                      <div className="flex items-center justify-center md:justify-start gap-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${b.status === 'PUBLISHED' ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'}`}>
                          {b.status}
                        </span>
                        <span className="text-xs text-gray-400 font-bold uppercase tracking-tight italic">
                           Created {new Date(b.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mt-6 md:mt-0 pt-6 md:pt-0 border-t md:border-t-0 border-gray-50 w-full md:w-auto justify-center">
                    <Link href={`/blog/${b.slug}`}>
                      <Button variant="ghost" size="sm" className="font-bold text-gray-500 hover:text-blue-600 hover:bg-blue-50 px-4 rounded-full">
                        View Post
                      </Button>
                    </Link>
                    <Link href={`/editor/${b._id}`}>
                      <Button variant="ghost" size="icon" className="text-gray-400 hover:text-blue-600 hover:bg-blue-50">
                        <Edit2 size={18} />
                      </Button>
                    </Link>
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-gray-400 hover:text-red-500 hover:bg-red-50"
                        onClick={() => handleDelete(b._id)}
                    >
                      <Trash2 size={18} />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-32 bg-white rounded-[3rem] shadow-xl shadow-gray-100/50 border border-gray-50 space-y-6">
               <div className="text-7xl">✍️</div>
               <div className="space-y-2">
                 <h3 className="text-2xl font-black text-gray-900 tracking-tight">Your story starts here.</h3>
                 <p className="text-gray-400 font-medium italic">You haven't published any blogs yet.</p>
               </div>
               <Link href="/editor">
                 <Button className="mt-4 bg-gray-900 text-white font-bold h-12 px-10 rounded-full hover:bg-blue-600 transition-all shadow-lg hover:shadow-blue-200">
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
