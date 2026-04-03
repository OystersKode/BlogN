import { getBookmarks } from '@/app/actions/blog';
import Navbar from '@/components/layout/Navbar';
import MediumSidebar from '@/components/layout/MediumSidebar';
import MediumRightbar from '@/components/layout/MediumRightbar';
import HorizontalBlogCard from '@/components/blog/HorizontalBlogCard';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Footer from '@/components/layout/Footer';

export default async function BookmarksPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
     redirect('/login');
  }

  const blogs = await getBookmarks();

  return (
    <main className="min-h-screen bg-white dark:bg-slate-950 transition-colors">
      <Navbar />
      <div className="max-w-[1336px] mx-auto flex justify-center px-4 sm:px-6">
        <MediumSidebar />
        
        <section className="flex-1 max-w-[700px] min-w-0 w-full lg:px-12 py-8 lg:py-12 border-x border-gray-100 dark:border-white/10 min-h-screen transition-colors">
          <div className="mb-8">
             <h1 className="text-[40px] font-black text-gray-900 dark:text-white tracking-tight leading-tight transition-colors">Your library</h1>
          </div>

          <div className="flex gap-8 border-b border-gray-100 dark:border-white/10 mb-8 overflow-x-auto hide-scrollbar transition-colors">
             <button className="pb-4 border-b border-gray-900 dark:border-white text-[14px] text-gray-900 dark:text-white font-medium whitespace-nowrap transition-colors">Saved stories</button>

          </div>

          {blogs.length > 0 ? (
             <div className="flex flex-col">
                {blogs.map((blog: any) => (
                  <HorizontalBlogCard key={blog._id} blog={blog} />
                ))}
             </div>
          ) : (
             <div className="text-center py-24 space-y-4">
                <span className="text-4xl block mb-4">📚</span>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white transition-colors">Your library is empty.</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm transition-colors">Save stories to read them later or easily reference them.</p>
             </div>
          )}
        </section>

        <MediumRightbar />
      </div>
      <Footer />
    </main>
  );
}
