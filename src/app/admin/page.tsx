"use client";

import { useState } from "react";

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [hint, setHint] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    await new Promise((r) => setTimeout(r, 400));
    setLoading(false);
    if (password !== "s3cret-admin-d0-not-share") {
      setError("Invalid admin password");
    } else {
      setHint(true)
    }
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-16">
      <h1 className="text-2xl font-semibold tracking-tight">Admin</h1>
      <p className="mt-2 text-sm text-[var(--muted)]">
        Только для админов
      </p>
      {!hint && (
      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-md border border-[var(--border)] bg-transparent px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
          />
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {loading ? "Verifying…" : "Enter"}
        </button>
      </form>
      )}
      {hint && (
        <div className="mt-4 rounded-md bg-yellow-100 p-4 text-md text-yellow-800">
          <p>
            <code>{process.env.NEXT_PUBLIC_HINT}</code>
            <br />
            <br />
            <code>{process.env.NEXT_PUBLIC_HINT2}</code>
          </p>
        </div>
      )}
    </div>
  );
}
