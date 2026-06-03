"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { useState } from "react";
import {
  Bold, Italic, Heading1, Heading2,
  List, ListOrdered, Code, Minus, Maximize2, Minimize2,
} from "lucide-react";

interface EditorProps {
  content: string;
  onChange: (html: string) => void;
}

function wordCount(html: string) {
  const text = html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  return text ? text.split(" ").length : 0;
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
        : "text-stone-500 hover:bg-stone-100 hover:text-stone-900 dark:text-stone-400 dark:hover:bg-stone-700 dark:hover:text-stone-100"
    }`}
  >
    {children}
  </button>
);

export default function Editor({ content, onChange }: EditorProps) {
  const [fullscreen, setFullscreen] = useState(false);
  const [words, setWords] = useState(() => wordCount(content));

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: "Start writing your post…" }),
    ],
    content,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
      setWords(wordCount(html));
    },
    immediatelyRender: false,
  });

  const readTime = Math.max(1, Math.ceil(words / 200));

  if (!editor) return null;

  const wrapperClass = fullscreen
    ? "fixed inset-0 z-50 flex flex-col bg-white dark:bg-stone-900 overflow-hidden"
    : "overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm focus-within:border-violet-300 focus-within:ring-2 focus-within:ring-violet-100 transition-all dark:border-stone-700 dark:bg-stone-900 dark:focus-within:border-violet-700";

  return (
    <div className={wrapperClass}>
      {/* Toolbar */}
      <div className="flex items-center gap-0.5 border-b border-stone-100 bg-stone-50 px-3 py-2 dark:border-stone-700 dark:bg-stone-800">
        <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")} title="Bold">
          <Bold size={14} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")} title="Italic">
          <Italic size={14} />
        </ToolbarButton>
        <div className="mx-1.5 h-5 w-px bg-stone-200 dark:bg-stone-700" />
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive("heading", { level: 1 })} title="Heading 1">
          <Heading1 size={15} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })} title="Heading 2">
          <Heading2 size={15} />
        </ToolbarButton>
        <div className="mx-1.5 h-5 w-px bg-stone-200 dark:bg-stone-700" />
        <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")} title="Bullet list">
          <List size={15} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")} title="Numbered list">
          <ListOrdered size={15} />
        </ToolbarButton>
        <div className="mx-1.5 h-5 w-px bg-stone-200 dark:bg-stone-700" />
        <ToolbarButton onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive("code")} title="Inline code">
          <Code size={14} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Divider" active={false}>
          <Minus size={14} />
        </ToolbarButton>

        {/* Spacer + fullscreen toggle */}
        <div className="ml-auto" />
        <ToolbarButton onClick={() => setFullscreen((f) => !f)} title={fullscreen ? "Exit fullscreen" : "Fullscreen"} active={false}>
          {fullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
        </ToolbarButton>
      </div>

      {/* Content */}
      <EditorContent
        editor={editor}
        className={`prose prose-stone max-w-none px-5 py-4 text-sm leading-relaxed dark:prose-invert focus:outline-none
          [&_.ProseMirror]:outline-none
          [&_.ProseMirror_h1]:text-xl [&_.ProseMirror_h1]:font-bold
          [&_.ProseMirror_h2]:text-lg [&_.ProseMirror_h2]:font-semibold
          [&_.ProseMirror_code]:rounded [&_.ProseMirror_code]:bg-stone-100 [&_.ProseMirror_code]:px-1 [&_.ProseMirror_code]:text-violet-700
          dark:[&_.ProseMirror_code]:bg-stone-800 dark:[&_.ProseMirror_code]:text-violet-400
          [&_.ProseMirror_blockquote]:border-l-4 [&_.ProseMirror_blockquote]:border-violet-300 [&_.ProseMirror_blockquote]:pl-4 [&_.ProseMirror_blockquote]:text-stone-500
          ${fullscreen ? "flex-1 overflow-y-auto [&_.ProseMirror]:min-h-full" : "[&_.ProseMirror]:min-h-[260px]"}`}
      />

      {/* Word count bar */}
      <div className="flex items-center gap-3 border-t border-stone-100 bg-stone-50 px-5 py-2 dark:border-stone-700 dark:bg-stone-800">
        <span className="text-xs text-stone-400">{words} {words === 1 ? "word" : "words"}</span>
        <span className="text-stone-300 dark:text-stone-600">·</span>
        <span className="text-xs text-stone-400">{readTime} min read</span>
      </div>
    </div>
  );
}
