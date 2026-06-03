"use client";

import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface PostCardProps {
  id: string;
  title: string;
  tags: string;
  updatedAt: string;
}

export default function PostCard({ id, title, tags, updatedAt }: PostCardProps) {
  const router = useRouter();
  const tagList = tags ? tags.split(",").map((t) => t.trim()).filter(Boolean) : [];

  async function handleDelete() {
    if (!confirm("Delete this post?")) return;
    await fetch(`/api/posts/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="group flex items-start justify-between rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md">
      <Link href={`/posts/${id}`} className="flex-1 min-w-0">
        <h2 className="truncate text-base font-semibold text-gray-900 group-hover:text-indigo-600">
          {title}
        </h2>
        <p className="mt-1 text-xs text-gray-400">
          {new Date(updatedAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
        </p>
        {tagList.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {tagList.map((tag) => (
              <span key={tag} className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs text-indigo-600">
                {tag}
              </span>
            ))}
          </div>
        )}
      </Link>
      <div className="ml-4 flex shrink-0 gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Link
          href={`/posts/${id}/edit`}
          className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-indigo-600"
        >
          <Pencil size={15} />
        </Link>
        <button
          onClick={handleDelete}
          className="rounded p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
}
