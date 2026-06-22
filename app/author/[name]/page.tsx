import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, User } from "lucide-react";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";
import PostCard from "@/components/PostCard";

export const dynamic = "force-dynamic";

export default async function AuthorPage({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const authorName = decodeURIComponent(name);
  const session = await auth();
  const isAdmin = session?.user?.email === "keerthishreets@gmail.com";

  const posts = await prisma.post.findMany({
    where: { authorName },
    orderBy: { updatedAt: "desc" },
    select: { id: true, title: true, tags: true, content: true, updatedAt: true, authorName: true, authorId: true, likes: true, views: true },
  });

  if (posts.length === 0) notFound();

  return (
    <div>
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-stone-400 transition-colors hover:text-stone-700 dark:hover:text-stone-200"
      >
        <ArrowLeft size={14} />
        All Posts
      </Link>

      {/* Author header */}
      <div className="mb-8 flex items-center gap-4 rounded-2xl border border-stone-200 bg-white px-6 py-5 shadow-sm dark:border-stone-700 dark:bg-stone-900">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-violet-100 dark:bg-violet-950">
          <User size={24} className="text-violet-600 dark:text-violet-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-stone-900 dark:text-stone-100">{authorName}</h1>
          <p className="mt-0.5 text-sm text-stone-400">
            {posts.length} post{posts.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Posts */}
      <div className="flex flex-col gap-3">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            id={post.id}
            title={post.title}
            tags={post.tags}
            content={post.content}
            updatedAt={post.updatedAt.toISOString()}
            authorName={post.authorName}
            likes={post.likes}
            views={post.views}
            isOwner={isAdmin || post.authorId === session?.user?.id}
          />
        ))}
      </div>
    </div>
  );
}
