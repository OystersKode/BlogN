'use client';

import { useState, useRef, useEffect } from 'react';
import TiptapEditor from '@/components/editor/TiptapEditor';
import { createBlog, updateBlog } from '@/app/actions/blog';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Loader2, Plus, X, ArrowLeft, Users, Search } from 'lucide-react';
import Image from 'next/image';
import Navbar from '@/components/layout/Navbar';

interface BlogEditorProps {
  initialData?: any;
}

const BlogEditor = ({ initialData }: BlogEditorProps) => {
  const isEdit = !!initialData?._id;
  const [title, setTitle] = useState(initialData?.title || '');
  const [content, setContent] = useState<any>(initialData?.content || null);
  const [coverImage, setCoverImage] = useState(initialData?.coverImage || '');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [coAuthors, setCoAuthors] = useState<any[]>(initialData?.coAuthors || []);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();

  // Debounced user search
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchTerm.length >= 2) {
        setIsSearching(true);
        try {
          const res = await fetch(`/api/users/search?q=${encodeURIComponent(searchTerm)}`);
          const data = await res.json();
          // Filter out already added co-authors
          const currentIds = coAuthors.map(a => a._id);
          setSearchResults(data.filter((u: any) => !currentIds.includes(u._id)));
        } catch (err) {
          console.error(err);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, coAuthors]);

  const addCoAuthor = (user: any) => {
    if (coAuthors.length >= 3) {
      alert("You can add a maximum of 3 co-authors.");
      return;
    }
    setCoAuthors([...coAuthors, user]);
    setSearchTerm('');
    setSearchResults([]);
  };

  const removeCoAuthor = (userId: string) => {
    setCoAuthors(coAuthors.filter(u => u._id !== userId));
  };

  // Auto-resize the title textarea
  const titleRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.style.height = 'auto';
      titleRef.current.style.height = titleRef.current.scrollHeight + 'px';
    }
  }, [title]);

  const handleImageUpload = async (e: any) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 300 * 1024) {
          alert("Cover image must be smaller than 300KB to save database space.");
          return;
      }
      setUploading(true);
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64 = reader.result;
        try {
          const res = await fetch('/api/upload', {
            method: 'POST',
            body: JSON.stringify({ image: base64 }),
            headers: { 'Content-Type': 'application/json' },
          });
          const data = await res.json();
          if (data.url) setCoverImage(data.url);
        } catch (err) {
          console.error(err);
          alert('Upload failed');
        } finally {
          setUploading(false);
        }
      };
    }
  };

  const handlePublish = async (status: 'DRAFT' | 'PUBLISHED') => {
    if (!title || !content) return alert('Please add title and content');
    
    setLoading(true);
    try {
      // Deep clone content to break React 19's client-side proxies/transitions ($T error fix)
      const plainContent = JSON.parse(JSON.stringify(content));
      const payload = { 
        title, 
        content: plainContent, 
        coverImage, 
        status,
        coAuthors: coAuthors.map(u => u._id)
      };

      if (isEdit) {
        const res = await updateBlog(initialData._id, payload);
        router.push(`/blog/${res.slug}`);
      } else {
        const res = await createBlog(payload);
        router.push(`/blog/${res.slug}`);
      }
    } catch (error: any) {
      console.error(error);
      alert(error.message || 'Error saving blog');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-slate-950 flex flex-col selection:bg-blue-100 selection:text-slate-900 transition-colors">
      <Navbar />

      {/* Editor Action Bar */}
      <div className="sticky top-[64px] z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-white/10 px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between shadow-sm transition-colors">
         <div className="flex items-center gap-2 sm:gap-4">
            <Button variant="ghost" onClick={() => router.back()} className="text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white h-9 w-9 sm:w-auto sm:px-3 rounded-full transition-colors">
              <ArrowLeft size={20} /><span className="hidden sm:inline ml-2">Back</span>
            </Button>
            <div className="hidden sm:block h-4 w-px bg-slate-300 dark:bg-white/10 mx-1 transition-colors"></div>
            <span className="text-[10px] sm:text-[12px] font-black tracking-widest text-slate-400 dark:text-gray-500 uppercase transition-colors">
                {isEdit ? 'Editing Mode' : 'Draft Mode'}
            </span>
         </div>
          <div className="flex items-center gap-2 sm:gap-3 transition-colors">
             <button 
                 className="text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full font-bold h-9 px-3 sm:px-4 text-xs sm:text-sm transition-colors"
                 onClick={() => handlePublish('DRAFT')} 
                 disabled={loading}
             >
               {isEdit ? 'Update Draft' : 'Save'}
             </button>
              <Button 
                 onClick={() => handlePublish('PUBLISHED')} 
                 disabled={loading}
                 className="bg-blue-600 hover:bg-blue-700 text-white dark:text-white rounded-full h-9 px-5 sm:px-6 font-bold shadow-md hover:shadow-lg transition-all text-xs sm:text-sm"
             >
               {loading ? <Loader2 className="animate-spin h-4 w-4" /> : (isEdit ? 'Update & Publish' : 'Publish')}
              </Button>
         </div>
      </div>

       <div className="flex-1 w-full max-w-4xl mx-auto py-6 sm:py-12 px-0 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-slate-900 rounded-none sm:rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.02)] dark:shadow-none border-x-0 sm:border border-slate-100 dark:border-white/10 p-6 sm:p-16 min-h-[800px] relative transition-colors">
            
            <div className="group relative mb-10">
               {!coverImage && (
                   <>
                     <div className="flex sm:hidden mb-3">
                       <label className="cursor-pointer flex items-center gap-2 text-xs font-semibold text-slate-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors" title="Add Cover Image">
                         <span className="w-8 h-8 rounded-full border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm hover:border-blue-500 dark:hover:border-blue-400 transition-all active:scale-95">
                           <Plus size={16} />
                         </span>
                         Add cover photo
                         <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                       </label>
                     </div>
                     <div className="hidden sm:block absolute -left-12 top-2 opacity-0 group-hover:opacity-100 transition-all">
                         <label className="cursor-pointer w-10 h-10 rounded-full border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-gray-500 hover:border-blue-500 dark:hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 shadow-md transition-all active:scale-95" title="Add Cover Image">
                             <Plus size={20} />
                             <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                         </label>
                     </div>
                   </>
               )}
              
              <textarea
                 ref={titleRef}
                 placeholder="Title..."
                 rows={1}
                 className="w-full text-3xl sm:text-5xl lg:text-6xl font-serif font-black text-slate-900 dark:text-white placeholder:text-slate-200 dark:placeholder:text-slate-800 focus:outline-none bg-transparent resize-none leading-[1.1] tracking-tight transition-colors"
                 value={title}
                 onChange={(e) => setTitle(e.target.value)}
               />
            </div>

            <div className="mb-10 space-y-4">
              <div className="flex items-center gap-2 text-slate-400 dark:text-gray-500 text-sm font-bold uppercase tracking-wider">
                <Users size={16} />
                Team Members ({coAuthors.length}/3)
              </div>
              
              <div className="flex flex-wrap gap-2">
                {coAuthors.map((user) => (
                  <div key={user._id} className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-3 py-1.5 rounded-full text-sm font-medium animate-in fade-in zoom-in duration-200">
                    <div className="relative w-5 h-5 rounded-full overflow-hidden">
                      <Image src={user.image || '/default-avatar.png'} alt={user.name} fill className="object-cover" />
                    </div>
                    <span>{user.name}</span>
                    <button 
                      onClick={() => removeCoAuthor(user._id)}
                      className="hover:text-red-500 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
                
                {coAuthors.length < 3 && (
                  <div className="relative">
                    <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 px-3 py-1 rounded-full focus-within:border-blue-500 dark:focus-within:border-blue-400 transition-all shadow-sm">
                      <Search size={14} className="text-slate-400" />
                      <input 
                        type="text"
                        placeholder="Tag teammate (name or PRN)..."
                        className="bg-transparent border-none focus:outline-none text-sm py-1 w-48 transition-colors"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      {isSearching && <Loader2 size={12} className="animate-spin text-blue-500" />}
                    </div>

                    {searchResults.length > 0 && (
                      <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                        {searchResults.map((user) => (
                          <button
                            key={user._id}
                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors text-left"
                            onClick={() => addCoAuthor(user)}
                          >
                            <div className="relative w-8 h-8 rounded-full overflow-hidden">
                              <Image src={user.image || '/default-avatar.png'} alt={user.name} fill className="object-cover" />
                            </div>
                            <div className="min-w-0">
                               <p className="font-bold text-sm text-slate-900 dark:text-white truncate">{user.name}</p>
                               <p className="text-[10px] text-slate-500 font-mono">PRN: {user.prn}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {uploading && (
               <div className="text-xs text-blue-600 font-bold mb-8 animate-pulse flex items-center gap-2">
                  <Loader2 size={14} className="animate-spin"/> Uploading...
               </div>
            )}

             {coverImage && (
               <div className="relative w-full aspect-video mb-12 rounded-3xl overflow-hidden bg-slate-50 dark:bg-slate-800 group border border-slate-100 dark:border-white/10 shadow-sm transition-colors">
                 <Image src={coverImage} alt="Cover" fill className="object-cover" />
                <button 
                  onClick={() => setCoverImage('')}
                  className="absolute top-4 right-4 bg-slate-900/60 backdrop-blur-md text-white p-2.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-slate-900 flex items-center justify-center"
                  title="Remove Image"
                >
                  <X size={18} />
                </button>
              </div>
            )}

            <TiptapEditor content={content} onChange={setContent} />
         </div>
      </div>
    </div>
  );
};

export default BlogEditor;
