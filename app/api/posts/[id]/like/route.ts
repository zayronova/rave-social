import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  const { id } = await params;
  const existing = await prisma.like.findUnique({ where: { userId_postId: { userId: user.id, postId: id } } });
  if (existing) await prisma.like.delete({ where: { id: existing.id } });
  else await prisma.like.create({ data: { userId: user.id, postId: id } });
  const count = await prisma.like.count({ where: { postId: id } });
  return NextResponse.json({ liked: !existing, count });
}
