import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

const schema = z.object({ content: z.string().trim().min(1).max(5000) });

export async function GET() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    include: { author: { select: { id: true, name: true, avatarUrl: true } }, _count: { select: { comments: true, likes: true } } },
  });
  return NextResponse.json({ posts });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Post content is invalid." }, { status: 400 });

  const post = await prisma.post.create({
    data: { content: parsed.data.content, authorId: user.id },
    include: { author: { select: { id: true, name: true, avatarUrl: true } }, _count: { select: { comments: true, likes: true } } },
  });

  return NextResponse.json({ post }, { status: 201 });
}
