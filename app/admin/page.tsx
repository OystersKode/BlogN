'use client';

import { useEffect, useState } from 'react';
import { getAllUsers, getAllBlogs, deleteUser, updateUserRole, toggleStaffPick } from '@/app/actions/admin';
import { deleteBlog } from '@/app/actions/blog';
import Navbar from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Loader2, Trash2, UserCog, BookOpen, Users, Star, FileDown, MessageSquare, Zap, Monitor, Layout, Smartphone } from 'lucide-react';
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
      
      // Basic CSV Generation
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
      console.error('Export failed:', error);
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

  const calculateAverage = (category: 'speed' | 'editor' | 'upload' | 'mobile') => {
    if (feedback.length === 0) return 0;
    const sum = feedback.reduce((acc, curr) => acc + curr.ratings[category], 0);
    return (sum / feedback.length).toFixed(1);
  };

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-[#fafbfc] dark:bg-slate-950 transition-colors">
      <Navbar />
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
         <div className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
               <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight transition-colors">Admin Console</h1>
               <p className="text-gray-500 dark:text-gray-400 font-medium">Platform management and user moderation.</p>
            </div>
            <Button 
               onClick={handleExport}
               disabled={exporting}
               className="bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl px-6 h-12 shadow-lg shadow-green-100 dark:shadow-none transition-all flex items-center gap-2"
            >
               {exporting ? <Loader2 className="animate-spin h-5 w-5" /> : <FileDown size={20} />}
               {exporting ? 'Generating...' : 'Download Report (Excel)'}
            </Button>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
           {/* Users Management */}
           <section className="space-y-6">
             <div className="flex items-center gap-2 text-xl font-bold text-gray-800 dark:text-gray-200 transition-colors">
                <Users size={24} className="text-blue-500 dark:text-blue-400" />
                Users ({users.length})
             </div>
             <div className="space-y-4 transition-colors">
               {users.map((u) => (
                 <Card key={u._id} className="p-4 flex items-center justify-between border-none shadow-sm dark:shadow-none bg-white dark:bg-slate-900 hover:shadow-md transition-all">
                   <div className="flex items-center gap-3">
                     <Image src={u.image || '/default-avatar.png'} alt={u.name} width={40} height={40} className="rounded-full ring-2 ring-gray-50 dark:ring-white/5 transition-colors" />
                     <div>
                       <p className="font-bold text-sm text-gray-900 dark:text-white transition-colors">{u.name}</p>
                       <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors">{u.email}</p>
                     </div>
                   </div>
                   <div className="flex items-center gap-2">
                     <Button
                        variant="ghost"
                        size="icon"
                        title="Toggle User Role"
                        className="text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                        onClick={async () => {
                            const newRole = u.role === 'ADMIN' ? 'USER' : 'ADMIN';
                            if(confirm(`Change ${u.name}'s role to ${newRole}?`)) {
                                await updateUserRole(u._id, newRole);
                                fetchData();
                            }
                        }}
                     >
                       <UserCog size={16} />
                     </Button>
                     <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tight transition-colors ${u.role === 'ADMIN' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400'}`}>
                       {u.role}
                     </span>
                     <Button 
                         variant="ghost" 
                         size="icon" 
                         className="text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                         onClick={async () => {
                             if(confirm('Delete user?')) {
                                 await deleteUser(u._id);
                                 fetchData();
                             }
                         }}
                     >
                       <Trash2 size={16} />
                     </Button>
                   </div>
                 </Card>
               ))}
             </div>
           </section>

          {/* Blogs Management */}
           <section className="space-y-6 transition-colors">
             <div className="flex items-center gap-2 text-xl font-bold text-gray-800 dark:text-gray-200 transition-colors">
                <BookOpen size={24} className="text-blue-500 dark:text-blue-400 transition-colors" />
                All Blogs ({blogs.length})
             </div>
             <div className="space-y-4 transition-colors">
               {blogs.map((b) => (
                 <Card key={b._id} className="p-4 flex items-center justify-between border-none shadow-sm dark:shadow-none bg-white dark:bg-slate-900 hover:shadow-md transition-all">
                   <div className="flex flex-col">
                     <p className="font-bold text-sm truncate max-w-[250px] text-gray-900 dark:text-white transition-colors">{b.title}</p>
                     <p className="text-xs text-gray-500 dark:text-gray-400 italic transition-colors">by {b.author.name}</p>
                   </div>
                   <div className="flex items-center gap-2 transition-colors">
                     <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tight transition-colors ${b.status === 'PUBLISHED' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'}`}>
                       {b.status}
                     </span>
                     <Button 
                         variant="ghost" 
                         size="icon" 
                         className={`${b.isStaffPick ? 'text-yellow-500 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20' : 'text-gray-400 dark:text-gray-500 hover:text-yellow-500 dark:hover:text-yellow-400 hover:bg-gray-100 dark:hover:bg-slate-800'} transition-colors`}
                         onClick={async () => {
                             await toggleStaffPick(b._id.toString());
                             fetchData();
                         }}
                         title={b.isStaffPick ? "Remove Staff Pick" : "Mark as Staff Pick"}
                     >
                       <Star size={16} className={b.isStaffPick ? 'fill-current' : ''} />
                     </Button>
                     <Button 
                         variant="ghost" 
                         size="icon" 
                         className="text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                         onClick={async () => {
                             if(confirm('Delete blog permanently?')) {
                                 await deleteBlog(b._id.toString());
                                 fetchData();
                             }
                         }}
                     >
                       <Trash2 size={16} />
                     </Button>
                   </div>
                 </Card>
               ))}
             </div>
           </section>
        </div>

        {/* Performance Feedback Reports */}
        <section className="space-y-8 mt-12 pt-12 border-t border-gray-100 dark:border-white/10 transition-colors">
           <div className="flex items-center justify-between">
             <div className="flex items-center gap-2 text-xl font-bold text-gray-800 dark:text-gray-200 transition-colors">
                 <MessageSquare size={24} className="text-indigo-500 dark:text-indigo-400" />
                 Performance Reports ({feedback.length})
             </div>
             
             <div className="flex gap-4 sm:gap-8 overflow-x-auto pb-2 transition-colors">
                 {[
                   { label: 'Speed', val: calculateAverage('speed'), icon: Zap, color: 'text-yellow-500' },
                   { label: 'Editor', val: calculateAverage('editor'), icon: Monitor, color: 'text-blue-500' },
                   { label: 'Upload', val: calculateAverage('upload'), icon: Layout, color: 'text-green-500' },
                   { label: 'Mobile', val: calculateAverage('mobile'), icon: Smartphone, color: 'text-purple-500' },
                 ].map((stat) => (
                   <div key={stat.label} className="bg-white dark:bg-slate-900 px-4 py-2 rounded-xl flex items-center gap-3 shadow-sm transition-colors min-w-fit">
                      <stat.icon size={16} className={stat.color} />
                      <span className="text-[10px] uppercase font-black tracking-widest text-gray-400 dark:text-gray-500">{stat.label}</span>
                      <span className="text-sm font-black text-gray-900 dark:text-white">{stat.val}</span>
                   </div>
                 ))}
             </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 transition-colors">
               {feedback.length > 0 ? feedback.map((f: any) => (
                 <Card key={f._id} className="border-none shadow-sm dark:shadow-none bg-white dark:bg-slate-900 hover:shadow-md transition-all">
                   <CardHeader className="p-4 flex flex-row items-center gap-3 border-b border-gray-50 dark:border-white/5">
                       <Image src={f.user?.image || '/default-avatar.png'} alt={f.user?.name} width={32} height={32} className="rounded-full" />
                       <div className="min-w-0">
                          <p className="font-bold text-[13px] text-gray-900 dark:text-white truncate transition-colors">{f.user?.name}</p>
                          <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-tight transition-colors">PRN: {f.user?.prn || 'N/A'}</p>
                       </div>
                   </CardHeader>
                   <CardContent className="p-4 space-y-4 transition-colors">
                       <div className="grid grid-cols-2 gap-2 transition-colors">
                          {Object.entries(f.ratings).map(([key, val]: [any, any]) => (
                            <div key={key} className="flex items-center justify-between bg-gray-50 dark:bg-slate-800/50 px-2.5 py-1.5 rounded-lg transition-colors">
                               <span className="text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500">{key}</span>
                               <div className="flex gap-0.5">
                                  {[1,2,3,4,5].map(s => (
                                    <div key={s} className={`w-1 h-3 rounded-full ${val >= s ? 'bg-blue-500' : 'bg-gray-200 dark:bg-gray-700'}`} />
                                  ))}
                               </div>
                            </div>
                          ))}
                       </div>
                       {f.comment && (
                         <div className="pt-3 border-t border-gray-50 dark:border-white/5 transition-colors">
                            <p className="text-[13px] text-gray-600 dark:text-gray-400 italic transition-colors leading-relaxed">"{f.comment}"</p>
                         </div>
                       )}
                       <p className="text-[10px] text-gray-400 dark:text-gray-500 font-medium pt-2 transition-colors">
                         Submitted: {new Date(f.createdAt).toLocaleDateString()}
                       </p>
                   </CardContent>
                 </Card>
               )) : (
                 <div className="col-span-full py-12 text-center text-gray-400 dark:text-gray-500 italic transition-colors">
                   No performance reports submitted yet.
                 </div>
               )}
           </div>
        </section>
      </div>
    </div>
  );
};

export default AdminDashboard;
