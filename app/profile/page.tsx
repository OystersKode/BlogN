import { getUserProfile } from '@/app/actions/profile';
import { getUserBlogs } from '@/app/actions/dashboard';
import Navbar from '@/components/layout/Navbar';
import ProfileForm from '@/components/profile/ProfileForm';
import BlogCard from '@/components/blog/BlogCard';
import { Card } from '@/components/ui/card';
import Image from 'next/image';
import { Mail, CalendarDays, Shield, PenTool } from 'lucide-react';
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
    <main className="min-h-screen bg-[#F4F4F1] dark:bg-zinc-950 transition-colors">
      <Navbar />
      <div className="max-w-[1336px] mx-auto py-12 px-6 lg:px-8 space-y-16">
        
        {/* Profile Header & Edit Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
           <Card className="p-8 border-[4px] border-black dark:border-white shadow-neo bg-white dark:bg-zinc-900 rounded-none lg:col-span-1 flex flex-col items-center text-center transition-colors">
              <div className="relative w-36 h-36 mb-8 border-[4px] border-black dark:border-white shadow-neo overflow-hidden">
                 <Image 
                    src={user.image || '/default-avatar.png'} 
                    alt={user.name} 
                    fill 
                    className="object-cover grayscale contrast-125"
                 />
                 <div className="absolute bottom-2 right-2 bg-primary text-black border-[2px] border-black p-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-colors">
                    {user.role === 'ADMIN' ? <Shield size={20} strokeWidth={3} /> : <PenTool size={20} strokeWidth={3} />}
                 </div>
              </div>
              <h2 className="text-3xl font-black text-black dark:text-white uppercase tracking-tighter leading-none mb-4">{user.name}</h2>
              
              <div className="flex items-center gap-2 text-zinc-500 font-black uppercase text-[11px] mb-2 transition-colors">
                 <Mail size={16} strokeWidth={3} /> {user.email}
              </div>
              <div className="flex items-center gap-2 text-zinc-400 font-bold uppercase tracking-widest text-[10px] transition-colors">
                 <CalendarDays size={16} strokeWidth={3} /> Joined {format(new Date(user.createdAt), 'MMM yyyy')}
              </div>

              <div className="flex flex-wrap gap-2 justify-center mt-10 pt-8 border-t-[3px] border-black/10 dark:border-white/10 w-full transition-colors">
                   <div className="bg-secondary text-black px-4 py-2 border-[2px] border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] text-[10px] font-black uppercase tracking-wider">
                      {blogs.length} Stories Published
                   </div>
              </div>
           </Card>

           <Card className="p-8 border-[4px] border-black dark:border-white shadow-neo bg-white dark:bg-zinc-900 rounded-none lg:col-span-2 transition-colors">
              <div className="mb-10 bg-primary/20 p-6 border-[3px] border-black dark:border-white">
                 <h3 className="text-2xl font-black text-black dark:text-white uppercase tracking-tight mb-2">Edit Your Profile</h3>
                 <p className="text-xs text-zinc-500 font-bold uppercase">Manage your public information and technical persona.</p>
              </div>
              <ProfileForm user={user} />
           </Card>
        </div>

        {/* Existing Blogs Section */}
        <section className="pt-8 transition-colors">
           <div className="flex items-center gap-6 mb-12">
              <h3 className="text-4xl font-black text-black dark:text-white uppercase tracking-tighter sm:rotate-[-1deg] bg-secondary px-4 py-2 border-[4px] border-black shadow-neo">Your Published Stories</h3>
              <div className="h-[4px] flex-grow bg-black dark:bg-white" />
           </div>

           {blogs.length > 0 ? (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
               {blogs.map((blog: any) => (
                 <BlogCard key={blog._id} blog={blog} />
               ))}
             </div>
           ) : (
             <div className="p-24 text-center border-[4px] border-dashed border-black dark:border-white bg-white/50 dark:bg-zinc-900/50 transition-colors">
                <p className="text-zinc-500 font-black uppercase italic text-lg transition-colors">You haven't written any stories yet.</p>
             </div>
           )}
        </section>
      </div>
    </main>
  );
};

export default ProfilePage;
