/**
 * Guide helpers: long-form reference pages served at the site root
 * (e.g. /daz-method). Shares author identity and draft rules with patterns.
 */
import { type CollectionEntry, getCollection } from "astro:content";
import { SITE } from "@/config";
import { AUTHOR_LOCATION, abs, isoDate, person, personId, showDrafts } from "@/utils/patterns";

export type Guide = CollectionEntry<"guides">;

export async function getGuides(): Promise<Guide[]> {
  const all = await getCollection("guides", ({ data }) => showDrafts || !data.draft);
  return all.sort((a, b) => a.data.title.localeCompare(b.data.title));
}

export const guidePath = (id: string) => `/${id}`;
export const guideMarkdownPath = (id: string) => `/${id}.md`;
export const guideLastModified = (g: Guide) => g.data.reviewed ?? g.data.published;

export function guideJsonLd(g: Guide, site: URL) {
  const url = abs(guidePath(g.id), site);
  const d = g.data;
  const graph: object[] = [
    {
      "@type": "TechArticle",
      "@id": `${url}#article`,
      headline: d.title,
      name: d.title,
      description: d.description,
      abstract: d.summary,
      url,
      mainEntityOfPage: url,
      inLanguage: "en-NZ",
      datePublished: isoDate(d.published),
      dateModified: isoDate(guideLastModified(g)),
      author: { "@id": personId(site) },
      publisher: { "@id": personId(site) },
      ...(d.links.length > 0 && {
        citation: d.links.filter((l) => /^https?:/.test(l.url)).map((l) => l.url),
      }),
    },
    person(site),
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: abs("/", site) },
        { "@type": "ListItem", position: 2, name: d.title, item: url },
      ],
    },
  ];

  if (d.faq.length) {
    graph.push({
      "@type": "FAQPage",
      "@id": `${url}#faq`,
      mainEntity: d.faq.map(({ q, a }) => ({
        "@type": "Question",
        name: q,
        acceptedAnswer: { "@type": "Answer", text: a },
      })),
    });
  }

  return { "@context": "https://schema.org", "@graph": graph };
}

/** Clean markdown served at /<id>.md for AI crawlers and agents. */
export function guideMarkdown(g: Guide, site: URL): string {
  const d = g.data;
  const lines = [
    `# ${d.title}`,
    "",
    `> ${d.summary}`,
    "",
    `- Author: ${SITE.author}, ${AUTHOR_LOCATION}`,
    `- Last reviewed: ${isoDate(guideLastModified(g))}`,
    `- Canonical: ${abs(guidePath(g.id), site)}`,
    ...d.links.map((l) => `- ${l.label}: ${abs(l.url, site)}`),
    "",
    (g.body ?? "").replace(/<!--[\s\S]*?-->/g, "").trim(),
  ];
  if (d.faq.length) {
    lines.push("", "## Common questions", "");
    for (const { q, a } of d.faq) lines.push(`### ${q}`, "", a, "");
  }
  return `${lines.join("\n").replace(/\n{3,}/g, "\n\n")}\n`;
}
