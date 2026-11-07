// Checks the rules that the schema cannot express. Run: npm run lint:content
import { readCases } from './lib.mjs';

const problems = [];
const bad = (id, msg) => problems.push(`${id}: ${msg}`);
const cases = readCases();

for (const { id, data: d, body } of cases) {
  if (d.draft) continue;
  const img = d.image;
  if (!img) { bad(id, 'no main picture'); continue; }
  if (!/^https:\/\//.test(img.src)) bad(id, 'picture is not an https hot-link');
  if (!img.license) bad(id, 'picture has no licence line');
  if (!img.sourceUrl) bad(id, 'picture has no source page');
  if (!img.caption) bad(id, 'picture has no caption');
  const kind = img.kind ?? 'drawing';
  if (kind === 'drawing' && !img.artist) bad(id, 'a courtroom drawing needs the artist credit');
  if (kind === 'drawing' && /not a drawing/i.test(img.caption ?? '')) bad(id, 'caption says "not a drawing" but kind is drawing');
  if (kind !== 'drawing' && /^a (courtroom )?drawing\b/i.test(img.caption ?? '')) bad(id, `caption says drawing but kind is ${kind}`);
  if (d.summary.length > 240) bad(id, `summary is ${d.summary.length} characters (limit 240)`);
  if (!/^## /m.test(body)) bad(id, 'body has no "## " headings');
  const adultOpen = (body.match(/<section class="adult-only">/g) || []).length;
  const adultClose = (body.match(/<\/section>/g) || []).length;
  if (adultOpen !== adultClose) bad(id, 'unbalanced <section class="adult-only"> tags');
  const urls = (d.sources ?? []).map((s) => s.url);
  if (new Set(urls).size !== urls.length) bad(id, 'duplicate source URL');
  for (const t of d.timeline ?? []) if (!t.date || !t.event) bad(id, 'timeline entry without date or event');
  if (d.yearEnd && d.yearEnd < d.yearStart) bad(id, 'yearEnd before yearStart');
  if (Math.abs(d.lat) > 90 || Math.abs(d.lng) > 180) bad(id, 'coordinates out of range');
  for (const r of d.related ?? []) if (!cases.some((c) => c.id === r)) bad(id, `related case "${r}" does not exist`);
  if (/—|\bdelve\b|\btapestry\b|\bpivotal\b|\blandscape of\b/i.test(body)) bad(id, 'prose contains a stock phrase or em dash; reword');
}

const visible = cases.filter((c) => !c.data.draft);
if (problems.length) {
  console.error(problems.join('\n'));
  console.error(`\n${problems.length} problem(s) in ${visible.length} case files.`);
  process.exit(1);
}
console.log(`Content lint passed: ${visible.length} case files.`);
