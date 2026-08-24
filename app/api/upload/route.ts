import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

const MAX_SIZE = 10 * 1024 * 1024;
const TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "No file provided." }, { status: 400 });
  if (file.size > MAX_SIZE) return NextResponse.json({ error: "Image must be 10MB or smaller." }, { status: 413 });
  if (!TYPES.has(file.type)) return NextResponse.json({ error: "Only JPG, PNG, WEBP, and GIF images are supported." }, { status: 415 });

  // Storage provider integration belongs here. The API intentionally does not write
  // uploaded bytes into the repository or expose local filesystem paths.
  return NextResponse.json({ error: "Media storage is not configured yet. Set a production storage provider before enabling uploads." }, { status: 503 });
}
