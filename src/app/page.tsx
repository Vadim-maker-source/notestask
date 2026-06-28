import Link from "next/link";
import { getServerSession } from "@/lib/session";

export default async function Home() {
  const session = await getServerSession();
  const authed = !!session?.user;

  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">notes</h1>
      <p className="mt-3 text-[var(--muted)]">
        A minimal place for your private notes. Keep your thoughts to yourself —
        only you can read what you write.
      </p>

      <div className="mt-8 flex gap-3">
        {authed ? (
          <Link
            href="/notes"
            className="rounded-md bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity"
          >
            Go to my notes
          </Link>
        ) : (
          <>
            <Link
              href="/register"
              className="rounded-md bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity"
            >
              Get started
            </Link>
            <Link
              href="/login"
              className="rounded-md border border-[var(--border)] px-4 py-2 text-sm font-medium hover:bg-[var(--card)] transition-colors"
            >
              Login
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
