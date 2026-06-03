"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowLeft, Tag, Check, Clock } from "lucide-react";

const Editor = dynamic(() => import("@/components/Editor"), { ssr: false });

type SaveStatus = "idle" | "saving" | "saved";

export default function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [id, setId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [loaded, setLoaded] = useState(false);
  const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    params.then(({ id }) => {
      setId(id);
      fetch(`/api/posts/${id}`)
        .then((r) => r.json())
        .then((post) => {
          setTitle(post.title);
          setContent(post.content);
          setTags(post.tags);
          setLoaded(true);
        });
    });
  }, [params]);

  // Auto-save draft to localStorage
  useEffect(() => {
    if (!loaded || !id) return;
    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    setSaveStatus("saving");
    autoSaveTimer.current = setTimeout(() => {
      localStorage.setItem(`blog_draft_${id}`, JSON.stringify({ title, content, tags }));
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2000);
    }, 1500);
    return () => { if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current); };
  }, [title, content, tags, loaded, id]);

  async function handleSave() {
    if (!title.trim() || !id) return;
    setSaving(true);
    await fetch(`/api/posts/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content, tags }),
    });
    localStorage.removeItem(`blog_draft_${id}`);
    router.push(`/posts/${id}`);
  }

  if (!id || !loaded) return null;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <Link
          href={`/posts/${id}`}
          className="inline-flex items-center gap-1.5 text-sm text-stone-400 transition-colors hover:text-stone-700 dark:hover:text-stone-200"
        >
          <ArrowLeft size={14} />
          Back to post
        </Link>

        <div className="flex h-6 items-center gap-1.5 text-xs text-stone-400">
          {saveStatus === "saving" && (
            <><Clock size={12} className="animate-pulse" /> Saving draft…</>
          )}
          {saveStatus === "saved" && (
            <><Check size={12} className="text-green-500" /><span className="text-green-500">Draft saved</span></>
          )}
        </div>
      </div>

      <h1 className="mb-6 text-3xl font-bold tracking-tight text-stone-900 dark:text-stone-100">Edit Post</h1>

      <div className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Give your post a title…"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-2xl border border-stone-200 bg-white px-5 py-3.5 text-xl font-semibold text-stone-900 shadow-sm outline-none placeholder:text-stone-300 focus:border-violet-300 focus:ring-2 focus:ring-violet-100 transition-all dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100 dark:placeholder:text-stone-600 dark:focus:border-violet-700"
        />

        <div className="relative">
          <Tag size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Add tags, comma-separated"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full rounded-2xl border border-stone-200 bg-white py-3 pl-10 pr-5 text-sm text-stone-700 shadow-sm outline-none placeholder:text-stone-300 focus:border-violet-300 focus:ring-2 focus:ring-violet-100 transition-all dark:border-stone-700 dark:bg-stone-900 dark:text-stone-300 dark:placeholder:text-stone-600 dark:focus:border-violet-700"
          />
        </div>

        <Editor content={content} onChange={setContent} />

        <div className="flex items-center justify-between pt-1">
          <button
            onClick={() => router.back()}
            className="rounded-xl border border-stone-200 bg-white px-5 py-2.5 text-sm font-medium text-stone-600 transition hover:bg-stone-50 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-400 dark:hover:bg-stone-800"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!title.trim() || saving}
            className="rounded-xl bg-violet-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-700 active:scale-95 disabled:opacity-40"
          >
            {saving ? "Saving…" : "Update Post"}
          </button>
        </div>
      </div>
    </div>
  );
}
