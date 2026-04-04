import { getBookmarks } from '@/app/actions/blog';
import Navbar from '@/components/layout/Navbar';
import MediumSidebar from '@/components/layout/MediumSidebar';
import MediumRightbar from '@/components/layout/MediumRightbar';
import HorizontalBlogCard from '@/components/blog/HorizontalBlogCard';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Footer from '@/components/layout/Footer';
import { BookMarked } from 'lucide-react';

export default async function BookmarksPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
     redirect('/login');
  }

  const blogs = await getBookmarks();

  return (
    <main className="min-h-screen bg-[#F4F4F1] dark:bg-zinc-950 transition-colors">
      <Navbar />
      <div className="max-w-[1336px] mx-auto flex justify-center px-4 md:px-6">
        <MediumSidebar />
        
        <section className="flex-1 max-w-[700px] min-w-0 w-full xl:px-12 py-8 lg:py-12 min-h-screen transition-colors">
          <div className="mb-12 bg-primary p-8 border-[4px] border-black shadow-neo-lg rotate-[1deg] max-w-md">
             <h1 className="text-4xl sm:text-5xl font-black text-black tracking-tighter uppercase leading-none font-serif">Your library</h1>
          </div>

          <div className="flex gap-8 border-b-[4px] border-black dark:border-white mb-10 overflow-x-auto hide-scrollbar transition-colors">
             <button className="pb-4 border-b-[4px] border-secondary text-[12px] text-black dark:text-white font-black uppercase tracking-widest whitespace-nowrap transition-colors">Saved stories</button>
          </div>

          {blogs.length > 0 ? (
             <div className="flex flex-col">
                {blogs.map((blog: any) => (
                  <HorizontalBlogCard key={blog._id} blog={blog} />
                ))}
             </div>
          ) : (
             <div className="text-center py-32 space-y-8 transition-colors">
                <div className="w-24 h-24 bg-white dark:bg-zinc-900 border-[4px] border-black shadow-neo flex items-center justify-center mx-auto mb-6">
                   <BookMarked size={48} strokeWidth={3} className="text-zinc-400" />
                </div>
                <div className="space-y-4">
                   <h3 className="text-3xl font-black text-black dark:text-white uppercase tracking-tighter">Your library is empty.</h3>
                   <p className="text-zinc-500 font-bold uppercase max-w-sm mx-auto">Save stories to read them later or easily reference them.</p>
                </div>
             </div>
          )}
        </section>

        <MediumRightbar />
      </div>
      <Footer />
    </main>
  );
}
