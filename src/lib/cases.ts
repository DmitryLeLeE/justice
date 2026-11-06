import { getCollection, type CollectionEntry } from 'astro:content';
import sketches from '../data/sketches.generated.json';

export type CaseEntry = CollectionEntry<'cases'>;

/** GitHub Pages prefix ('/justice') plus the path. */
export function url(path = ''): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const clean = path.replace(/^\//, '');
  return `${base}/${clean}`;
}

export async function getCases(): Promise<CaseEntry[]> {
  const all = await getCollection('cases', ({ data }) => !data.draft);
  // Drawings verified and downloaded by scripts/fetch-sketches.mjs fill in `image` when the case has none.
  const generated = sketches as Record<string, NonNullable<CaseEntry['data']['image']>>;
  for (const e of all) e.data.image ??= generated[e.id];
  return all.sort((a, b) => a.data.yearStart - b.data.yearStart || a.id.localeCompare(b.id));
}

export function yearsLabel(d: { yearStart: number; yearEnd?: number }): string {
  return d.yearEnd && d.yearEnd !== d.yearStart ? `${d.yearStart}–${d.yearEnd}` : `${d.yearStart}`;
}
