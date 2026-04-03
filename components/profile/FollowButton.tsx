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
         className={`rounded-full px-6 font-medium tracking-wide ${following ? 'bg-white text-gray-900 border border-gray-300 hover:bg-gray-50' : 'bg-green-600 text-white hover:bg-green-700 border-none'}`}
      >
         {following ? 'Following' : 'Follow'}
      </Button>
   );
}
