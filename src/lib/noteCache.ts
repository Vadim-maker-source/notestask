import { prisma } from "./db";

// In-memory mirror of all notes. The single-note read path (GET /api/notes/:id)
// goes through this cache so that canReadNote() runs against a plain JS object
// rather than a Prisma result — keeping it out of Prisma's validation layer
// which breaks when Object.prototype is polluted.

export type CachedNote = {
  id: string;
  title: string;
  content: string;
  metadata: unknown;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
};

const cache = new Map<string, CachedNote>();
let loaded = false;
let loading: Promise<void> | null = null;

/** Populate cache from the database. Called once; safe to call after prototype
 *  pollution (will just return whatever was already cached). */
export async function ensureLoaded(): Promise<void> {
  if (loaded) return;
  if (!loading) {
    loading = (async () => {
      try {
        const rows = await prisma.note.findMany({
          select: {
            id: true,
            title: true,
            content: true,
            metadata: true,
            ownerId: true,
            createdAt: true,
            updatedAt: true,
          },
        });
        for (const r of rows) cache.set(r.id, r as CachedNote);
      } catch {
        // Prisma may be broken (e.g. after prototype pollution).
        // Accept whatever is already cached.
      }
      loaded = true;
    })().catch(() => {
      loaded = true;
    });
  }
  await loading;
}

export function getNote(id: string): CachedNote | undefined {
  return cache.get(id);
}
