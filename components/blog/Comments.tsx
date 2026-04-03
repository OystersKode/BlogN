'use client';

import { useState } from 'react';
import { addComment } from '@/app/actions/comment';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { format } from 'date-fns';

import { useSession } from 'next-auth/react';
import LoginPromptModal from '@/components/auth/LoginPromptModal';

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
      <div id="comments" className="mt-16 pt-16 border-t border-gray-100 dark:border-white/10 transition-colors">
         <LoginPromptModal isOpen={showLoginPrompt} onClose={() => setShowLoginPrompt(false)} action="comment" />
         
         <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-8 transition-colors">Responses ({comments.length})</h3>
         
         <form onSubmit={handleSubmit} className="mb-12">
            <textarea
               value={content}
               onChange={e => setContent(e.target.value)}
               onFocus={() => {
                  if (!session) {
                     setShowLoginPrompt(true);
                  }
               }}
               placeholder="What are your thoughts?"
               className="w-full bg-transparent text-gray-900 dark:text-white rounded-xl border border-gray-200 dark:border-white/20 p-4 min-h-[120px] outline-none focus:border-gray-900 dark:focus:border-white shadow-sm resize-none mb-4 font-serif text-lg transition-colors placeholder-gray-400 dark:placeholder-gray-600"
            />
            <div className="flex justify-end">
               <Button type="submit" disabled={loading} className="bg-green-600 hover:bg-green-700 text-white rounded-full px-6 transition-colors">
                  {loading ? 'Posting...' : 'Respond'}
               </Button>
            </div>
         </form>

         <div className="space-y-8">
            {comments.map((c, i) => (
               <div key={i} className="pb-6 border-b border-gray-50 dark:border-white/5 transition-colors">
                  <div className="flex items-center gap-3 mb-3">
                     <Image src={c.author?.image || '/default-avatar.png'} width={40} height={40} className="rounded-full" alt={c.author?.name || 'User'} />
                     <div>
                        <p className="text-[15px] font-bold text-gray-900 dark:text-white transition-colors">{c.author?.name}</p>
                        <p className="text-[13px] text-gray-500 dark:text-gray-400 transition-colors">{format(new Date(c.createdAt), 'MMM d, yyyy')}</p>
                     </div>
                  </div>
                  <p className="text-gray-800 dark:text-gray-300 font-serif leading-relaxed text-lg whitespace-pre-wrap transition-colors">{c.content}</p>
               </div>
            ))}
            
            {comments.length === 0 && (
               <p className="text-center text-gray-400 italic py-8">Be the first to share your thoughts.</p>
            )}
         </div>
      </div>
   );
}
