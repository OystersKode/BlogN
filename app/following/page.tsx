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

export default async function FollowingPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
     redirect('/login');
  }

  // Get the active user's network using their session ID
  const activeUserId = (session.user as any).id;
  const network = await getPublicUserNetwork(activeUserId);

  return (
    <main className="min-h-screen bg-white dark:bg-slate-950 transition-colors">
      <Navbar />
      <div className="max-w-[1336px] mx-auto flex justify-center px-4 sm:px-6">
        <MediumSidebar />
        
        <section className="flex-1 max-w-[700px] min-w-0 w-full lg:px-12 py-8 lg:py-12 border-x border-gray-100 dark:border-white/10 min-h-screen transition-colors">
          <div className="mb-8">
             <h1 className="text-[40px] font-black text-gray-900 dark:text-white tracking-tight leading-tight transition-colors">Your Network</h1>
          </div>

          <div className="flex gap-8 border-b border-gray-100 dark:border-white/10 mb-8 overflow-x-auto hide-scrollbar transition-colors">
             <h1 className="text-[40px] font-black text-white dark:text-gray-900 tracking-tight leading-tight transition-colors">Your Network</h1>
          </div>

          <div className="flex gap-8 border-b border-white/10 dark:border-gray-100 mb-8 overflow-x-auto hide-scrollbar transition-colors">
             <button className="pb-4 border-b border-white dark:border-gray-900 text-[14px] text-white dark:text-gray-900 font-medium whitespace-nowrap transition-colors">Following ({network.following.length})</button>
          </div>

          {network.following.length > 0 ? (
             <div className="space-y-6">
                 {network.following.map((u: any) => (
                     <Link href={`/user/${u._id}`} key={u._id} className="flex items-center justify-between group transition-all">
                        <div className="flex items-center gap-4">
                           <Image src={u.image || '/default-avatar.png'} width={48} height={48} className="rounded-full" alt={u.name} />
                           <div>
                              <p className="font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors uppercase tracking-tight">{u.name}</p>
                              {u.prn && <p className="text-xs font-mono text-gray-500 dark:text-gray-400 uppercase transition-colors">PRN: {u.prn}</p>}
                              <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1 transition-colors">{u.bio || 'No bio available'}</p>
                           </div>
                        </div>
                        <button className="hidden sm:block border border-gray-300 dark:border-white/20 text-gray-900 dark:text-white text-sm font-medium rounded-full px-4 py-1.5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                           View Profile
                        </button>
                     </Link>
                 ))}
             </div>
          ) : (
              <div className="text-center py-24 space-y-4">
                 <span className="text-4xl block mb-4">👥</span>
                 <h3 className="text-xl font-bold text-gray-900 dark:text-white transition-colors">You aren't following anyone yet.</h3>
                 <p className="text-gray-500 dark:text-gray-400 text-sm transition-colors">Discover writers and expand your network.</p>
              </div>
          )}
        </section>

        <MediumRightbar />
      </div>
      <Footer />
    </main>
  );
}
