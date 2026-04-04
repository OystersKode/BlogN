'use client';

import { useState, useTransition } from 'react';
import { toggleFollow } from '@/app/actions/profile';
import { Button } from '@/components/ui/button';

export default function FollowButton({ targetUserId, initialFollowing }: { targetUserId: string, initialFollowing: boolean }) {
   const [isPending, startTransition] = useTransition();
   const [following, setFollowing] = useState(initialFollowing);

   const handleFollow = () => {
      setFollowing(!following);
      startTransition(async () => {
         try {
            const res = await toggleFollow(targetUserId);
            setFollowing(res.isFollowing);
         } catch {
            setFollowing(following); // revert on error
         }
      });
   };

   return (
      <Button 
         onClick={handleFollow} 
         disabled={isPending}
         className={`rounded-none px-10 py-6 font-black uppercase tracking-widest border-[3px] border-black shadow-neo active:shadow-none active:translate-x-1 active:translate-y-1 transition-all h-auto text-xs ${following ? 'bg-white text-black hover:bg-zinc-100' : 'bg-primary text-black hover:bg-primary/90'}`}
      >
         {following ? 'Following ✓' : 'Follow Writer'}
      </Button>
   );
}
