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
    <aside className="w-80 flex-shrink-0 hidden xl:block sticky top-[80px] h-[calc(100vh-80px)] overflow-y-auto pl-8 py-8 border-l border-gray-100 dark:border-white/10 transition-colors">
      
      {/* Staff Picks */}
      <div className="mb-10">
         <h4 className="font-bold text-[15px] text-gray-900 dark:text-white mb-6 transition-colors">Staff Picks</h4>
                  <div className="space-y-6">
            {staffPicks.length > 0 ? (
               staffPicks.map((pick: any) => (
                  <Link href={`/blog/${pick.slug}`} key={pick._id} className="block space-y-2 group">
                     <div className="flex items-center gap-2">
                        <Image src={pick.author?.image || '/default-avatar.png'} width={20} height={20} className="rounded-full" alt={pick.author?.name} />
                        <span className="text-[13px] font-medium text-gray-900 dark:text-gray-200 line-clamp-1 transition-colors">{pick.author?.name}</span>
                     </div>
                     <h5 className="font-bold text-[15px] text-gray-900 dark:text-white leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">{pick.title}</h5>
                     <p className="text-[13px] text-gray-500 dark:text-gray-400 transition-colors">{format(new Date(pick.createdAt), 'MMM d, yyyy')}</p>
                  </Link>
               ))
            ) : (
               <p className="text-sm text-gray-400 dark:text-gray-500 italic">No staff picks yet.</p>
            )}
          </div>
         
         <Link href="/?feed=staff" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-[13px] mt-6 transition-colors font-medium inline-block">See the full list</Link>
      </div>

      {/* Who to follow */}
      {suggestions.length > 0 && (
         <div className="mb-10">
            <h4 className="font-bold text-[15px] text-gray-900 dark:text-white mb-6 transition-colors">Who to follow</h4>
            <div className="space-y-6">
               {suggestions.map((u: any) => (
                  <div key={u._id} className="flex items-start justify-between gap-3">
                     <Link href={`/user/${u._id}`} className="flex items-start gap-3 group min-w-0">
                        <Image src={u.image || '/default-avatar.png'} width={32} height={32} className="rounded-full flex-shrink-0 dark:border-slate-800" alt={u.name} />
                        <div className="min-w-0">
                           <h5 className="font-bold text-[14px] text-gray-900 dark:text-white leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">{u.name}</h5>
                           <p className="text-[12px] text-gray-500 dark:text-gray-400 line-clamp-1 transition-colors">{u.bio || 'TY CSE Student'}</p>
                        </div>
                     </Link>
                     <div className="flex-shrink-0 pt-1 text-[13px]">
                        <FollowButton targetUserId={u._id} initialFollowing={false} />
                     </div>
                  </div>
               ))}
            </div>
         </div>
      )}
      
      {/* Recommended Topics */}
      <div className="mb-10">
         <h4 className="font-bold text-[15px] text-gray-900 dark:text-white mb-6 transition-colors">Recommended topics</h4>
         <div className="flex flex-wrap gap-2">
            {['Programming', 'Data Science', 'Machine Learning', 'React.js', 'System Design', 'Algorithms', 'JavaScript'].map((topic) => (
              <span key={topic} className="px-4 py-2 bg-gray-50 dark:bg-slate-900 hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-800 dark:text-gray-300 text-[13px] font-medium rounded-full cursor-pointer transition-colors">
                 {topic}
              </span>
            ))}
         </div>
      </div>

    </aside>
  );
};

export default MediumRightbar;
