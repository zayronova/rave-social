import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  const body = await request.json();
  const targetId = typeof body.userId === "string" ? body.userId : "";
  if (!targetId || targetId === user.id) return NextResponse.json({ error: "Invalid user." }, { status: 400 });
  return NextResponse.json({ error: "Follow relationships are scheduled for the next schema migration." }, { status: 501 });
}
