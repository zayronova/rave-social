import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

const schema = z.object({ action: z.enum(["like", "unlike", "comment"]), content: z.string().trim().min(1).max(2000).optional() });

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  const { id: postId } = await context.params;
  const post = await prisma.post.findUnique({ where: { id: postId }, select: { id: true, authorId: true } });
  if (!post) return NextResponse.json({ error: "Post not found." }, { status: 404 });
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success || (parsed.data.action === "comment" && !parsed.data.content)) return NextResponse.json({ error: "Invalid interaction." }, { status: 400 });
  if (parsed.data.action === "like") {
    const existing = await prisma.like.findUnique({ where: { userId_postId: { userId: user.id, postId } } });
    if (!existing) {
      await prisma.like.create({ data: { userId: user.id, postId } });
      if (post.authorId !== user.id) await prisma.notification.create({ data: { userId: post.authorId, actorId: user.id, type: "POST_LIKE", postId } });
    }
  } else if (parsed.data.action === "unlike") {
    await prisma.like.deleteMany({ where: { userId: user.id, postId } });
  } else {
    const comment = await prisma.comment.create({ data: { content: parsed.data.content!, authorId: user.id, postId } });
    if (post.authorId !== user.id) await prisma.notification.create({ data: { userId: post.authorId, actorId: user.id, type: "POST_COMMENT", postId } });
    return NextResponse.json({ comment }, { status: 201 });
  }
  const likes = await prisma.like.count({ where: { postId } });
  const comments = await prisma.comment.count({ where: { postId } });
  return NextResponse.json({ liked: parsed.data.action === "like", likes, comments });
}
