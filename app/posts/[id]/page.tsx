import Link from "next/link";
import { notFound } from "next/navigation";
import { Pencil } from "lucide-react";
import { prisma } from "@/lib/db";

export default async function ViewPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) notFound();

  const tagList = post.tags ? post.tags.split(",").map((t) => t.trim()).filter(Boolean) : [];

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{post.title}</h1>
          <p className="mt-1 text-sm text-gray-400">
            {new Date(post.updatedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </p>
          {tagList.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {tagList.map((tag) => (
                <span key={tag} className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs text-indigo-600">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
        <Link
          href={`/posts/${id}/edit`}
          className="flex shrink-0 items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <Pencil size={14} />
          Edit
        </Link>
      </div>
      <div
        className="prose prose-sm max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
      <Link href="/" className="mt-10 inline-block text-sm text-indigo-600 hover:underline">
        ← All Posts
      </Link>
    </div>
  );
}
