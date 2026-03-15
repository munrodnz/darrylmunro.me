import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

export const BLOG_PATH = "src/content/blog";
export const PROJECTS_PATH = "src/content/projects";

const blog = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: `./${BLOG_PATH}` }),
  schema: ({ image }) =>
    z.object({
      author: z.string().default("Darryl Munro"),
      pubDatetime: z.coerce.date(),
      modDatetime: z.date().optional().nullable(),
      title: z.string(),
      featured: z.boolean().optional(),
      draft: z.boolean().optional(),
      unlisted: z.boolean().optional(),
      tags: z.array(z.string()).default(["others"]),
      ogImage: image().or(z.string()).optional(),
      heroImage: z.string().optional(),
      description: z.string(),
      canonicalURL: z.string().optional(),
      hideEditPost: z.boolean().optional(),
      timezone: z.string().optional(),
      source: z.string().optional(),
      AIDescription: z.boolean().optional(),
    }),
});

const projects = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: `./${PROJECTS_PATH}` }),
  schema: () =>
    z.object({
      title: z.string(),
      description: z.string(),
      tag: z.string(), // e.g. "Food Safety · SaaS"
      status: z.string(), // e.g. "In development"
      statusType: z.enum(["live", "building", "idea", "paused"]),
      featured: z.boolean().default(false), // show on homepage
      sortOrder: z.number().default(99), // homepage display order
      draft: z.boolean().default(false),
      heroImage: z.string().optional(), // hero/banner image
      url: z.string().optional(), // live project URL
      repoUrl: z.string().optional(), // GitHub repo
      techStack: z.array(z.string()).default([]),
      startDate: z.string().optional(), // e.g. "2025-06"
    }),
});

export const collections = { blog, projects };
