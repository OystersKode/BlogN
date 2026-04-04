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
    <div className="min-h-screen bg-primary flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden transition-colors">
      
      {/* Decorative Background Elements - Neo Style */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-secondary border-b-[5px] border-r-[5px] border-black -translate-x-12 -translate-y-12 rotate-12 z-0 hidden md:block"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-accent border-t-[5px] border-l-[5px] border-black translate-x-16 translate-y-16 -rotate-12 z-0 hidden md:block"></div>

      {/* Main Login Card */}
      <div className="max-w-[480px] w-full bg-white dark:bg-zinc-900 border-[5px] border-black dark:border-white shadow-neo-xl p-8 sm:p-12 relative z-10 flex flex-col items-center transition-all">
         
         <Link href="/" className="mb-12 block group">
             <div className="text-5xl font-serif text-center transition-all flex items-center justify-center gap-1 group-hover:-rotate-2">
                <span className="font-black text-black dark:text-white uppercase">B</span>
                <span className="font-black italic text-black dark:text-white px-1 bg-secondary border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  (logN)
                </span>
             </div>
         </Link>

         <div className="text-center space-y-4 mb-12 w-full transition-colors">
            <h2 className="text-3xl font-black text-black dark:text-white uppercase tracking-tighter leading-none">Access Granted</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-widest">Identify yourself to continue the journey.</p>
         </div>
          
         <button 
            onClick={() => signIn('google')} 
            className="w-full flex items-center justify-center gap-4 bg-white dark:bg-zinc-800 border-[4px] border-black dark:border-white text-black dark:text-white hover:bg-primary hover:translate-x-1 hover:translate-y-1 hover:shadow-none shadow-neo-sm h-16 text-lg font-black uppercase tracking-widest transition-all group"
         >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="group-hover:rotate-12 transition-transform">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="currentColor"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="currentColor"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="currentColor"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="currentColor"/>
            </svg>
            Continue with Google
         </button>

         <div className="mt-12 border-t-[3px] border-black dark:border-white pt-8 text-center w-full transition-colors">
            <p className="text-[11px] text-zinc-500 font-black uppercase tracking-[0.2em] leading-relaxed">
               Authentication implies agreement with our <br/> technical terms and analytical protocols.
            </p>
         </div>
      </div>

      {/* Static Noise Overlay Placeholder */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
    </div>
  );
};

export default LoginPage;
