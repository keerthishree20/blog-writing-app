import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const result = await prisma.$queryRaw<{ views: number }[]>`
    UPDATE "Post" SET "views" = "views" + 1 WHERE "id" = ${id} RETURNING "views"
  `;
  if (result.length === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({ views: result[0].views });
}
