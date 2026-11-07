import { readdirSync, readFileSync } from 'node:fs';
import { parse } from 'yaml';

const DIR = new URL('../src/content/cases/', import.meta.url);

/** Every case file as { id, data, body }. */
export function readCases() {
  return readdirSync(DIR)
    .filter((f) => f.endsWith('.md'))
    .map((f) => {
      const raw = readFileSync(new URL(f, DIR), 'utf8');
      const m = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
      if (!m) throw new Error(`${f}: no front matter`);
      return { id: f.replace(/\.md$/, ''), data: parse(m[1]), body: m[2] };
    });
}
