'use client';

import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

const LoginPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/');
    }
  }, [status, router]);

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-slate-950 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden selection:bg-blue-100 selection:text-slate-900 transition-colors">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-900/20 dark:bg-blue-100/50 rounded-full blur-3xl pointer-events-none mix-blend-soft-light dark:mix-blend-multiply transition-colors" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-900/20 dark:bg-indigo-100/50 rounded-full blur-3xl pointer-events-none mix-blend-soft-light dark:mix-blend-multiply transition-colors" />

      {/* Main Login Card */}
      <div className="max-w-[420px] w-full bg-slate-900 dark:bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/10 dark:border-slate-100 p-10 relative z-10 flex flex-col items-center transition-colors">
         
         <Link href="/" className="mb-8 block">
            <h1 className="text-4xl text-white dark:text-slate-900 font-bold font-serif tracking-tight text-center hover:opacity-80 transition-all">
              BlogN
            </h1>
         </Link>

         <div className="text-center space-y-2 mb-10 w-full transition-colors">
            <h2 className="text-xl font-semibold text-white dark:text-slate-900 tracking-tight">Welcome back</h2>
            <p className="text-[15px] text-gray-400 dark:text-slate-500 font-medium">Log in to your account to continue</p>
         </div>
          
         <button 
            onClick={() => signIn('google')} 
            className="w-full flex items-center justify-center gap-3 bg-slate-800 dark:bg-white border border-white/20 dark:border-slate-300 text-white dark:text-slate-700 hover:bg-slate-700 dark:hover:bg-slate-50 hover:border-white/40 dark:hover:border-slate-400 hover:shadow-sm rounded-xl h-12 text-[15px] font-bold transition-all"
         >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
         </button>

         <div className="mt-8 border-t border-white/10 dark:border-slate-100 pt-6 text-center w-full transition-colors">
            <p className="text-[13px] text-gray-500 dark:text-slate-400">
               By continuing, you agree to the <br/> Terms of Service and Privacy Policy.
            </p>
         </div>
      </div>
    </div>
  );
};

export default LoginPage;
