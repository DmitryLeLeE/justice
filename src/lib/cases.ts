import { getCollection, type CollectionEntry } from 'astro:content';

export type CaseEntry = CollectionEntry<'cases'>;

/** GitHub Pages prefix ('/justice') plus the path. */
export function url(path = ''): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const clean = path.replace(/^\//, '');
  return `${base}/${clean}`;
}

export async function getCases(): Promise<CaseEntry[]> {
  const all = await getCollection('cases', ({ data }) => !data.draft && !!data.image);
  return all.sort((a, b) => a.data.yearStart - b.data.yearStart || a.id.localeCompare(b.id));
}

export function yearsLabel(d: { yearStart: number; yearEnd?: number }): string {
  return d.yearEnd && d.yearEnd !== d.yearStart ? `${d.yearStart}–${d.yearEnd}` : `${d.yearStart}`;
}

/** Hot-linked drawings are absolute URLs; local files get the site base path. */
export function imgSrc(src: string): string {
  return /^https?:\/\//.test(src) ? src : url(src);
}

/** Up to `n` files related to `entry`: the explicit list first, then the same drawer by closeness in time. */
export function relatedFor(entry: CaseEntry, all: CaseEntry[], n = 3): CaseEntry[] {
  const byId = new Map(all.map((c) => [c.id, c]));
  const picked: CaseEntry[] = [];
  for (const id of entry.data.related ?? []) {
    const c = byId.get(id);
    if (c && c.id !== entry.id) picked.push(c);
  }
  const rest = all
    .filter((c) => c.id !== entry.id && c.data.category === entry.data.category && !picked.includes(c))
    .sort((a, b) => Math.abs(a.data.yearStart - entry.data.yearStart) - Math.abs(b.data.yearStart - entry.data.yearStart));
  return [...picked, ...rest].slice(0, n);
}

export function decadeOf(year: number): number {
  return Math.floor(year / 10) * 10;
}

/** The file number is the position in the chronological index. */
export function fileNo(index: number): string {
  return `AJ-${String(index + 1).padStart(3, '0')}`;
}
