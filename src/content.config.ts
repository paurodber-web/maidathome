import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    intro: z.string().min(1).optional(),
    takeaway: z.string().min(1).optional(),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    category: z.enum(['home-care', 'cleaning-guides', 'moving', 'local-living']),
    categoryLabel: z.string().min(1),
    image: z.url(),
    imageAlt: z.string().min(1),
    imageWidth: z.number().int().positive().default(1200),
    imageHeight: z.number().int().positive().default(800),
    readingTime: z.string().min(1),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
