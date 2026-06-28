"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
    >
      {children}
    </Link>
  );
}

export function Navbar() {
  const { status } = useSession();
  const authed = status === "authenticated";

  return (
    <header className="border-b border-[var(--border)]">
      <nav className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
        <Link
          href="/"
          className="text-base font-semibold tracking-tight text-[var(--foreground)]"
        >
          notes
        </Link>

        <div className="flex items-center gap-5">
          <NavLink href="/feed">Feed</NavLink>
          {authed ? (
            <>
              <NavLink href="/notes">My notes</NavLink>
              <NavLink href="/settings">Settings</NavLink>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <NavLink href="/login">Login</NavLink>
              <NavLink href="/register">Register</NavLink>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
