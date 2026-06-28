import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getServerSession } from "@/lib/session";
import { NoteForm } from "@/components/NoteForm";
import { NoteCard } from "@/components/NoteCard";

export const dynamic = 'force-dynamic';

export default async function NotesPage() {
  const session = await getServerSession();
  if (!session?.user?.id) redirect("/login?callbackUrl=/notes");

  const notes = await prisma.note.findMany({
    where: { ownerId: session.user.id },
    orderBy: { createdAt: "desc" },
    select: { id: true, title: true, content: true, updatedAt: true },
  });

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-2xl font-semibold tracking-tight">My notes</h1>
      <p className="mt-1 text-sm text-[var(--muted)]">
        Your private notes. Only you can read them.
      </p>

      <div className="mt-8">
        <NoteForm />
      </div>

      <div className="mt-8 space-y-3">
        {notes.length === 0 ? (
          <p className="text-sm text-[var(--muted)]">No notes yet.</p>
        ) : (
          notes.map((n) => (
            <NoteCard
              key={n.id}
              id={n.id}
              title={n.title}
              content={n.content}
              showContent
              href={`/notes/${n.id}`}
              deletable
            />
          ))
        )}
      </div>
    </div>
  );
}
