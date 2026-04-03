'use client';

import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { Bookmark, MoreHorizontal, ThumbsUp, MessageSquare } from 'lucide-react';
import { useState, useTransition } from 'react';
import { toggleBookmark, toggleLike } from '@/app/actions/blog';

const HorizontalBlogCard = ({ blog }: { blog: any }) => {
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
    <article className="border-b border-gray-100 py-8 group">
      <div className="flex gap-8 items-start justify-between">
        
        {/* Left Side: Content */}
        <div className="flex-1 min-w-0 pr-4">
          <div className="flex items-center gap-2 mb-3">
             <Link href={`/user/${blog.author?._id}`} className="flex items-center gap-2 group">
                <Image 
                   src={blog.author?.image || '/default-avatar.png'} 
                   alt={blog.author?.name || 'Author'} 
                   width={20} 
                   height={20} 
                   className="rounded-full"
                />
                <span className="text-[13px] font-medium text-gray-900 group-hover:text-blue-600 transition-colors">{blog.author?.name}</span>
             </Link>
             <span className="text-gray-400 text-sm hidden sm:inline">in</span>
             <span className="text-[13px] font-bold text-gray-900 hidden sm:inline">TY CSE Insights</span>
          </div>

          <Link href={`/blog/${blog.slug}`} className="block block group-hover:opacity-90">
             <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight leading-tight mb-2 line-clamp-3">
                {blog.title}
             </h2>
             <p className="text-[15px] text-gray-500 leading-snug line-clamp-2 hidden sm:block font-serif">
                {excerpt}
             </p>
          </Link>

          <div className="flex items-center justify-between mt-6">
             <div className="flex items-center gap-4 text-[13px] text-gray-500">
                <span className="text-gray-400">✨</span>
                <span>{format(new Date(blog.createdAt), 'MMM d, yyyy')}</span>
                <span>•</span>
                <span>{blog.readingTime}</span>
             </div>
             
             <div className="flex items-center gap-6 text-gray-400">
                <button 
                   onClick={handleLike} 
                   className={`transition-colors flex items-center gap-1 ${liked ? 'text-blue-600 font-bold' : 'hover:text-gray-900'}`}
                >
                   <ThumbsUp size={18} strokeWidth={liked ? 2 : 1.5} className={liked ? 'fill-current' : ''} />
                   <span className="text-[13px]">{likesCount}</span>
                </button>
                <Link href={`/blog/${blog.slug}#comments`} className="hover:text-gray-900 transition-colors flex items-center gap-1">
                   <MessageSquare size={18} strokeWidth={1.5} />
                   <span className="text-[13px]">--</span>
                </Link>
                <button onClick={handleBookmark} className={`transition-colors ml-2 ${bookmarked ? 'text-blue-600' : 'hover:text-gray-900'}`}>
                   <Bookmark size={20} strokeWidth={bookmarked ? 2 : 1.5} className={bookmarked ? 'fill-current' : ''} />
                </button>
                <button className="hover:text-gray-900 transition-colors">
                   <MoreHorizontal size={20} strokeWidth={1.5} />
                </button>
             </div>
          </div>
        </div>

        {/* Right Side: Image */}
        {blog.coverImage && (
           <Link href={`/blog/${blog.slug}`} className="block flex-shrink-0">
             <div className="relative w-[120px] h-[120px] sm:w-[160px] sm:h-[110px] bg-gray-50 overflow-hidden">
                <Image 
                   src={blog.coverImage} 
                   alt={blog.title} 
                   fill
                   sizes="(max-width: 768px) 120px, 160px"
                   className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
             </div>
           </Link>
        )}
      </div>
    </article>
  );
};

export default HorizontalBlogCard;
