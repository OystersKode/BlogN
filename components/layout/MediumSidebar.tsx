import Link from 'next/link';
import { Home, Library, User, FileText, BarChart2, Users } from 'lucide-react';

const MediumSidebar = () => {
  return (
    <aside className="w-64 flex-shrink-0 hidden lg:block sticky top-[80px] h-[calc(100vh-80px)] overflow-y-auto pr-8 py-8 border-r border-gray-100">
      <nav className="space-y-6">
        <Link href="/" className="flex items-center gap-4 text-gray-900 group">
          <Home size={22} className="text-gray-400 group-hover:text-gray-900 transition-colors" />
          <span className="font-medium text-[15px]">Home</span>
        </Link>
        <Link href="/library" className="flex items-center gap-4 text-gray-500 hover:text-gray-900 group transition-colors">
          <Library size={22} className="text-gray-400 group-hover:text-gray-900 transition-colors" />
          <span className="font-medium text-[15px]">Library</span>
        </Link>
        <Link href="/profile" className="flex items-center gap-4 text-gray-500 hover:text-gray-900 group transition-colors">
          <User size={22} className="text-gray-400 group-hover:text-gray-900 transition-colors" />
          <span className="font-medium text-[15px]">Profile</span>
        </Link>
        <Link href="/explore" className="flex items-center gap-4 text-gray-500 hover:text-gray-900 group transition-colors">
          <FileText size={22} className="text-gray-400 group-hover:text-gray-900 transition-colors" />
          <span className="font-medium text-[15px]">Stories</span>
        </Link>
        <div className="flex items-center gap-4 text-gray-500 hover:text-gray-900 group transition-colors cursor-not-allowed opacity-70">
          <BarChart2 size={22} className="text-gray-400" />
          <span className="font-medium text-[15px]">Stats</span>
        </div>
        
        <div className="pt-8 mt-8 border-t border-gray-100">
           <Link href="/following" className="flex items-center gap-4 text-gray-500 hover:text-gray-900 group transition-colors">
              <Users size={22} className="text-gray-400 group-hover:text-gray-900 transition-colors" />
              <span className="font-medium text-[15px]">Following</span>
           </Link>
           <div className="mt-8">
              <p className="text-gray-500 text-[13px] font-medium leading-relaxed">Find writers and publications to follow.</p>
              <button className="text-blue-600 text-[13px] font-medium hover:text-blue-700 mt-2">See suggestions</button>
           </div>
        </div>
      </nav>
    </aside>
  );
};

export default MediumSidebar;
