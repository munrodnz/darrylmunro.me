import type { APIRoute } from "astro";
import { SITE } from "@/config";
import { getPatterns, type Pattern, patternMarkdown } from "@/utils/patterns";

export async function getStaticPaths() {
  const patterns = await getPatterns();
  return patterns.map((pattern) => ({ params: { slug: pattern.id }, props: { pattern } }));
}

export const GET: APIRoute = ({ props, site }) => {
  const { pattern } = props as { pattern: Pattern };
  return new Response(patternMarkdown(pattern, site ?? new URL(SITE.website)), {
    status: 200,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
