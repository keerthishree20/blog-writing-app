"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { Search, X } from "lucide-react";

export default function SearchBar({ defaultValue }: { defaultValue: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  function handleChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) { params.set("q", value); } else { params.delete("q"); }
    startTransition(() => { router.replace(`/?${params.toString()}`); });
  }

  return (
    <div className="relative">
      <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
      <input
        type="text"
        defaultValue={defaultValue}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Search posts by title or tag…"
        className="w-full rounded-2xl border border-stone-200 bg-white py-2.5 pl-10 pr-10 text-sm text-stone-700 shadow-sm outline-none placeholder:text-stone-300 focus:border-violet-300 focus:ring-2 focus:ring-violet-100 transition-all dark:border-stone-700 dark:bg-stone-900 dark:text-stone-300 dark:placeholder:text-stone-600 dark:focus:border-violet-700"
      />
      {defaultValue && (
        <button
          onClick={() => handleChange("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
