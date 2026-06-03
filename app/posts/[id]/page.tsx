import Link from "next/link";
import { notFound } from "next/navigation";
import { Pencil, ArrowLeft, Calendar } from "lucide-react";
import { prisma } from "@/lib/db";

export default async function ViewPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) notFound();

  const tagList = post.tags ? post.tags.split(",").map((t) => t.trim()).filter(Boolean) : [];

  return (
    <div>
      {/* Back nav */}
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-stone-400 transition-colors hover:text-stone-700"
      >
        <ArrowLeft size={14} />
        All Posts
      </Link>

      {/* Post header */}
      <div className="mb-8 rounded-2xl border border-stone-200 bg-white px-8 py-7 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold leading-tight tracking-tight text-stone-900">
              {post.title}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <span className="flex items-center gap-1.5 text-xs text-stone-400">
                <Calendar size={12} />
                {new Date(post.updatedAt).toLocaleDateString("en-US", {
                  year: "numeric", month: "long", day: "numeric",
                })}
              </span>
              {tagList.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {tagList.map((tag) => (
                    <span key={tag} className="rounded-full bg-violet-50 px-2.5 py-0.5 text-xs font-medium text-violet-600">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
          <Link
            href={`/posts/${id}/edit`}
            className="flex shrink-0 items-center gap-1.5 rounded-xl border border-stone-200 bg-stone-50 px-3.5 py-2 text-sm font-medium text-stone-600 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700"
          >
            <Pencil size={13} />
            Edit
          </Link>
        </div>
      </div>

      {/* Post content */}
      <div className="rounded-2xl border border-stone-200 bg-white px-8 py-7 shadow-sm">
        <div
          className="prose prose-stone max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-violet-600 prose-code:rounded prose-code:bg-stone-100 prose-code:text-violet-700 prose-blockquote:border-violet-300"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>
    </div>
  );
}
