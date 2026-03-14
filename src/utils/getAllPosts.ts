// ── BLENDED POST LIST ─────────────────────────────────────────
// Merges local blog posts with Substack RSS posts into a single
// chronologically sorted list.

import type { CollectionEntry } from "astro:content";
import { getCollection } from "astro:content";
import { getPath } from "./getPath";
import getSortedPosts from "./getSortedPosts";
import { getSubstackPosts, type SubstackPost } from "./getSubstackPosts";

export interface UnifiedPost {
  title: string;
  description: string;
  url: string;
  pubDatetime: Date;
  heroImage?: string;
  source: "local" | "substack";
}

function localToUnified(post: CollectionEntry<"blog">): UnifiedPost {
  return {
    title: post.data.title,
    description: post.data.description,
    url: getPath(post.id, post.filePath),
    pubDatetime: new Date(post.data.pubDatetime),
    heroImage: post.data.heroImage,
    source: "local",
  };
}

function substackToUnified(post: SubstackPost): UnifiedPost {
  return {
    title: post.title,
    description: post.description,
    url: post.url,
    pubDatetime: post.pubDatetime,
    heroImage: post.heroImage,
    source: "substack",
  };
}

export async function getAllPosts(): Promise<UnifiedPost[]> {
  const [localPosts, substackPosts] = await Promise.all([
    getCollection("blog", ({ data }) => !data.draft),
    getSubstackPosts(),
  ]);

  const sortedLocal = getSortedPosts(localPosts);

  // Deduplicate: if a local post has the same title as a Substack post,
  // prefer the local version (user chose to put it on the site).
  const localTitles = new Set(sortedLocal.map((p) => p.data.title.toLowerCase().trim()));

  const uniqueSubstack = substackPosts.filter(
    (sp) => !localTitles.has(sp.title.toLowerCase().trim())
  );

  const unified: UnifiedPost[] = [
    ...sortedLocal.map(localToUnified),
    ...uniqueSubstack.map(substackToUnified),
  ];

  // Sort by date, newest first
  unified.sort((a, b) => b.pubDatetime.getTime() - a.pubDatetime.getTime());

  return unified;
}
