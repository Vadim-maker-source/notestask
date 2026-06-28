import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/session";
import { canReadNote } from "@/lib/access";
import { ensureLoaded, getNote } from "@/lib/noteCache";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  const { id } = await params;
  await ensureLoaded();
  const note = getNote(id);

  if (!note) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const session = await getServerSession();
  const user = session?.user?.id ? { id: session.user.id } : null;

  if (!canReadNote(user, note)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json({
    note: {
      id: note.id,
      title: note.title,
      content: note.content,
      ownerId: note.ownerId,
      createdAt: note.createdAt,
      updatedAt: note.updatedAt,
    },
  });
}
