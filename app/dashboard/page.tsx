'use client';

import { useEffect, useState } from 'react';
import { getUserBlogs, deleteUserBlog } from '@/app/actions/dashboard';
import Navbar from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Loader2, Trash2, Edit2, PlusCircle, BookOpen, Layers, PenTool, ExternalLink } from 'lucide-react';
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

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#F4F4F1] dark:bg-zinc-950 transition-colors">
      <Loader2 className="h-12 w-12 animate-spin text-black dark:text-white" />
      <p className="mt-4 font-black uppercase tracking-widest text-sm">Loading Workspace...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F4F4F1] dark:bg-zinc-950 transition-colors">
      <Navbar />
      <div className="max-w-7xl mx-auto py-12 px-6">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
           <div className="bg-primary p-6 sm:p-8 border-[4px] border-black shadow-neo-lg sm:rotate-[-1deg] max-w-xl">
              <h1 className="text-4xl sm:text-5xl font-black text-black tracking-tighter uppercase leading-none mb-2 font-serif">Your Dashboard</h1>
              <p className="text-black font-bold uppercase text-sm">Manage your stories, drafts and publications.</p>
           </div>
           <Link href="/editor">
             <Button className="bg-black text-white font-black uppercase tracking-widest px-8 py-6 border-[3px] border-black shadow-neo active:shadow-none active:translate-x-1 active:translate-y-1 transition-all h-auto">
               <PlusCircle className="mr-2 h-5 w-5" strokeWidth={3} /> Write New Story
             </Button>
           </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
           <Link href="#activity" className="block group">
             <Card className="p-8 border-[4px] border-black bg-secondary text-black shadow-neo hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all h-full rounded-none">
                <BookOpen className="h-10 w-10 mb-4" strokeWidth={3} />
                <div className="text-5xl font-black mb-2">{blogs.filter(b => b.status === 'PUBLISHED').length}</div>
                <div className="text-xs font-black uppercase tracking-widest opacity-80">Published Articles</div>
             </Card>
           </Link>

           <div className="block">
             <Card className="p-8 border-[4px] border-black bg-white dark:bg-zinc-900 text-black dark:text-white shadow-neo h-full rounded-none">
                <Layers className="h-10 w-10 mb-4 text-primary" strokeWidth={3} />
                <div className="text-5xl font-black mb-2">
                  {blogs.reduce((acc, curr) => acc + (curr.likes?.length || 0), 0)}
                </div>
                <div className="text-xs font-black uppercase tracking-widest text-zinc-500">Total Likes Received</div>
             </Card>
           </div>

           <Link href="/profile" className="block group lg:col-span-1">
             <Card className="p-8 border-[4px] border-black bg-white dark:bg-zinc-900 text-black dark:text-white shadow-neo hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all h-full rounded-none flex flex-col justify-between">
                <div className="text-xs font-black uppercase tracking-widest text-zinc-500 flex items-center justify-between pb-4 border-b-2 border-black/10">
                  Profile Info
                  <span className="font-mono opacity-50 px-2 py-0.5 border border-black/20">{new Date((session?.user as any)?.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                </div>
                <div className="mt-8">
                  <div className="text-2xl sm:text-3xl font-black text-black dark:text-white uppercase leading-none group-hover:text-primary transition-colors">
                     Class of 2027
                  </div>
                  <div className="h-3 w-12 bg-primary border-2 border-black mt-4 transition-all group-hover:w-full" />
                </div>
             </Card>
           </Link>
        </div>

        {/* Blogs List */}
        <div className="space-y-10" id="activity">
          <div className="flex items-center gap-4">
             <h2 className="text-3xl font-black text-black dark:text-white uppercase tracking-tighter">Recent Activity</h2>
             <div className="h-[4px] flex-1 bg-black dark:bg-white" />
          </div>
          
          {blogs.length > 0 ? (
            <div className="grid grid-cols-1 gap-8">
              {blogs.map((b) => (
                <Card key={b._id} className="p-4 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between border-[4px] border-black dark:border-white shadow-neo hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all group bg-white dark:bg-zinc-900 rounded-none gap-8">
                  <div className="flex flex-col sm:flex-row items-center gap-8 w-full lg:w-auto">
                    <div className="relative h-40 w-full sm:w-60 border-[4px] border-black dark:border-white shadow-neo group-hover:shadow-none transition-all flex-shrink-0">
                      {b.coverImage ? (
                        <Image src={b.coverImage} alt={b.title} fill className="object-cover grayscale group-hover:grayscale-0 transition-all" />
                      ) : (
                        <div className="w-full h-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-xl font-black text-zinc-400 dark:text-zinc-600 uppercase">
                          No Preview
                        </div>
                      )}
                    </div>
                    <div className="text-center sm:text-left space-y-4 max-w-xl">
                      <h3 className="font-black text-2xl sm:text-3xl text-black dark:text-white uppercase leading-[0.9] group-hover:bg-primary transition-all inline-block">{b.title}</h3>
                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4">
                        <span className={`px-3 py-1 border-[2px] border-black text-[10px] font-black uppercase tracking-widest ${b.status === 'PUBLISHED' ? 'bg-primary text-black' : 'bg-yellow-200 text-black'}`}>
                          {b.status}
                        </span>
                        <span className="text-[10px] text-zinc-500 font-black uppercase tracking-tight bg-zinc-100 dark:bg-zinc-800 px-2 py-1 border-[2px] border-black dark:border-white">
                           {new Date(b.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 w-full lg:w-auto justify-between sm:justify-center border-t-[3px] lg:border-t-0 border-black dark:border-white pt-6 lg:pt-0">
                    <Link href={`/blog/${b.slug}`} className="flex-1 lg:flex-none">
                      <Button className="w-full lg:w-auto bg-white text-black border-[3px] border-black shadow-neo active:shadow-none active:translate-x-1 active:translate-y-1 transition-all font-black uppercase text-xs px-6 py-4 flex items-center gap-2">
                        <ExternalLink size={16} strokeWidth={3} /> View
                      </Button>
                    </Link>
                    <div className="flex items-center gap-4">
                      <Link href={`/editor/${b._id}`}>
                        <Button className="bg-secondary text-black border-[3px] border-black shadow-neo active:shadow-none active:translate-x-1 active:translate-y-1 transition-all p-3 h-auto">
                          <Edit2 size={20} strokeWidth={3} />
                        </Button>
                      </Link>
                      <Button 
                          className="bg-red-500 text-white border-[3px] border-black shadow-neo active:shadow-none active:translate-x-1 active:translate-y-1 transition-all p-3 h-auto"
                          onClick={() => handleDelete(b._id)}
                      >
                        <Trash2 size={20} strokeWidth={3} />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-32 bg-white dark:bg-zinc-900 border-[5px] border-black shadow-neo-xl space-y-10 max-w-4xl mx-auto sm:rotate-[1deg]">
               <div className="w-24 h-24 bg-white border-[4px] border-black shadow-neo flex items-center justify-center mx-auto">
                  <PenTool size={48} strokeWidth={3} className="text-zinc-400" />
               </div>
               <div className="space-y-4">
                 <h3 className="text-4xl font-black text-black dark:text-white uppercase tracking-tighter">Your story starts here.</h3>
                 <p className="text-zinc-500 font-bold uppercase">You haven't published any blogs yet.</p>
               </div>
               <Link href="/editor">
                 <Button className="bg-black text-white font-black uppercase tracking-widest h-14 px-12 border-[4px] border-black shadow-neo active:shadow-none active:translate-x-1 active:translate-y-1 transition-all">
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
