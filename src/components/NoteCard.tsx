"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  id: string;
  title: string;
  content?: string;
  showContent?: boolean;
  href?: string;
  deletable?: boolean;
};

export function NoteCard({
  id,
  title,
  content,
  showContent = false,
  href,
  deletable = false,
}: Props) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function onDelete() {
    setDeleting(true);
    const res = await fetch(`/api/notes/${id}`, { method: "DELETE" });
    setDeleting(false);
    if (res.ok) router.refresh();
  }

  const titleEl = (
    <h3 className="font-medium hover:text-[var(--accent)] transition-colors">
      {title}
    </h3>
  );

  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-4">
      {href ? (
        <Link href={href}>{titleEl}</Link>
      ) : (
        titleEl
      )}
      {showContent && content && (
        <p className="mt-2 whitespace-pre-wrap text-sm text-[var(--muted)]">
          {content}
        </p>
      )}
      {deletable && (
        <button
          onClick={onDelete}
          disabled={deleting}
          className="mt-3 text-xs text-[var(--muted)] hover:text-red-500 transition-colors disabled:opacity-50"
        >
          {deleting ? "Deleting…" : "Delete"}
        </button>
      )}
    </div>
  );
}
