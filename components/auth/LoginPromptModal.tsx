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
              className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-[2rem] shadow-2xl border border-gray-100 dark:border-white/10 overflow-hidden pointer-events-auto transition-colors"
            >
              <div className="p-8 text-center space-y-6">
                <div className="relative inline-flex mb-2">
                   <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400">
                      {action === 'like' ? <Heart size={28} fill="currentColor" /> : 
                       action === 'comment' ? <MessageSquare size={28} fill="currentColor" /> :
                       <Bookmark size={28} fill="currentColor" />}
                   </div>
                   <button 
                     onClick={onClose}
                     className="absolute -top-2 -right-2 bg-white dark:bg-slate-800 border border-gray-100 dark:border-white/10 p-1.5 rounded-full text-gray-400 hover:text-gray-900 dark:hover:text-white shadow-sm transition-colors"
                   >
                     <X size={14} />
                   </button>
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Join B(logN)</h3>
                  <p className="text-[15px] text-gray-500 dark:text-gray-400 leading-relaxed">
                    Log in to {action} this story, follow your classmates, and build your own academic library.
                  </p>
                </div>

                <div className="pt-2 space-y-3">
                   <Button 
                     onClick={() => router.push('/login')}
                     className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl h-12 flex items-center justify-center gap-2 hover:scale-[1.02] shadow-lg transition-all"
                   >
                     <LogIn size={18} />
                     Sign in to continue
                   </Button>
                   <button 
                     onClick={onClose}
                     className="text-sm font-bold text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
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
