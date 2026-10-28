/**
 * Published data models. Each pairs an industry pack (LinkML) with one
 * client overlay used as the worked example. Source files live in /models.
 */
export interface ModelEntry {
  /** URL slug: /models/<slug> */
  slug: string;
  /** Folder under /models holding the pack's schema.yaml and explorer.yaml */
  packDir: string;
  /** Folder under /models holding the overlay's schema.yaml and explorer.yaml */
  overlayDir: string;
  title: string;
  seoTitle?: string;
  /** 70–160 characters */
  description: string;
  /** 40–80 words, quotable on its own */
  summary: string;
  published: string;
  reviewed?: string;
  draft: boolean;
}

export const MODELS: ModelEntry[] = [
  {
    slug: "nz-infrastructure-contractor",
    packDir: "packs/nz-infrastructure-contractor",
    overlayDir: "overlays/kotuku-civil",
    title: "NZ infrastructure contractor data model",
    seoTitle: "NZ Infrastructure Contractor Data Model (LinkML)",
    description:
      "An open conceptual data model for NZ infrastructure contractors, written in LinkML, with an industry pack, a fictional client overlay and an HTML explorer.",
    summary:
      "A conceptual data model for New Zealand contractors who build, operate and maintain water, parks, roading and facilities assets for councils. It is written in LinkML as a reusable industry pack, with a fictional company overlay showing how one organisation adds its own examples and lists. The explorer lets people who never open a YAML file read, question and improve it.",
    published: "2026-10-28",
    reviewed: "2026-10-28",
    draft: false,
  },
];
