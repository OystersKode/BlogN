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
    <main className="min-h-screen bg-white">
      <Navbar />
      <div className="max-w-[1336px] mx-auto flex justify-center px-4 sm:px-6">
        <MediumSidebar />
        
        <section className="flex-1 max-w-[700px] min-w-0 w-full lg:px-12 py-8 lg:py-12 border-x border-gray-100 min-h-screen">
          <div className="mb-8">
             <h1 className="text-[40px] font-black text-gray-900 tracking-tight leading-tight">Your Network</h1>
          </div>

          <div className="flex gap-8 border-b border-gray-100 mb-8 overflow-x-auto hide-scrollbar">
             <button className="pb-4 border-b border-gray-900 text-[14px] text-gray-900 font-medium whitespace-nowrap">Following ({network.following.length})</button>
          </div>

          {network.following.length > 0 ? (
             <div className="space-y-6">
                 {network.following.map((u: any) => (
                    <Link href={`/user/${u._id}`} key={u._id} className="flex items-center justify-between group">
                       <div className="flex items-center gap-4">
                          <Image src={u.image || '/default-avatar.png'} width={48} height={48} className="rounded-full" alt={u.name} />
                          <div>
                             <p className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{u.name}</p>
                             {u.prn && <p className="text-xs font-mono text-gray-500 uppercase">PRN: {u.prn}</p>}
                             <p className="text-sm text-gray-500 line-clamp-1">{u.bio || 'No bio available'}</p>
                          </div>
                       </div>
                       <button className="hidden sm:block border border-gray-300 text-gray-900 text-sm font-medium rounded-full px-4 py-1.5 group-hover:bg-gray-50 transition-colors">
                          View Profile
                       </button>
                    </Link>
                 ))}
             </div>
          ) : (
             <div className="text-center py-24 space-y-4">
                <span className="text-4xl block mb-4">👥</span>
                <h3 className="text-xl font-bold text-gray-900">You aren't following anyone yet.</h3>
                <p className="text-gray-500 text-sm">Discover writers and expand your network.</p>
             </div>
          )}
        </section>

        <MediumRightbar />
      </div>
      <Footer />
    </main>
  );
}
