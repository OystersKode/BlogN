'use client';

import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Search, Edit, Bell, LayoutDashboard, User, Shield, Menu, X, LogOut } from 'lucide-react';

const Navbar = () => {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="border-b border-gray-100 bg-white sticky top-0 z-50 h-[64px] flex items-center">
      <div className="w-full max-w-[1336px] mx-auto px-4 sm:px-6">
        <div className="flex justify-between h-full items-center">
          
          {/* Left side: Logo & Search */}
          <div className="flex items-center gap-6">
            <Link href="/" className="text-[26px] font-black text-gray-900 tracking-tighter font-serif">
              BlogN
            </Link>
            
            <div className="hidden sm:flex items-center bg-gray-50 rounded-full px-4 py-2 border border-gray-100 focus-within:border-gray-200 transition-colors w-64">
               <Search size={18} className="text-gray-400 mr-2" />
               <input 
                 type="text" 
                 placeholder="Search" 
                 className="bg-transparent text-sm w-full outline-none text-gray-800 placeholder-gray-400"
               />
            </div>
          </div>

          {/* Right side: Actions & Profile */}
          <div className="flex items-center gap-6">
            {session ? (
              <>
                <Link href="/editor" className="hidden sm:flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors">
                  <Edit size={22} strokeWidth={1.5} />
                  <span className="text-[15px] font-medium">Write</span>
                </Link>
                
                <button className="text-gray-400 hover:text-gray-900 transition-colors hidden sm:block">
                   <Bell size={24} strokeWidth={1.5} />
                </button>

                <div className="relative">
                  <button
                    onClick={() => setIsOpen(!isOpen)}
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
                  
                  {isOpen && (
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
              <Button onClick={() => signIn('google')} className="bg-gray-900 text-white hover:bg-black rounded-full px-6 transition-all font-bold text-[14px]">
                Sign In
              </Button>
            )}
            
            {/* Mobile menu button */}
            <div className="flex sm:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-500 hover:text-gray-900 focus:outline-none"
              >
                {isOpen ? <X size={26} /> : <Menu size={26} />}
              </button>
            </div>
          </div>
          
        </div>
      </div>
      
      {/* Mobile dropdown */}
      {isOpen && !session && (
        <div className="absolute top-[64px] left-0 w-full bg-white border-b border-gray-100 sm:hidden px-4 py-4 space-y-4 shadow-lg">
           <Button onClick={() => signIn('google')} className="w-full bg-gray-900 text-white rounded-full">Sign In</Button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
