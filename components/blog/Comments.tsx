'use client';

import { useState } from 'react';
import { addComment } from '@/app/actions/comment';
import Image from 'next/image';
import { format } from 'date-fns';
import { useSession } from 'next-auth/react';
import LoginPromptModal from '@/components/auth/LoginPromptModal';
import { MessageSquare, Send, User } from 'lucide-react';

export default function Comments({ blogId, slug, initialComments }: { blogId: string, slug: string, initialComments: any[] }) {
   const { data: session } = useSession();
   const [comments, setComments] = useState(initialComments);
   const [content, setContent] = useState('');
   const [loading, setLoading] = useState(false);
   const [showLoginPrompt, setShowLoginPrompt] = useState(false);

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!session) {
         setShowLoginPrompt(true);
         return;
      }
      if (!content.trim()) return;
      setLoading(true);
      try {
         await addComment(blogId, content, slug);
         setContent('');
         window.location.reload(); 
      } catch (err) {
         console.error(err);
      } finally {
         setLoading(false);
      }
   }

   return (
      <div id="comments" className="mt-24 pt-16 border-t-[5px] border-black dark:border-white transition-all">
         <LoginPromptModal isOpen={showLoginPrompt} onClose={() => setShowLoginPrompt(false)} action="comment" />
         
         <div className="flex items-center gap-4 mb-12 bg-black text-white px-6 py-3 w-fit border-[3px] border-black shadow-neo-sm -rotate-1">
            <MessageSquare size={24} strokeWidth={3} className="text-white" />
            <h3 className="text-xl font-black uppercase tracking-widest leading-none">Responses ({comments.length})</h3>
         </div>
         
         <form onSubmit={handleSubmit} className="mb-20 space-y-6">
            <div className="relative bg-white dark:bg-zinc-800 border-[4px] border-black dark:border-white shadow-neo group focus-within:shadow-none focus-within:translate-x-1 focus-within:translate-y-1 transition-all">
               <textarea
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  onFocus={() => {
                     if (!session) setShowLoginPrompt(true);
                  }}
                  placeholder="ADD TO THE ANALYTICAL STREAM..."
                  className="w-full bg-transparent text-black dark:text-white p-8 min-h-[160px] outline-none resize-none font-black text-xl uppercase tracking-tight leading-tight placeholder-zinc-300 dark:placeholder-zinc-600 transition-all"
               />
            </div>
            <div className="flex justify-end">
               <button 
                  type="submit" 
                  disabled={loading || !content.trim()} 
                  className="bg-secondary text-black border-[4px] border-black shadow-neo px-12 h-16 text-lg font-black uppercase tracking-widest hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all disabled:opacity-50 flex items-center gap-3 active:scale-95"
               >
                  {loading ? 'UPLOADING...' : (
                     <>
                        <Send size={20} strokeWidth={3} />
                        RESPOND
                     </>
                  )}
               </button>
            </div>
         </form>

         <div className="space-y-10">
            {comments.map((c, i) => (
               <div key={i} className="bg-white dark:bg-zinc-900 border-[3px] border-black dark:border-white p-6 sm:p-8 shadow-neo group hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
                  <div className="flex items-center gap-4 mb-6 pb-4 border-b-[2px] border-black/10 dark:border-white/10">
                     <div className="relative w-12 h-12 border-[2px] border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
                        {c.author?.image ? (
                           <Image src={c.author.image} fill className="object-cover grayscale" alt={c.author.name} />
                        ) : (
                           <div className="w-full h-full bg-primary flex items-center justify-center">
                              <User size={24} strokeWidth={3} className="text-black" />
                           </div>
                        )}
                     </div>
                     <div className="min-w-0">
                        <p className="text-sm font-black text-black dark:text-white uppercase tracking-tight truncate">{c.author?.name}</p>
                        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{format(new Date(c.createdAt), 'MMM dd, yyyy')}</p>
                     </div>
                  </div>
                  <p className="text-black dark:text-zinc-200 font-bold leading-tight text-lg whitespace-pre-wrap uppercase tracking-tight">{c.content}</p>
               </div>
            ))}
            
            {comments.length === 0 && (
               <div className="text-start py-16 px-10 border-[4px] border-black border-dashed bg-zinc-50 dark:bg-zinc-800/20">
                  <p className="text-zinc-400 font-black uppercase tracking-[0.2em] italic">No technical responses documented for this node.</p>
               </div>
            )}
         </div>
      </div>
   );
}
