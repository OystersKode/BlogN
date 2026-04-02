'use client';

import { useState, useRef, useEffect } from 'react';
import TiptapEditor from '@/components/editor/TiptapEditor';
import { createBlog } from '@/app/actions/blog';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Loader2, Plus, Image as ImageIcon, X } from 'lucide-react';
import Image from 'next/image';

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
      const res = await createBlog({ title, content, coverImage, status });
      router.push(`/blog/${res.slug}`);
    } catch (error) {
      console.error(error);
      alert('Error publishing blog');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Sticky Action Bar */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 flex justify-between items-center px-4 sm:px-6 lg:px-8 h-16">
         <div className="flex items-center gap-4">
            <span className="text-sm font-semibold text-gray-500">Draft</span>
         </div>
         <div className="flex items-center gap-3">
             <Button 
                 variant="ghost" 
                 className="text-gray-600 hover:text-gray-900 rounded-full font-medium"
                 onClick={() => handlePublish('DRAFT')} 
                 disabled={loading}
             >
               Save
             </Button>
             <Button 
                 onClick={() => handlePublish('PUBLISHED')} 
                 disabled={loading}
                 className="bg-green-600 hover:bg-green-700 text-white rounded-full px-6 font-bold shadow-sm transition-all"
             >
               {loading ? <Loader2 className="animate-spin h-4 w-4" /> : 'Publish'}
             </Button>
         </div>
      </div>

      <div className="max-w-3xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="group relative mb-8">
            {/* Title Line Add Image Button */}
            {!coverImage && (
                <div className="absolute -left-12 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <label className="cursor-pointer w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-400 hover:border-gray-800 hover:text-gray-800 transition-colors">
                        <Plus size={18} />
                        <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                    </label>
                </div>
            )}
            
            <textarea
              ref={titleRef}
              placeholder="Title"
              rows={1}
              className="w-full text-5xl sm:text-6xl font-serif text-gray-900 placeholder:text-gray-300 focus:outline-none bg-transparent resize-none leading-tight"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {uploading && (
             <div className="text-sm text-gray-400 font-medium mb-8 animate-pulse">Uploading cover image...</div>
          )}

          {coverImage && (
            <div className="relative w-full aspect-video mb-12 rounded-xl overflow-hidden bg-gray-50 group">
              <Image src={coverImage} alt="Cover" fill className="object-cover" />
              <button 
                onClick={() => setCoverImage('')}
                className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80"
              >
                <X size={16} />
              </button>
            </div>
          )}

          <TiptapEditor content={content} onChange={setContent} />
      </div>
    </div>
  );
};

export default EditorPage;
