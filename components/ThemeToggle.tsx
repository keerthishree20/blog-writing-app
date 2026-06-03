"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon, Monitor } from "lucide-react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const options = [
    { value: "light", icon: <Sun size={13} /> },
    { value: "dark", icon: <Moon size={13} /> },
    { value: "system", icon: <Monitor size={13} /> },
  ] as const;

  return (
    <div className="flex items-center rounded-xl border border-stone-200 bg-stone-100 p-0.5 dark:border-stone-700 dark:bg-stone-800">
      {options.map(({ value, icon }) => (
        <button
          key={value}
          onClick={() => setTheme(value)}
          title={value}
          className={`flex h-6 w-6 items-center justify-center rounded-lg transition-colors ${
            theme === value
              ? "bg-white text-violet-600 shadow-sm dark:bg-stone-700 dark:text-violet-400"
              : "text-stone-400 hover:text-stone-600 dark:hover:text-stone-300"
          }`}
        >
          {icon}
        </button>
      ))}
    </div>
  );
}
