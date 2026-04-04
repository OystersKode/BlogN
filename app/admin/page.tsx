'use client';

import { useEffect, useState } from 'react';
import { getAllUsers, getAllBlogs, deleteUser, updateUserRole, toggleStaffPick } from '@/app/actions/admin';
import { deleteBlog } from '@/app/actions/blog';
import Navbar from '@/components/layout/Navbar';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Loader2, Trash2, UserCog, BookOpen, Users, Star, FileDown, MessageSquare, Zap, Monitor, Layout, Smartphone, ShieldCheck, Search } from 'lucide-react';
import Image from 'next/image';
import { getExportableBlogs } from '@/app/actions/admin';
import { getAllFeedback } from '@/app/actions/feedback';

const AdminDashboard = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [feedback, setFeedback] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    setExporting(true);
    try {
      const data = await getExportableBlogs();
      const headers = ['PRN', 'Author Name', 'Blog Title', 'Blog Link', 'Submitted At'];
      const csvRows = [headers.join(',')];
      data.forEach((row: any) => {
        const values = [
          `"${row.prn}"`,
          `"${row.name.replace(/"/g, '""')}"`,
          `"${row.title.replace(/"/g, '""')}"`,
          `"${row.link}"`,
          `"${new Date(row.submittedAt).toLocaleString()}"`
        ];
        csvRows.push(values.join(','));
      });
      const csvString = csvRows.join('\n');
      const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `blogn_export_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      alert('Export failed. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  useEffect(() => {
    if (status === 'unauthenticated' || (session && (session.user as any).role !== 'ADMIN')) {
      router.push('/');
    } else if (status === 'authenticated') {
      fetchData();
    }
  }, [session, status]);

  const fetchData = async () => {
    try {
      const [u, b, f] = await Promise.all([getAllUsers(), getAllBlogs(), getAllFeedback()]);
      setUsers(u);
      setBlogs(b);
      setFeedback(f);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center bg-primary"><Loader2 className="animate-spin h-10 w-10" strokeWidth={3} /></div>;

  return (
    <div className="min-h-screen bg-[#F4F4F1] dark:bg-zinc-950 transition-colors flex flex-col">
      <Navbar />
      <div className="max-w-[1440px] mx-auto py-12 px-4 sm:px-8 lg:px-12 w-full space-y-16 pb-32">
         
         {/* Hero Header */}
         <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 border-b-[5px] border-black dark:border-white pb-12">
            <div className="space-y-4">
               <div className="flex items-center gap-3 bg-black text-white px-4 py-1 w-fit border-[3px] border-black shadow-neo-sm">
                  <ShieldCheck size={18} strokeWidth={3} />
                  <span className="text-xs font-black uppercase tracking-[0.3em]">System Level: Root</span>
               </div>
               <h1 className="text-6xl sm:text-8xl font-black text-black dark:text-white tracking-tighter leading-[0.8] uppercase italic">CONSOLE.</h1>
               <p className="text-xl font-bold text-zinc-500 uppercase tracking-tight">Platform moderation and analytical oversight.</p>
            </div>
            
            <button 
               onClick={handleExport}
               disabled={exporting}
               className="bg-accent text-white border-[4px] border-black shadow-neo px-10 h-20 text-lg font-black uppercase tracking-widest hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center gap-4 group"
            >
               {exporting ? <Loader2 className="animate-spin h-6 w-6" /> : <FileDown size={28} strokeWidth={3} className="group-hover:translate-y-1 transition-transform" />}
               {exporting ? 'GENERATING...' : 'EXPORT LOGS'}
            </button>
         </div>

         {/* Stats Grid */}
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
               { label: 'Total Nodes', val: users.length, icon: Users, color: 'bg-primary' },
               { label: 'Total Logs', val: blogs.length, icon: BookOpen, color: 'bg-secondary' },
               { label: 'Reports', val: feedback.length, icon: MessageSquare, color: 'bg-accent' },
               { label: 'Staff Picks', val: blogs.filter(b => b.isStaffPick).length, icon: Star, color: 'bg-yellow-400' }
            ].map((stat) => (
               <div key={stat.label} className={`${stat.color} border-[4px] border-black shadow-neo p-8 space-y-4 hover:scale-[1.02] transition-transform`}>
                  <div className="flex items-center justify-between">
                     <stat.icon size={24} strokeWidth={3} className="text-black" />
                     <span className="text-xs font-black uppercase tracking-widest text-black">Live Stream</span>
                  </div>
                  <div className="flex flex-col">
                     <span className="text-5xl font-black text-black leading-none">{stat.val}</span>
                     <span className="text-sm font-black text-black uppercase tracking-tight pt-2">{stat.label}</span>
                  </div>
               </div>
            ))}
         </div>

         <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
            {/* User Moderation */}
            <div className="xl:col-span-1 space-y-8">
               <div className="flex items-center justify-between border-b-[4px] border-black dark:border-white pb-4">
                  <h2 className="text-3xl font-black text-black dark:text-white uppercase italic">Users.</h2>
                  <Users size={24} strokeWidth={3} className="text-black dark:text-white" />
               </div>
               <div className="space-y-4">
                  {users.map(u => (
                     <div key={u._id} className="bg-white dark:bg-zinc-800 border-[3px] border-black dark:border-white p-4 shadow-neo hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all flex items-center justify-between">
                        <div className="flex items-center gap-4">
                           <Image src={u.image || '/default-avatar.png'} width={48} height={48} className="border-[2px] border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] grayscale" alt={u.name} />
                           <div className="min-w-0">
                              <p className="font-black text-sm uppercase text-black dark:text-white truncate">{u.name}</p>
                              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest truncate">{u.role}</p>
                           </div>
                        </div>
                        <div className="flex items-center gap-2">
                           <button onClick={async () => {
                              const newRole = u.role === 'ADMIN' ? 'USER' : 'ADMIN';
                              if(confirm(`Promote/Demote ${u.name}?`)) {
                                 await updateUserRole(u._id, newRole);
                                 fetchData();
                              }
                           }} className="p-2 border-[2px] border-black bg-secondary hover:bg-white transition-colors" title="Toggle Role">
                              <UserCog size={16} strokeWidth={3} />
                           </button>
                           <button onClick={async () => {
                              if(confirm('Purge user?')) {
                                 await deleteUser(u._id);
                                 fetchData();
                              }
                           }} className="p-2 border-[2px] border-black bg-primary hover:bg-white transition-colors" title="Delete">
                              <Trash2 size={16} strokeWidth={3} />
                           </button>
                        </div>
                     </div>
                  ))}
               </div>
            </div>

            {/* Blog Moderation */}
            <div className="xl:col-span-2 space-y-8">
               <div className="flex items-center justify-between border-b-[4px] border-black dark:border-white pb-4">
                  <h2 className="text-3xl font-black text-black dark:text-white uppercase italic">Logs.</h2>
                  <BookOpen size={24} strokeWidth={3} className="text-black dark:text-white" />
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {blogs.map(b => (
                     <div key={b._id} className="bg-white dark:bg-zinc-800 border-[3px] border-black dark:border-white p-6 shadow-neo-sm space-y-6 flex flex-col justify-between">
                        <div className="space-y-4">
                           <div className="flex justify-between items-start">
                              <span className={`px-3 py-1 border-[2px] border-black font-black text-[10px] uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${b.status === 'PUBLISHED' ? 'bg-secondary' : 'bg-primary'}`}>
                                 {b.status}
                              </span>
                              <div className="flex gap-2">
                                 <button onClick={async () => {
                                    await toggleStaffPick(b._id.toString());
                                    fetchData();
                                 }} className={`p-2 border-[2px] border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all ${b.isStaffPick ? 'bg-yellow-400 -translate-y-1' : 'bg-white'}`}>
                                    <Star size={16} strokeWidth={3} className={b.isStaffPick ? 'fill-current' : ''} />
                                 </button>
                                 <button onClick={async () => {
                                    if(confirm('Purge log permanently?')) {
                                       await deleteBlog(b._id.toString());
                                       fetchData();
                                    }
                                 }} className="p-2 border-[2px] border-black bg-primary shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-white transition-all">
                                    <Trash2 size={16} strokeWidth={3} />
                                 </button>
                              </div>
                           </div>
                           <h3 className="font-black text-lg uppercase leading-tight text-black dark:text-white tracking-tighter line-clamp-2">{b.title}</h3>
                           <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest italic">Node: {b.author.name}</p>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </div>

         {/* Technical Reports */}
         <div className="space-y-12 pt-16">
            <div className="flex items-center justify-between border-b-[5px] border-black dark:border-white pb-6">
               <div className="flex items-center gap-6">
                  <h2 className="text-5xl font-black text-black dark:text-white uppercase italic leading-none">Feedback reports.</h2>
                  <div className="hidden lg:flex gap-4">
                     {['Speed', 'Editor', 'Upload', 'Mobile'].map(k => (
                        <div key={k} className="bg-black text-white px-4 py-1 text-[10px] font-black uppercase border-[2px] border-black -rotate-2">
                           {k}
                        </div>
                     ))}
                  </div>
               </div>
               <MessageSquare size={32} strokeWidth={3} className="text-black dark:text-white" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
               {feedback.map(f => (
                  <div key={f._id} className="bg-white dark:bg-zinc-900 border-[4px] border-black dark:border-white shadow-neo p-8 space-y-6 flex flex-col justify-between">
                     <div className="space-y-6">
                        <div className="flex items-center gap-4 border-b-[2px] border-black/10 pb-4">
                           <div className="w-12 h-12 bg-primary border-[2px] border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center font-black italic">
                              {f.user?.name?.[0].toUpperCase() || 'U'}
                           </div>
                           <div className="min-w-0">
                              <p className="font-black text-sm uppercase text-black dark:text-white truncate">{f.user?.name}</p>
                              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">PRN: {f.user?.prn || 'ROOT'}</p>
                           </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                           {Object.entries(f.ratings).map(([k, v]: [any, any]) => (
                              <div key={k} className="bg-zinc-100 dark:bg-zinc-800 p-2 border-[2px] border-black flex flex-col gap-1 items-center">
                                 <span className="text-[10px] font-black uppercase tracking-tighter text-zinc-500">{k}</span>
                                 <span className="text-xl font-black text-black dark:text-white">{v}</span>
                              </div>
                           ))}
                        </div>
                        {f.comment && (
                           <div className="bg-secondary p-4 border-[2px] border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                              <p className="text-[12px] font-bold text-black uppercase leading-tight italic">"{f.comment}"</p>
                           </div>
                        )}
                     </div>
                     <p className="text-[9px] font-black uppercase text-zinc-400 tracking-[0.2em] pt-4">Timestamp: {new Date(f.createdAt).toISOString()}</p>
                  </div>
               ))}
            </div>
         </div>

      </div>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
