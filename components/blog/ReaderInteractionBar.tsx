'use client';

import { useState } from 'react';
import { ThumbsUp, Bookmark, Share2 } from 'lucide-react';
import { toggleLike, toggleBookmark } from '@/app/actions/blog';
import { useSession } from 'next-auth/react';
import LoginPromptModal from '@/components/auth/LoginPromptModal';

export default function ReaderInteractionBar({ blog }: { blog: any }) {
  const { data: session } = useSession();
  const [likes, setLikes] = useState(blog.likes?.length || 0);
  const [isLiked, setIsLiked] = useState(session ? blog.likes?.includes((session.user as any).id) : false);
  const [isBookmarked, setIsBookmarked] = useState(blog.isBookmarked || false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [activeAction, setActiveAction] = useState<string | null>(null);

  const handleLike = async () => {
    if (!session) {
      setActiveAction('like');
      setShowLoginPrompt(true);
      return;
    }
    
    const newLiked = !isLiked;
    setIsLiked(newLiked);
    setLikes((prev: number) => newLiked ? prev + 1 : prev - 1);
    await toggleLike(blog._id.toString());
  };

  const handleBookmark = async () => {
    if (!session) {
      setActiveAction('bookmark');
      setShowLoginPrompt(true);
      return;
    }

    const newBookmarked = !isBookmarked;
    setIsBookmarked(newBookmarked);
    await toggleBookmark(blog._id.toString());
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Packet URL copied to clipboard.");
  };

  const ActionButton = ({ onClick, isActive, icon: Icon, label, count, color }: { onClick: () => void, isActive?: boolean, icon: any, label: string, count?: number, color: string }) => (
    <button 
      onClick={onClick}
      className={`flex items-center gap-3 px-6 py-3 border-[3px] border-black shadow-neo-sm hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all active:scale-95 group ${isActive ? color : 'bg-white dark:bg-zinc-800 text-black dark:text-white'}`}
    >
      <Icon size={20} className={isActive ? 'fill-current' : ''} strokeWidth={3} />
      <span className="text-xs font-black uppercase tracking-widest">
         {label} {count !== undefined && `[${count}]`}
      </span>
    </button>
  );

  return (
    <div className="flex flex-wrap items-center gap-6 py-8 border-y-[4px] border-black dark:border-white transition-all">
      <LoginPromptModal 
        isOpen={showLoginPrompt} 
        onClose={() => setShowLoginPrompt(false)} 
        action={activeAction || 'interact'} 
      />
      
      <ActionButton 
        onClick={handleLike} 
        isActive={isLiked} 
        icon={ThumbsUp} 
        label="Analyze" 
        count={likes} 
        color="bg-primary"
      />

      <ActionButton 
        onClick={handleBookmark} 
        isActive={isBookmarked} 
        icon={Bookmark} 
        label="Archive" 
        color="bg-secondary"
      />

      <ActionButton 
        onClick={handleShare} 
        icon={Share2} 
        label="Broadcast" 
        color="bg-accent"
      />
    </div>
  );
}
