'use client';

import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Search, Edit, LayoutDashboard, User, Shield, Menu, X, LogOut } from 'lucide-react';
import MediumSidebar from './MediumSidebar';
import NotificationsDropdown from './NotificationsDropdown';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

const Navbar = () => {
  const { data: session } = useSession();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
       window.location.href = `/search?q=${encodeURIComponent(query.trim())}`;
    }
  };

  return (
    <nav className="border-b-[4px] border-black dark:border-white bg-primary sticky top-0 z-50 h-[72px] flex items-center transition-all">
      <div className="w-full max-w-[1336px] mx-auto px-4 sm:px-6">
        <div className="flex justify-between h-full items-center">
          
          {/* Left side: Logo & Search */}
          <div className="flex items-center gap-8">
            <Link href="/" className="group flex items-center text-[32px] tracking-tight font-serif transition-transform hover:-translate-y-1">
              <span className="font-black text-black">B</span>
              <span className="font-extrabold text-black italic">(logN)</span>
            </Link>
            
            <form onSubmit={handleSearch} className="hidden lg:flex items-center bg-white dark:bg-zinc-900 px-4 py-2 border-[3px] border-black dark:border-white shadow-neo focus-within:-translate-y-0.5 transition-transform w-80">
               <Search size={20} className="text-black dark:text-white mr-2" strokeWidth={3} />
               <input 
                 value={query}
                 onChange={e => setQuery(e.target.value)}
                 type="text" 
                 placeholder="SEARCH POSTS..." 
                 className="bg-transparent text-sm w-full outline-none text-black dark:text-white placeholder-zinc-500 font-bold uppercase tracking-wider"
               />
            </form>
          </div>

          {/* Right side: Actions & Profile */}
          <div className="flex items-center gap-4">
            <div className="bg-white dark:bg-zinc-900 border-[3px] border-black dark:border-white shadow-neo p-1 flex items-center">
               <ThemeToggle />
            </div>
            
            {session ? (
              <>
                <Link href="/editor" className="hidden sm:flex items-center gap-2 bg-accent text-white px-4 py-2 border-[3px] border-black shadow-neo active:translate-x-[2px] active:translate-y-[2px] active:shadow-none font-bold uppercase text-xs">
                  <Edit size={18} strokeWidth={2.5} />
                  <span>Write</span>
                </Link>
                
                <NotificationsDropdown />

                <div className="relative hidden sm:block">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex focus:outline-none border-[3px] border-black dark:border-white shadow-neo hover:-translate-y-0.5 active:translate-y-0 active:shadow-none transition-all"
                  >
                    <Image
                      className="h-8 w-8 object-cover"
                      src={session.user?.image || '/default-avatar.png'}
                      alt="User profile"
                      width={32}
                      height={32}
                    />
                  </button>
                  
                  {isProfileOpen && (
                    <div className="origin-top-right absolute right-0 mt-4 w-60 rounded-none border-[4px] border-black dark:border-white bg-white dark:bg-zinc-900 shadow-neo-lg py-2 focus:outline-none z-[100]">
                      <Link href="/profile" className="flex items-center px-4 py-3 text-sm font-black uppercase text-black dark:text-white hover:bg-primary transition-colors border-b-[3px] border-black dark:border-white">
                        <User className="mr-3 h-5 w-5" strokeWidth={3} /> My Profile
                      </Link>
                      
                      <Link href="/dashboard" className="flex items-center px-4 py-3 text-sm font-black uppercase text-black dark:text-white hover:bg-secondary transition-colors border-b-[3px] border-black dark:border-white">
                        <LayoutDashboard className="mr-3 h-5 w-5" strokeWidth={3} /> Analytics
                      </Link>

                      {(session.user as any)?.role === 'ADMIN' && (
                        <Link href="/admin" className="flex items-center px-4 py-3 text-sm font-black uppercase text-purple-600 hover:bg-purple-50 transition-colors border-b-[3px] border-black dark:border-white">
                          <Shield className="mr-3 h-5 w-5" strokeWidth={3} /> Admin Console
                        </Link>
                      )}
                      
                      <button
                        onClick={() => signOut()}
                        className="flex w-full items-center px-4 py-3 text-sm font-black uppercase text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="mr-3 h-5 w-5" strokeWidth={3} /> Sign out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <Button onClick={() => signIn('google')} className="hidden sm:block bg-black text-white px-6 font-black uppercase tracking-widest text-xs">
                Sign In
              </Button>
            )}
            
            {/* Global menu button */}
            <button
               onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
               className="bg-white dark:bg-zinc-900 border-[3px] border-black dark:border-white shadow-neo p-2 hover:-translate-y-0.5 active:translate-y-0 active:shadow-none transition-all"
            >
               {isMobileMenuOpen ? <X size={24} strokeWidth={3} /> : <Menu size={24} strokeWidth={3} />}
            </button>
          </div>
          
        </div>
      </div>
      
      {/* Global sliding sidebar drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] flex">
           {/* Backdrop */}
           <div 
             className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" 
             onClick={() => setIsMobileMenuOpen(false)}
           />
           
           {/* Slider */}
           <div className="relative w-[300px] sm:w-[350px] bg-[#F4F4F1] dark:bg-zinc-900 border-r-[5px] border-black dark:border-white h-full shadow-neo-xl flex flex-col px-6 py-8 animate-in slide-in-from-left duration-300 z-[110] overflow-y-auto">
              <div className="flex justify-between items-center mb-10 pb-6 border-b-[4px] border-black dark:border-white">
                 <Link href="/" className="flex items-center text-3xl font-serif" onClick={() => setIsMobileMenuOpen(false)}>
                    <span className="font-black text-black dark:text-white">B</span>
                    <span className="font-extrabold italic text-black dark:text-white">(logN)</span>
                 </Link>
                 <button onClick={() => setIsMobileMenuOpen(false)} className="bg-white dark:bg-zinc-800 border-[3px] border-black dark:border-white p-2 shadow-neo active:shadow-none active:translate-x-1 active:translate-y-1 transition-all"><X size={20} strokeWidth={3} /></button>
              </div>

              {session && (
                 <div className="flex items-center gap-3 mb-8 pb-8 border-b-[4px] border-black dark:border-white">
                    <Image
                      className="h-12 w-12 border-[3px] border-black dark:border-white object-cover shadow-neo"
                      src={session.user?.image || '/default-avatar.png'}
                      alt="User profile"
                      width={48}
                      height={48}
                    />
                    <div>
                       <p className="font-black text-black dark:text-white text-sm uppercase tracking-tight">{session.user?.name}</p>
                       <p className="text-[10px] text-zinc-500 font-bold uppercase">{session.user?.email}</p>
                    </div>
                 </div>
              )}
              
              <div onClick={() => setIsMobileMenuOpen(false)}>
                 <MediumSidebar isOverlay={true} />
              </div>

              {session ? (
                 <div className="mt-8 pt-8 border-t-[4px] border-black dark:border-white space-y-2">
                    <Link
                      href="/profile"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 border-[3px] border-black dark:border-white bg-white dark:bg-zinc-800 shadow-neo hover:bg-primary transition-all text-black dark:text-white font-black uppercase text-xs"
                    >
                      <User className="h-5 w-5" strokeWidth={3} /> My Profile
                    </Link>
                    <Link
                      href="/dashboard"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 border-[3px] border-black dark:border-white bg-white dark:bg-zinc-800 shadow-neo hover:bg-secondary transition-all text-black dark:text-white font-black uppercase text-xs"
                    >
                      <LayoutDashboard className="h-5 w-5" strokeWidth={3} /> Analytics
                    </Link>
                    {(session.user as any)?.role === 'ADMIN' && (
                      <Link
                        href="/admin"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 border-[3px] border-black dark:border-white bg-white dark:bg-zinc-800 shadow-neo hover:bg-purple-500 transition-all text-purple-600 dark:text-purple-400 font-black uppercase text-xs"
                      >
                        <Shield className="h-5 w-5" strokeWidth={3} /> Admin Console
                      </Link>
                    )}
                    <button
                      onClick={() => { signOut(); setIsMobileMenuOpen(false); }}
                      className="flex w-full items-center gap-3 px-4 py-3 border-[3px] border-black dark:border-white bg-white dark:bg-zinc-800 shadow-neo hover:bg-red-500 transition-all text-red-600 dark:text-red-400 font-black uppercase text-xs"
                    >
                      <LogOut className="h-5 w-5" strokeWidth={3} /> Sign Out
                    </button>
                 </div>
              ) : (
                 <div className="mt-8 pt-8 border-t-[4px] border-black dark:border-white">
                    <Button onClick={() => { signIn('google'); setIsMobileMenuOpen(false); }} className="w-full bg-black text-white font-black uppercase tracking-widest py-6 border-[3px] border-black shadow-neo active:shadow-none active:translate-x-1 active:translate-y-1 transition-all">
                       Sign In Now
                    </Button>
                 </div>
              )}
           </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
