'use client';

import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Search, Edit, LayoutDashboard, User, Shield, Menu, X, LogOut } from 'lucide-react';
import MediumSidebar from './MediumSidebar';
import NotificationsDropdown from './NotificationsDropdown';

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
    <nav className="border-b border-gray-100 bg-white sticky top-0 z-50 h-[64px] flex items-center">
      <div className="w-full max-w-[1336px] mx-auto px-4 sm:px-6">
        <div className="flex justify-between h-full items-center">
          
          {/* Left side: Logo & Search */}
          <div className="flex items-center gap-6">
            <Link href="/" className="text-[26px] font-black text-gray-900 tracking-tighter font-serif">
              BlogN
            </Link>
            
            <form onSubmit={handleSearch} className="hidden sm:flex items-center bg-gray-50 rounded-full px-4 py-2 border border-gray-100 focus-within:border-gray-200 transition-colors w-64">
               <Search size={18} className="text-gray-400 mr-2" />
               <input 
                 value={query}
                 onChange={e => setQuery(e.target.value)}
                 type="text" 
                 placeholder="Search" 
                 className="bg-transparent text-sm w-full outline-none text-gray-800 placeholder-gray-400"
               />
            </form>
          </div>

          {/* Right side: Actions & Profile */}
          <div className="flex items-center gap-6">
            {session ? (
              <>
                <Link href="/editor" className="hidden sm:flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors">
                  <Edit size={22} strokeWidth={1.5} />
                  <span className="text-[15px] font-medium border-r border-gray-100 pr-4 mr-2">Write</span>
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
                    <div className="origin-top-right absolute right-0 mt-3 w-56 rounded-xl shadow-lg py-2 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <Link href="/profile" className="flex items-center px-4 py-2.5 text-[15px] text-gray-700 hover:bg-gray-50 transition-colors border-b border-gray-50">
                        <User className="mr-3 h-5 w-5 text-gray-400" /> My Profile
                      </Link>
                      
                      <Link href="/dashboard" className="flex items-center px-4 py-2.5 text-[15px] text-gray-700 hover:bg-gray-50 transition-colors">
                        <LayoutDashboard className="mr-3 h-5 w-5 text-gray-400" /> Analytics
                      </Link>

                      {(session.user as any)?.role === 'ADMIN' && (
                        <Link href="/admin" className="flex items-center px-4 py-2.5 text-[15px] text-purple-700 font-medium hover:bg-purple-50 transition-colors">
                          <Shield className="mr-3 h-5 w-5" /> Admin Console
                        </Link>
                      )}
                      
                      <button
                        onClick={() => signOut()}
                        className="flex w-full items-center px-4 py-2.5 text-[15px] text-red-600 hover:bg-red-50 transition-colors border-t border-gray-50 mt-1"
                      >
                        <LogOut className="mr-3 h-5 w-5 text-red-400" /> Sign out
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
                className="text-gray-500 hover:text-gray-900 focus:outline-none"
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
             className="absolute inset-0 bg-gray-900/40 backdrop-blur-[2px] transition-opacity" 
             onClick={() => setIsMobileMenuOpen(false)}
           />
           
           {/* Slider */}
           <div className="relative w-[280px] sm:w-[320px] bg-white h-full shadow-2xl flex flex-col px-8 py-8 animate-in slide-in-from-left duration-300 z-[60] overflow-y-auto">
              <div className="flex justify-between items-center mb-10 pb-6 border-b border-gray-100">
                 <Link href="/" className="text-2xl font-black text-gray-900 font-serif tracking-tighter" onClick={() => setIsMobileMenuOpen(false)}>BlogN</Link>
                 <button onClick={() => setIsMobileMenuOpen(false)} className="bg-gray-50 hover:bg-gray-100 p-2 rounded-full transition-colors"><X size={20} className="text-gray-500"/></button>
              </div>

              {session && (
                 <div className="flex items-center gap-3 mb-8 pb-8 border-b border-gray-100">
                    <Image
                      className="h-12 w-12 rounded-full border border-gray-200 object-cover"
                      src={session.user?.image || '/default-avatar.png'}
                      alt="User profile"
                      width={48}
                      height={48}
                    />
                    <div>
                       <p className="font-bold text-gray-900 text-sm">{session.user?.name}</p>
                       <p className="text-xs text-gray-500">{session.user?.email}</p>
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
