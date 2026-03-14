// ── SUBSTACK RSS FEED FETCHER ─────────────────────────────────
// Fetches posts from a Substack RSS feed at build time.
// To change the Substack, update the URL below.

const SUBSTACK_FEED_URL = "https://darrylmunro.substack.com/feed";

export interface SubstackPost {
  title: string;
  description: string;
  url: string;
  pubDatetime: Date;
  heroImage?: string;
  source: "substack";
}

/**
 * Parse a simple XML string to extract values by tag name.
 * This avoids needing a full XML parser dependency.
 */
function extractTag(xml: string, tag: string): string {
  const match = xml.match(new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>`));
  if (match) return match[1].trim();

  const simple = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`));
  return simple ? simple[1].trim() : "";
}

function extractImageFromContent(content: string): string | undefined {
  // Look for the first <img> src in the content
  const imgMatch = content.match(/<img[^>]+src=["']([^"']+)["']/);
  if (imgMatch) return imgMatch[1];

  // Look for enclosure or media:content
  const enclosureMatch = content.match(/<enclosure[^>]+url=["']([^"']+)["'][^>]+type=["']image/);
  if (enclosureMatch) return enclosureMatch[1];

  return undefined;
}

export async function getSubstackPosts(): Promise<SubstackPost[]> {
  try {
    const response = await fetch(SUBSTACK_FEED_URL);
    if (!response.ok) {
      console.warn(`Failed to fetch Substack feed: ${response.status} ${response.statusText}`);
      return [];
    }

    const xml = await response.text();

    // Split into individual <item> blocks
    const items = xml.split("<item>").slice(1);

    return items
      .map((item) => {
        const title = extractTag(item, "title");
        const link = extractTag(item, "link");
        const description = extractTag(item, "description") || extractTag(item, "subtitle");
        const pubDate = extractTag(item, "pubDate");
        const content = extractTag(item, "content:encoded") || extractTag(item, "content");
        const heroImage =
          extractImageFromContent(item) || (content ? extractImageFromContent(content) : undefined);

        if (!title || !link) return null;

        return {
          title,
          description: description.replace(/<[^>]*>/g, "").slice(0, 300),
          url: link,
          pubDatetime: pubDate ? new Date(pubDate) : new Date(),
          heroImage,
          source: "substack" as const,
        };
      })
      .filter((post): post is SubstackPost => post !== null);
  } catch (error) {
    console.warn("Error fetching Substack feed:", error);
    return [];
  }
}
