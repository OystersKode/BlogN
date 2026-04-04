'use client';

import { useState, useRef, useEffect } from 'react';
import TiptapEditor from '@/components/editor/TiptapEditor';
import { createBlog } from '@/app/actions/blog';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Loader2, Plus, X, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import Navbar from '@/components/layout/Navbar';

const EditorPage = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState<any>(null);
  const [coverImage, setCoverImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

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
        const res = await fetch('/api/upload', {
          method: 'POST',
          body: JSON.stringify({ image: base64 }),
          headers: { 'Content-Type': 'application/json' },
        });
        const data = await res.json();
        if (data.url) setCoverImage(data.url);
        setUploading(false);
      };
    }
  };

  const handlePublish = async (status: 'DRAFT' | 'PUBLISHED') => {
    if (!title || !content) return alert('Please add title and content');
    
    setLoading(true);
    try {
      // Deep clone content to break React 19's client-side proxies/transitions ($T error fix)
      const plainContent = JSON.parse(JSON.stringify(content));
      const res = await createBlog({ title, content: plainContent, coverImage, status });
      router.push(`/blog/${res.slug}`);
    } catch (error) {
      console.error(error);
      alert('Error publishing blog');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F4F1] dark:bg-zinc-950 flex flex-col transition-all">
      <Navbar />

      {/* Editor Action Bar */}
      <div className="sticky top-[73px] z-40 bg-white dark:bg-zinc-900 border-b-[4px] border-black dark:border-white px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between transition-all">
         <div className="flex items-center gap-4">
            <Button 
               variant="ghost" 
               onClick={() => router.back()} 
               className="text-black dark:text-white border-[2px] border-black dark:border-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all text-xs font-black uppercase"
            >
              <ArrowLeft size={16} strokeWidth={3} /><span className="hidden sm:inline ml-2">Back</span>
            </Button>
            <div className="hidden sm:block h-6 w-[2px] bg-black dark:bg-white mx-2"></div>
            <span className="text-[10px] sm:text-[12px] font-black tracking-widest text-black dark:text-white uppercase px-2 py-1 bg-primary border-[2px] border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">Draft Mode</span>
         </div>
          <div className="flex items-center gap-4">
             <button 
                 className="text-black dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 font-black uppercase tracking-widest h-10 px-4 text-xs transition-all border-[2px] border-transparent hover:border-black active:scale-95"
                 onClick={() => handlePublish('DRAFT')} 
                 disabled={loading}
             >
               Save
             </button>
              <Button 
                 onClick={() => handlePublish('PUBLISHED')} 
                 disabled={loading}
                 className="bg-secondary text-black border-[3px] border-black shadow-neo-sm hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all text-xs font-black uppercase tracking-widest h-10 px-8"
             >
               {loading ? <Loader2 className="animate-spin h-4 w-4" /> : 'Publish Now'}
              </Button>
         </div>
      </div>

       {/* Writing Canvas Environment */}
       <div className="flex-1 w-full max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-zinc-900 border-[5px] border-black dark:border-white shadow-neo-xl p-8 sm:p-20 min-h-[900px] relative transition-all">
            
            <div className="group relative mb-12">
               {!coverImage && (
                   <div className="mb-6">
                       <label className="cursor-pointer inline-flex items-center gap-3 bg-white dark:bg-zinc-800 px-4 py-2 border-[3px] border-black dark:border-white shadow-neo-sm hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all" title="Add Cover Image">
                         <Plus size={20} className="text-black dark:text-white" strokeWidth={3} />
                         <span className="text-xs font-black uppercase text-black dark:text-white">Add cover photo</span>
                         <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                       </label>
                   </div>
               )}
              
              <textarea
                 ref={titleRef}
                 placeholder="TYPE YOUR BOLD TITLE..."
                 rows={1}
                 className="w-full text-4xl sm:text-6xl lg:text-7xl font-serif font-black text-black dark:text-white placeholder:text-zinc-200 dark:placeholder:text-zinc-800 focus:outline-none bg-transparent resize-none leading-[0.9] tracking-tighter uppercase mb-8 transition-all"
                 value={title}
                 onChange={(e) => setTitle(e.target.value)}
               />
            </div>

            {uploading && (
               <div className="text-xs text-secondary font-black uppercase tracking-widest mb-10 animate-pulse flex items-center gap-3 bg-black text-white px-4 py-2 w-fit">
                  <Loader2 size={16} className="animate-spin" strokeWidth={3}/> Uploading visual...
               </div>
            )}

             {coverImage && (
               <div className="relative w-full aspect-video mb-16 border-[5px] border-black dark:border-white shadow-neo group bg-black overflow-hidden">
                 <Image src={coverImage} alt="Cover" fill className="object-cover grayscale hover:grayscale-0 transition-all duration-500" />
                <button 
                  onClick={() => setCoverImage('')}
                  className="absolute top-6 right-6 bg-accent text-white p-3 border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] opacity-0 group-hover:opacity-100 transition-all hover:shadow-none hover:translate-x-1 hover:translate-y-1 flex items-center justify-center font-black"
                  title="Remove Image"
                >
                  <X size={20} strokeWidth={3} />
                </button>
              </div>
            )}

            <div className="prose-neo-writing">
               <TiptapEditor content={content} onChange={setContent} />
            </div>
         </div>
      </div>
    </div>
  );
};

export default EditorPage;
