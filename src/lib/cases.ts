import { getCollection, type CollectionEntry } from 'astro:content';

export type CaseEntry = CollectionEntry<'cases'>;

/** Префикс GitHub Pages ('/justice') + путь, всегда со слэшем в конце для страниц. */
export function url(path = ''): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const clean = path.replace(/^\//, '');
  return `${base}/${clean}`;
}

export async function getCases(): Promise<CaseEntry[]> {
  const all = await getCollection('cases', ({ data }) => !data.draft);
  return all.sort((a, b) => a.data.yearStart - b.data.yearStart || a.id.localeCompare(b.id));
}

export function yearsLabel(d: { yearStart: number; yearEnd?: number }): string {
  return d.yearEnd && d.yearEnd !== d.yearStart ? `${d.yearStart}–${d.yearEnd}` : `${d.yearStart}`;
}
