import { searchPlatform } from '@/app/actions/search';
import Navbar from '@/components/layout/Navbar';
import MediumSidebar from '@/components/layout/MediumSidebar';
import MediumRightbar from '@/components/layout/MediumRightbar';
import HorizontalBlogCard from '@/components/blog/HorizontalBlogCard';
import Footer from '@/components/layout/Footer';
import Image from 'next/image';
import Link from 'next/link';

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q: string }> }) {
  const resolvedParams = await searchParams;
  const q = resolvedParams.q || '';
  
  const { users, blogs } = await searchPlatform(q);

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <div className="max-w-[1336px] mx-auto flex justify-center px-4 sm:px-6">
        <MediumSidebar />
        
        <section className="flex-1 max-w-[700px] min-w-0 w-full lg:px-12 py-8 lg:py-12 border-x border-gray-100 min-h-screen">
          <div className="mb-12 border-b border-gray-100 pb-8">
             <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">Results for <span className="text-gray-500">"{q}"</span></h1>
          </div>

          {users.length > 0 && (
             <div className="mb-12">
                <h2 className="text-lg font-bold text-gray-900 mb-6 uppercase tracking-wider">People matching "{q}"</h2>
                <div className="space-y-6">
                   {users.map((u: any) => (
                      <Link href={`/user/${u._id}`} key={u._id} className="flex items-center justify-between group">
                         <div className="flex items-center gap-4">
                            <Image src={u.image || '/default-avatar.png'} width={48} height={48} className="rounded-full" alt={u.name} />
                            <div>
                               <p className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{u.name}</p>
                               {u.prn && <p className="text-xs font-mono text-gray-500 uppercase">PRN: {u.prn}</p>}
                               <p className="text-sm text-gray-500 line-clamp-1">{u.bio || 'No bio available'}</p>
                            </div>
                         </div>
                         <button className="hidden sm:block border border-gray-300 text-gray-900 text-sm font-medium rounded-full px-4 py-1.5 group-hover:bg-gray-50 transition-colors">
                            View Profile
                         </button>
                      </Link>
                   ))}
                </div>
             </div>
          )}

          <div>
             <h2 className="text-lg font-bold text-gray-900 mb-6 uppercase tracking-wider">Stories matching "{q}"</h2>
             {blogs.length > 0 ? (
                <div className="flex flex-col">
                   {blogs.map((blog: any) => (
                     <HorizontalBlogCard key={blog._id} blog={blog} />
                   ))}
                </div>
             ) : (
                <div className="text-center py-12">
                   <p className="text-gray-500">No stories found matching your query.</p>
                </div>
             )}
          </div>
        </section>

        <MediumRightbar />
      </div>
      <Footer />
    </main>
  );
}
