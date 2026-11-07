# Atlas of Justice

An interactive map of famous trials: one case file per trial, with a main picture (a courtroom drawing, or a photograph from the courtroom or the case file), a short account, a timeline and sources. Written in English as "official case files". Built with Astro as a static site.

**Live site:** https://dmitrylelee.github.io/justice/

## What is in it

- **149 case files** from 1633 to 2026, in 13 categories (murder, serial killers, mob, assassination, terrorism, spies, political trials, war crimes, fraud, celebrity, wrongful conviction, landmark rulings, inquiries).
- A **world map** with a pin per case, filters by category, region, verdict and period, and a random-case button.
- Each case page has "at a glance" facts (defendants, charges, judge, prosecution, defence), a timeline, related cases and a source list.
- Each case has one main picture: a courtroom drawing where court artists were the public's eyes, or a photograph from the courtroom or the case file (press photographs, booking photographs, exhibits). For the best-documented cases a photograph is preferred over a drawing.
- Pictures are **hot-linked** from the archives that hold them (Wikimedia Commons, Library of Congress and others). Each one carries a credit line and says whether it is a courtroom drawing, a photograph or another kind of picture.

## The 18+ edition

The site has two editions on the same pages. The standard edition shows 136 cases. The **18+ switch** in the navigation bar asks the reader to confirm their age and then adds:

- 13 further cases marked 18+ (for example Leopold and Loeb, Emmett Till, Bundy, Breivik, McVeigh, Gacy, the Doctors' Trial, Mladić, Karadžić, Shipman, Ramirez, the 1938 Moscow trial);
- frank "18+" sections inside existing case files, set off with a red rule;
- documentary photographs from case materials, where the case has them (booking photographs, exhibits shown in court).

The switch is a reader's choice stored in the browser (`localStorage`, key `aj-adult`). It is not an access barrier. Crime-scene and victim photographs are not used anywhere on the site.

## Run it locally

```bash
npm install
npm run dev      # http://localhost:4321/justice/
npm run build    # static output in dist/
```

## Adding a case

Each case is one Markdown file in `src/content/cases/`. The frontmatter is validated by `src/content.config.ts`; a bad field fails the build with a clear message. A full example is on the site's About page.

```yaml
---
title: The Trial of Dr Crippen
country: United Kingdom
city: London
court: Central Criminal Court (Old Bailey)
region: europe                 # europe | north-america | south-america | africa | asia | oceania
category: murder
lat: 51.5155
lng: -0.1025
yearStart: 1910
summary: One or two sentences, at most 240 characters.
outcome: What the court decided.
verdict: guilty                # guilty | acquitted | overturned | mixed | hung | dismissed | settled | ruling | inquiry
mature: false                  # true = shown only in the 18+ edition
image:
  src: https://commons.wikimedia.org/wiki/Special:FilePath/<File name>?width=1400
  alt: Description of the picture
  kind: photo                  # drawing (default) | photo | other
  artist: Name
  license: Public domain
  sourceUrl: https://commons.wikimedia.org/wiki/File:<File name>
sources:
  - title: Wikipedia, Hawley Harvey Crippen
    url: https://en.wikipedia.org/wiki/Hawley_Harvey_Crippen
---
```

Optional fields: `titleOriginal`, `glance`, `timeline`, `related` (slugs of other cases), `gallery` (extra documentary photographs, shown in the 18+ edition only).

### 18+ sections

Inside the body, wrap the text in a raw HTML section. It is hidden in the standard edition:

```markdown
<section class="adult-only">

## 18+ · Title

Text.

</section>
```

### Pictures

A case appears only if its frontmatter has an `image` block, and it is hidden if it has `draft: true`. Pictures are never copied into the repository. Commons files use `https://commons.wikimedia.org/wiki/Special:FilePath/<File name>?width=1400`; Library of Congress items use the `tile.loc.gov` derivative (`...v.jpg`). Always keep the `artist` and `license` credit line, and test that the link loads before committing.

## Deploy

Repository Settings → Pages → Source: GitHub Actions. Pushing to `main` builds and publishes.

## Layout

```
src/content/cases/    case files (Markdown)
src/content.config.ts frontmatter schema
src/pages/            index (map), cases/[id], category/[slug], about
src/components/       CaseCard and others
src/layouts/Base.astro  page shell, 18+ switch and age gate
src/styles/global.css all styling
```
