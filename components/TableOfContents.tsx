"use client";

import { useState, useEffect } from "react";
import { List, ChevronDown, ChevronUp } from "lucide-react";

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

export default function TableOfContents({ content }: { content: string }) {
  const [items, setItems] = useState<TOCItem[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, "text/html");
    const headings = doc.querySelectorAll("h1, h2, h3");
    const toc: TOCItem[] = [];
    headings.forEach((h, i) => {
      const id = `heading-${i}`;
      const text = h.textContent?.trim() ?? "";
      if (text) {
        toc.push({ id, text, level: parseInt(h.tagName[1]) });
      }
    });
    setItems(toc);
  }, [content]);

  useEffect(() => {
    if (items.length === 0) return;
    const contentEl = document.querySelector("[data-post-content]");
    if (!contentEl) return;
    const headings = contentEl.querySelectorAll("h1, h2, h3");
    headings.forEach((h, i) => {
      h.id = `heading-${i}`;
    });
  }, [items]);

  if (items.length < 2) return null;

  function scrollTo(id: string) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    setOpen(false);
  }

  return (
    <div className="mb-6 rounded-xl border border-stone-200 bg-white dark:border-stone-700 dark:bg-stone-900">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-5 py-3 text-sm font-semibold text-stone-600 dark:text-stone-300"
      >
        <span className="flex items-center gap-2">
          <List size={15} />
          Table of Contents
        </span>
        {open ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
      </button>
      {open && (
        <div className="border-t border-stone-100 px-5 py-3 dark:border-stone-800">
          <ul className="space-y-1.5">
            {items.map((item) => (
              <li key={item.id} style={{ paddingLeft: `${(item.level - 1) * 16}px` }}>
                <button
                  onClick={() => scrollTo(item.id)}
                  className="text-left text-sm text-stone-500 transition-colors hover:text-violet-600 dark:text-stone-400 dark:hover:text-violet-400"
                >
                  {item.text}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
