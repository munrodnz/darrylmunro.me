/**
 * Pattern library helpers: querying, URLs, JSON-LD, and the plain-markdown
 * version of each pattern that llms.txt and AI crawlers read.
 */
import { type CollectionEntry, getCollection } from "astro:content";
import { SITE } from "@/config";
import { BOUNDARIES, DOMAINS, LADDER, type LadderRung } from "@/data/patternTaxonomy";

export type Pattern = CollectionEntry<"patterns">;

export const LIBRARY_NAME = "Daz Patterns";
export const LIBRARY_PATH = "/patterns";
export const LIBRARY_DESCRIPTION =
  "Pragmatic architecture patterns for New Zealand organisations: what each pattern solves, the cheaper fix to try first, and where it stops being BAU.";

const AUTHOR_LOCATION = "Ōtepoti Dunedin, Aotearoa New Zealand";
const AUTHOR_SAME_AS = [
  "https://www.linkedin.com/in/darryl-munro/",
  "https://github.com/munrodnz",
  "https://x.com/munrod10",
  "https://darrylmunro.substack.com",
];

// ── Queries ─────────────────────────────────────────────────────
/**
 * Drafts are visible in `bun run dev` and on Vercel preview deployments (so a
 * pull request preview can be reviewed), never in production.
 */
export const showDrafts = !import.meta.env.PROD || process.env.VERCEL_ENV === "preview";

/** Published patterns, plus drafts where showDrafts is true. */
export async function getPatterns(): Promise<Pattern[]> {
  const all = await getCollection("patterns", ({ data }) => showDrafts || !data.draft);
  return all.sort((a, b) => a.data.title.localeCompare(b.data.title));
}

// trailingSlash is "never" on this site
export const patternPath = (id: string) => `${LIBRARY_PATH}/${id}`;
export const patternMarkdownPath = (id: string) => `${LIBRARY_PATH}/${id}.md`;
export const lastModified = (p: Pattern) => p.data.reviewed ?? p.data.published;
export const isoDate = (d: Date) => d.toISOString().slice(0, 10);
export const ladderLabel = (r: number) => LADDER[r as LadderRung].label;

const abs = (path: string, site: URL) => new URL(path, site).href;
const personId = (site: URL) => `${abs("/about", site)}#darryl`;

function person(site: URL) {
  return {
    "@type": "Person",
    "@id": personId(site),
    name: SITE.author,
    url: abs("/about", site),
    jobTitle: "Fractional CTO and Enterprise Architect",
    homeLocation: { "@type": "Place", name: AUTHOR_LOCATION },
    sameAs: AUTHOR_SAME_AS,
  };
}

// ── Structured data ─────────────────────────────────────────────
/**
 * One @graph per page: article, author, breadcrumb and (when present) FAQ.
 * Everything in the JSON-LD is also visible on the page, because search
 * engines discount markup describing content readers can't see.
 */
export function patternJsonLd(p: Pattern, site: URL) {
  const url = abs(patternPath(p.id), site);
  const d = p.data;

  const article = {
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
    dateModified: isoDate(lastModified(p)),
    author: { "@id": personId(site) },
    publisher: { "@id": personId(site) },
    isPartOf: { "@id": `${abs(LIBRARY_PATH, site)}#library` },
    articleSection: DOMAINS[d.domain].label,
    keywords: [DOMAINS[d.domain].label, BOUNDARIES[d.boundary].label, ...d.tags].join(", "),
    audience: {
      "@type": "Audience",
      audienceType: "IT leaders, enterprise and solution architects, and operational managers",
      geographicArea: { "@type": "Country", name: "New Zealand" },
    },
    ...(d.ogImage && { image: abs(d.ogImage.src, site) }),
    ...(d.inspiredBy.length > 0 && {
      isBasedOn: d.inspiredBy.map((s) => ({
        "@type": "CreativeWork",
        name: s.name,
        url: s.url,
        ...(s.author && { author: { "@type": "Person", name: s.author } }),
      })),
    }),
  };

  const breadcrumb = {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: abs("/", site) },
      { "@type": "ListItem", position: 2, name: LIBRARY_NAME, item: abs(LIBRARY_PATH, site) },
      { "@type": "ListItem", position: 3, name: d.title, item: url },
    ],
  };

  const graph: object[] = [article, person(site), breadcrumb];

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

export function libraryJsonLd(patterns: Pattern[], site: URL) {
  const url = abs(LIBRARY_PATH, site);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${url}#library`,
        name: LIBRARY_NAME,
        description: LIBRARY_DESCRIPTION,
        url,
        inLanguage: "en-NZ",
        author: { "@id": personId(site) },
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: patterns.length,
          itemListElement: patterns.map((p, i) => ({
            "@type": "ListItem",
            position: i + 1,
            url: abs(patternPath(p.id), site),
            name: p.data.title,
          })),
        },
      },
      person(site),
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: abs("/", site) },
          { "@type": "ListItem", position: 2, name: LIBRARY_NAME, item: url },
        ],
      },
    ],
  };
}

// ── Markdown version ────────────────────────────────────────────
/**
 * Clean, self-contained markdown served at /patterns/<id>.md. LLM crawlers
 * and agents read this far more reliably than rendered HTML.
 */
export function patternMarkdown(p: Pattern, site: URL): string {
  const d = p.data;
  const lines = [
    `# ${d.title}`,
    "",
    `> ${d.summary}`,
    "",
    `- Domain: ${DOMAINS[d.domain].label}`,
    `- Boundary: ${BOUNDARIES[d.boundary].label}`,
    `- Pragmatism ladder: rung ${d.ladderRung} of 5 (${ladderLabel(d.ladderRung)})`,
    `- Last reviewed: ${isoDate(lastModified(p))}`,
    `- Author: ${SITE.author}, ${AUTHOR_LOCATION}`,
    `- Canonical: ${abs(patternPath(p.id), site)}`,
    "",
    "## The problem",
    "",
    d.problem,
    "",
    "## You'll know you have it when",
    "",
    ...d.symptoms.map((s) => `- ${s}`),
    "",
    "## Before you build: try these first",
    "",
    ...d.tryFirst.map((t) => `- Rung ${t.rung} (${ladderLabel(t.rung)}): ${t.action}`),
    "",
    // Author notes in HTML comments stay out of the public version.
    (p.body ?? "").replace(/<!--[\s\S]*?-->/g, "").trim(),
    "",
    "## Where it stops being BAU",
    "",
    d.significantLine,
  ];

  if (d.faq.length) {
    lines.push("", "## Common questions", "");
    for (const { q, a } of d.faq) lines.push(`### ${q}`, "", a, "");
  }
  if (d.inspiredBy.length) {
    lines.push("", "## Credits", "");
    for (const s of d.inspiredBy) {
      lines.push(`- Draws on [${s.name}](${s.url})${s.author ? ` by ${s.author}` : ""}`);
    }
  }
  return `${lines.join("\n").replace(/\n{3,}/g, "\n\n")}\n`;
}
