import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, User, FileText, Heart, Eye, Calendar } from "lucide-react";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";
import PostCard from "@/components/PostCard";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const isAdmin = session.user.email === "keerthishreets@gmail.com";

  const posts = await prisma.post.findMany({
    where: { authorId: session.user.id },
    orderBy: { updatedAt: "desc" },
    select: { id: true, title: true, tags: true, content: true, updatedAt: true, authorName: true, authorId: true, likes: true, views: true },
  });

  const totalLikes = posts.reduce((sum, p) => sum + p.likes, 0);
  const totalViews = posts.reduce((sum, p) => sum + p.views, 0);

  const user = await prisma.user.findUnique({
    where: { id: session.user.id! },
    select: { createdAt: true, name: true },
  });

  return (
    <div>
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-stone-400 transition-colors hover:text-stone-700 dark:hover:text-stone-200"
      >
        <ArrowLeft size={14} />
        All Posts
      </Link>

      <div className="mb-8 rounded-2xl border border-stone-200 bg-white px-6 py-6 shadow-sm dark:border-stone-700 dark:bg-stone-900">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-violet-100 dark:bg-violet-950">
            {session.user.image ? (
              <img src={session.user.image} alt="" className="h-16 w-16 rounded-full" />
            ) : (
              <User size={28} className="text-violet-600 dark:text-violet-400" />
            )}
          </div>
          <div>
            <h1 className="text-xl font-bold text-stone-900 dark:text-stone-100">
              {session.user.name ?? "Anonymous"}
            </h1>
            <p className="text-sm text-stone-400">{session.user.email}</p>
            {user?.createdAt && (
              <p className="mt-0.5 flex items-center gap-1 text-xs text-stone-400">
                <Calendar size={11} />
                Joined {new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              </p>
            )}
          </div>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-3">
          <div className="rounded-xl bg-stone-50 px-4 py-3 text-center dark:bg-stone-800">
            <div className="flex items-center justify-center gap-1.5 text-stone-400">
              <FileText size={13} />
            </div>
            <p className="mt-1 text-xl font-bold text-stone-900 dark:text-stone-100">{posts.length}</p>
            <p className="text-xs text-stone-400">Posts</p>
          </div>
          <div className="rounded-xl bg-stone-50 px-4 py-3 text-center dark:bg-stone-800">
            <div className="flex items-center justify-center gap-1.5 text-stone-400">
              <Heart size={13} />
            </div>
            <p className="mt-1 text-xl font-bold text-stone-900 dark:text-stone-100">{totalLikes}</p>
            <p className="text-xs text-stone-400">Likes</p>
          </div>
          <div className="rounded-xl bg-stone-50 px-4 py-3 text-center dark:bg-stone-800">
            <div className="flex items-center justify-center gap-1.5 text-stone-400">
              <Eye size={13} />
            </div>
            <p className="mt-1 text-xl font-bold text-stone-900 dark:text-stone-100">{totalViews}</p>
            <p className="text-xs text-stone-400">Views</p>
          </div>
        </div>
      </div>

      {posts.length > 0 && (
        <>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-stone-400">Your Posts</h2>
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
                isOwner={true}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
