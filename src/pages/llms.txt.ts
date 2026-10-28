/**
 * /llms.txt — a curated map of the site for LLM crawlers and agents
 * (format: https://llmstxt.org). Generated at build time so it never drifts.
 */
import type { APIRoute } from "astro";
import { SITE } from "@/config";
import { DOMAINS } from "@/data/patternTaxonomy";
import { getGuides, guideMarkdownPath } from "@/utils/guides";
import { getModels, modelPath } from "@/utils/models";
import {
  getPatterns,
  LIBRARY_DESCRIPTION,
  LIBRARY_NAME,
  patternMarkdownPath,
} from "@/utils/patterns";

export const GET: APIRoute = async ({ site }) => {
  const base = site ?? new URL(SITE.website);
  const abs = (p: string) => new URL(p, base).href;
  const patterns = await getPatterns();
  const guides = await getGuides();

  const out: string[] = [
    `# ${SITE.author}`,
    "",
    `> ${SITE.author} is a fractional CTO and enterprise architect based in Ōtepoti Dunedin, Aotearoa New Zealand. ${SITE.desc}`,
    "",
    "## Site",
    "",
    `- [About](${abs("/about.md")}): Background, experience and how to get in touch`,
    `- [Writing](${abs("/posts.md")}): Articles on digital leadership, architecture and neurodiversity at work`,
    `- [Services](${abs("/services")}): Fractional CTO/CIO and enterprise architecture`,
    `- [How I work](${abs("/how-i-work")}): Engagement approach`,
    "",
  ];

  if (guides.length) {
    out.push("## Guides", "");
    for (const g of guides)
      out.push(`- [${g.data.title}](${abs(guideMarkdownPath(g.id))}): ${g.data.description}`);
    out.push("");
  }

  const models = getModels();
  if (models.length) {
    out.push("## Data models", "");
    for (const m of models)
      out.push(`- [${m.title}](${abs(`${modelPath(m.slug)}.md`)}): ${m.description}`);
    out.push("");
  }

  if (patterns.length) {
    out.push(
      `## ${LIBRARY_NAME}`,
      "",
      `${LIBRARY_DESCRIPTION} Each pattern follows the same structure: a short answer, the problem, symptoms, ` +
        "cheaper fixes to try first (the pragmatism ladder, rung 1 = process, rung 5 = AI/ML), the pattern itself, " +
        "New Zealand context, trade-offs, and the point where the work stops being business-as-usual.",
      ""
    );
    for (const [key, domain] of Object.entries(DOMAINS)) {
      const inDomain = patterns.filter((p) => p.data.domain === key);
      if (!inDomain.length) continue;
      out.push(`### ${domain.label}`, "");
      for (const p of inDomain)
        out.push(`- [${p.data.title}](${abs(patternMarkdownPath(p.id))}): ${p.data.description}`);
      out.push("");
    }
  }

  return new Response(out.join("\n"), {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
