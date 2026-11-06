# Atlas of Justice

A map of famous trials with courtroom drawings, short case files and sources. Astro, static export, GitHub Pages.

```bash
npm install
npm run dev      # http://localhost:4321/justice/
npm run build
```

## Cases

One Markdown file per case in `src/content/cases/`. The frontmatter is validated (see `src/content.config.ts`); a bad field fails the build with a clear message. See the example on the About page.

## Drawings and rights

Drawings are listed in `data/sketches.json` and fetched by `scripts/fetch-sketches.mjs` (it runs in the GitHub Actions workflow before the build, or locally with `node scripts/fetch-sketches.mjs`). The script **fails closed**:

- Wikimedia Commons files are accepted only if the licence is Public domain / PD / CC0.
- Library of Congress items are accepted only if the record says "No known restrictions on publication". That is the Library's rights advisory, not a legal guarantee.
- Anything else is skipped and the case shows an empty frame.

Each image is shown with artist, rights note and a link to the archive record. Output: `public/sketches/<id>.jpg` and `src/data/sketches.generated.json`.

The script needs access to commons.wikimedia.org and loc.gov. It was written without being able to reach those sites, so check the Actions log of the first run for `ok` / `skip` lines.

## Deploy

Repository Settings → Pages → Source: GitHub Actions. Pushing to `main` builds and publishes. Site URL: `https://dmitrylelee.github.io/justice/`.
