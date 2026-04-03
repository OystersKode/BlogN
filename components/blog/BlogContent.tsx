'use client';

import { useEditor, EditorContent, mergeAttributes } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEffect } from 'react';
import Image from '@tiptap/extension-image';

const ResizableImage = Image.extend({
  name: 'image',
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
          style: `width: ${attributes.width}; height: auto;`,
        }),
      },
    };
  },
});

const extensions = [
  StarterKit,
  ResizableImage,
];

const BlogContent = ({ content }: { content: any }) => {
  const editor = useEditor({
    immediatelyRender: false,
    extensions,
    content,
    editable: false, 
    editorProps: {
        attributes: {
            class: 'prose prose-lg md:prose-xl max-w-none focus:outline-none focus:ring-0 text-slate-900 dark:text-gray-100 dark:prose-invert font-serif leading-[1.8] transition-colors',
        },
    },
  });

  useEffect(() => {
    if (editor && content) {
      console.log('Rendering Blog Content:', JSON.stringify(content, null, 2));
      editor.commands.setContent(content);
    }
  }, [editor, content]);

  if (!editor) return null;

  return (
    <div className="blog-content-tiptap">
      <EditorContent editor={editor} />
    </div>
  );
};

export default BlogContent;
