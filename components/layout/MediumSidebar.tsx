import Link from 'next/link';
import { Home, Library, User, FileText, BarChart2, Users, MessageSquare } from 'lucide-react';

const MediumSidebar = ({ isOverlay = false }: { isOverlay?: boolean }) => {
  return (
    <aside className={`flex-shrink-0 overflow-y-auto pr-8 py-8 border-black dark:border-white transition-all ${isOverlay ? 'w-full block border-none py-0 pr-4' : 'w-64 hidden lg:block sticky top-[90px] h-[calc(100vh-90px)] border-r-[4px]'}`}>
      <nav className="space-y-8 font-black uppercase tracking-tight text-xs">
        <Link href="/" className="flex items-center gap-4 text-black dark:text-white group transition-all hover:translate-x-1">
          <Home size={22} strokeWidth={3} className="text-black dark:text-white" />
          <span>Home</span>
        </Link>
        <Link href="/bookmarks" className="flex items-center gap-4 text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white group transition-all hover:translate-x-1">
          <Library size={22} strokeWidth={3} />
          <span>Bookmarks</span>
        </Link>
        <Link href="/profile" className="flex items-center gap-4 text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white group transition-all hover:translate-x-1">
          <User size={22} strokeWidth={3} />
          <span>Profile</span>
        </Link>
        <Link href="/explore" className="flex items-center gap-4 text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white group transition-all hover:translate-x-1">
          <FileText size={22} strokeWidth={3} />
          <span>Stories</span>
        </Link>
        
        <div className="flex flex-col gap-6 mt-8 pt-8 border-t-[3px] border-black dark:border-white">
          <Link href="/feedback" className="flex items-center gap-4 text-zinc-500 hover:text-black dark:hover:text-white transition-all group">
            <div className="p-2 bg-primary border-[2px] border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] group-hover:shadow-none group-hover:translate-x-0.5 group-hover:translate-y-0.5 transition-all">
              <MessageSquare size={20} strokeWidth={3} className="text-black" />
            </div>
            <span>Feedback</span>
          </Link>
          <Link href="/dashboard" className="flex items-center gap-4 text-zinc-500 hover:text-black dark:hover:text-white transition-all group">
            <div className="p-2 bg-secondary border-[2px] border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] group-hover:shadow-none group-hover:translate-x-0.5 group-hover:translate-y-0.5 transition-all">
              <BarChart2 size={20} strokeWidth={3} className="text-black" />
            </div>
            <span>Stats</span>
          </Link>
        </div>
        
        <div className="pt-8 mt-8 border-t-[3px] border-black dark:border-white">
           <Link href="/following" className="flex items-center gap-4 text-zinc-500 hover:text-black dark:hover:text-white group transition-all">
              <Users size={22} strokeWidth={3} />
              <span>Following</span>
           </Link>
            <div className="mt-10 bg-white dark:bg-zinc-800 p-4 border-[3px] border-black dark:border-white shadow-neo">
               <p className="text-black dark:text-white text-[12px] font-black leading-tight mb-4 lowercase">Find writers and publications to follow.</p>
               <Link href="/explore" className="bg-black text-white px-3 py-2 border-[2px] border-black text-[11px] font-black hover:bg-zinc-800 transition-all block text-center">EXPLORE</Link>
            </div>
        </div>
      </nav>
    </aside>
  );
};

export default MediumSidebar;
