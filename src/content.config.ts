import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const about = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/about' }),
  schema: z.object({}),
});

const news = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/news' }),
  schema: z.object({
    year: z.string(),
    textEs: z.string(),
    textEn: z.string(),
    images: z.array(z.object({
      image: z.string().startsWith('/'),
      altEs: z.string(),
      altEn: z.string(),
    })).default([]),
  }),
});

const publications = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/publications' }),
  schema: z.object({
    bibtex: z.string().min(1),
  }),
});

const datasets = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/datasets' }),
  schema: z.object({
    published: z.boolean(),
    titleEs: z.string(),
    titleEn: z.string(),
    descriptionEs: z.string(),
    descriptionEn: z.string(),
    url: z.string().url().optional(),
  }),
});

const memberSchema = z.object({
  order: z.number().int(),
  name: z.string(),
  roleEs: z.string(),
  roleEn: z.string(),
  focusEs: z.string(),
  focusEn: z.string(),
  link: z.string().url().optional(),
});

const members = defineCollection({
  loader: glob({ pattern: 'team.md', base: './src/content/members' }),
  schema: z.object({
    members: z.array(memberSchema),
    interns: z.array(memberSchema),
    alumni: z.array(memberSchema),
  }),
});

const slides = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/slides' }),
  schema: z.object({
    order: z.number().int(),
    image: z.string().startsWith('/'),
    altEs: z.string(),
    altEn: z.string(),
  }),
});

export const collections = { about, news, publications, datasets, members, slides };
