'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, LogIn, Heart, MessageSquare, Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface LoginPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  action?: string;
}

const LoginPromptModal = ({ isOpen, onClose, action = "interact" }: LoginPromptModalProps) => {
  const router = useRouter();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-[2px] z-[100] transition-colors"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 flex items-center justify-center z-[101] p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white dark:bg-zinc-900 w-full max-w-sm border-[4px] border-black dark:border-white shadow-neo-xl overflow-hidden pointer-events-auto transition-all"
            >
              <div className="p-10 text-center space-y-8">
                <div className="relative inline-flex mb-2">
                   <div className="w-20 h-20 bg-primary border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center text-black">
                      {action === 'like' ? <Heart size={32} strokeWidth={3} fill="currentColor" /> : 
                       action === 'comment' ? <MessageSquare size={32} strokeWidth={3} fill="currentColor" /> :
                       <Bookmark size={32} strokeWidth={3} fill="currentColor" />}
                   </div>
                   <button 
                     onClick={onClose}
                     className="absolute -top-4 -right-4 bg-white dark:bg-zinc-800 border-[3px] border-black dark:border-white p-2 text-black dark:text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
                   >
                     <X size={16} strokeWidth={3} />
                   </button>
                </div>

                <div className="space-y-4">
                   <h3 className="text-3xl font-black text-black dark:text-white uppercase tracking-tighter leading-none">Join B(logN)</h3>
                   <p className="text-sm font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-tight leading-tight">
                     Log in to {action} this story, follow your classmates, and build your own academic library.
                   </p>
                </div>

                <div className="pt-4 space-y-4">
                   <Button 
                     onClick={() => router.push('/login')}
                     className="w-full bg-black dark:bg-white text-white dark:text-black font-black uppercase tracking-widest h-14 border-[3px] border-black dark:border-white shadow-neo-sm hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
                   >
                     <LogIn size={20} className="mr-2" strokeWidth={3} />
                     Sign in
                   </Button>
                   <button 
                     onClick={onClose}
                     className="text-xs font-black uppercase tracking-widest text-zinc-400 hover:text-black dark:hover:text-white transition-all underline decoration-2 underline-offset-4"
                   >
                     Maybe later
                   </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default LoginPromptModal;
