import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import NetworkBackground from '@/components/ui/NetworkBackground';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import MediumSidebar from '@/components/layout/MediumSidebar';
import MediumRightbar from '@/components/layout/MediumRightbar';
import HorizontalBlogCard from '@/components/blog/HorizontalBlogCard';
import { getBlogs } from '@/app/actions/blog';


export default async function Home({ searchParams }: { searchParams: Promise<{ feed?: string }> }) {
  const session = await getServerSession(authOptions);
  const resolvedSearchParams = await searchParams;
  const feedType = resolvedSearchParams.feed || 'all';

  if (session) {
    // ---- LOGGED IN STATE: Medium-Style 3-Column Feed ----
    const blogs = await getBlogs(feedType);

    return (
      <main className="min-h-screen bg-white dark:bg-slate-950 transition-colors">
        <Navbar />
        <div className="max-w-[1336px] mx-auto flex justify-center px-4 sm:px-6">
          <MediumSidebar />
          
          <section className="flex-1 max-w-[700px] min-w-0 w-full lg:px-12 py-8 lg:py-12">
            
            {/* Feed Tabs */}
            <div className="flex gap-8 border-b border-gray-100 dark:border-white/10 mb-8 overflow-x-auto hide-scrollbar transition-colors">
               <Link href="/" className={`pb-4 text-[14px] font-medium whitespace-nowrap transition-colors ${feedType === 'all' ? 'border-b border-gray-900 dark:border-white text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'}`}>For you</Link>
               <Link href="/?feed=following" className={`pb-4 text-[14px] font-medium whitespace-nowrap transition-colors ${feedType === 'following' ? 'border-b border-gray-900 dark:border-white text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'}`}>Following</Link>
               <Link href="/?feed=staff" className={`pb-4 text-[14px] font-medium whitespace-nowrap transition-colors ${feedType === 'staff' ? 'border-b border-gray-900 dark:border-white text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'}`}>TY CSE Selected</Link>
            </div>

            {blogs.length > 0 ? (
               <div className="flex flex-col">
                  {blogs.map((blog: any) => (
                    <HorizontalBlogCard key={blog._id} blog={blog} />
                  ))}
               </div>
            ) : (
               <div className="text-center py-24 space-y-4">
                  <span className="text-4xl block mb-4">🤷‍♂️</span>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white transition-colors">Your feed is empty.</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm transition-colors">Follow some TY CSE classmates or publish the first article!</p>
               </div>
            )}
          </section>

          <MediumRightbar />
        </div>
        <Footer />
      </main>
    );
  }

  // ---- LOGGED OUT STATE: Minimalist TY CSE Landing Page ----
  return (
    <main className="min-h-screen bg-[#f8fafc] dark:bg-slate-950 selection:bg-blue-100 selection:text-slate-900 flex flex-col transition-colors">
      <Navbar />

      {/* Hero Section */}
      <section className="flex-1 flex border-b border-slate-200 dark:border-white/10 pb-20 relative overflow-hidden transition-colors">
        <NetworkBackground />
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24 flex flex-col lg:flex-row items-center justify-between gap-12 z-10 pointer-events-none">
           <div className="max-w-2xl relative z-10 space-y-8 pointer-events-auto">
              <h1 className="text-[60px] md:text-[85px] font-normal leading-[0.95] tracking-tight text-slate-900 dark:text-white font-serif transition-colors">
                 The Central Hub for <br className="hidden md:block"/> Engineering Insights
              </h1>
              <p className="text-xl md:text-2xl text-slate-700 dark:text-slate-300 font-sans leading-relaxed transition-colors">
                 A dedicated platform built by and for Third Year Computer Science students. Document your technical journeys and build a collective academic archive.
              </p>
              <div className="flex gap-4 pt-4">
                 <Link 
                    href="/api/auth/signin" 
                    className="inline-block bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-lg rounded-full px-8 py-3 hover:bg-slate-800 dark:hover:bg-gray-200 hover:shadow-lg transition-all"
                 >
                    Login to Start Reading
                 </Link>
                 <Link 
                    href="/explore" 
                    className="inline-block bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-300 dark:border-white/20 text-lg rounded-full px-8 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-400 transition-colors"
                 >
                    Explore Public Feed
                 </Link>
              </div>
           </div>
        </div>
      </section>

      {/* Purpose / Element Boxes Section (Minimalist Redesign) */}
      <section className="py-24 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-white/10 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="max-w-3xl mb-16">
              <h2 className="text-4xl md:text-5xl font-normal text-slate-900 dark:text-white font-serif tracking-tight mb-4 transition-colors">Why we built this platform.</h2>
              <p className="text-xl text-slate-600 dark:text-slate-400 font-sans transition-colors">Solving the fragmentation of student knowledge.</p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-12">
              <div className="border-t border-slate-300 dark:border-white/10 pt-6 transition-colors">
                 <div className="text-xl mb-6 w-10 h-10 flex items-center justify-center bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">📚</div>
                 <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight transition-colors">Preserving Knowledge</h3>
                 <p className="text-slate-600 dark:text-slate-400 leading-relaxed transition-colors">
                    Every semester, brilliant project documentation and research are lost. This platform ensures your technical writings are permanently archived and easily accessible to future batches.
                 </p>
              </div>

              <div className="border-t border-slate-300 dark:border-white/10 pt-6 transition-colors">
                 <div className="text-xl mb-6 w-10 h-10 flex items-center justify-center bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg">🤝</div>
                 <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight transition-colors">Peer Collaboration</h3>
                 <p className="text-slate-600 dark:text-slate-400 leading-relaxed transition-colors">
                    Stuck on a tricky algorithm or setting up a complex tech stack? Search the platform to see how your classmates solved the exact same problems in their own projects.
                 </p>
              </div>

              <div className="border-t border-slate-300 dark:border-white/10 pt-6 transition-colors">
                 <div className="text-xl mb-6 w-10 h-10 flex items-center justify-center bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg">👨‍🏫</div>
                 <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight transition-colors">Academic Visibility</h3>
                 <p className="text-slate-600 dark:text-slate-400 leading-relaxed transition-colors">
                    Teachers can easily browse through the compiled writings of the entire class to gauge understanding, providing a centralized place for assignment submissions and project tracking.
                 </p>
              </div>
           </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
}
