"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ totalPages, currentPage }: { totalPages: number; currentPage: number }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  function goTo(page: number) {
    const params = new URLSearchParams(searchParams.toString());
    if (page <= 1) {
      params.delete("page");
    } else {
      params.set("page", String(page));
    }
    router.replace(`/?${params.toString()}`);
  }

  return (
    <div className="mt-6 flex items-center justify-center gap-2">
      <button
        onClick={() => goTo(currentPage - 1)}
        disabled={currentPage <= 1}
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-stone-200 bg-white text-stone-500 transition hover:border-violet-200 hover:text-violet-600 disabled:opacity-30 disabled:hover:border-stone-200 disabled:hover:text-stone-500 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-400"
      >
        <ChevronLeft size={15} />
      </button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          onClick={() => goTo(page)}
          className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium transition ${
            page === currentPage
              ? "bg-violet-600 text-white shadow-sm"
              : "border border-stone-200 bg-white text-stone-500 hover:border-violet-200 hover:text-violet-600 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-400"
          }`}
        >
          {page}
        </button>
      ))}
      <button
        onClick={() => goTo(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-stone-200 bg-white text-stone-500 transition hover:border-violet-200 hover:text-violet-600 disabled:opacity-30 disabled:hover:border-stone-200 disabled:hover:text-stone-500 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-400"
      >
        <ChevronRight size={15} />
      </button>
    </div>
  );
}
