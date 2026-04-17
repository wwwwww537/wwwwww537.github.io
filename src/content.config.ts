// src/content.config.ts
// 1. 从 astro:content 中只引入 defineCollection
import { defineCollection } from 'astro:content';
// 2. 按照最新规范，从 astro/zod 引入 z
import { z } from 'astro/zod';
// 3. 引入 glob 加载器
import { glob } from 'astro/loaders'; 

const blogCollection = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date(),
    category: z.string(),
    tags: z.array(z.string()),
    lang: z.enum(['zh', 'en']).default('zh'),
  }),
});

export const collections = {
  'blog': blogCollection,
};