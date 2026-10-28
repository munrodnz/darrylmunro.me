/**
 * Pattern library taxonomy: the one place for labels, ordering and blurbs.
 * Change wording here and every pattern page, card, llms.txt entry and
 * JSON-LD keyword list picks it up.
 */

export const DOMAINS = {
  integration: {
    label: "Integration",
    blurb:
      "Moving data and events between systems without building a fragile web of point-to-point links.",
  },
  data: {
    label: "Data platform",
    blurb: "Ingesting, modelling, governing and serving data so people can trust the numbers.",
  },
  security: {
    label: "Security & identity",
    blurb: "Who can get in, what they can touch, and how you prove it to an auditor.",
  },
  cloud: {
    label: "Cloud & infrastructure",
    blurb: "Where workloads run, what they cost, and how they recover when they fall over.",
  },
  ai: {
    label: "AI & automation",
    blurb: "Using AI and automation where it earns its keep, with the guardrails in place first.",
  },
  "operating-model": {
    label: "Operating model & governance",
    blurb:
      "Decisions, ownership and ways of working that keep an estate healthy after the project team leaves.",
  },
} as const;

export const BOUNDARIES = {
  internal: { label: "Internal", blurb: "Both ends sit inside your own network and ownership." },
  external: {
    label: "External / partner",
    blurb: "One end belongs to a customer, supplier, regulator or partner.",
  },
  saas: {
    label: "Cloud & SaaS",
    blurb: "One end is a provider-controlled service you configure but do not own.",
  },
  "cross-cutting": { label: "Cross-cutting", blurb: "Applies wherever the boundary sits." },
} as const;

/**
 * The Daz Method pragmatism ladder. Rung 1 is the cheapest fix that could
 * work; climbing is what you justify, not staying low.
 */
export const LADDER = {
  1: { label: "Process & source controls", short: "Fix the process" },
  2: { label: "Configure existing tools", short: "Use what you own" },
  3: { label: "Aggregate and model the data properly", short: "Model the data" },
  4: { label: "Custom development", short: "Build it" },
  5: { label: "AI / ML", short: "Add AI" },
} as const;

export type DomainKey = keyof typeof DOMAINS;
export type BoundaryKey = keyof typeof BOUNDARIES;
export type LadderRung = keyof typeof LADDER;

export const DOMAIN_KEYS = Object.keys(DOMAINS) as [DomainKey, ...DomainKey[]];
export const BOUNDARY_KEYS = Object.keys(BOUNDARIES) as [BoundaryKey, ...BoundaryKey[]];
