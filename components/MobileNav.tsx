"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, BookOpen, PenLine, Feather, LogIn, Bookmark, UserCircle } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import UserMenu from "./UserMenu";

interface Props {
  user?: { name?: string | null; email?: string | null; image?: string | null } | null;
}

export default function MobileNav({ user }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Sticky top bar — mobile only */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-stone-200 bg-white px-4 py-3 dark:border-stone-800 dark:bg-stone-900 md:hidden">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-600">
            <Feather size={13} className="text-white" />
          </div>
          <span className="text-sm font-bold tracking-tight text-stone-800 dark:text-stone-100">
            Blog Writer
          </span>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="rounded-lg p-1.5 text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800"
        >
          <Menu size={20} />
        </button>
      </header>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Slide-in drawer */}
      <div
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-stone-200 bg-white transition-transform duration-200 dark:border-stone-800 dark:bg-stone-900 md:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between border-b border-stone-100 px-5 py-5 dark:border-stone-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600">
              <Feather size={15} className="text-white" />
            </div>
            <span className="text-base font-bold tracking-tight text-stone-800 dark:text-stone-100">
              Blog Writer
            </span>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800"
          >
            <X size={18} />
          </button>
        </div>

        {/* Drawer nav */}
        <nav className="flex flex-col gap-1 p-3 pt-4" onClick={() => setOpen(false)}>
          <p className="mb-1 px-3 text-[10px] font-semibold uppercase tracking-widest text-stone-400">
            Browse
          </p>
          <Link
            href="/"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-stone-600 transition-colors hover:bg-violet-50 hover:text-violet-700 dark:text-stone-400 dark:hover:bg-violet-950 dark:hover:text-violet-300"
          >
            <BookOpen size={15} />
            All Posts
          </Link>
          <Link
            href="/bookmarks"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-stone-600 transition-colors hover:bg-violet-50 hover:text-violet-700 dark:text-stone-400 dark:hover:bg-violet-950 dark:hover:text-violet-300"
          >
            <Bookmark size={15} />
            Bookmarks
          </Link>
          {user && (
            <>
              <p className="mb-1 mt-3 px-3 text-[10px] font-semibold uppercase tracking-widest text-stone-400">
                Write
              </p>
              <Link
                href="/posts/new"
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-stone-600 transition-colors hover:bg-violet-50 hover:text-violet-700 dark:text-stone-400 dark:hover:bg-violet-950 dark:hover:text-violet-300"
              >
                <PenLine size={15} />
                New Post
              </Link>
              <Link
                href="/profile"
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-stone-600 transition-colors hover:bg-violet-50 hover:text-violet-700 dark:text-stone-400 dark:hover:bg-violet-950 dark:hover:text-violet-300"
              >
                <UserCircle size={15} />
                Profile
              </Link>
            </>
          )}
        </nav>

        {/* Drawer footer */}
        <div className="mt-auto space-y-3 border-t border-stone-100 px-4 py-4 dark:border-stone-800">
          {user ? (
            <UserMenu name={user.name} email={user.email} image={user.image} />
          ) : (
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 rounded-xl border border-stone-200 px-3 py-2 text-sm font-medium text-stone-600 transition hover:bg-violet-50 hover:text-violet-700 dark:border-stone-700 dark:text-stone-400 dark:hover:bg-violet-950 dark:hover:text-violet-300"
            >
              <LogIn size={14} />
              Sign in to write
            </Link>
          )}
          <div className="flex items-center justify-between">
            <p className="text-xs text-stone-400">Theme</p>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </>
  );
}
