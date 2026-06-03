import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Link from "next/link";
import { PenLine, BookOpen, Feather } from "lucide-react";
import ThemeProvider from "@/components/ThemeProvider";
import ThemeToggle from "@/components/ThemeToggle";
import "./globals.css";

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Blog Writer",
  description: "A minimal blog writing app",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="flex h-full overflow-hidden bg-[var(--bg)] text-[var(--fg)]">
        <ThemeProvider>
          {/* Sidebar */}
          <aside className="flex w-60 shrink-0 flex-col border-r border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-900">
            {/* Logo */}
            <div className="flex items-center gap-2.5 border-b border-stone-100 px-5 py-5 dark:border-stone-800">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600">
                <Feather size={15} className="text-white" />
              </div>
              <span className="text-base font-bold tracking-tight text-stone-800 dark:text-stone-100">
                Blog Writer
              </span>
            </div>

            {/* Nav */}
            <nav className="flex flex-col gap-1 p-3 pt-4">
              <p className="mb-1 px-3 text-[10px] font-semibold uppercase tracking-widest text-stone-400">
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
                href="/"
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-stone-600 transition-colors hover:bg-violet-50 hover:text-violet-700 dark:text-stone-400 dark:hover:bg-violet-950 dark:hover:text-violet-300"
              >
                <BookOpen size={15} />
                All Posts
              </Link>
            </nav>

            {/* Footer with theme toggle */}
            <div className="mt-auto border-t border-stone-100 px-4 py-4 dark:border-stone-800">
              <div className="flex items-center justify-between">
                <p className="text-xs text-stone-400">Theme</p>
                <ThemeToggle />
              </div>
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1 overflow-y-auto bg-[var(--bg)]">
            <div className="mx-auto max-w-3xl px-8 py-10">{children}</div>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
