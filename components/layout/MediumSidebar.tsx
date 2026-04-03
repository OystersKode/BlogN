import Link from 'next/link';
import { Home, Library, User, FileText, BarChart2, Users } from 'lucide-react';

const MediumSidebar = ({ isOverlay = false }: { isOverlay?: boolean }) => {
  return (
    <aside className={`flex-shrink-0 overflow-y-auto pr-8 py-8 border-gray-100 dark:border-white/10 transition-colors ${isOverlay ? 'w-full block border-none py-0 pr-4' : 'w-64 hidden lg:block sticky top-[80px] h-[calc(100vh-80px)] border-r'}`}>
      <nav className="space-y-6">
        <Link href="/" className="flex items-center gap-4 text-gray-900 dark:text-white group transition-colors">
          <Home size={22} className="text-gray-400 dark:text-gray-500 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" />
          <span className="font-medium text-[15px]">Home</span>
        </Link>
        <Link href="/bookmarks" className="flex items-center gap-4 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white group transition-colors">
          <Library size={22} className="text-gray-400 dark:text-gray-500 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" />
          <span className="font-medium text-[15px]">Bookmarks</span>
        </Link>
        <Link href="/profile" className="flex items-center gap-4 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white group transition-colors">
          <User size={22} className="text-gray-400 dark:text-gray-500 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" />
          <span className="font-medium text-[15px]">Profile</span>
        </Link>
        <Link href="/explore" className="flex items-center gap-4 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white group transition-colors">
          <FileText size={22} className="text-gray-400 dark:text-gray-500 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" />
          <span className="font-medium text-[15px]">Stories</span>
        </Link>
        <Link href="/dashboard" className="flex items-center gap-4 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white group transition-colors">
          <BarChart2 size={22} className="text-gray-400 dark:text-gray-500 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" />
          <span className="font-medium text-[15px]">Stats</span>
        </Link>
        
        <div className="pt-8 mt-8 border-t border-gray-100 dark:border-white/10 transition-colors">
           <Link href="/following" className="flex items-center gap-4 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white group transition-colors">
              <Users size={22} className="text-gray-400 dark:text-gray-500 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" />
              <span className="font-medium text-[15px]">Following</span>
           </Link>
            <div className="mt-8">
               <p className="text-gray-500 dark:text-gray-400 text-[13px] font-medium leading-relaxed transition-colors">Find writers and publications to follow.</p>
               <Link href="/explore" className="text-blue-600 dark:text-blue-400 text-[13px] font-bold hover:text-blue-700 dark:hover:text-blue-300 mt-2 transition-colors block w-fit underline decoration-blue-600/20 underline-offset-4">See suggestions</Link>
            </div>
        </div>
      </nav>
    </aside>
  );
};

export default MediumSidebar;
