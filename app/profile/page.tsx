import { getUserProfile } from '@/app/actions/profile';
import { getUserBlogs } from '@/app/actions/dashboard';
import Navbar from '@/components/layout/Navbar';
import ProfileForm from '@/components/profile/ProfileForm';
import BlogCard from '@/components/blog/BlogCard';
import { Card } from '@/components/ui/card';
import Image from 'next/image';
import { Mail, CalendarDays } from 'lucide-react';
import { format } from 'date-fns';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';

const ProfilePage = async () => {
  const session = await getServerSession(authOptions);
  
  if (!session) {
     redirect('/login');
  }

  const user = await getUserProfile();
  const blogs = await getUserBlogs();

  return (
    <main className="min-h-screen bg-[#fafbfc]">
      <Navbar />
      <div className="max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Profile Header & Edit Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <Card className="p-8 border-none shadow-xl bg-white rounded-[2rem] lg:col-span-1 flex flex-col items-center text-center">
              <div className="relative w-32 h-32 mb-6">
                 <Image 
                    src={user.image || '/default-avatar.png'} 
                    alt={user.name} 
                    fill 
                    className="rounded-full object-cover ring-4 ring-blue-50 shadow-md"
                 />
                 <div className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-2 ring-4 ring-white shadow-sm">
                    {user.role === 'ADMIN' ? '🛡️' : '✍️'}
                 </div>
              </div>
              <h2 className="text-2xl font-black text-gray-900">{user.name}</h2>
              
              <div className="flex items-center gap-2 text-gray-500 text-sm font-medium mt-3">
                 <Mail size={14} /> {user.email}
              </div>
              <div className="flex items-center gap-2 text-gray-400 text-xs font-bold uppercase tracking-widest mt-2">
                 <CalendarDays size={14} /> Joined {format(new Date(user.createdAt), 'MMM yyyy')}
              </div>

              <div className="flex flex-wrap gap-2 justify-center mt-8 pt-6 border-t border-gray-50 w-full">
                  <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider">
                     {blogs.length} Stories
                  </div>
              </div>
           </Card>

           <Card className="p-8 border-none shadow-sm bg-white rounded-[2rem] lg:col-span-2">
              <div className="mb-6">
                 <h3 className="text-xl font-black text-gray-900 tracking-tight">About You</h3>
                 <p className="text-sm text-gray-500 font-medium">Manage your public information and persona.</p>
              </div>
              <ProfileForm user={user} />
           </Card>
        </div>

        {/* Existing Blogs Section */}
        <section className="pt-8">
           <div className="flex items-center gap-4 mb-8">
              <h3 className="text-3xl font-black text-gray-900 tracking-tight">Your Published Stories</h3>
              <div className="h-1 flex-grow bg-gradient-to-r from-gray-100 to-transparent rounded-full" />
           </div>

           {blogs.length > 0 ? (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {blogs.map((blog: any) => (
                 <BlogCard key={blog._id} blog={blog} />
               ))}
             </div>
           ) : (
             <Card className="p-16 text-center border-dashed border-2 border-gray-200 bg-transparent rounded-[2rem]">
                <p className="text-gray-400 font-medium italic">You haven't written any stories yet.</p>
             </Card>
           )}
        </section>
      </div>
    </main>
  );
};

export default ProfilePage;
