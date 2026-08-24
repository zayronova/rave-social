import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

const schema = z.object({ name: z.string().trim().min(2).max(100), slug: z.string().trim().regex(/^[a-z0-9-]+$/).min(2).max(80), description: z.string().trim().max(1000).optional() });

export async function GET() {
  const groups = await prisma.group.findMany({ orderBy: { createdAt: "desc" }, take: 50, include: { owner: { select: { id: true, name: true } }, _count: { select: { members: true } } } });
  return NextResponse.json({ groups });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid group details." }, { status: 400 });
  const group = await prisma.group.create({ data: { ...parsed.data, description: parsed.data.description || "", ownerId: user.id, members: { create: { userId: user.id, role: "OWNER" } } }, include: { owner: { select: { id: true, name: true } } } });
  return NextResponse.json({ group }, { status: 201 });
}
