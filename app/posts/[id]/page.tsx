import Link from "next/link";
import { notFound } from "next/navigation";
import { Pencil, ArrowLeft, Calendar, User, Clock } from "lucide-react";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";
import ReadingProgressBar from "@/components/ReadingProgressBar";
import LikeButton from "@/components/LikeButton";
import { readingTime } from "@/lib/readingTime";

export default async function ViewPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [post, session] = await Promise.all([
    prisma.post.findUnique({ where: { id } }),
    auth(),
  ]);
  if (!post) notFound();
  const isAdmin = session?.user?.email === "keerthishreets@gmail.com";
  const isOwner = isAdmin || post.authorId === session?.user?.id;

  const tagList = post.tags ? post.tags.split(",").map((t) => t.trim()).filter(Boolean) : [];
  const time = readingTime(post.content);

  return (
    <div>
      <ReadingProgressBar />
      <Link href="/" className="mb-6 inline-flex items-center gap-1.5 text-sm text-stone-400 transition-colors hover:text-stone-700 dark:hover:text-stone-200">
        <ArrowLeft size={14} />
        All Posts
      </Link>

      <div className="mb-6 rounded-2xl border border-stone-200 bg-white px-8 py-7 shadow-sm dark:border-stone-700 dark:bg-stone-900">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold leading-tight tracking-tight text-stone-900 dark:text-stone-100">
              {post.title}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <span className="flex items-center gap-1.5 text-xs text-stone-400">
                <Clock size={12} />
                {time}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-stone-400">
                <Calendar size={12} />
                {new Date(post.updatedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
              </span>
              {post.authorName && (
                <span className="flex items-center gap-1.5 text-xs text-stone-400">
                  <User size={12} />
                  {post.authorName}
                </span>
              )}
              {tagList.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {tagList.map((tag) => (
                    <span key={tag} className="rounded-full bg-violet-50 px-2.5 py-0.5 text-xs font-medium text-violet-600 dark:bg-violet-950 dark:text-violet-400">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
          {isOwner && (
            <Link
              href={`/posts/${id}/edit`}
              className="flex shrink-0 items-center gap-1.5 rounded-xl border border-stone-200 bg-stone-50 px-3.5 py-2 text-sm font-medium text-stone-600 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-400 dark:hover:border-violet-700 dark:hover:bg-violet-950 dark:hover:text-violet-300"
            >
              <Pencil size={13} />
              Edit
            </Link>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-stone-200 bg-white px-8 py-7 shadow-sm dark:border-stone-700 dark:bg-stone-900">
        <div
          className="prose prose-stone max-w-none dark:prose-invert prose-headings:font-bold prose-headings:tracking-tight prose-a:text-violet-600 prose-code:rounded prose-code:bg-stone-100 prose-code:text-violet-700 prose-blockquote:border-violet-300 dark:prose-code:bg-stone-800 dark:prose-code:text-violet-400"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>

      {/* Like button */}
      <div className="mt-6 flex justify-center">
        <LikeButton postId={post.id} initialLikes={post.likes} />
      </div>
    </div>
  );
}
