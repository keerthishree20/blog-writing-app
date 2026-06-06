"use client";

import { useState } from "react";
import { Link2, Share2, Check, ExternalLink } from "lucide-react";

interface ShareButtonProps {
  title: string;
  url: string;
}

export default function ShareButton({ title, url }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleTwitter() {
    const text = encodeURIComponent(`"${title}"`);
    const link = encodeURIComponent(url);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${link}`, "_blank", "noopener");
  }

  async function handleNativeShare() {
    if (navigator.share) {
      await navigator.share({ title, url });
    } else {
      handleCopy();
    }
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-medium text-stone-400 uppercase tracking-wide">Share</span>
      <button
        onClick={handleCopy}
        title="Copy link"
        className="flex items-center gap-1.5 rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-xs font-medium text-stone-500 transition hover:border-violet-200 hover:text-violet-600 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-400 dark:hover:border-violet-700 dark:hover:text-violet-400"
      >
        {copied ? <Check size={13} className="text-green-500" /> : <Link2 size={13} />}
        {copied ? "Copied!" : "Copy link"}
      </button>
      <button
        onClick={handleTwitter}
        title="Share on X / Twitter"
        className="flex items-center gap-1.5 rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-xs font-medium text-stone-500 transition hover:border-sky-300 hover:text-sky-600 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-400 dark:hover:border-sky-700 dark:hover:text-sky-400"
      >
        <ExternalLink size={13} />
        Post on X
      </button>
      {"share" in navigator && (
        <button
          onClick={handleNativeShare}
          title="Share"
          className="flex items-center gap-1.5 rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-xs font-medium text-stone-500 transition hover:border-violet-200 hover:text-violet-600 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-400 dark:hover:border-violet-700 dark:hover:text-violet-400 md:hidden"
        >
          <Share2 size={13} />
          Share
        </button>
      )}
    </div>
  );
}
