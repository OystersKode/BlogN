import Navbar from '@/components/layout/Navbar';
import BlogCard from '@/components/blog/BlogCard';
import { getBlogs } from '@/app/actions/blog';
import { Search } from 'lucide-react';

export default async function ExplorePage() {
  const blogs = await getBlogs();

  return (
    <main className="min-h-screen bg-[#F4F4F1] dark:bg-zinc-950 transition-colors">
      <Navbar />

      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-6 lg:px-8">
         <div className="mb-12 transition-colors bg-secondary p-8 border-[4px] border-black shadow-neo-lg sm:rotate-[-1deg] max-w-2xl">
            <h1 className="text-4xl sm:text-6xl font-black text-black tracking-tighter uppercase leading-none mb-4 font-serif">Explore Knowledge</h1>
            <p className="text-lg text-black font-bold uppercase leading-tight transition-colors">Read the latest articles published by TY CSE students.</p>
         </div>

        {blogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {blogs.map((blog: any) => (
              <BlogCard key={blog._id} blog={blog} />
            ))}
          </div>
         ) : (
            <div className="text-center py-32 space-y-8 transition-colors">
               <div className="mx-auto w-24 h-24 bg-white dark:bg-zinc-900 border-[4px] border-black shadow-neo flex items-center justify-center transition-colors">
                  <Search size={48} strokeWidth={3} className="text-zinc-400" />
               </div>
               <div className="space-y-4 transition-colors">
                  <h3 className="text-3xl font-black text-black dark:text-white uppercase tracking-tighter">No articles published yet.</h3>
                  <p className="text-zinc-500 font-bold uppercase max-w-md mx-auto">Be the very first to share your insights with the department!</p>
               </div>
            </div>
         )}
      </section>
    </main>
  );
}
