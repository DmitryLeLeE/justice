// Downloads courtroom drawings listed in data/sketches.json, but only after checking the rights
// statement at the source. It fails closed: if the statement cannot be read or is not clearly
// "public domain" / "no known restrictions on publication", the drawing is skipped and the site
// shows a placeholder. Writes public/sketches/<id>.jpg and src/data/sketches.generated.json.
//
// Usage: node scripts/fetch-sketches.mjs
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const UA = 'justice-atlas/0.1 (https://github.com/DmitryLeLeE/justice)';

export const stripHtml = (s = '') =>
  s.replace(/<[^>]*>/g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#0?39;/g, "'").replace(/\s+/g, ' ').trim();

/** Wikimedia Commons: accept only licences that start with Public domain / PD / CC0. */
export function commonsLicenseOk(shortName = '') {
  return /^(public domain|pd[\s-]|pd$|cc0)/i.test(shortName.trim());
}

/** Library of Congress: accept only the explicit "No known restrictions" advisory. */
export function locRightsOk(text = '') {
  if (!/no known restrictions on publication/i.test(text)) return false;
  return !/(may be restricted|not evaluated|restrictions apply|copyright)/i.test(text.replace(/no known restrictions on publication/gi, ''));
}

async function getJson(u) {
  const r = await fetch(u, { headers: { 'User-Agent': UA, Accept: 'application/json' } });
  if (!r.ok) throw new Error(`${r.status} ${u}`);
  return r.json();
}

async function getBytes(u) {
  const r = await fetch(u, { headers: { 'User-Agent': UA } });
  if (!r.ok) throw new Error(`${r.status} ${u}`);
  const ct = r.headers.get('content-type') || '';
  if (!ct.startsWith('image/')) throw new Error(`not an image (${ct}) ${u}`);
  return Buffer.from(await r.arrayBuffer());
}

export async function resolveCommons(entry) {
  const title = 'File:' + entry.file;
  const api =
    'https://commons.wikimedia.org/w/api.php?action=query&format=json&formatversion=2&prop=imageinfo' +
    '&iiprop=url|mime|extmetadata&iiurlwidth=1400&titles=' + encodeURIComponent(title);
  const data = await getJson(api);
  const page = data?.query?.pages?.[0];
  const info = page?.imageinfo?.[0];
  if (!info) throw new Error('file not found on Commons');
  const meta = info.extmetadata || {};
  const license = meta.LicenseShortName?.value || '';
  if (!commonsLicenseOk(license)) throw new Error(`licence not public domain: "${license}"`);
  if (meta.Restrictions?.value) throw new Error(`restrictions flagged: ${meta.Restrictions.value}`);
  return {
    downloadUrl: info.thumburl || info.url,
    license: license.replace(/^pd\b/i, 'Public domain'),
    artist: stripHtml(meta.Artist?.value) || entry.artistFallback,
    sourceUrl: info.descriptionurl || 'https://commons.wikimedia.org/wiki/' + encodeURIComponent(title.replace(/ /g, '_')),
  };
}

export async function resolveLoc(entry) {
  const data = await getJson(`https://www.loc.gov/item/${entry.item}/?fo=json`);
  const item = data.item || {};
  const rights = [item.rights_advisory, item.rights, item.rights_information, data.rights_advisory]
    .flat().filter(Boolean).join(' ');
  if (!locRightsOk(rights)) throw new Error(`rights statement not clear enough: "${rights.slice(0, 120)}"`);
  const urls = [item.image_url, data.resources?.flatMap((r) => r.image || r.files?.flat().map((f) => f.url))]
    .flat(2).filter((u) => typeof u === 'string' && /\.jpe?g/i.test(u));
  if (!urls.length) throw new Error('no JPEG found in item record');
  const best = urls[urls.length - 1].split('#')[0];
  return {
    downloadUrl: best.startsWith('//') ? 'https:' + best : best,
    license: 'No known restrictions on publication (Library of Congress rights advisory)',
    artist: entry.artistFallback,
    sourceUrl: `https://www.loc.gov/item/${entry.item}/`,
  };
}

async function main() {
  const manifest = JSON.parse(await readFile(path.join(root, 'data/sketches.json'), 'utf8'));
  const outDir = path.join(root, 'public/sketches');
  await mkdir(outDir, { recursive: true });
  const generated = {};
  for (const [id, entry] of Object.entries(manifest)) {
    if (id.startsWith('_')) continue;
    try {
      const r = entry.source === 'commons' ? await resolveCommons(entry) : await resolveLoc(entry);
      await writeFile(path.join(outDir, `${id}.jpg`), await getBytes(r.downloadUrl));
      generated[id] = {
        src: `sketches/${id}.jpg`,
        alt: entry.alt,
        caption: entry.caption,
        artist: r.artist,
        license: r.license,
        sourceUrl: r.sourceUrl,
      };
      console.log(`ok    ${id}  (${r.license})`);
    } catch (e) {
      console.warn(`skip  ${id}: ${e.message}`);
    }
  }
  await writeFile(path.join(root, 'src/data/sketches.generated.json'), JSON.stringify(generated, null, 2) + '\n');
}

if (process.argv[1] === fileURLToPath(import.meta.url)) await main();
