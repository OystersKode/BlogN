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
    <div className="min-h-screen bg-[#f8fafc] dark:bg-slate-950 flex flex-col selection:bg-blue-100 selection:text-slate-900 transition-colors">
      <Navbar />

      {/* Editor Action Bar */}
      <div className="sticky top-[64px] z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-white/10 px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between shadow-sm transition-colors">
         <div className="flex items-center gap-2 sm:gap-4">
            <Button variant="ghost" onClick={() => router.back()} className="text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hidden sm:flex h-8 px-2 transition-colors">
              <ArrowLeft size={18} className="mr-2"/> Back
            </Button>
            <div className="hidden sm:block h-4 w-px bg-slate-300 dark:bg-white/10 mx-1 transition-colors"></div>
            <span className="text-[12px] font-bold tracking-widest text-slate-400 dark:text-gray-500 uppercase transition-colors">Draft Status</span>
         </div>
          <div className="flex items-center gap-2 sm:gap-3 transition-colors">
             <button 
                 className="text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full font-medium h-9 px-4 transition-colors"
                 onClick={() => handlePublish('DRAFT')} 
                 disabled={loading}
             >
               Save Draft
             </button>
              <Button 
                 onClick={() => handlePublish('PUBLISHED')} 
                 disabled={loading}
                 className="bg-blue-600 hover:bg-blue-700 text-white dark:text-white rounded-full h-9 px-6 font-bold shadow-md hover:shadow-lg transition-all"
             >
               {loading ? <Loader2 className="animate-spin h-4 w-4" /> : 'Publish Now'}
             </Button>
         </div>
      </div>

       {/* Writing Canvas Environment */}
       <div className="flex-1 w-full max-w-4xl mx-auto py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-slate-100 dark:border-white/10 p-6 sm:p-12 min-h-[700px] relative transition-colors">
            
            <div className="group relative mb-8">
              {/* Cover Image Uploader */}
               {!coverImage && (
                   <div className="absolute -left-4 sm:-left-12 top-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                       <label className="cursor-pointer w-8 h-8 rounded-full border border-slate-300 dark:border-white/20 bg-white dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-gray-500 hover:border-slate-800 dark:hover:border-white hover:text-slate-800 dark:hover:text-white shadow-sm transition-all" title="Add Cover Image">
                           <Plus size={18} />
                           <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                       </label>
                   </div>
               )}
              
              <textarea
                 ref={titleRef}
                 placeholder="Story Title..."
                 rows={1}
                 className="w-full text-4xl sm:text-5xl lg:text-6xl font-serif font-medium text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-gray-700 focus:outline-none bg-transparent resize-none leading-tight tracking-tight transition-colors"
                 value={title}
                 onChange={(e) => setTitle(e.target.value)}
               />
            </div>

            {uploading && (
               <div className="text-sm text-blue-600 font-bold mb-8 animate-pulse flex items-center gap-2">
                  <Loader2 size={16} className="animate-spin"/> Uploading cover image...
               </div>
            )}

             {coverImage && (
               <div className="relative w-full aspect-video mb-12 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-800 group border border-slate-100 dark:border-white/10 shadow-sm transition-colors">
                 <Image src={coverImage} alt="Cover" fill className="object-cover" />
                <button 
                  onClick={() => setCoverImage('')}
                  className="absolute top-4 right-4 bg-slate-900/60 backdrop-blur-sm text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-slate-900 flex items-center justify-center"
                  title="Remove Image"
                >
                  <X size={16} />
                </button>
              </div>
            )}

            <TiptapEditor content={content} onChange={setContent} />
         </div>
      </div>
    </div>
  );
};

export default EditorPage;
