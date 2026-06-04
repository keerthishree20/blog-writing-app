"use client";

import Link from "next/link";
import { Pencil, Trash2, Clock, User, Heart } from "lucide-react";
import { useRouter } from "next/navigation";

interface PostCardProps {
  id: string;
  title: string;
  tags: string;
  content: string;
  updatedAt: string;
  authorName?: string | null;
  likes?: number;
  isOwner?: boolean;
}

function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

export default function PostCard({ id, title, tags, content, updatedAt, authorName, likes = 0, isOwner }: PostCardProps) {
  const router = useRouter();
  const tagList = tags ? tags.split(",").map((t) => t.trim()).filter(Boolean) : [];
  const excerpt = stripHtml(content).slice(0, 120);

  async function handleDelete() {
    if (!confirm("Delete this post?")) return;
    await fetch(`/api/posts/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="group relative rounded-2xl border border-stone-200 bg-white p-5 shadow-sm transition-all duration-200 hover:border-violet-200 hover:shadow-md dark:border-stone-700 dark:bg-stone-900 dark:hover:border-violet-800">
      {/* Main clickable area */}
      <Link href={`/posts/${id}`} className="block">
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-base font-semibold text-stone-900 transition-colors group-hover:text-violet-700 dark:text-stone-100 dark:group-hover:text-violet-400">
            {title}
          </h2>
          <div className="flex shrink-0 items-center gap-2">
            {likes > 0 && (
              <span className="flex items-center gap-1 text-xs text-red-400">
                <Heart size={11} fill="currentColor" />
                {likes}
              </span>
            )}
            <span className="flex items-center gap-1 text-xs text-stone-400">
              <Clock size={11} />
              {new Date(updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </span>
          </div>
        </div>
        {excerpt && (
          <p className="mt-1.5 text-sm leading-relaxed text-stone-500 line-clamp-2 dark:text-stone-400">{excerpt}</p>
        )}
      </Link>

      {/* Author link */}
      {authorName && (
        <Link
          href={`/author/${encodeURIComponent(authorName)}`}
          className="mt-2 inline-flex items-center gap-1 text-xs text-stone-400 transition-colors hover:text-violet-600 dark:hover:text-violet-400"
        >
          <User size={11} />
          <span>{authorName}</span>
        </Link>
      )}

      {/* Tag links */}
      {tagList.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {tagList.map((tag) => (
            <Link
              key={tag}
              href={`/?tag=${encodeURIComponent(tag)}`}
              className="rounded-full bg-violet-50 px-2.5 py-0.5 text-xs font-medium text-violet-600 transition-colors hover:bg-violet-100 dark:bg-violet-950 dark:text-violet-400 dark:hover:bg-violet-900"
            >
              #{tag}
            </Link>
          ))}
        </div>
      )}

      {isOwner && (
        <div className="absolute right-4 top-4 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <Link
            href={`/posts/${id}/edit`}
            onClick={(e) => e.stopPropagation()}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-stone-200 bg-white text-stone-400 transition hover:border-violet-200 hover:text-violet-600 dark:border-stone-700 dark:bg-stone-800 dark:hover:border-violet-700 dark:hover:text-violet-400"
          >
            <Pencil size={13} />
          </Link>
          <button
            onClick={handleDelete}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-stone-200 bg-white text-stone-400 transition hover:border-red-200 hover:text-red-500 dark:border-stone-700 dark:bg-stone-800 dark:hover:border-red-800 dark:hover:text-red-400"
          >
            <Trash2 size={13} />
          </button>
        </div>
      )}
    </div>
  );
}
