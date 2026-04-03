import { getPublicUser, getPublicUserNetwork } from '@/app/actions/profile';
import { getBlogs } from '@/app/actions/blog';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import MediumSidebar from '@/components/layout/MediumSidebar';
import MediumRightbar from '@/components/layout/MediumRightbar';
import HorizontalBlogCard from '@/components/blog/HorizontalBlogCard';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import Footer from '@/components/layout/Footer';
import FollowButton from '@/components/profile/FollowButton';

export default async function PublicProfilePage({ 
  params, 
  searchParams 
}: { 
  params: Promise<{ id: string }>, 
  searchParams: Promise<{ tab?: string }> 
}) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const tab = resolvedSearchParams.tab || 'stories';
  
  const user = await getPublicUser(resolvedParams.id);
  
  if (!user) {
    notFound();
  }

  let userBlogs = [];
  let network = { followers: [], following: [] };

  if (tab === 'stories') {
     let allBlogs = await getBlogs();
     userBlogs = allBlogs.filter((b: any) => b.author?._id === user._id);
  } else {
     network = await getPublicUserNetwork(resolvedParams.id);
  }

  return (
    <main className="min-h-screen bg-white dark:bg-slate-950 transition-colors">
      <Navbar />
      <div className="max-w-[1336px] mx-auto flex justify-center px-4 sm:px-6">
        <MediumSidebar />
        
        <section className="flex-1 max-w-[700px] min-w-0 w-full lg:px-12 py-8 lg:py-12 border-x border-gray-100 dark:border-white/10 min-h-screen transition-colors">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 gap-8">
             <div>
                <h1 className="text-[40px] font-black text-gray-900 dark:text-white tracking-tight leading-tight mb-2 transition-colors">{user.name}</h1>
                <p className="text-gray-500 dark:text-gray-400 font-medium mb-4 transition-colors">{user.followersCount} Followers • {user.followingCount} Following</p>
                {user.bio && <p className="text-gray-700 dark:text-gray-300 font-serif leading-relaxed line-clamp-3 transition-colors">{user.bio}</p>}
                
                {user.prn && <p className="text-blue-600 dark:text-blue-400 text-sm font-mono mt-2 font-bold uppercase tracking-wider transition-colors">PRN: {user.prn}</p>}
             </div>
             
             <div className="flex flex-col items-center gap-4 flex-shrink-0">
               <Image 
                  src={user.image || '/default-avatar.png'}
                  alt={user.name}
                  width={96}
                  height={96}
                  className="rounded-full ring-4 ring-gray-50 dark:ring-white/10"
               />
               <FollowButton targetUserId={user._id} initialFollowing={user.isFollowing} />
             </div>
          </div>

          <div className="flex gap-8 border-b border-gray-100 dark:border-white/10 mb-8 overflow-x-auto hide-scrollbar transition-colors">
             <Link href={`/user/${user._id}?tab=stories`} className={`pb-4 text-[14px] font-medium whitespace-nowrap transition-colors ${tab === 'stories' ? 'border-b border-gray-900 dark:border-white text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}>Stories</Link>
             <Link href={`/user/${user._id}?tab=following`} className={`pb-4 text-[14px] font-medium whitespace-nowrap transition-colors ${tab === 'following' ? 'border-b border-gray-900 dark:border-white text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}>Following ({user.followingCount})</Link>
             <Link href={`/user/${user._id}?tab=followers`} className={`pb-4 text-[14px] font-medium whitespace-nowrap transition-colors ${tab === 'followers' ? 'border-b border-gray-900 dark:border-white text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}>Followers ({user.followersCount})</Link>
          </div>

          {tab === 'stories' && (
             userBlogs.length > 0 ? (
                <div className="flex flex-col">
                   {userBlogs.map((blog: any) => (
                     <HorizontalBlogCard key={blog._id} blog={blog} />
                   ))}
                </div>
             ) : (
                <div className="text-center py-24 space-y-4">
                   <span className="text-4xl block mb-4">📝</span>
                   <h3 className="text-xl font-bold text-gray-900 dark:text-white transition-colors">{user.name} hasn't published any stories yet.</h3>
                </div>
             )
          )}

          {(tab === 'following' || tab === 'followers') && (
             <div className="space-y-6">
                {(tab === 'following' ? network.following : network.followers).length > 0 ? (
                   (tab === 'following' ? network.following : network.followers).map((u: any) => (
                      <Link href={`/user/${u._id}`} key={u._id} className="flex items-center justify-between group">
                         <div className="flex items-center gap-4">
                            <Image src={u.image || '/default-avatar.png'} width={48} height={48} className="rounded-full" alt={u.name} />
                            <div>
                               <p className="font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{u.name}</p>
                               {u.prn && <p className="text-xs font-mono text-gray-500 dark:text-gray-400 uppercase transition-colors">PRN: {u.prn}</p>}
                               <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1 transition-colors">{u.bio || 'No bio available'}</p>
                            </div>
                         </div>
                         <button className="hidden sm:block border border-gray-300 dark:border-white/20 text-gray-900 dark:text-white text-sm font-medium rounded-full px-4 py-1.5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                            View Profile
                         </button>
                      </Link>
                   ))
                ) : (
                   <div className="text-center py-24 space-y-4">
                      <span className="text-4xl block mb-4">👥</span>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white transition-colors">{user.name} isn't {tab === 'following' ? 'following anyone' : 'followed by anyone'} yet.</h3>
                   </div>
                )}
             </div>
          )}
        </section>

        <MediumRightbar />
      </div>
      <Footer />
    </main>
  );
}
