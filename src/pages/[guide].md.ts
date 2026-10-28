import type { APIRoute } from "astro";
import { SITE } from "@/config";
import { type Guide, getGuides, guideMarkdown } from "@/utils/guides";

export async function getStaticPaths() {
  const guides = await getGuides();
  return guides.map((guide) => ({ params: { guide: guide.id }, props: { guide } }));
}

export const GET: APIRoute = ({ props, site }) => {
  const { guide } = props as { guide: Guide };
  return new Response(guideMarkdown(guide, site ?? new URL(SITE.website)), {
    status: 200,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
