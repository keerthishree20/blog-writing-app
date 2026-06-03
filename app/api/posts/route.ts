import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const posts = await prisma.post.findMany({
    orderBy: { updatedAt: "desc" },
    select: { id: true, title: true, tags: true, createdAt: true, updatedAt: true },
  });
  return NextResponse.json(posts);
}

export async function POST(req: Request) {
  const { title, content, tags } = await req.json();
  if (!title?.trim()) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }
  const post = await prisma.post.create({
    data: { title: title.trim(), content: content ?? "", tags: tags ?? "" },
  });
  return NextResponse.json(post, { status: 201 });
}
