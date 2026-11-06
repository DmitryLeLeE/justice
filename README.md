# Atlas of Justice

A map of famous trials with courtroom drawings, short case files and sources. Astro, static export, GitHub Pages.

```bash
npm install
npm run dev      # http://localhost:4321/justice/
npm run build
```

## Cases

One Markdown file per case in `src/content/cases/`. The frontmatter is validated (see `src/content.config.ts`); a bad field fails the build with a clear message. See the example on the About page.

## Drawings

Drawings are hot-linked from the archives that host them, not copied into the repo. A case appears on the site only if its frontmatter has an `image` block (absolute `src` URL, `artist`, `license` credit line, `sourceUrl`). Cases without one, or with `draft: true`, are hidden. Commons files use `https://commons.wikimedia.org/wiki/Special:FilePath/<File name>?width=1400`; Library of Congress items use the `tile.loc.gov` derivative (`...v.jpg`).

Each case can set `theme:`; the matching `[data-theme="..."]` block in `src/styles/global.css` gives it its own palette, type and frame.

## Deploy

Repository Settings → Pages → Source: GitHub Actions. Pushing to `main` builds and publishes. Site URL: `https://dmitrylelee.github.io/justice/`.
