import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({ content: z.string().trim().min(1).max(2000) });

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const comments = await prisma.comment.findMany({ where: { postId: id }, orderBy: { createdAt: "asc" }, include: { author: { select: { id: true, name: true, avatarUrl: true } } } });
  return NextResponse.json({ comments });
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  const { id } = await params;
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid comment." }, { status: 400 });
  const comment = await prisma.comment.create({ data: { content: parsed.data.content, authorId: user.id, postId: id }, include: { author: { select: { id: true, name: true, avatarUrl: true } } } });
  return NextResponse.json({ comment }, { status: 201 });
}
