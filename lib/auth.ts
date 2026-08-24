import crypto from "crypto";
import { cookies } from "next/headers";
import { prisma } from "./prisma";

const SESSION_COOKIE = "rave_session";
const SESSION_DAYS = 30;

function hash(value: string) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

export async function createSession(userId: string) {
  const rawToken = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 86400000);

  await prisma.session.create({
    data: { tokenHash: hash(rawToken), userId, expiresAt },
  });

  const jar = await cookies();
  jar.set(SESSION_COOKIE, rawToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

export async function getCurrentUser() {
  const jar = await cookies();
  const rawToken = jar.get(SESSION_COOKIE)?.value;
  if (!rawToken) return null;

  const session = await prisma.session.findUnique({
    where: { tokenHash: hash(rawToken) },
    include: { user: true },
  });

  if (!session || session.expiresAt <= new Date()) return null;
  return session.user;
}

export async function destroySession() {
  const jar = await cookies();
  const rawToken = jar.get(SESSION_COOKIE)?.value;
  if (rawToken) await prisma.session.deleteMany({ where: { tokenHash: hash(rawToken) } });
  jar.delete(SESSION_COOKIE);
}
