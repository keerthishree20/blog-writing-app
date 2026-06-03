import Link from "next/link";
import { PenLine } from "lucide-react";
import PostCard from "@/components/PostCard";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const posts = await prisma.post.findMany({
    orderBy: { updatedAt: "desc" },
    select: { id: true, title: true, tags: true, updatedAt: true },
  });

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">All Posts</h1>
        <Link
          href="/posts/new"
          className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
        >
          <PenLine size={15} />
          New Post
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 py-16 text-center">
          <p className="text-gray-400">No posts yet.</p>
          <Link href="/posts/new" className="mt-2 inline-block text-sm text-indigo-600 hover:underline">
            Write your first post →
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
              updatedAt={post.updatedAt.toISOString()}
            />
          ))}
        </div>
      )}
    </div>
  );
}
