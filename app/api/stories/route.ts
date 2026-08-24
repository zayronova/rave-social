import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

const schema = z.object({ mediaUrl: z.string().url().max(2000), caption: z.string().trim().max(500).optional() });

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const stories = await prisma.story.findMany({ where: { createdAt: { gte: since }, OR: [{ userId: user.id }, { user: { followers: { some: { followerId: user.id } } } }] }, orderBy: { createdAt: "desc" }, include: { user: { select: { id: true, name: true, avatarUrl: true } } } });
  return NextResponse.json({ stories });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid story." }, { status: 400 });
  const story = await prisma.story.create({ data: { userId: user.id, mediaUrl: parsed.data.mediaUrl, caption: parsed.data.caption || "" } });
  return NextResponse.json({ story }, { status: 201 });
}
