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
    <nav className="border-b border-gray-100 dark:border-white/10 bg-white dark:bg-slate-950 sticky top-0 z-50 h-[64px] flex items-center transition-colors">
      <div className="w-full max-w-[1336px] mx-auto px-4 sm:px-6">
        <div className="flex justify-between h-full items-center">
          
          {/* Left side: Logo & Search */}
          <div className="flex items-center gap-6">
            <Link href="/" className="group flex items-center text-[26px] tracking-tighter font-serif transition-all hover:scale-[1.02]">
              <span className="font-black text-gray-900 dark:text-white transition-colors">B</span>
              <span className="font-medium bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent italic px-0.5">
                (logN)
              </span>
            </Link>
            
            <form onSubmit={handleSearch} className="hidden sm:flex items-center bg-gray-50 dark:bg-slate-900 rounded-full px-4 py-2 border border-gray-100 dark:border-white/10 focus-within:border-gray-200 dark:focus-within:border-white/20 transition-colors w-64">
               <Search size={18} className="text-gray-400 dark:text-gray-500 mr-2 transition-colors" />
               <input 
                 value={query}
                 onChange={e => setQuery(e.target.value)}
                 type="text" 
                 placeholder="Search" 
                 className="bg-transparent text-sm w-full outline-none text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500"
               />
            </form>
          </div>

          {/* Right side: Actions & Profile */}
          <div className="flex items-center gap-4 sm:gap-6">
            <ThemeToggle />
            
            {session ? (
              <>
                <Link href="/editor" className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                  <Edit size={22} strokeWidth={1.5} />
                  <span className="hidden sm:inline text-[15px] font-medium border-r border-gray-100 dark:border-white/10 pr-4 mr-2">Write</span>
                </Link>
                
                <NotificationsDropdown />

                <div className="relative hidden sm:block">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 rounded-full"
                  >
                    <Image
                      className="h-8 w-8 rounded-full border border-gray-200 object-cover"
                      src={session.user?.image || '/default-avatar.png'}
                      alt="User profile"
                      width={32}
                      height={32}
                    />
                  </button>
                  
                  {isProfileOpen && (
                    <div className="origin-top-right absolute right-0 mt-3 w-56 rounded-xl shadow-lg py-2 bg-white dark:bg-slate-900 ring-1 ring-black ring-opacity-5 dark:ring-white/10 focus:outline-none">
                      <Link href="/profile" className="flex items-center px-4 py-2.5 text-[15px] text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors border-b border-gray-50 dark:border-white/5">
                        <User className="mr-3 h-5 w-5 text-gray-400 dark:text-gray-500" /> My Profile
                      </Link>
                      
                      <Link href="/dashboard" className="flex items-center px-4 py-2.5 text-[15px] text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                        <LayoutDashboard className="mr-3 h-5 w-5 text-gray-400 dark:text-gray-500" /> Analytics
                      </Link>

                      {(session.user as any)?.role === 'ADMIN' && (
                        <Link href="/admin" className="flex items-center px-4 py-2.5 text-[15px] text-purple-600 dark:text-purple-400 font-bold hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors border-t border-gray-50 dark:border-white/5 mt-1">
                          <Shield className="mr-3 h-5 w-5" /> Admin Console
                        </Link>
                      )}
                      
                      <button
                        onClick={() => signOut()}
                        className="flex w-full items-center px-4 py-2.5 text-[15px] text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 transition-colors border-t border-gray-50 dark:border-white/5 mt-1"
                      >
                        <LogOut className="mr-3 h-5 w-5 text-red-400 dark:text-red-500" /> Sign out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <Button onClick={() => signIn('google')} className="hidden sm:block bg-gray-900 text-white hover:bg-black rounded-full px-6 transition-all font-bold text-[14px]">
                Sign In
              </Button>
            )}
            
            {/* Global menu button */}
            <div className="flex">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white focus:outline-none transition-colors"
              >
                {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
              </button>
            </div>
          </div>
          
        </div>
      </div>
      
      {/* Global sliding sidebar drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
           {/* Backdrop */}
           <div 
             className="absolute inset-0 bg-gray-900/40 dark:bg-black/60 backdrop-blur-[2px] transition-opacity" 
             onClick={() => setIsMobileMenuOpen(false)}
           />
           
           {/* Slider */}
           <div className="relative w-[280px] sm:w-[320px] bg-white dark:bg-slate-950 h-full shadow-2xl flex flex-col px-8 py-8 animate-in slide-in-from-left duration-300 z-[60] overflow-y-auto">
              <div className="flex justify-between items-center mb-10 pb-6 border-b border-gray-100 dark:border-white/10">
                 <Link href="/" className="flex items-center text-2xl tracking-tighter font-serif transition-all hover:scale-[1.02]" onClick={() => setIsMobileMenuOpen(false)}>
                   <span className="flex items-center font-serif text-2xl mb-2 transition-colors">
                  <span className="font-black text-gray-900 dark:text-white transition-colors">B</span>
                  <span className="font-medium bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent italic px-0.5">
                    (logN)
                  </span>
               </span>
                 </Link>
                 <button onClick={() => setIsMobileMenuOpen(false)} className="bg-gray-50 dark:bg-slate-900 hover:bg-gray-100 dark:hover:bg-slate-800 p-2 rounded-full transition-colors"><X size={20} className="text-gray-500 dark:text-gray-400"/></button>
              </div>

              {session && (
                 <div className="flex items-center gap-3 mb-8 pb-8 border-b border-gray-100 dark:border-white/10">
                    <Image
                      className="h-12 w-12 rounded-full border border-gray-200 dark:border-slate-800 object-cover"
                      src={session.user?.image || '/default-avatar.png'}
                      alt="User profile"
                      width={48}
                      height={48}
                    />
                    <div>
                       <p className="font-bold text-gray-900 dark:text-white text-sm">{session.user?.name}</p>
                       <p className="text-xs text-gray-500 dark:text-gray-400">{session.user?.email}</p>
                    </div>
                 </div>
              )}
              
              <div onClick={() => setIsMobileMenuOpen(false)}>
                 <MediumSidebar isOverlay={true} />
              </div>

              {!session && (
                 <div className="mt-8 pt-8 border-t border-gray-100">
                    <Button onClick={() => signIn('google')} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl py-6 tracking-wide shadow-md">
                       Get Started
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
