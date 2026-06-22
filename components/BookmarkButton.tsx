"use client";

import { useState, useEffect } from "react";
import { Bookmark } from "lucide-react";

export default function BookmarkButton({ postId }: { postId: string }) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("bookmarked_posts");
    const bookmarks: string[] = stored ? JSON.parse(stored) : [];
    setSaved(bookmarks.includes(postId));
  }, [postId]);

  function toggle() {
    const stored = localStorage.getItem("bookmarked_posts");
    const bookmarks: string[] = stored ? JSON.parse(stored) : [];

    let updated: string[];
    if (bookmarks.includes(postId)) {
      updated = bookmarks.filter((id) => id !== postId);
      setSaved(false);
    } else {
      updated = [...bookmarks, postId];
      setSaved(true);
    }
    localStorage.setItem("bookmarked_posts", JSON.stringify(updated));
  }

  return (
    <button
      onClick={toggle}
      title={saved ? "Remove bookmark" : "Bookmark this post"}
      className={`flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium transition-all duration-200 ${
        saved
          ? "border-amber-200 bg-amber-50 text-amber-600 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-400"
          : "border-stone-200 bg-white text-stone-500 hover:border-amber-200 hover:bg-amber-50 hover:text-amber-600 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-400 dark:hover:border-amber-900 dark:hover:bg-amber-950 dark:hover:text-amber-400"
      }`}
    >
      <Bookmark size={15} fill={saved ? "currentColor" : "none"} />
      {saved ? "Saved" : "Bookmark"}
    </button>
  );
}
