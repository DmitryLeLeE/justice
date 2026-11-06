import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { regionKeys, categoryKeys } from './lib/taxonomy';

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
    // How it ended
    outcome: z.string(),
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
      })
      .optional(),
    sources: z.array(z.object({ title: z.string(), url: z.string().url() })).min(1),
    // Visual theme slug; each case with a drawing gets its own look (see [data-theme] blocks in global.css)
    theme: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { cases };
