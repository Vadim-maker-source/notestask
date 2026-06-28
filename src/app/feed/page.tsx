import Link from "next/link";
import { prisma } from "@/lib/db";

export default async function FeedPage() {
  const notes = await prisma.note.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, title: true, ownerId: true, createdAt: true },
  });

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-2xl font-semibold tracking-tight">Public feed</h1>
      <p className="mt-1 text-sm text-[var(--muted)]">
        A stream of note titles from everyone. Content stays private to its
        author.
      </p>

      <div className="mt-8 space-y-3">
        {notes.length === 0 ? (
          <p className="text-sm text-[var(--muted)]">Nothing here yet.</p>
        ) : (
          notes.map((n) => (
            <div
              key={n.id}
              className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-4"
            >
              <Link
                href={`/notes/${n.id}`}
                className="font-medium hover:text-[var(--accent)] transition-colors"
              >
                {n.title}
              </Link>
              <p className="mt-1 text-xs text-[var(--muted)]">
                {new Date(n.createdAt).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
