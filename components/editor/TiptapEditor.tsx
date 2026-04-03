'use client';

import { useEditor, EditorContent, mergeAttributes } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import { Bold, Italic, Underline as UnderlineIcon, Link as LinkIcon, Image as ImageIcon, Heading1, Heading2, List, ListOrdered, Quote, Code } from 'lucide-react';

const Toolbar = ({ editor }: { editor: any }) => {
  if (!editor) return null;

  const addImage = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e: any) => {
      const file = e.target.files[0];
      if (file) {
        if (file.size > 300 * 1024) {
            alert("Image must be smaller than 300KB to save database space.");
            return;
        }
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
          if (data.url) {
            editor.chain().focus().setImage({ src: data.url }).run();
          } else {
            alert("Upload failed: " + (data.error || "Unknown error"));
          }
        };
      }
    };
    input.click();
  };

  return (
    <div className="flex flex-wrap gap-1 p-1 mb-8 sticky top-[120px] z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-b border-gray-100 dark:border-white/10 text-gray-400">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-2 rounded transition-colors ${editor.isActive('bold') ? 'text-gray-900 dark:text-white bg-gray-100 dark:bg-slate-800' : 'hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-slate-800'}`}
      >
        <Bold size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-2 rounded transition-colors ${editor.isActive('italic') ? 'text-gray-900 dark:text-white bg-gray-100 dark:bg-slate-800' : 'hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-slate-800'}`}
      >
        <Italic size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={`p-2 rounded transition-colors ${editor.isActive('underline') ? 'text-gray-900 dark:text-white bg-gray-100 dark:bg-slate-800' : 'hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-slate-800'}`}
      >
        <UnderlineIcon size={18} />
      </button>
      <div className="w-[1px] h-6 bg-gray-200 dark:bg-white/10 mx-2 self-center" />
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`p-2 rounded transition-colors ${editor.isActive('heading', { level: 1 }) ? 'text-gray-900 dark:text-white bg-gray-100 dark:bg-slate-800' : 'hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-slate-800'}`}
      >
        <Heading1 size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`p-2 rounded transition-colors ${editor.isActive('heading', { level: 2 }) ? 'text-gray-900 dark:text-white bg-gray-100 dark:bg-slate-800' : 'hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-slate-800'}`}
      >
        <Heading2 size={18} />
      </button>
      <div className="w-[1px] h-6 bg-gray-200 dark:bg-white/10 mx-2 self-center" />
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-2 rounded transition-colors ${editor.isActive('bulletList') ? 'text-gray-900 dark:text-white bg-gray-100 dark:bg-slate-800' : 'hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-slate-800'}`}
      >
        <List size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-2 rounded transition-colors ${editor.isActive('orderedList') ? 'text-gray-900 dark:text-white bg-gray-100 dark:bg-slate-800' : 'hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-slate-800'}`}
      >
        <ListOrdered size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`p-2 rounded transition-colors ${editor.isActive('blockquote') ? 'text-gray-900 dark:text-white bg-gray-100 dark:bg-slate-800' : 'hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-slate-800'}`}
      >
        <Quote size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={`p-2 rounded transition-colors ${editor.isActive('codeBlock') ? 'text-gray-900 dark:text-white bg-gray-100 dark:bg-slate-800' : 'hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-slate-800'}`}
      >
        <Code size={18} />
      </button>
      <div className="w-[1px] h-6 bg-gray-200 dark:bg-white/10 mx-2 self-center" />
      <button
        onClick={addImage}
        className="p-2 rounded hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
      >
      <ImageIcon size={18} />
      </button>

      {editor.isActive('image') && (
        <div className="flex items-center gap-1 bg-gray-50 dark:bg-slate-800 rounded-md px-2 ml-2 transition-colors">
          <button
            onClick={() => editor.chain().focus().updateAttributes('image', { width: '25%' }).run()}
            className="text-[12px] font-black px-3 py-1 hover:text-blue-500 transition-colors"
          >
            S
          </button>
          <button
            onClick={() => editor.chain().focus().updateAttributes('image', { width: '50%' }).run()}
            className="text-[12px] font-black px-3 py-1 hover:text-blue-500 transition-colors"
          >
            M
          </button>
          <button
            onClick={() => editor.chain().focus().updateAttributes('image', { width: '100%' }).run()}
            className="text-[12px] font-black px-3 py-1 hover:text-blue-500 transition-colors"
          >
            L
          </button>
        </div>
      )}
    </div>
  );
};

const ResizableImage = Image.extend({
  name: 'image', // Keep the canonical name for command compatibility
  addAttributes() {
    return {
      src: {
        default: null,
      },
      alt: {
        default: null,
      },
      title: {
        default: null,
      },
      width: {
        default: '100%',
        renderHTML: (attributes) => ({
          style: `width: ${attributes.width}; height: auto; cursor: pointer; transition: width 0.2s ease-in-out;`,
        }),
      },
    };
  },
});

const extensions = [
  StarterKit,
  ResizableImage,
  Placeholder.configure({ placeholder: 'Tell your story...' }),
];

const TiptapEditor = ({ content, onChange }: { content: any, onChange: (val: any) => void }) => {
  const editor = useEditor({
    immediatelyRender: false,
    extensions,
    content,
    onUpdate: ({ editor }) => {
      const json = editor.getJSON();
      onChange(json);
    },
    editorProps: {
        attributes: {
            class: 'prose prose-base sm:prose-lg md:prose-xl font-serif max-w-none focus:outline-none min-h-[50vh] text-gray-800 dark:text-gray-200 leading-[1.8] tracking-normal',
        },
    },
  });

  return (
    <div className="w-full">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};

export default TiptapEditor;
