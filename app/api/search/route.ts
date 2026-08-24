import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  const q = new URL(request.url).searchParams.get("q")?.trim() || "";
  if (q.length < 2) return NextResponse.json({ users: [], pages: [], groups: [] });
  const [users, pages, groups] = await Promise.all([
    prisma.user.findMany({ where: { name: { contains: q, mode: "insensitive" } }, select: { id: true, name: true, avatarUrl: true }, take: 20 }),
    prisma.page.findMany({ where: { name: { contains: q, mode: "insensitive" } }, select: { id: true, name: true, slug: true }, take: 20 }),
    prisma.group.findMany({ where: { name: { contains: q, mode: "insensitive" } }, select: { id: true, name: true, slug: true }, take: 20 })
  ]);
  return NextResponse.json({ users, pages, groups });
}
