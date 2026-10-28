# Daz Patterns: pattern library

Pragmatic architecture patterns for NZ organisations, at `/patterns`. Each pattern is a Markdown file in `src/content/patterns/`.

## Writing a pattern

1. Copy `src/content/patterns/_template.md` to `src/content/patterns/<short-keyword-name>.md`. The file name becomes the URL (`/patterns/<short-keyword-name>`).
2. Fill in the frontmatter. The build fails, with a clear message, if a field is out of bounds. For example, the description must be 70–160 characters and the summary 40–80 words.
3. Write the four body sections, using these H2s in this order: **The pattern**, **NZ reality check**, **Trade-offs and traps**, **Worked example**.
4. Set `draft: false` to publish. Drafts show in `bun run dev` only.
5. Update `reviewed:` whenever you re-check a page. It drives the visible "Reviewed" date, `dateModified` and the sitemap `<lastmod>`.

The page layout renders everything else from frontmatter: In short, The problem, symptoms, the pragmatism ladder, Where it stops being BAU, FAQ, related patterns and credits.

## Where things live

| File | Job |
|---|---|
| `src/content.config.ts` | `patterns` collection schema |
| `src/data/patternTaxonomy.ts` | Domains, boundaries and ladder labels. Change wording here. |
| `src/utils/patterns.ts` | Queries, URLs, JSON-LD and the Markdown-version builder |
| `src/pages/patterns/index.astro` | Library page, grouped by domain. Noindexed until a pattern is published. |
| `src/pages/patterns/[...slug].astro` | Pattern page |
| `src/pages/patterns/[...slug].md.ts` | Plain-Markdown version at `/patterns/<name>.md` |
| `src/pages/llms.txt.ts` | `/llms.txt` site map for AI crawlers, built from the collection |
| `src/pages/robots.txt.ts` | Search and AI crawler rules |
| `src/layouts/Layout.astro` | New optional props: `structuredData`, `ogType`, `markdownPath`, `noindex` |

## SEO and AI-engine choices

- **Answer first.** The summary sits under the H1 and is written to be quoted on its own.
- **One structure for every pattern,** so readers and crawlers learn it once.
- **Structured data matches the visible page:** `TechArticle`, `Person`, `BreadcrumbList` and `FAQPage` in one `@graph`. Credits are emitted as `isBasedOn`.
- **Machine-readable versions:** `/llms.txt` and the `.md` page versions give AI tools clean text without navigation or styling.

## Check after the first pattern goes live

- [Rich Results Test](https://search.google.com/test/rich-results) and [Schema Markup Validator](https://validator.schema.org/) on the pattern URL
- `/llms.txt` and `/patterns/<name>.md` load as plain text
- The pattern appears in `sitemap-0.xml` with a `<lastmod>`
