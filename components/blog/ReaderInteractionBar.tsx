'use client';
import { useState, useTransition } from 'react';
import { ThumbsUp, MessageSquare, Bookmark, Share } from 'lucide-react';
import { toggleLike, toggleBookmark } from '@/app/actions/blog';

export default function ReaderInteractionBar({ blog }: { blog: any }) {
   const [liked, setLiked] = useState(blog.isLikedByMe || false);
   const [likesCount, setLikesCount] = useState(blog.likesCount || 0);
   const [bookmarked, setBookmarked] = useState(blog.isBookmarkedByMe || false);
   const [isPending, startTransition] = useTransition();

   const handleLike = () => {
      setLiked(!liked);
      setLikesCount(liked ? likesCount - 1 : likesCount + 1);
      startTransition(async () => {
          try {
             const res = await toggleLike(blog._id.toString());
             setLiked(res.isLiked);
             setLikesCount(res.likesCount);
          } catch(e) {
             setLiked(liked);
             setLikesCount(likesCount);
          }
      });
   };

   const handleBookmark = () => {
      setBookmarked(!bookmarked);
      startTransition(async () => {
          try {
             const res = await toggleBookmark(blog._id.toString());
             setBookmarked(res.isBookmarked);
          } catch(e) {
             setBookmarked(bookmarked);
          }
      });
   };

   const handleShare = () => {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
   };

   return (
       <div className="flex items-center justify-between py-3 border-y border-gray-100 my-8 text-gray-500">
          <div className="flex items-center gap-6">
             <button 
                onClick={handleLike} 
                className={`flex items-center gap-2 transition-colors ${liked ? 'text-blue-600' : 'hover:text-gray-900'}`}
             >
                <ThumbsUp size={22} className={liked ? 'fill-current' : ''} strokeWidth={liked ? 2 : 1.5} />
                <span className="text-[15px] font-medium">{likesCount}</span>
             </button>
             <button 
                onClick={() => document.getElementById('comments')?.scrollIntoView({ behavior: 'smooth', block: 'start' })} 
                className="flex items-center gap-2 hover:text-gray-900 transition-colors"
             >
                <MessageSquare size={22} strokeWidth={1.5} />
                <span className="text-[15px] font-medium">Respond</span>
             </button>
          </div>
          <div className="flex items-center gap-6">
             <button 
                onClick={handleBookmark} 
                className={`transition-colors ${bookmarked ? 'text-blue-600' : 'hover:text-gray-900'}`}
             >
                <Bookmark size={22} className={bookmarked ? 'fill-current' : ''} strokeWidth={bookmarked ? 2 : 1.5} />
             </button>
             <button onClick={handleShare} className="hover:text-gray-900 transition-colors">
                <Share size={22} strokeWidth={1.5} />
             </button>
          </div>
       </div>
   );
}
