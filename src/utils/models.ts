/**
 * Data model helpers. Reads the LinkML pack and overlay schemas plus their
 * explorer narrative YAML from /models at build time, and merges them into
 * the shape the model explorer renders. The YAML is the only source; nothing
 * here is hand-maintained.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { parse } from "yaml";
import { MODELS, type ModelEntry } from "@/data/models";

const ROOT = join(process.cwd(), "models");
/** Same rule as patterns and guides: drafts in dev and Vercel previews, never in production. */
const showDrafts = !import.meta.env.PROD || process.env.VERCEL_ENV === "preview";

type Any = any;

export const modelFile = (dir: string, file: string) => join(ROOT, dir, file);
export const readModelText = (dir: string, file: string) =>
  readFileSync(modelFile(dir, file), "utf8");
const readYaml = (dir: string, file: string): Any => parse(readModelText(dir, file));

export const getModels = (): ModelEntry[] => MODELS.filter((m) => showDrafts || !m.draft);
export const modelPath = (slug: string) => `/models/${slug}`;
export const explorerPath = (slug: string) => `/models/${slug}/explorer`;

const FIT_FROM_MAPPING: Record<string, string> = {
  exact_mappings: "full",
  close_mappings: "partial",
  related_mappings: "misfit",
};
const PREFIX_TO_PRODUCT: Record<string, string> = {
  dbxwater: "water",
  dbxcon: "construction",
  dbxwaste: "waste",
};
const curieToProduct = (c: string) => {
  const [prefix, rest] = c.split(":");
  return `${PREFIX_TO_PRODUCT[prefix] ?? prefix}.${rest}`;
};
const ann = (el: Any, key: string) => el?.annotations?.[key] ?? null;
const splitList = (s: string | null, sep: string) => (s ? s.split(sep).map((x) => x.trim()) : null);

/** Merge pack + overlay into the explorer's data shape: { client, releases: [{ version, status, model }] }. */
export function buildExplorerData(entry: ModelEntry) {
  const pack = readYaml(entry.packDir, "schema.yaml");
  const packX = readYaml(entry.packDir, "explorer.yaml");
  const ovl = readYaml(entry.overlayDir, "schema.yaml");
  const ovlX = readYaml(entry.overlayDir, "explorer.yaml");
  const overrides: Record<string, Record<string, Any>> = ovlX.concept_overrides ?? {};

  const subject_areas = Object.entries<Any>(pack.subsets ?? {}).map(([id, s]) => ({
    id,
    name: s.title,
    blurb: s.description,
    owner_role: ann(s, "owner_role"),
    colour: ann(s, "colour"),
  }));

  const concepts = Object.entries<Any>(pack.classes ?? {}).map(([id, c]) => {
    const base: Any = {
      id,
      label: c.title,
      layer: "pack",
      alt_labels: c.aliases ?? [],
      type: ann(c, "concept_type"),
      subject_area: c.in_subset?.[0],
      rigidity: ann(c, "rigidity"),
      definition: c.description,
      scope: ann(c, "scope"),
      excludes: ann(c, "excludes"),
      examples: (c.examples ?? []).map((e: Any) => e.value),
      non_examples: splitList(ann(c, "non_examples"), "|"),
      identity: ann(c, "identity"),
      vagueness: ann(c, "vagueness"),
      vagueness_decision: ann(c, "vagueness_decision"),
      semantic_change: ann(c, "semantic_change"),
      notes: ann(c, "notes"),
      owner_role: ann(c, "owner_role"),
      disjoint_with: c.disjoint_with ?? null,
      attributes: Object.entries<Any>(c.attributes ?? {}).map(([name, a]) => ({
        name,
        label: a.title ?? null,
        range: a.range ?? null,
        required: Boolean(a.required),
        description: a.description ?? null,
      })),
    };
    if (!base.examples.length) base.examples = null;
    if (!base.attributes.length) base.attributes = null;
    const o = overrides[id];
    if (o) {
      Object.assign(base, o);
      base.client_fields = Object.keys(o);
    }
    return base;
  });

  const relations = Object.entries<Any>(pack.slots ?? {}).map(([slot, s]) => ({
    id: ann(s, "relation_id"),
    slot,
    from: s.domain,
    to: s.range ? [s.range] : (s.any_of ?? []).map((r: Any) => r.range),
    label: s.title,
    card: ann(s, "cardinality"),
    chars: splitList(ann(s, "characteristics"), ",") ?? [],
    role: ann(s, "role"),
    layer: "pack",
  }));

  const scheme =
    (layer: "pack" | "client") =>
    ([id, e]: [string, Any]) => ({
      id,
      label: e.title,
      layer,
      principle: e.description ?? null,
      note: ann(e, "note"),
      values: Object.keys(e.permissible_values ?? {}),
      inherits: e.inherits ?? [],
      owner_role: ann(e, "owner_role"),
      subject_area: e.in_subset?.[0] ?? null,
    });
  const reference_schemes = [
    ...Object.entries<Any>(pack.enums ?? {}).map(scheme("pack")),
    ...Object.entries<Any>(ovl.enums ?? {}).map(scheme("client")),
  ];

  const mapping: Record<string, Any> = {};
  for (const [id, c] of Object.entries<Any>(pack.classes ?? {})) {
    const fit = ann(c, "reference_model_fit");
    if (!fit) continue;
    const key = Object.keys(FIT_FROM_MAPPING).find((k) => c[k]);
    mapping[id] = {
      fit,
      products: key ? (c[key] as string[]).map(curieToProduct) : [],
      change: ann(c, "reference_model_change"),
    };
  }

  const model = {
    meta: {
      ...ovlX.meta,
      version: ovl.version,
      pack: { name: pack.title, version: pack.version, schema: pack.name },
    },
    purpose: ovlX.purpose,
    levels: packX.levels,
    assumptions: ovlX.assumptions,
    context: ovlX.context,
    subject_areas,
    divisions: ovlX.divisions,
    concepts,
    reference_schemes,
    relations,
    lexicon: packX.lexicon,
    competency_questions: packX.competency_questions,
    mapping,
    rules: packX.rules,
    dilemmas: [
      ...(packX.dilemmas ?? []).map((d: Any) => ({ ...d, layer: "pack" })),
      ...(ovlX.dilemmas ?? []).map((d: Any) => ({ ...d, layer: "client" })),
    ],
    open_questions: ovlX.open_questions,
    reference_models: packX.reference_models,
    changelog: { pack: packX.changelog, client: ovlX.changelog },
  };

  return {
    client: ovlX.client as string,
    releases: [{ version: ovl.version as string, status: "released", model }],
  };
}

export type ExplorerData = ReturnType<typeof buildExplorerData>;
export type ExplorerModel = ExplorerData["releases"][number]["model"];
