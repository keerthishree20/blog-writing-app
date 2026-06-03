"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowLeft, Tag } from "lucide-react";

const Editor = dynamic(() => import("@/components/Editor"), { ssr: false });

export default function NewPostPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!title.trim()) return;
    setSaving(true);
    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content, tags }),
    });
    const post = await res.json();
    router.push(`/posts/${post.id}`);
  }

  return (
    <div>
      {/* Back nav */}
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-stone-400 transition-colors hover:text-stone-700"
      >
        <ArrowLeft size={14} />
        All Posts
      </Link>

      <h1 className="mb-6 text-3xl font-bold tracking-tight text-stone-900">New Post</h1>

      <div className="flex flex-col gap-4">
        {/* Title */}
        <input
          type="text"
          placeholder="Give your post a title…"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-2xl border border-stone-200 bg-white px-5 py-3.5 text-xl font-semibold text-stone-900 shadow-sm outline-none placeholder:text-stone-300 focus:border-violet-300 focus:ring-2 focus:ring-violet-100 transition-all"
        />

        {/* Tags */}
        <div className="relative">
          <Tag size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Add tags, comma-separated (e.g. tech, life)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full rounded-2xl border border-stone-200 bg-white py-3 pl-10 pr-5 text-sm text-stone-700 shadow-sm outline-none placeholder:text-stone-300 focus:border-violet-300 focus:ring-2 focus:ring-violet-100 transition-all"
          />
        </div>

        {/* Editor */}
        <Editor content={content} onChange={setContent} />

        {/* Actions */}
        <div className="flex items-center justify-between pt-1">
          <button
            onClick={() => router.back()}
            className="rounded-xl border border-stone-200 bg-white px-5 py-2.5 text-sm font-medium text-stone-600 transition hover:bg-stone-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!title.trim() || saving}
            className="rounded-xl bg-violet-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-700 active:scale-95 disabled:opacity-40"
          >
            {saving ? "Saving…" : "Publish Post"}
          </button>
        </div>
      </div>
    </div>
  );
}
