import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { getServerSession } from "@/lib/session";
import { canReadNote } from "@/lib/access";

type Params = { params: Promise<{ id: string }> };

export default async function NotePage({ params }: Params) {
  const { id } = await params;
  const session = await getServerSession();
  const user = session?.user?.id ? { id: session.user.id } : null;

  const note = await prisma.note.findUnique({ where: { id } });
  if (!note) notFound();

  if (!canReadNote(user, note)) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16">
        <h1 className="text-2xl font-semibold tracking-tight">Access denied</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          This note is private. Only the owner can read it.
        </p>
        <Link
          href="/feed"
          className="mt-6 inline-block text-sm text-[var(--accent)] hover:underline"
        >
          ← Back to feed
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <Link
        href="/notes"
        className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
      >
        ← My notes
      </Link>
      <h1 className="mt-4 text-2xl font-semibold tracking-tight">{note.title}</h1>
      <p className="mt-4 whitespace-pre-wrap text-[var(--foreground)]">
        {note.content}
      </p>
    </div>
  );
}
