import Link from "next/link";
import { PenLine } from "lucide-react";
import PostCard from "@/components/PostCard";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const posts = await prisma.post.findMany({
    orderBy: { updatedAt: "desc" },
    select: { id: true, title: true, tags: true, content: true, updatedAt: true },
  });

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-stone-900">All Posts</h1>
          <p className="mt-1 text-sm text-stone-400">
            {posts.length === 0 ? "No posts yet" : `${posts.length} post${posts.length !== 1 ? "s" : ""}`}
          </p>
        </div>
        <Link
          href="/posts/new"
          className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-700 active:scale-95"
        >
          <PenLine size={15} />
          New Post
        </Link>
      </div>

      {/* Posts */}
      {posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-stone-200 bg-white py-24 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-50">
            <PenLine size={24} className="text-violet-500" />
          </div>
          <p className="text-base font-medium text-stone-600">Nothing written yet</p>
          <p className="mt-1 text-sm text-stone-400">Start your first post and it will appear here.</p>
          <Link
            href="/posts/new"
            className="mt-5 rounded-lg bg-violet-600 px-5 py-2 text-sm font-semibold text-white hover:bg-violet-700 transition"
          >
            Write your first post
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              id={post.id}
              title={post.title}
              tags={post.tags}
              content={post.content}
              updatedAt={post.updatedAt.toISOString()}
            />
          ))}
        </div>
      )}
    </div>
  );
}
