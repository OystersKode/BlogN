import Navbar from '@/components/layout/Navbar';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import MediumSidebar from '@/components/layout/MediumSidebar';
import MediumRightbar from '@/components/layout/MediumRightbar';
import HorizontalBlogCard from '@/components/blog/HorizontalBlogCard';
import { getBlogs } from '@/app/actions/blog';


export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session) {
    // ---- LOGGED IN STATE: Medium-Style 3-Column Feed ----
    const blogs = await getBlogs();

    return (
      <main className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-[1336px] mx-auto flex justify-center px-4 sm:px-6">
          <MediumSidebar />
          
          <section className="flex-1 max-w-[700px] min-w-0 w-full lg:px-12 py-8 lg:py-12">
            
            {/* Feed Tabs */}
            <div className="flex gap-8 border-b border-gray-100 mb-8 overflow-x-auto hide-scrollbar">
               <button className="pb-4 border-b border-gray-900 text-[14px] text-gray-900 font-medium whitespace-nowrap">For you</button>
               <button className="pb-4 text-[14px] text-gray-500 hover:text-gray-900 transition-colors whitespace-nowrap">Following</button>
               <button className="pb-4 text-[14px] text-gray-500 hover:text-gray-900 transition-colors whitespace-nowrap">TY CSE Selected</button>
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
                  <h3 className="text-xl font-bold text-gray-900">Your feed is empty.</h3>
                  <p className="text-gray-500 text-sm">Follow some TY CSE classmates or publish the first article!</p>
               </div>
            )}
          </section>

          <MediumRightbar />
        </div>
      </main>
    );
  }

  // ---- LOGGED OUT STATE: Minimalist TY CSE Landing Page ----
  return (
    <main className="min-h-screen bg-[#f8fafc] selection:bg-blue-100 selection:text-slate-900 flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="flex-1 flex border-b border-slate-200 pb-20">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24 flex flex-col lg:flex-row items-center justify-between gap-12">
           <div className="max-w-2xl relative z-10 space-y-8">
              <h1 className="text-[60px] md:text-[85px] font-normal leading-[0.95] tracking-tight text-slate-900 font-serif">
                 The Central Hub for <br className="hidden md:block"/> Engineering Insights
              </h1>
              <p className="text-xl md:text-2xl text-slate-700 font-serif leading-relaxed">
                 A dedicated platform built by and for Third Year Computer Science students. Document your technical journeys and build a collective academic archive.
              </p>
              <div className="flex gap-4 pt-4">
                 <Link 
                    href="/api/auth/signin" 
                    className="inline-block bg-slate-900 text-white text-lg rounded-full px-8 py-3 hover:bg-slate-800 hover:shadow-lg transition-all"
                 >
                    Login to Start Reading
                 </Link>
                 <Link 
                    href="/explore" 
                    className="inline-block bg-white text-slate-900 border border-slate-300 text-lg rounded-full px-8 py-3 hover:bg-slate-50 hover:border-slate-400 transition-colors"
                 >
                    Explore Public Feed
                 </Link>
              </div>
           </div>
        </div>
      </section>

      {/* Purpose / Element Boxes Section (Minimalist Redesign) */}
      <section className="py-24 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="max-w-3xl mb-16">
              <h2 className="text-4xl md:text-5xl font-normal text-slate-900 font-serif tracking-tight mb-4">Why we built this platform.</h2>
              <p className="text-xl text-slate-600 font-serif">Solving the fragmentation of student knowledge.</p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-12">
              <div className="border-t border-slate-300 pt-6">
                 <div className="text-xl mb-6 w-10 h-10 flex items-center justify-center bg-blue-50 text-blue-600 rounded-lg">📚</div>
                 <h3 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">Preserving Knowledge</h3>
                 <p className="text-slate-600 leading-relaxed">
                    Every semester, brilliant project documentation and research are lost. This platform ensures your technical writings are permanently archived and easily accessible to future batches.
                 </p>
              </div>

              <div className="border-t border-slate-300 pt-6">
                 <div className="text-xl mb-6 w-10 h-10 flex items-center justify-center bg-indigo-50 text-indigo-600 rounded-lg">🤝</div>
                 <h3 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">Peer Collaboration</h3>
                 <p className="text-slate-600 leading-relaxed">
                    Stuck on a tricky algorithm or setting up a complex tech stack? Search the platform to see how your classmates solved the exact same problems in their own projects.
                 </p>
              </div>

              <div className="border-t border-slate-300 pt-6">
                 <div className="text-xl mb-6 w-10 h-10 flex items-center justify-center bg-purple-50 text-purple-600 rounded-lg">👨‍🏫</div>
                 <h3 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">Academic Visibility</h3>
                 <p className="text-slate-600 leading-relaxed">
                    Teachers can easily browse through the compiled writings of the entire class to gauge understanding, providing a centralized place for assignment submissions and project tracking.
                 </p>
              </div>
           </div>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="bg-[#f8fafc] py-12 text-[13px] text-slate-500 font-medium">
         <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            
            <div className="flex flex-col gap-2">
               <span className="text-gray-900 font-bold font-serif text-2xl mb-2">BlogN</span>
               <div className="flex flex-wrap gap-4">
                  <span className="cursor-pointer hover:text-gray-900">CSE Department</span>
                  <span className="cursor-pointer hover:text-gray-900">Subject: Design and Analysis of Algorithm</span>
               </div>
               <span className="mt-4">
                  Built with ❤️ by{' '}
                  <a href="https://www.linkedin.com/in/vishwajit-sutar-03324b2b0/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 font-bold transition-colors">
                     Vishwajit Sutar
                  </a>
               </span>
            </div>

            <div className="flex flex-col md:items-end gap-2">
               <span className="text-gray-900 font-bold text-sm mb-2">Oyster Kode Club</span>
               <div className="flex flex-wrap md:justify-end gap-5">
                  <a href="mailto:oysterkode@ritindia.edu" className="cursor-pointer text-slate-400 hover:text-[#ea4335] transition-all" aria-label="Mail" title="Mail">
                     <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"/></svg>
                  </a>
                  <a href="#" className="cursor-pointer text-slate-400 hover:text-[#E1306C] transition-all" aria-label="Instagram" title="Instagram">
                     <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                  </a>
                  <a href="https://www.linkedin.com/in/oyster-kode-club/" target="_blank" rel="noopener noreferrer" className="cursor-pointer text-slate-400 hover:text-[#0077b5] transition-all" aria-label="LinkedIn" title="LinkedIn">
                     <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                  </a>
               </div>
               <span className="mt-4 text-[12px]">© {new Date().getFullYear()} All Rights Reserved.</span>
            </div>

         </div>
      </footer>
    </main>
  );
}
