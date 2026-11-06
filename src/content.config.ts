import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { regionKeys, categoryKeys } from './lib/taxonomy';

const cases = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/cases' }),
  schema: z.object({
    title: z.string(),
    // Название процесса на языке страны, если есть
    titleOriginal: z.string().optional(),
    country: z.string(),
    city: z.string(),
    court: z.string(),
    region: z.enum(regionKeys),
    category: z.enum(categoryKeys),
    // Ориентир на карте: центр города или здание суда, не точный адрес
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180),
    yearStart: z.number().int(),
    yearEnd: z.number().int().optional(),
    // 1-2 предложения для карточки и всплывающего окна на карте
    summary: z.string().max(240),
    // Чем закончилось
    outcome: z.string(),
    // Рисунок из зала суда. Файл кладётся в public/sketches/
    image: z
      .object({
        src: z.string(),
        alt: z.string(),
        artist: z.string().optional(),
        // Что именно на рисунке и когда сделан
        caption: z.string().optional(),
        license: z.string(),
        sourceUrl: z.string().url(),
      })
      .optional(),
    sources: z.array(z.object({ title: z.string(), url: z.string().url() })).min(1),
    draft: z.boolean().default(false),
  }),
});

export const collections = { cases };
