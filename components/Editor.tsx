"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold, Italic, Heading1, Heading2,
  List, ListOrdered, Code, Minus,
} from "lucide-react";

interface EditorProps {
  content: string;
  onChange: (html: string) => void;
}

const ToolbarButton = ({
  onClick, active, title, children,
}: {
  onClick: () => void;
  active?: boolean;
  title: string;
  children: React.ReactNode;
}) => (
  <button
    type="button"
    onClick={onClick}
    title={title}
    className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
      active
        ? "bg-violet-600 text-white"
        : "text-stone-500 hover:bg-stone-100 hover:text-stone-900"
    }`}
  >
    {children}
  </button>
);

export default function Editor({ content, onChange }: EditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: "Start writing your post…" }),
    ],
    content,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    immediatelyRender: false,
  });

  if (!editor) return null;

  return (
    <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm focus-within:border-violet-300 focus-within:ring-2 focus-within:ring-violet-100 transition-all">
      {/* Toolbar */}
      <div className="flex items-center gap-0.5 border-b border-stone-100 bg-stone-50 px-3 py-2">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
          title="Bold"
        >
          <Bold size={14} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
          title="Italic"
        >
          <Italic size={14} />
        </ToolbarButton>

        <div className="mx-1.5 h-5 w-px bg-stone-200" />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          active={editor.isActive("heading", { level: 1 })}
          title="Heading 1"
        >
          <Heading1 size={15} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive("heading", { level: 2 })}
          title="Heading 2"
        >
          <Heading2 size={15} />
        </ToolbarButton>

        <div className="mx-1.5 h-5 w-px bg-stone-200" />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList")}
          title="Bullet list"
        >
          <List size={15} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive("orderedList")}
          title="Numbered list"
        >
          <ListOrdered size={15} />
        </ToolbarButton>

        <div className="mx-1.5 h-5 w-px bg-stone-200" />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCode().run()}
          active={editor.isActive("code")}
          title="Inline code"
        >
          <Code size={14} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="Divider"
          active={false}
        >
          <Minus size={14} />
        </ToolbarButton>
      </div>

      {/* Content area */}
      <EditorContent
        editor={editor}
        className="prose prose-stone max-w-none px-5 py-4 text-sm leading-relaxed focus:outline-none
          [&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-[260px]
          [&_.ProseMirror_h1]:text-xl [&_.ProseMirror_h1]:font-bold [&_.ProseMirror_h1]:text-stone-900
          [&_.ProseMirror_h2]:text-lg [&_.ProseMirror_h2]:font-semibold [&_.ProseMirror_h2]:text-stone-900
          [&_.ProseMirror_code]:rounded [&_.ProseMirror_code]:bg-stone-100 [&_.ProseMirror_code]:px-1 [&_.ProseMirror_code]:text-violet-700
          [&_.ProseMirror_blockquote]:border-l-4 [&_.ProseMirror_blockquote]:border-violet-300 [&_.ProseMirror_blockquote]:pl-4 [&_.ProseMirror_blockquote]:text-stone-500"
      />
    </div>
  );
}
