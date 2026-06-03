"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";

interface EditorProps {
  content: string;
  onChange: (html: string) => void;
}

export default function Editor({ content, onChange }: EditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: "Start writing your post..." }),
    ],
    content,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    immediatelyRender: false,
  });

  return (
    <div className="min-h-[300px] rounded-lg border border-gray-200 bg-white p-4 focus-within:ring-2 focus-within:ring-indigo-500">
      {editor && (
        <div className="mb-2 flex flex-wrap gap-1 border-b border-gray-100 pb-2">
          {(
            [
              { label: "B", action: () => editor.chain().focus().toggleBold().run(), active: editor.isActive("bold") },
              { label: "I", action: () => editor.chain().focus().toggleItalic().run(), active: editor.isActive("italic") },
              { label: "H1", action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(), active: editor.isActive("heading", { level: 1 }) },
              { label: "H2", action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), active: editor.isActive("heading", { level: 2 }) },
              { label: "• List", action: () => editor.chain().focus().toggleBulletList().run(), active: editor.isActive("bulletList") },
              { label: "1. List", action: () => editor.chain().focus().toggleOrderedList().run(), active: editor.isActive("orderedList") },
              { label: "Code", action: () => editor.chain().focus().toggleCode().run(), active: editor.isActive("code") },
            ] as const
          ).map(({ label, action, active }) => (
            <button
              key={label}
              type="button"
              onClick={action}
              className={`rounded px-2 py-0.5 text-sm font-medium transition-colors ${
                active ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      )}
      <EditorContent
        editor={editor}
        className="prose prose-sm max-w-none focus:outline-none [&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-[200px]"
      />
    </div>
  );
}
