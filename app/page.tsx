import Link from "next/link";
import { PenLine } from "lucide-react";
import { Suspense } from "react";
import PostCard from "@/components/PostCard";
import SearchBar from "@/components/SearchBar";
import TagFilter from "@/components/TagFilter";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; tag?: string }>;
}) {
  const { q, tag } = await searchParams;
  const query = q?.trim().toLowerCase() ?? "";
  const activeTag = tag?.trim().toLowerCase() ?? "";
  const session = await auth();
  const isAdmin = session?.user?.email === "keerthishreets@gmail.com";

  const posts = await prisma.post.findMany({
    orderBy: { updatedAt: "desc" },
    select: { id: true, title: true, tags: true, content: true, updatedAt: true, authorName: true, authorId: true, likes: true },
  });

  // Collect all unique tags across all posts
  const allTags = Array.from(
    new Set(posts.flatMap((p) => p.tags.split(",").map((t) => t.trim()).filter(Boolean)))
  );

  const filtered = posts.filter((p) => {
    const matchesQuery = !query || p.title.toLowerCase().includes(query) || p.tags.toLowerCase().includes(query);
    const matchesTag = !activeTag || p.tags.split(",").map((t) => t.trim().toLowerCase()).includes(activeTag);
    return matchesQuery && matchesTag;
  });

  return (
    <div>
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-stone-900 dark:text-stone-100">All Posts</h1>
          <p className="mt-1 text-sm text-stone-400">
            {filtered.length === 0
              ? query ? "No results" : "No posts yet"
              : `${filtered.length} post${filtered.length !== 1 ? "s" : ""}${query ? ` for "${q}"` : ""}`}
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

      <div className="mb-4">
        <Suspense>
          <SearchBar defaultValue={q ?? ""} />
        </Suspense>
      </div>

      {allTags.length > 0 && (
        <div className="mb-5">
          <Suspense>
            <TagFilter tags={allTags} activeTag={activeTag} />
          </Suspense>
        </div>
      )}

      {posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-stone-200 bg-white py-24 text-center dark:border-stone-700 dark:bg-stone-900">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-50 dark:bg-violet-950">
            <PenLine size={24} className="text-violet-500" />
          </div>
          <p className="text-base font-medium text-stone-600 dark:text-stone-300">Nothing written yet</p>
          <p className="mt-1 text-sm text-stone-400">Start your first post and it will appear here.</p>
          <Link href="/posts/new" className="mt-5 rounded-lg bg-violet-600 px-5 py-2 text-sm font-semibold text-white hover:bg-violet-700 transition">
            Write your first post
          </Link>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-stone-200 bg-white py-16 text-center dark:border-stone-700 dark:bg-stone-900">
          <p className="text-base font-medium text-stone-600 dark:text-stone-300">No posts match &ldquo;{q}&rdquo;</p>
          <p className="mt-1 text-sm text-stone-400">Try a different title or tag.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((post) => (
            <PostCard key={post.id} id={post.id} title={post.title} tags={post.tags} content={post.content} updatedAt={post.updatedAt.toISOString()} authorName={post.authorName} likes={post.likes} isOwner={isAdmin || post.authorId === session?.user?.id} />
          ))}
        </div>
      )}
    </div>
  );
}
