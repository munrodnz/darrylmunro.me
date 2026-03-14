// ── WORK / PROJECT CARDS ──────────────────────────────────────
// Edit these to update the "Things I've built" section on the homepage.
export const workCards = [
  {
    tag: "Food Safety · SaaS",
    title: "QualityFlow",
    description:
      "HACCP and food safety management for the ANZ market. Built for the people doing the work, not the auditors reviewing it.",
    status: "In development",
    statusType: "building" as const, // "live" | "building"
  },
  {
    tag: "Knowledge Graph · Compliance",
    title: "EUDR Compliance POC",
    description:
      "Neo4j-powered knowledge graph mapping 10,000+ operational procedures to supply chain traceability requirements.",
    status: "POC complete",
    statusType: "live" as const,
  },
  {
    tag: "Internal Tooling · AI",
    title: "MVP Factory",
    description:
      "Autonomous coding pipelines integrating Linear, GitHub, Claude Code, and Azure Container Apps. Ship faster without cutting corners.",
    status: "Active",
    statusType: "live" as const,
  },
  {
    tag: "Wellbeing · Workers",
    title: "MoveWell",
    description:
      "Movement and mobility tooling for meat processing workers, grounded in Kelly Starrett's Ready State methodology.",
    status: "Speccing",
    statusType: "building" as const,
  },
];

// ── NOW SECTION ───────────────────────────────────────────────
// Edit this to update the "/now" block on the homepage.
export const nowContent = {
  headline: "March 2026 · Otepoti, NZ.",
  paragraphs: [
    "Recently left a Head of Architecture role. Taking stock, building things I've been wanting to build, and figuring out what comes next.",
    "Currently: rebuilding this site, developing QualityFlow for the ANZ food safety market, writing on Substack about digital leadership and neurodiversity, and running <strong>ThinkDifferent</strong> — a workplace neurodiversity community.",
    'If you\'re working on something interesting at the intersection of architecture, AI, and people — <a href="/contact" class="text-accent hover:underline">get in touch</a>.',
  ],
};
