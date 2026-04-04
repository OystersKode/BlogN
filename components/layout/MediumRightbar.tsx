import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { getStaffPicks } from '@/app/actions/blog';
import { getSuggestedUsers } from '@/app/actions/profile';
import FollowButton from '@/components/profile/FollowButton';

const MediumRightbar = async () => {
  const staffPicks = await getStaffPicks();
  const suggestions = await getSuggestedUsers();
  
  return (
    <aside className="w-80 flex-shrink-0 hidden xl:block sticky top-[90px] h-[calc(100vh-90px)] overflow-y-auto pl-8 py-8 border-l-[4px] border-black dark:border-white transition-all">
      
      {/* Staff Picks */}
      <div className="mb-12">
         <h4 className="font-black text-xs uppercase tracking-widest text-black dark:text-white mb-8 border-l-[4px] border-primary pl-3">Staff Picks</h4>
         <div className="space-y-8">
            {staffPicks.length > 0 ? (
               staffPicks.map((pick: any) => (
                  <Link href={`/blog/${pick.slug}`} key={pick._id} className="block group">
                     <div className="flex items-center gap-3 mb-2">
                        <Image src={pick.author?.image || '/default-avatar.png'} width={18} height={18} className="grayscale border border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]" alt={pick.author?.name} />
                        <span className="text-[11px] font-black uppercase text-black dark:text-zinc-300 line-clamp-1">{pick.author?.name}</span>
                     </div>
                     <h5 className="font-black text-sm text-black dark:text-white leading-tight group-hover:bg-primary transition-colors line-clamp-2 uppercase tracking-tighter mb-2">{pick.title}</h5>
                     <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{format(new Date(pick.createdAt), 'MMM d, yyyy')}</p>
                  </Link>
               ))
            ) : (
               <p className="text-[12px] font-bold text-zinc-500 italic lowercase">No staff picks yet.</p>
            )}
          </div>
         
         <Link href="/?feed=staff" className="bg-black text-white px-4 py-2 text-[10px] font-black uppercase tracking-widest mt-8 transition-all hover:bg-zinc-800 inline-block border-[2px] border-black shadow-neo active:shadow-none active:translate-x-1 active:translate-y-1">See all</Link>
      </div>

      {/* Recommended Topics */}
      <div className="mb-12">
         <h4 className="font-black text-xs uppercase tracking-widest text-black dark:text-white mb-8 border-l-[4px] border-secondary pl-3">Topics</h4>
         <div className="flex flex-wrap gap-2">
            {['Programming', 'Data Science', 'Machine Learning', 'React.js', 'System Design', 'Algorithms', 'JavaScript'].map((topic) => (
              <span key={topic} className="px-3 py-1 bg-white dark:bg-zinc-800 text-black dark:text-white text-[10px] font-black uppercase tracking-tighter border-[2px] border-black dark:border-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] cursor-pointer transition-all">
                 {topic}
              </span>
            ))}
         </div>
      </div>

    </aside>
  );
};

export default MediumRightbar;
