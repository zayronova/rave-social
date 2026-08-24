import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  const body = await request.json();
  const targetId = typeof body.userId === "string" ? body.userId : "";
  if (!targetId || targetId === user.id) return NextResponse.json({ error: "Invalid user." }, { status: 400 });
  const target = await prisma.user.findUnique({ where: { id: targetId } });
  if (!target) return NextResponse.json({ error: "User not found." }, { status: 404 });
  const existing = await prisma.follow.findUnique({ where: { followerId_followingId: { followerId: user.id, followingId: targetId } } });
  if (existing) {
    await prisma.follow.delete({ where: { followerId_followingId: { followerId: user.id, followingId: targetId } } });
    return NextResponse.json({ following: false });
  }
  await prisma.follow.create({ data: { followerId: user.id, followingId: targetId } });
  return NextResponse.json({ following: true }, { status: 201 });
}
