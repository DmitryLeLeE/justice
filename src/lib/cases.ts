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
