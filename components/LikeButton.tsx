"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";

export default function LikeButton({ postId, initialLikes }: { postId: string; initialLikes: number }) {
  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(false);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("liked_posts");
    const likedPosts: string[] = stored ? JSON.parse(stored) : [];
    setLiked(likedPosts.includes(postId));
  }, [postId]);

  async function handleLike() {
    if (liked) return;

    setAnimating(true);
    setTimeout(() => setAnimating(false), 300);

    const res = await fetch(`/api/posts/${postId}/like`, { method: "POST" });
    if (!res.ok) return;
    const { likes: newLikes } = await res.json();

    setLikes(newLikes);
    setLiked(true);

    const stored = localStorage.getItem("liked_posts");
    const likedPosts: string[] = stored ? JSON.parse(stored) : [];
    localStorage.setItem("liked_posts", JSON.stringify([...likedPosts, postId]));
  }

  return (
    <button
      onClick={handleLike}
      disabled={liked}
      className={`flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium transition-all duration-200 ${
        liked
          ? "border-red-200 bg-red-50 text-red-500 dark:border-red-900 dark:bg-red-950 dark:text-red-400"
          : "border-stone-200 bg-white text-stone-500 hover:border-red-200 hover:bg-red-50 hover:text-red-500 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-400 dark:hover:border-red-900 dark:hover:bg-red-950 dark:hover:text-red-400"
      }`}
    >
      <Heart
        size={15}
        className={`transition-transform duration-200 ${animating ? "scale-150" : "scale-100"}`}
        fill={liked ? "currentColor" : "none"}
      />
      <span>{likes}</span>
    </button>
  );
}
