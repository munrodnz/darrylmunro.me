import { defineCollection, reference, z } from "astro:content";
import { glob } from "astro/loaders";
import { BOUNDARY_KEYS, DOMAIN_KEYS } from "./data/patternTaxonomy";

export const BLOG_PATH = "src/content/blog";
export const PROJECTS_PATH = "src/content/projects";
export const PATTERNS_PATH = "src/content/patterns";

const wordCount = (s: string) => s.trim().split(/\s+/).filter(Boolean).length;

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

/**
 * Pattern library. The schema is strict on purpose: SEO and AI-engine hygiene
 * is enforced at build time, so a pattern with a 220-character description or
 * a summary that can't stand on its own fails the build instead of shipping.
 * Files starting with "_" (e.g. _template.md) are ignored.
 */
const patterns = defineCollection({
  loader: glob({ pattern: "**/[^_]*.md", base: `./${PATTERNS_PATH}` }),
  schema: ({ image }) =>
    z.object({
      // Identity
      title: z.string().max(70),
      seoTitle: z.string().max(60).optional(),
      description: z.string().min(70).max(160),

      // Answer-first content (what search and AI engines quote)
      summary: z.string().refine((s) => wordCount(s) >= 40 && wordCount(s) <= 80, {
        message: "summary should be 40–80 words so it can be quoted on its own",
      }),
      problem: z.string().min(80),
      symptoms: z.array(z.string()).min(3).max(6),

      // The Daz Method
      tryFirst: z
        .array(z.object({ rung: z.number().int().min(1).max(5), action: z.string() }))
        .min(1),
      ladderRung: z.number().int().min(1).max(5),
      significantLine: z.string(),

      // Taxonomy
      domain: z.enum(DOMAIN_KEYS),
      boundary: z.enum(BOUNDARY_KEYS),
      tags: z.array(z.string()).max(8).default([]),
      related: z.array(reference("patterns")).default([]),

      // Rendered on the page and emitted as FAQPage JSON-LD
      faq: z
        .array(z.object({ q: z.string(), a: z.string() }))
        .max(6)
        .default([]),

      // Freshness and provenance
      published: z.coerce.date(),
      reviewed: z.coerce.date().optional(),
      draft: z.boolean().default(true),
      inspiredBy: z
        .array(z.object({ name: z.string(), url: z.string().url(), author: z.string().optional() }))
        .default([]),

      // Social
      ogImage: image().optional(),
      ogImageAlt: z.string().optional(),
    }),
});

export const collections = { blog, projects, patterns };
