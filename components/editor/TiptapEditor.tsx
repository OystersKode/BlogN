'use client';

import { useEditor, EditorContent } from '@tiptap/react';
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
          }
        };
      }
    };
    input.click();
  };

  return (
    <div className="flex flex-wrap gap-1 p-1 mb-8 sticky top-[64px] z-40 bg-white/95 backdrop-blur-sm border-b border-gray-100 text-gray-400">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-1.5 rounded transition-colors ${editor.isActive('bold') ? 'text-gray-900 bg-gray-100' : 'hover:text-gray-900 hover:bg-gray-50'}`}
      >
        <Bold size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-1.5 rounded transition-colors ${editor.isActive('italic') ? 'text-gray-900 bg-gray-100' : 'hover:text-gray-900 hover:bg-gray-50'}`}
      >
        <Italic size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={`p-1.5 rounded transition-colors ${editor.isActive('underline') ? 'text-gray-900 bg-gray-100' : 'hover:text-gray-900 hover:bg-gray-50'}`}
      >
        <UnderlineIcon size={18} />
      </button>
      <div className="w-[1px] h-6 bg-gray-200 mx-2 self-center" />
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`p-1.5 rounded transition-colors ${editor.isActive('heading', { level: 1 }) ? 'text-gray-900 bg-gray-100' : 'hover:text-gray-900 hover:bg-gray-50'}`}
      >
        <Heading1 size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`p-1.5 rounded transition-colors ${editor.isActive('heading', { level: 2 }) ? 'text-gray-900 bg-gray-100' : 'hover:text-gray-900 hover:bg-gray-50'}`}
      >
        <Heading2 size={18} />
      </button>
      <div className="w-[1px] h-6 bg-gray-200 mx-2 self-center" />
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-1.5 rounded transition-colors ${editor.isActive('bulletList') ? 'text-gray-900 bg-gray-100' : 'hover:text-gray-900 hover:bg-gray-50'}`}
      >
        <List size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-1.5 rounded transition-colors ${editor.isActive('orderedList') ? 'text-gray-900 bg-gray-100' : 'hover:text-gray-900 hover:bg-gray-50'}`}
      >
        <ListOrdered size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`p-1.5 rounded transition-colors ${editor.isActive('blockquote') ? 'text-gray-900 bg-gray-100' : 'hover:text-gray-900 hover:bg-gray-50'}`}
      >
        <Quote size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={`p-1.5 rounded transition-colors ${editor.isActive('codeBlock') ? 'text-gray-900 bg-gray-100' : 'hover:text-gray-900 hover:bg-gray-50'}`}
      >
        <Code size={18} />
      </button>
      <div className="w-[1px] h-6 bg-gray-200 mx-2 self-center" />
      <button
        onClick={addImage}
        className="p-1.5 rounded hover:text-gray-900 hover:bg-gray-50 transition-colors"
      >
        <ImageIcon size={18} />
      </button>
    </div>
  );
};

const extensions = [
  StarterKit,
  Underline,
  Link.configure({ openOnClick: false }),
  Image,
  Placeholder.configure({ placeholder: 'Tell your story...' }),
];

const TiptapEditor = ({ content, onChange }: { content: any, onChange: (val: any) => void }) => {
  const editor = useEditor({
    immediatelyRender: false,
    extensions,
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getJSON());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-lg md:prose-xl font-serif max-w-none focus:outline-none min-h-[50vh] text-gray-800 leading-relaxed',
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
