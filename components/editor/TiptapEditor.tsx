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

  const Button = ({ onClick, isActive, children, title }: { onClick: () => void, isActive?: boolean, children: React.ReactNode, title?: string }) => (
    <button
      onClick={onClick}
      title={title}
      className={`p-2 border-[2px] transition-all flex items-center justify-center ${
        isActive 
          ? 'bg-secondary text-black shadow-none translate-x-[2px] translate-y-[2px] border-black' 
          : 'bg-white dark:bg-zinc-800 text-zinc-500 hover:text-black dark:hover:text-white border-black dark:border-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]'
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="flex flex-wrap gap-2 mb-10 sticky top-[137px] z-40 bg-[#F4F4F1]/95 dark:bg-zinc-950/95 backdrop-blur-sm py-4 transition-all">
      <Button onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')}>
        <Bold size={18} strokeWidth={3} />
      </Button>
      <Button onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')}>
        <Italic size={18} strokeWidth={3} />
      </Button>
      <Button onClick={() => editor.chain().focus().toggleUnderline().run()} isActive={editor.isActive('underline')}>
        <UnderlineIcon size={18} strokeWidth={3} />
      </Button>
      
      <div className="w-[3px] h-8 bg-black dark:bg-white mx-1 self-center"></div>

      <Button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} isActive={editor.isActive('heading', { level: 1 })}>
        <Heading1 size={18} strokeWidth={3} />
      </Button>
      <Button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} isActive={editor.isActive('heading', { level: 2 })}>
        <Heading2 size={18} strokeWidth={3} />
      </Button>

      <div className="w-[3px] h-8 bg-black dark:bg-white mx-1 self-center"></div>

      <Button onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')}>
        <List size={18} strokeWidth={3} />
      </Button>
      <Button onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive('orderedList')}>
        <ListOrdered size={18} strokeWidth={3} />
      </Button>
      <Button onClick={() => editor.chain().focus().toggleBlockquote().run()} isActive={editor.isActive('blockquote')}>
        <Quote size={18} strokeWidth={3} />
      </Button>
      <Button onClick={() => editor.chain().focus().toggleCodeBlock().run()} isActive={editor.isActive('codeBlock')}>
        <Code size={18} strokeWidth={3} />
      </Button>

      <div className="w-[3px] h-8 bg-black dark:bg-white mx-1 self-center"></div>

      <Button onClick={addImage} title="Add Image">
        <ImageIcon size={18} strokeWidth={3} />
      </Button>

      {editor.isActive('image') && (
        <div className="flex items-center gap-1 bg-white dark:bg-zinc-800 border-[2px] border-black p-1 shadow-neo-sm ml-2">
          {['25%', '50%', '100%'].map(size => (
              <button
                key={size}
                onClick={() => editor.chain().focus().updateAttributes('image', { width: size }).run()}
                className="text-[10px] font-black px-3 py-1 hover:bg-primary transition-all border-[1px] border-transparent hover:border-black"
              >
                {size === '25%' ? 'S' : size === '50%' ? 'M' : 'L'}
              </button>
          ))}
        </div>
      )}
    </div>
  );
};

const ResizableImage = Image.extend({
  name: 'image',
  addAttributes() {
    return {
      src: { default: null },
      alt: { default: null },
      title: { default: null },
      width: {
        default: '100%',
        renderHTML: (attributes) => ({
          style: `width: ${attributes.width}; height: auto; cursor: pointer; border: 4px solid black; transition: width 0.2s ease-in-out; margin: 2rem 0;`,
        }),
      },
    };
  },
});

const extensions = [
  StarterKit,
  ResizableImage,
  Underline,
  Placeholder.configure({ placeholder: 'COMMENCE ANALYTICAL LOGGING...' }),
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
            class: 'prose-neo-writing font-bold max-w-none focus:outline-none min-h-[50vh] text-black dark:text-white leading-tight tracking-tight uppercase',
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
