// Fetches every hot-linked picture and reports the ones that no longer load.
// Run: npm run check:images   (CI runs it weekly; Commons can rate-limit, so it goes one request at a time)
import { readCases } from './lib.mjs';

const UA = 'AtlasOfJusticeLinkChecker/1.0 (https://github.com/DmitryLeLeE/justice)';
const urls = [];
for (const { id, data: d } of readCases()) {
  if (d.draft) continue;
  if (d.image?.src) urls.push([id, d.image.src]);
  for (const g of d.gallery ?? []) if (g.src) urls.push([id, g.src]);
}

async function check(url) {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': UA }, redirect: 'follow' });
      if (res.status === 429 || res.status >= 500) { await new Promise((r) => setTimeout(r, 4000 * (attempt + 1))); continue; }
      const type = res.headers.get('content-type') ?? '';
      await res.body?.cancel();
      return res.ok && type.startsWith('image/') ? null : `HTTP ${res.status} ${type}`;
    } catch (e) {
      if (attempt === 2) return String(e.message ?? e);
    }
  }
  return 'gave up after retries';
}

const failures = [];
for (const [id, url] of urls) {
  const err = await check(url);
  if (err) failures.push(`${id}: ${err}\n   ${url}`);
  await new Promise((r) => setTimeout(r, 400));
}
if (failures.length) {
  console.error(failures.join('\n'));
  console.error(`\n${failures.length} of ${urls.length} pictures failed.`);
  process.exit(1);
}
console.log(`All ${urls.length} pictures load.`);
