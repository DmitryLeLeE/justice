import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { regionKeys, categoryKeys, verdictKeys } from './lib/taxonomy';

const cases = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/cases' }),
  schema: z.object({
    title: z.string(),
    // Name of the proceeding in the local language, if any
    titleOriginal: z.string().optional(),
    country: z.string(),
    city: z.string(),
    court: z.string(),
    region: z.enum(regionKeys),
    category: z.enum(categoryKeys),
    // Map marker: city centre or courthouse area, never a precise address
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180),
    yearStart: z.number().int(),
    yearEnd: z.number().int().optional(),
    // One or two sentences for the card and the map popup
    summary: z.string().max(240),
    // How it ended, in a sentence or two
    outcome: z.string(),
    // Drives the coloured stamp on the card and the dossier
    verdict: z.enum(verdictKeys).optional(),
    // "At a glance" block on the dossier page. Every field is optional
    glance: z
      .object({
        defendants: z.string().optional(),
        charges: z.string().optional(),
        judge: z.string().optional(),
        prosecution: z.string().optional(),
        defence: z.string().optional(),
      })
      .optional(),
    // Key dates, oldest first
    timeline: z.array(z.object({ date: z.string(), event: z.string() })).optional(),
    // Slugs of related files; when absent the page picks neighbours from the same drawer
    related: z.array(z.string()).optional(),
    // Courtroom drawing, hot-linked from the archive that hosts it (absolute URL). Every case published on the site has one
    image: z
      .object({
        src: z.string(),
        alt: z.string(),
        artist: z.string().optional(),
        // What the drawing shows and when it was made
        caption: z.string().optional(),
        license: z.string(),
        sourceUrl: z.string().url(),
        // What kind of picture it is; drives the note on the frame. Defaults to a courtroom drawing
        kind: z.enum(['drawing', 'photo', 'other']).default('drawing'),
      })
      .optional(),
    // Only shown in the 18+ edition (graphic subject matter)
    mature: z.boolean().default(false),
    // Extra documentary pictures from case materials, shown in the 18+ edition only
    gallery: z
      .array(
        z.object({
          src: z.string(),
          alt: z.string(),
          caption: z.string(),
          credit: z.string(),
          sourceUrl: z.string().url(),
        }),
      )
      .optional(),
    sources: z.array(z.object({ title: z.string(), url: z.string().url() })).min(1),
    draft: z.boolean().default(false),
  }),
});

export const collections = { cases };
