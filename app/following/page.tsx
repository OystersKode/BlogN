import { getPublicUserNetwork } from '@/app/actions/profile';
import Navbar from '@/components/layout/Navbar';
import MediumSidebar from '@/components/layout/MediumSidebar';
import MediumRightbar from '@/components/layout/MediumRightbar';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Footer from '@/components/layout/Footer';
import Image from 'next/image';
import Link from 'next/link';
import { Users, UserPlus } from 'lucide-react';

export default async function FollowingPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
     redirect('/login');
  }

  const activeUserId = (session.user as any).id;
  const network = await getPublicUserNetwork(activeUserId);

  return (
    <main className="min-h-screen bg-[#F4F4F1] dark:bg-zinc-950 transition-colors">
      <Navbar />
      <div className="max-w-[1336px] mx-auto flex justify-center px-4 md:px-6">
        <MediumSidebar />
        
        <section className="flex-1 max-w-[700px] min-w-0 w-full xl:px-12 py-8 lg:py-12 min-h-screen transition-colors">
          <div className="mb-12 bg-secondary p-8 border-[4px] border-black shadow-neo-lg rotate-[-1deg] max-w-md">
             <h1 className="text-4xl sm:text-5xl font-black text-black tracking-tighter uppercase leading-none font-serif">Your Network</h1>
          </div>

          <div className="flex gap-8 border-b-[4px] border-black dark:border-white mb-10 overflow-x-auto hide-scrollbar transition-colors">
             <button className="pb-4 border-b-[4px] border-primary text-[12px] text-black dark:text-white font-black uppercase tracking-widest whitespace-nowrap transition-colors">Following ({network.following.length})</button>
          </div>

          {network.following.length > 0 ? (
             <div className="space-y-6">
                 {network.following.map((u: any) => (
                     <Link href={`/user/${u._id}`} key={u._id} className="flex items-center justify-between group transition-all p-4 border-[3px] border-black dark:border-white bg-white dark:bg-zinc-900 shadow-neo hover:shadow-none hover:translate-x-1 hover:translate-y-1">
                        <div className="flex items-center gap-4">
                           <Image src={u.image || '/default-avatar.png'} width={56} height={56} className="border-[2px] border-black dark:border-white grayscale contrast-125" alt={u.name} />
                           <div>
                              <p className="font-black text-black dark:text-white uppercase tracking-tight group-hover:bg-primary transition-all px-1 inline-block">{u.name}</p>
                              {u.prn && <p className="text-[10px] font-black text-zinc-500 uppercase transition-colors">PRN: {u.prn}</p>}
                              <p className="text-xs font-bold text-zinc-600 dark:text-zinc-400 line-clamp-1 truncate max-w-[150px] sm:max-w-xs">{u.bio || 'Technical Writer @ BlogN'}</p>
                           </div>
                        </div>
                        <div className="hidden sm:flex items-center justify-center p-2 bg-black text-white border-[2px] border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] group-hover:bg-primary group-hover:text-black transition-all">
                           <UserPlus size={18} strokeWidth={3} />
                        </div>
                     </Link>
                 ))}
             </div>
          ) : (
              <div className="text-center py-24 space-y-8 transition-colors">
                 <div className="w-24 h-24 bg-white dark:bg-zinc-900 border-[4px] border-black shadow-neo flex items-center justify-center mx-auto">
                    <Users size={48} strokeWidth={3} className="text-zinc-400" />
                 </div>
                 <div className="space-y-4">
                    <h3 className="text-2xl sm:text-3xl font-black text-black dark:text-white uppercase tracking-tighter">You aren't following anyone yet.</h3>
                    <p className="text-zinc-500 font-bold uppercase max-w-sm mx-auto">Discover writers and expand your network.</p>
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
