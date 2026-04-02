'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';

const extensions = [
  StarterKit,
  Underline,
  Link.configure({ openOnClick: true }),
  Image,
];

const BlogContent = ({ content }: { content: any }) => {
  const editor = useEditor({
    immediatelyRender: false,
    extensions,
    content,
    editable: false, // Make it read-only
    editorProps: {
        attributes: {
            class: 'prose prose-lg md:prose-xl max-w-none focus:outline-none focus:ring-0 text-slate-900 font-serif leading-relaxed',
        },
    },
  });

  if (!editor) return null;

  return (
    <EditorContent editor={editor} />
  );
};

export default BlogContent;
