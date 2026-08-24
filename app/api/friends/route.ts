import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

const schema = z.object({ userId: z.string().min(1) });

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  const following = await prisma.follow.findMany({ where: { followerId: user.id }, include: { following: { select: { id: true, name: true, avatarUrl: true } } }, orderBy: { createdAt: "desc" } });
  const followers = await prisma.follow.findMany({ where: { followingId: user.id }, include: { follower: { select: { id: true, name: true, avatarUrl: true } } }, orderBy: { createdAt: "desc" } });
  return NextResponse.json({ following, followers });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success || parsed.data.userId === user.id) return NextResponse.json({ error: "Invalid user." }, { status: 400 });
  const target = await prisma.user.findUnique({ where: { id: parsed.data.userId }, select: { id: true } });
  if (!target) return NextResponse.json({ error: "User not found." }, { status: 404 });
  const existing = await prisma.follow.findUnique({ where: { followerId_followingId: { followerId: user.id, followingId: target.id } } });
  if (existing) { await prisma.follow.delete({ where: { followerId_followingId: { followerId: user.id, followingId: target.id } } }); return NextResponse.json({ following: false }); }
  await prisma.follow.create({ data: { followerId: user.id, followingId: target.id } });
  return NextResponse.json({ following: true }, { status: 201 });
}
