"use client";

import { useEffect, useState } from "react";

export default function SettingsPage() {
  const [theme, setTheme] = useState("light");
  const [fontSize, setFontSize] = useState(14);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/settings", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.settings) {
          setTheme(data.settings.theme ?? "light");
          setFontSize(data.settings.fontSize ?? 14);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  async function onSave() {
    setSaving(true);
    setMessage(null);
    const res = await fetch("/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ theme, fontSize }),
    });
    setSaving(false);
    setMessage(res.ok ? "Saved" : "Failed to save");
    if (res.ok) window.location.reload();
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-sm text-[var(--muted)]">
        Loading…
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
      <p className="mt-1 text-sm text-[var(--muted)]">
        Personalize how notes looks for you.
      </p>

      <div className="mt-8 space-y-6">
        <div>
          <label className="mb-2 block text-sm font-medium">Theme</label>
          <div className="flex gap-3">
            {["light", "dark"].map((t) => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                className={`rounded-md border px-4 py-2 text-sm capitalize transition-colors ${
                  theme === t
                    ? "border-[var(--accent)] text-[var(--accent)]"
                    : "border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)]"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Base font size: <span className="text-[var(--accent)]">{fontSize}px</span>
          </label>
          <input
            type="range"
            min={12}
            max={20}
            value={fontSize}
            onChange={(e) => setFontSize(Number(e.target.value))}
            className="w-full"
          />
        </div>

        {message && <p className="text-sm text-[var(--muted)]">{message}</p>}

        <button
          onClick={onSave}
          disabled={saving}
          className="rounded-md bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save settings"}
        </button>
      </div>
    </div>
  );
}
