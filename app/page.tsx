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
import { BookOpen, Users, GraduationCap, Search } from 'lucide-react';


export default async function Home({ searchParams }: { searchParams: Promise<{ feed?: string }> }) {
   const session = await getServerSession(authOptions);
   const resolvedSearchParams = await searchParams;
   const feedType = resolvedSearchParams.feed || 'all';

   if (session) {
      // ---- LOGGED IN STATE: Medium-Style 3-Column Feed ----
      const blogs = await getBlogs(feedType);

      return (
         <main className="min-h-screen bg-[#F4F4F1] dark:bg-zinc-950 transition-all">
            <Navbar />
            <div className="max-w-[1336px] mx-auto flex justify-center px-4 md:px-6">
               <MediumSidebar />

               <section className="flex-1 max-w-[700px] min-w-0 w-full xl:px-12 py-8 lg:py-12">

                  {/* Feed Tabs */}
                  <div className="flex gap-8 border-b-[4px] border-black dark:border-white mb-10 overflow-x-auto hide-scrollbar transition-all px-4 sm:px-0">
                     <Link href="/" className={`pb-4 text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${feedType === 'all' ? 'border-b-[4px] border-primary text-black dark:text-white' : 'text-zinc-500 hover:text-black dark:hover:text-white'}`}>For you</Link>
                     <Link href="/?feed=following" className={`pb-4 text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${feedType === 'following' ? 'border-b-[4px] border-primary text-black dark:text-white' : 'text-zinc-500 hover:text-black dark:hover:text-white'}`}>Following</Link>
                  </div>

                  {blogs.length > 0 ? (
                     <div className="flex flex-col">
                        {blogs.map((blog: any) => (
                           <HorizontalBlogCard key={blog._id} blog={blog} />
                        ))}
                     </div>
                  ) : (
                     <div className="text-center py-24 space-y-4">
                        <div className="w-20 h-20 bg-white border-[3px] border-black shadow-neo flex items-center justify-center mx-auto mb-6">
                           <Search size={32} strokeWidth={3} className="text-zinc-400" />
                        </div>
                        <h3 className="text-xl font-black uppercase tracking-tighter text-black dark:text-white transition-colors">Your feed is empty.</h3>
                        <p className="text-zinc-500 dark:text-zinc-400 text-sm font-bold transition-colors">Follow some TY CSE classmates or publish the first article!</p>
                     </div>
                  )}
               </section>

               <MediumRightbar />
            </div>
            <Footer />
         </main>
      );
   }

   // ---- LOGGED OUT STATE: Neo-Brutalist Landing Page ----
   return (
      <main className="min-h-screen bg-[#F4F4F1] dark:bg-zinc-950 flex flex-col transition-all">
         <Navbar />

         {/* Hero Section */}
         <section className="flex-1 flex border-b-[5px] border-black dark:border-white pb-24 relative overflow-hidden transition-all bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:20px_20px] dark:bg-[radial-gradient(#fff_1px,transparent_1px)]">
            <NetworkBackground />
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 md:mt-24 flex flex-col lg:flex-row items-center justify-between gap-12 z-10">
               <div className="max-w-4xl relative z-10 space-y-8 sm:space-y-10 bg-primary p-6 sm:p-10 md:p-14 border-[5px] border-black shadow-neo-xl mx-4 sm:mx-0">
                  <h1 className="text-2xl sm:text-4xl md:text-6xl lg:text-6xl xl:text-7xl font-black leading-[0.9] tracking-tighter text-black font-serif uppercase">
                     ENGINEERING <br className="hidden sm:block" /> INSIGHTS.
                  </h1>
                  <p className="text-lg md:text-2xl text-black font-bold leading-tight uppercase tracking-tight max-w-xl">
                     A dedicated platform built by and for Third Year Computer Science students. Document your technical journeys.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-6 pt-4">
                     <Link
                        href="/api/auth/signin"
                        className="w-full sm:w-auto text-center bg-black text-white text-lg sm:text-xl font-black uppercase tracking-widest px-10 py-5 border-[4px] border-black shadow-neo hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
                     >
                        Start writing
                     </Link>
                     <Link
                        href="/explore"
                        className="w-full sm:w-auto text-center bg-white text-black text-lg sm:text-xl font-black uppercase tracking-widest px-10 py-5 border-[4px] border-black shadow-symbols shadow-neo hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
                     >
                        Explore Feed
                     </Link>
                  </div>
               </div>
            </div>
         </section>

         {/* Purpose Section */}
         <section className="py-24 sm:py-32 bg-white dark:bg-zinc-900 border-b-[5px] border-black dark:border-white transition-all">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
               <div className="max-w-4xl mb-16 sm:mb-20 bg-secondary p-8 border-[4px] border-black shadow-neo-lg sm:rotate-[-1deg]">
                  <h2 className="text-4xl sm:text-7xl font-black text-black font-serif uppercase tracking-tighter mb-4 leading-none">Why we built this.</h2>
                  <p className="text-xl sm:text-2xl text-black font-bold uppercase">Solving the fragmentation of knowledge.</p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                  <div className="bg-[#C7FFD8] p-8 border-[4px] border-black shadow-neo hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all group">
                     <div className="mb-8 w-16 h-16 flex items-center justify-center bg-white border-[3px] border-black shadow-neo group-hover:rotate-12 transition-transform">
                        <BookOpen size={32} strokeWidth={3} className="text-black" />
                     </div>
                     <h3 className="text-lg sm:text-xl md:text-lg lg:text-2xl font-black text-black mb-6 uppercase tracking-tight leading-[0.9] break-words">Preserving Knowledge</h3>
                     <p className="text-black font-bold leading-snug">
                        Every semester, brilliant project documentation and research are lost. This platform ensures your technical writings are permanently archived.
                     </p>
                  </div>

                  <div className="bg-[#FFD166] p-8 border-[4px] border-black shadow-neo hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all group sm:rotate-[1deg]">
                     <div className="mb-8 w-16 h-16 flex items-center justify-center bg-white border-[3px] border-black shadow-neo group-hover:-rotate-12 transition-transform">
                        <Users size={32} strokeWidth={3} className="text-black" />
                     </div>
                     <h3 className="text-lg sm:text-xl md:text-lg lg:text-2xl font-black text-black mb-6 uppercase tracking-tight leading-[0.9] break-words">Peer Collaboration</h3>
                     <p className="text-black font-bold leading-snug">
                        Stuck on a tricky algorithm? Search the platform to see how your classmates solved the exact same problems in their own projects.
                     </p>
                  </div>

                  <div className="bg-[#EF476F] text-white p-8 border-[4px] border-black shadow-neo hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all group">
                     <div className="mb-8 w-16 h-16 flex items-center justify-center bg-white border-[3px] border-black shadow-neo group-hover:rotate-6 transition-transform">
                        <GraduationCap size={32} strokeWidth={3} className="text-black" />
                     </div>
                     <h3 className="text-lg sm:text-xl md:text-lg lg:text-2xl font-black text-white mb-6 uppercase tracking-tight leading-[0.9] break-words">Academic Visibility</h3>
                     <p className="text-white font-bold leading-snug">
                        Teachers can easily browse through the compiled writings of the entire class to gauge understanding and project tracking.
                     </p>
                  </div>
               </div>
            </div>
         </section>

         <Footer />
      </main>
   );
}
