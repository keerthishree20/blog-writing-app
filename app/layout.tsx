import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Link from "next/link";
import { PenLine, BookOpen } from "lucide-react";
import "./globals.css";

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Blog Writer",
  description: "A minimal blog writing app",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} h-full antialiased`}>
      <body className="flex h-full bg-gray-50 text-gray-900">
        <aside className="flex w-56 shrink-0 flex-col gap-1 border-r border-gray-200 bg-white px-3 py-6">
          <p className="mb-4 px-2 text-lg font-bold tracking-tight text-indigo-600">
            Blog Writer
          </p>
          <Link
            href="/posts/new"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
          >
            <PenLine size={16} />
            New Post
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
          >
            <BookOpen size={16} />
            All Posts
          </Link>
        </aside>
        <main className="flex-1 overflow-y-auto p-8">{children}</main>
      </body>
    </html>
  );
}
