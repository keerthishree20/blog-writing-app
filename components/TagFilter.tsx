"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

export default function TagFilter({ tags, activeTag }: { tags: string[]; activeTag: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  function handleTag(tag: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (tag === activeTag) {
      params.delete("tag");
    } else {
      params.set("tag", tag);
    }
    startTransition(() => router.replace(`/?${params.toString()}`));
  }

  if (tags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <button
          key={tag}
          onClick={() => handleTag(tag)}
          className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
            tag === activeTag
              ? "bg-violet-600 text-white shadow-sm"
              : "bg-violet-50 text-violet-600 hover:bg-violet-100 dark:bg-violet-950 dark:text-violet-400 dark:hover:bg-violet-900"
          }`}
        >
          #{tag}
        </button>
      ))}
    </div>
  );
}
