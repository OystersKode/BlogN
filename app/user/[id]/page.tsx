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
import { Users, FileText, UserPlus } from 'lucide-react';

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
    <main className="min-h-screen bg-[#F4F4F1] dark:bg-zinc-950 transition-colors">
      <Navbar />
      <div className="max-w-[1336px] mx-auto flex justify-center px-4 md:px-6">
        <MediumSidebar />
        
        <section className="flex-1 max-w-[700px] min-w-0 w-full xl:px-12 py-8 lg:py-12 min-h-screen transition-colors">
          <div className="flex flex-col sm:flex-row items-start justify-between mb-16 gap-10 bg-white dark:bg-zinc-900 border-[4px] border-black dark:border-white p-8 shadow-neo-lg">
             <div className="flex-1">
                <h1 className="text-4xl sm:text-5xl font-black text-black dark:text-white tracking-tighter uppercase leading-none mb-4 font-serif">{user.name}</h1>
                <div className="flex items-center gap-4 text-[11px] font-black uppercase text-zinc-500 mb-6 flex-wrap">
                   <span className="bg-primary text-black px-2 py-1 border-[2px] border-black">{user.followersCount} Followers</span>
                   <span className="bg-secondary text-black px-2 py-1 border-[2px] border-black">{user.followingCount} Following</span>
                </div>
                {user.bio && <p className="text-sm font-bold text-black dark:text-white uppercase leading-tight italic bg-zinc-100 dark:bg-zinc-800 p-4 border-l-[6px] border-black dark:border-white">{user.bio}</p>}
                
                {user.prn && <p className="text-black dark:text-white text-xs font-black mt-6 uppercase tracking-wider bg-white dark:bg-zinc-900 px-3 py-1 border-[2px] border-black dark:border-white inline-block">PRN: {user.prn}</p>}
             </div>
             
             <div className="flex flex-col items-center gap-6 flex-shrink-0 w-full sm:w-auto">
                <div className="relative w-32 h-32 border-[4px] border-black dark:border-white shadow-neo overflow-hidden">
                   <Image 
                      src={user.image || '/default-avatar.png'}
                      alt={user.name}
                      fill
                      className="object-cover grayscale contrast-125"
                   />
                </div>
                <FollowButton targetUserId={user._id} initialFollowing={user.isFollowing} />
             </div>
          </div>

          <div className="flex gap-8 border-b-[4px] border-black dark:border-white mb-12 overflow-x-auto hide-scrollbar transition-colors">
             <Link href={`/user/${user._id}?tab=stories`} className={`pb-4 text-[12px] font-black uppercase tracking-widest whitespace-nowrap transition-colors ${tab === 'stories' ? 'border-b-[4px] border-primary text-black dark:text-white' : 'text-zinc-500 hover:text-black dark:hover:text-white'}`}>Stories</Link>
             <Link href={`/user/${user._id}?tab=following`} className={`pb-4 text-[12px] font-black uppercase tracking-widest whitespace-nowrap transition-colors ${tab === 'following' ? 'border-b-[4px] border-primary text-black dark:text-white' : 'text-zinc-500 hover:text-black dark:hover:text-white'}`}>Following ({user.followingCount})</Link>
             <Link href={`/user/${user._id}?tab=followers`} className={`pb-4 text-[12px] font-black uppercase tracking-widest whitespace-nowrap transition-colors ${tab === 'followers' ? 'border-b-[4px] border-primary text-black dark:text-white' : 'text-zinc-500 hover:text-black dark:hover:text-white'}`}>Followers ({user.followersCount})</Link>
          </div>

          {tab === 'stories' && (
             userBlogs.length > 0 ? (
                <div className="flex flex-col">
                   {userBlogs.map((blog: any) => (
                     <HorizontalBlogCard key={blog._id} blog={blog} />
                   ))}
                </div>
             ) : (
                <div className="text-center py-24 space-y-8 transition-colors">
                   <div className="w-20 h-20 bg-white border-[3px] border-black shadow-neo flex items-center justify-center mx-auto">
                      <FileText size={36} strokeWidth={3} className="text-zinc-400" />
                   </div>
                   <h3 className="text-2xl font-black text-black dark:text-white uppercase tracking-tighter">{user.name} hasn't published any stories yet.</h3>
                </div>
             )
          )}

          {(tab === 'following' || tab === 'followers') && (
             <div className="space-y-6">
                {(tab === 'following' ? network.following : network.followers).length > 0 ? (
                   (tab === 'following' ? network.following : network.followers).map((u: any) => (
                      <Link href={`/user/${u._id}`} key={u._id} className="flex items-center justify-between group p-4 border-[3px] border-black dark:border-white bg-white dark:bg-zinc-900 shadow-neo hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
                         <div className="flex items-center gap-4">
                            <div className="relative w-14 h-14 border-[2px] border-black dark:border-white shadow-neo overflow-hidden flex-shrink-0">
                               <Image src={u.image || '/default-avatar.png'} fill className="object-cover grayscale contrast-125" alt={u.name} />
                            </div>
                            <div>
                               <p className="font-black text-black dark:text-white uppercase tracking-tight group-hover:bg-primary px-1 inline-block">{u.name}</p>
                               {u.prn && <p className="text-[10px] font-black text-zinc-500 uppercase transition-colors">PRN: {u.prn}</p>}
                               <p className="text-xs font-bold text-zinc-600 dark:text-zinc-400 line-clamp-1 truncate max-w-[150px] sm:max-w-xs">{u.bio || 'Technical Contributor'}</p>
                            </div>
                         </div>
                         <div className="hidden sm:flex items-center justify-center p-2 bg-black text-white border-[2px] border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] group-hover:bg-primary group-hover:text-black transition-all">
                            <UserPlus size={18} strokeWidth={3} />
                         </div>
                      </Link>
                   ))
                ) : (
                   <div className="text-center py-24 space-y-8 transition-colors">
                      <div className="w-20 h-20 bg-white border-[3px] border-black shadow-neo flex items-center justify-center mx-auto">
                         <Users size={36} strokeWidth={3} className="text-zinc-400" />
                      </div>
                      <h3 className="text-2xl font-black text-black dark:text-white uppercase tracking-tighter">{user.name} isn't {tab === 'following' ? 'following anyone' : 'followed by anyone'} yet.</h3>
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
