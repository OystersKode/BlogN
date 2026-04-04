import { searchPlatform } from '@/app/actions/search';
import Navbar from '@/components/layout/Navbar';
import MediumSidebar from '@/components/layout/MediumSidebar';
import MediumRightbar from '@/components/layout/MediumRightbar';
import HorizontalBlogCard from '@/components/blog/HorizontalBlogCard';
import Footer from '@/components/layout/Footer';
import Image from 'next/image';
import Link from 'next/link';
import { Search, UserPlus } from 'lucide-react';

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q: string }> }) {
  const resolvedParams = await searchParams;
  const q = resolvedParams.q || '';
  
  const { users, blogs } = await searchPlatform(q);

  return (
    <main className="min-h-screen bg-[#F4F4F1] dark:bg-zinc-950 transition-colors">
      <Navbar />
      <div className="max-w-7xl mx-auto flex justify-center px-4 sm:px-6">
        <MediumSidebar />
        
        <section className="flex-1 max-w-[700px] min-w-0 w-full lg:px-12 py-8 lg:py-16 border-x-[4px] border-black dark:border-white min-h-screen transition-all bg-white dark:bg-zinc-900 shadow-neo">
          <div className="mb-16 border-b-[5px] border-black dark:border-white pb-8 transition-all flex flex-col gap-4">
             <div className="flex items-center gap-3 bg-primary border-[3px] border-black shadow-neo-sm px-4 py-1 w-fit rotate-1">
                <Search size={18} strokeWidth={3} className="text-black" />
                <span className="text-xs font-black uppercase tracking-widest text-black">Search Result</span>
             </div>
             <h1 className="text-4xl sm:text-6xl font-black text-black dark:text-white tracking-tighter leading-none uppercase italic">"{q}"</h1>
          </div>

          {users.length > 0 && (
             <div className="mb-16 transition-all">
                <h2 className="text-xl font-black text-black dark:text-white mb-8 pb-2 border-b-[3px] border-black w-fit uppercase tracking-tighter italic transition-all">Matched Authors ({users.length})</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   {users.map((u: any) => (
                      <Link href={`/user/${u._id}`} key={u._id} className="bg-white dark:bg-zinc-800 border-[3px] border-black dark:border-white p-4 shadow-neo hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all group flex items-center justify-between">
                         <div className="flex items-center gap-4 min-w-0">
                            <Image src={u.image || '/default-avatar.png'} width={56} height={56} className="border-[2px] border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] grayscale group-hover:grayscale-0 transition-all" alt={u.name} />
                            <div className="min-w-0">
                               <p className="font-black text-sm uppercase text-black dark:text-white truncate tracking-tight">{u.name}</p>
                               {u.prn && <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest truncate">PRN: {u.prn}</p>}
                               <p className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 line-clamp-1 truncate mt-1 italic">{u.bio || 'No analytical bio'}</p>
                            </div>
                         </div>
                         <div className="flex-shrink-0 ml-2">
                             <div className="p-2 border-[2px] border-black bg-secondary shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] group-hover:shadow-none transition-all">
                                <UserPlus size={16} strokeWidth={3} className="text-black" />
                             </div>
                         </div>
                      </Link>
                   ))}
                </div>
             </div>
          )}

          <div className="space-y-8">
             <h2 className="text-xl font-black text-black dark:text-white mb-8 pb-2 border-b-[3px] border-black w-fit uppercase tracking-tighter italic transition-all">Technical Stories ({blogs.length})</h2>
             {blogs.length > 0 ? (
                <div className="space-y-12">
                   {blogs.map((blog: any) => (
                     <div key={blog._id} className="border-b-[4px] border-black/10 pb-8 last:border-0">
                        <HorizontalBlogCard blog={blog} />
                     </div>
                   ))}
                </div>
             ) : (
                <div className="text-start py-12 px-8 bg-zinc-50 dark:bg-zinc-800/50 border-[3px] border-black border-dashed transition-all">
                   <p className="text-zinc-400 font-bold uppercase tracking-widest italic leading-relaxed">No data packets found matching your query on the academic grid.</p>
                </div>
             )}
          </div>
        </section>

        <MediumRightbar />
      </div>
      <Footer />
    </main>
  );
}
