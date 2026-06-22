"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Bookmark, Trash2 } from "lucide-react";
import Link from "next/link";
import { readingTime } from "@/lib/readingTime";

interface Post {
  id: string;
  title: string;
  tags: string;
  content: string;
  updatedAt: string;
  authorName: string | null;
  likes: number;
}

function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

export default function BookmarksPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("bookmarked_posts");
    const ids: string[] = stored ? JSON.parse(stored) : [];
    if (ids.length === 0) {
      setLoading(false);
      return;
    }

    Promise.all(
      ids.map((id) =>
        fetch(`/api/posts/${id}`)
          .then((r) => (r.ok ? r.json() : null))
          .catch(() => null)
      )
    ).then((results) => {
      setPosts(results.filter(Boolean));
      setLoading(false);
    });
  }, []);

  function removeBookmark(postId: string) {
    const stored = localStorage.getItem("bookmarked_posts");
    const ids: string[] = stored ? JSON.parse(stored) : [];
    localStorage.setItem("bookmarked_posts", JSON.stringify(ids.filter((id) => id !== postId)));
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  }

  return (
    <div>
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-stone-400 transition-colors hover:text-stone-700 dark:hover:text-stone-200"
      >
        <ArrowLeft size={14} />
        All Posts
      </Link>

      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-stone-900 dark:text-stone-100">Bookmarks</h1>
        <p className="mt-1 text-sm text-stone-400">Your saved posts</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-violet-600 border-t-transparent" />
        </div>
      ) : posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-stone-200 bg-white py-16 text-center dark:border-stone-700 dark:bg-stone-900">
          <Bookmark size={24} className="mb-3 text-stone-300" />
          <p className="text-base font-medium text-stone-600 dark:text-stone-300">No bookmarks yet</p>
          <p className="mt-1 text-sm text-stone-400">Click the bookmark button on any post to save it here.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {posts.map((post) => {
            const excerpt = stripHtml(post.content).slice(0, 120);
            const time = readingTime(post.content);
            return (
              <div
                key={post.id}
                className="group relative rounded-2xl border border-stone-200 bg-white p-5 shadow-sm transition-all hover:border-violet-200 hover:shadow-md dark:border-stone-700 dark:bg-stone-900 dark:hover:border-violet-800"
              >
                <Link href={`/posts/${post.id}`} className="block">
                  <h2 className="text-base font-semibold text-stone-900 transition-colors group-hover:text-violet-700 dark:text-stone-100 dark:group-hover:text-violet-400">
                    {post.title}
                  </h2>
                  {excerpt && (
                    <p className="mt-1.5 text-sm leading-relaxed text-stone-500 line-clamp-2 dark:text-stone-400">
                      {excerpt}
                    </p>
                  )}
                  <div className="mt-2 flex items-center gap-3 text-xs text-stone-400">
                    <span>{time}</span>
                    <span>·</span>
                    <span>{new Date(post.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                  </div>
                </Link>
                <button
                  onClick={() => removeBookmark(post.id)}
                  className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-lg border border-stone-200 bg-white text-stone-400 opacity-0 transition hover:border-red-200 hover:text-red-500 group-hover:opacity-100 dark:border-stone-700 dark:bg-stone-800 dark:hover:border-red-800 dark:hover:text-red-400"
                  title="Remove bookmark"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
