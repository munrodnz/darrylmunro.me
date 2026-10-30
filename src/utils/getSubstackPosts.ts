// ── SUBSTACK ARCHIVE FETCHER ──────────────────────────────────
// Fetches ALL posts from a Substack publication at build time
// using the archive API (no post limit, unlike RSS which caps at 20).
// Public and paid posts are both listed; paid posts link to Substack's
// free preview and are flagged so the UI can label them.
// New posts appear after the next build. The "Substack rebuild" GitHub
// Action triggers that build hourly when a new post has been published.
// To change the Substack, update the constants below.

const SUBSTACK_BASE = "https://darrylmunro.substack.com";
const PAGE_SIZE = 50; // max allowed by the API

// "everyone" = public. "only_paid" = paid subscribers, with a free preview
// that anyone can read. Other audiences (e.g. free-subscriber-only or
// founding-member posts) are left off the site.
const LISTED_AUDIENCES = new Set(["everyone", "only_paid"]);

export interface SubstackPost {
  title: string;
  description: string;
  url: string;
  pubDatetime: Date;
  heroImage?: string;
  source: "substack";
  /** True when the post is for paid subscribers; the link lands on Substack's free preview. */
  paid: boolean;
}

interface SubstackArchiveItem {
  title: string;
  subtitle?: string;
  description?: string;
  slug: string;
  post_date: string;
  canonical_url: string;
  cover_image?: string;
  audience: string;
}

async function fetchPage(offset: number): Promise<SubstackArchiveItem[]> {
  const url = `${SUBSTACK_BASE}/api/v1/archive?sort=new&offset=${offset}&limit=${PAGE_SIZE}`;
  const response = await fetch(url);
  if (!response.ok) {
    console.warn(`Substack archive API error: ${response.status}`);
    return [];
  }
  const data = await response.json();
  if (Array.isArray(data)) return data;
  return [];
}

export async function getSubstackPosts(): Promise<SubstackPost[]> {
  try {
    const allItems: SubstackArchiveItem[] = [];
    let offset = 0;

    // Paginate through all posts
    while (true) {
      const page = await fetchPage(offset);
      if (page.length === 0) break;
      allItems.push(...page);
      if (page.length < PAGE_SIZE) break; // last page
      offset += PAGE_SIZE;
    }

    return allItems
      .filter((item) => LISTED_AUDIENCES.has(item.audience))
      .map((item) => ({
        title: item.title,
        description: (item.subtitle || item.description || "").slice(0, 300),
        url: item.canonical_url,
        pubDatetime: new Date(item.post_date),
        heroImage: item.cover_image || undefined,
        source: "substack" as const,
        paid: item.audience === "only_paid",
      }));
  } catch (error) {
    console.warn("Error fetching Substack archive:", error);
    return [];
  }
}
