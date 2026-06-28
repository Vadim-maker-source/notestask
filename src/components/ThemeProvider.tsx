"use client";

import { useEffect, useState } from "react";

type Settings = {
  theme?: string;
  fontSize?: number;
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>({});

  useEffect(() => {
    let active = true;
    fetch("/api/settings", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (active && data?.settings) setSettings(data.settings);
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (settings.theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    if (typeof settings.fontSize === "number") {
      root.style.fontSize = `${settings.fontSize}px`;
    }
  }, [settings]);

  return <>{children}</>;
}
