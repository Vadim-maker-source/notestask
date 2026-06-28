import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { ensureLoaded } from "@/lib/noteCache";

export const dynamic = 'force-dynamic';

export async function GET() {
  await ensureLoaded();
  const notes = await prisma.note.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, title: true, ownerId: true, createdAt: true },
  });
  return NextResponse.json({ notes });
}
