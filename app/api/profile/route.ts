import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

const schema = z.object({ name: z.string().trim().min(2).max(80).optional(), bio: z.string().max(500).optional(), avatarUrl: z.string().url().max(2000).optional() });

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  const profile = await prisma.user.findUnique({ where: { id: user.id }, select: { id: true, name: true, email: true, bio: true, avatarUrl: true, createdAt: true, _count: { select: { posts: true, pages: true } } } });
  return NextResponse.json({ profile });
}

export async function PATCH(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid profile data." }, { status: 400 });
  const profile = await prisma.user.update({ where: { id: user.id }, data: parsed.data, select: { id: true, name: true, email: true, bio: true, avatarUrl: true } });
  return NextResponse.json({ profile });
}
