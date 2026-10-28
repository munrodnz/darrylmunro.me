import type { APIRoute } from "astro";

// Default is open: the site wants to be found and cited by search engines and
// AI assistants. Training crawlers are listed separately so they can be opted
// out (change Allow to Disallow) without affecting Google or Bing search.
const getRobotsTxt = (sitemapURL: URL) => `
User-agent: *
Allow: /

# AI search and answer engines (cite and link back)
User-agent: OAI-SearchBot
User-agent: ChatGPT-User
User-agent: Claude-SearchBot
User-agent: Claude-User
User-agent: PerplexityBot
User-agent: Perplexity-User
Allow: /

# AI model training
User-agent: GPTBot
User-agent: ClaudeBot
User-agent: Google-Extended
User-agent: Applebot-Extended
User-agent: CCBot
Allow: /

Sitemap: ${sitemapURL.href}
`;

export const GET: APIRoute = ({ site }) => {
  const sitemapURL = new URL("sitemap-index.xml", site);
  return new Response(getRobotsTxt(sitemapURL));
};
