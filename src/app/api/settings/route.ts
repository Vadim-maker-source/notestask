import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { getServerSession } from "@/lib/session";
import { deepMerge } from "@/lib/merge";

type Settings = {
  theme?: string;
  fontSize?: number;
  [key: string]: unknown;
};

const DEFAULT_SETTINGS: Settings = {
  theme: "light",
  fontSize: 14,
};

export async function GET() {
  const session = await getServerSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { settings: true },
  });
  if (!user) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const stored = (user.settings ?? {}) as Settings;
  return NextResponse.json({ settings: { ...DEFAULT_SETTINGS, ...stored } });
}

export async function PATCH(req: Request) {
  const session = await getServerSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return NextResponse.json({ error: "Invalid settings payload" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { settings: true },
  });
  if (!user) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const base = deepMerge(
    { ...DEFAULT_SETTINGS },
    (user.settings ?? {}) as Settings
  );
  const merged = deepMerge(base, body as Settings);

  await prisma.user.update({
    where: { id: session.user.id },
    data: { settings: merged as Prisma.InputJsonValue },
  });

  return NextResponse.json({ settings: merged });
}
