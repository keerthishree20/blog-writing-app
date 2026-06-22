"use client";

import { useEffect, useState } from "react";
import { Eye } from "lucide-react";

export default function ViewCounter({ postId, initialViews }: { postId: string; initialViews: number }) {
  const [views, setViews] = useState(initialViews);

  useEffect(() => {
    const key = `viewed_${postId}`;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");
    fetch(`/api/posts/${postId}/view`, { method: "POST" })
      .then((r) => r.json())
      .then((d) => setViews(d.views))
      .catch(() => {});
  }, [postId]);

  return (
    <span className="flex items-center gap-1.5 text-xs text-stone-400">
      <Eye size={12} />
      {views} view{views !== 1 ? "s" : ""}
    </span>
  );
}
