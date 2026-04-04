'use client';

import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { Bookmark, MoreHorizontal, ThumbsUp, MessageSquare } from 'lucide-react';
import { useState, useTransition } from 'react';
import { toggleBookmark, toggleLike } from '@/app/actions/blog';

import { useSession } from 'next-auth/react';
import LoginPromptModal from '@/components/auth/LoginPromptModal';

const HorizontalBlogCard = ({ blog }: { blog: any }) => {
  const { data: session } = useSession();
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [promptAction, setPromptAction] = useState('interact');

  // Extract a brief text snippet from TipTap JSON structure if possible
  const getExcerpt = (contentObj: any) => {
    try {
      if (!contentObj || !contentObj.content) return 'Read more about this topic...';
      const paragraphs = contentObj.content.filter((n: any) => n.type === 'paragraph' && n.content);
      if (paragraphs.length > 0) {
         let text = '';
         paragraphs[0].content.forEach((chunk: any) => { text += chunk.text || '' });
         return text.length > 150 ? text.substring(0, 150) + '...' : text;
      }
      return 'Read more about this topic...';
    } catch {
      return 'Read more about this topic...';
    }
  };

  const excerpt = getExcerpt(blog.content);

  const [isPending, startTransition] = useTransition();
  const [bookmarked, setBookmarked] = useState(blog.isBookmarkedByMe || false);
  const [liked, setLiked] = useState(blog.isLikedByMe || false);
  const [likesCount, setLikesCount] = useState(blog.likesCount || 0);

  const handleBookmark = () => {
     if (!session) {
        setPromptAction('bookmark');
        setShowLoginPrompt(true);
        return;
     }

     setBookmarked(!bookmarked);
     startTransition(async () => {
        try {
           await toggleBookmark(blog._id);
        } catch {
           setBookmarked(bookmarked);
        }
     });
  };

  const handleLike = () => {
     if (!session) {
        setPromptAction('like');
        setShowLoginPrompt(true);
        return;
     }

     setLiked(!liked);
     setLikesCount(liked ? likesCount - 1 : likesCount + 1);
     startTransition(async () => {
        try {
           const res = await toggleLike(blog._id);
           setLikesCount(res.likesCount);
           setLiked(res.isLiked);
        } catch {
           setLiked(liked);
           setLikesCount(likesCount);
        }
     });
  };

  return (
    <article className="border-[3px] border-black dark:border-white bg-white dark:bg-zinc-900 p-6 mb-8 shadow-neo group transition-all hover:-translate-y-1 hover:translate-x-1 hover:shadow-none">
      <div className="flex flex-col md:flex-row gap-6 items-start justify-between">
        
        <LoginPromptModal 
           isOpen={showLoginPrompt} 
           onClose={() => setShowLoginPrompt(false)} 
           action={promptAction}
        />

        {/* Left Side: Content */}
        <div className="flex-1 min-w-0 order-2 md:order-1">
          <div className="flex items-center gap-2 mb-4">
             <Link href={`/user/${blog.author?._id}`} className="flex items-center gap-2 bg-primary px-2 py-1 border-[2px] border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <Image 
                   src={blog.author?.image || '/default-avatar.png'} 
                   alt={blog.author?.name || 'Author'} 
                   width={18} 
                   height={18} 
                   className="grayscale contrast-125"
                />
                <span className="text-[11px] font-black uppercase text-black">{blog.author?.name}</span>
             </Link>
             <span className="text-black dark:text-white text-[11px] font-black px-2 py-1 border-[2px] border-black dark:border-white uppercase tracking-tighter">TY CSE</span>
          </div>

          <Link href={`/blog/${blog.slug}`} className="block group">
             <h2 className="text-2xl sm:text-3xl font-black text-black dark:text-white uppercase leading-[0.9] mb-4 hover:bg-primary transition-colors">
                {blog.title}
             </h2>
             <p className="text-sm font-bold text-zinc-600 dark:text-zinc-400 leading-snug line-clamp-3 mb-6">
                {excerpt}
             </p>
          </Link>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-auto gap-6 sm:gap-4">
             <div className="flex flex-wrap items-center gap-3 text-[10px] sm:text-[11px] font-black uppercase text-zinc-500">
                <span className="bg-zinc-100 dark:bg-zinc-800 px-2 py-1 border-[2px] border-black dark:border-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]">{format(new Date(blog.createdAt), 'MMM d, yyyy')}</span>
                <span className="bg-zinc-100 dark:bg-zinc-800 px-2 py-1 border-[2px] border-black dark:border-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]">{blog.readingTime}</span>
             </div>
             
             <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                <div className="flex items-center gap-3">
                   <button 
                      onClick={handleLike} 
                      className={`p-2 border-[3px] border-black dark:border-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all flex items-center gap-2 ${liked ? 'bg-secondary text-black' : 'bg-white text-black'}`}
                   >
                      <ThumbsUp size={18} strokeWidth={3} className={liked ? 'fill-current' : ''} />
                      <span className="font-black text-xs sm:text-sm">{likesCount}</span>
                   </button>
                   
                   <Link 
                      href={session ? `/blog/${blog.slug}#comments` : '#'} 
                      className="p-2 bg-white text-black border-[3px] border-black dark:border-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all flex items-center gap-2"
                   >
                      <MessageSquare size={18} strokeWidth={3} />
                      <span className="font-black text-xs sm:text-sm">{blog.commentsCount !== undefined ? blog.commentsCount : '--'}</span>
                   </Link>
                </div>

                <button 
                  onClick={handleBookmark} 
                  className={`p-2 border-[3px] border-black dark:border-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all ${bookmarked ? 'bg-primary text-black' : 'bg-white text-black'}`}
                >
                   <Bookmark size={18} strokeWidth={3} className={bookmarked ? 'fill-current' : ''} />
                </button>
             </div>
          </div>
        </div>

        {/* Right Side: Image */}
        {blog.coverImage && (
           <Link href={`/blog/${blog.slug}`} className="block flex-shrink-0 order-1 md:order-2 w-full md:w-auto">
             <div className="relative w-full h-[220px] sm:h-[260px] md:w-[240px] md:h-[180px] bg-black border-[4px] border-black dark:border-white shadow-neo overflow-hidden">
                <Image 
                   src={blog.coverImage} 
                   alt={blog.title} 
                   fill
                   sizes="(max-width: 768px) 100vw, 240px"
                   className="object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
                />
             </div>
           </Link>
        )}
      </div>
    </article>
  );
};

export default HorizontalBlogCard;
