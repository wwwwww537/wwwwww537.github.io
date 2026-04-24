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
    desc: z.string(),
    pubDate: z.date(),
    category: z.string(),
    tech: z.array(z.string()),
    lang: z.enum(['zh', 'en']).default('zh'),
  }),
});

const projectsCollection = defineCollection({
  // Astro 5.0 推荐使用 glob 或其它 loader，这里沿用你的标准方式
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    lang: z.enum(['zh', 'en']),
    title: z.string(),
    status: z.string(),
    category: z.string(),
    desc: z.string(),
    tech: z.array(z.string()),
    repoUrl: z.string().optional(), // 源代码链接（可选）
    liveUrl: z.string().optional()  // 在线演示链接（可选）
  }),
});

export const collections = {
  'blog': blogCollection,
  'projects': projectsCollection,
};