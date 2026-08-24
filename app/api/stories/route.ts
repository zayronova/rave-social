import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

const schema = z.object({ mediaUrl: z.string().url().max(2000), text: z.string().trim().max(500).optional() });

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  const now = new Date();
  const stories = await prisma.story.findMany({ where: { expiresAt: { gt: now }, OR: [{ authorId: user.id }, { author: { followers: { some: { followerId: user.id } } } }] }, orderBy: { createdAt: "desc" }, include: { author: { select: { id: true, name: true, avatarUrl: true } } } });
  return NextResponse.json({ stories });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid story." }, { status: 400 });
  const story = await prisma.story.create({ data: { authorId: user.id, mediaUrl: parsed.data.mediaUrl, text: parsed.data.text || "", expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) }, include: { author: { select: { id: true, name: true, avatarUrl: true } } } });
  return NextResponse.json({ story }, { status: 201 });
}
