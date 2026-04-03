import Navbar from '@/components/layout/Navbar';
import BlogCard from '@/components/blog/BlogCard';
import { getBlogs } from '@/app/actions/blog';

export default async function ExplorePage() {
  const blogs = await getBlogs();

  return (
    <main className="min-h-screen bg-[#fafbfc] dark:bg-slate-950 transition-colors">
      <Navbar />

      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
         <div className="flex justify-between items-end mb-12 transition-colors">
            <div className="space-y-4">
               <h1 className="text-5xl font-black text-gray-900 dark:text-white tracking-tight transition-colors">Explore Knowledge</h1>
               <p className="text-lg text-gray-500 dark:text-gray-400 font-medium transition-colors">Read the latest articles published by TY CSE students.</p>
               <div className="h-1.5 w-24 bg-blue-600 dark:bg-blue-400 rounded-full mt-4 transition-colors" />
            </div>
         </div>

        {blogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {blogs.map((blog: any) => (
              <BlogCard key={blog._id} blog={blog} />
            ))}
          </div>
         ) : (
           <div className="text-center py-32 space-y-6 transition-colors">
              <div className="mx-auto w-24 h-24 bg-gray-50 dark:bg-slate-900 rounded-full flex items-center justify-center border border-gray-100 dark:border-white/10 shadow-inner transition-colors">
                 <span className="text-4xl">📚</span>
              </div>
              <div className="space-y-2 transition-colors">
                 <h3 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">No articles published yet.</h3>
                 <p className="text-gray-500 dark:text-gray-400 font-medium italic">Be the very first to share your insights with the department!</p>
              </div>
           </div>
         )}
      </section>
    </main>
  );
}
