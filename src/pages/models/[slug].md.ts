/**
 * Plain-markdown version of a data model overview for AI crawlers and agents.
 */
import type { APIRoute } from "astro";
import { SITE } from "@/config";
import type { ModelEntry } from "@/data/models";
import { buildExplorerData, explorerPath, getModels, modelPath } from "@/utils/models";

export async function getStaticPaths() {
  return getModels().map((entry) => ({ params: { slug: entry.slug }, props: { entry } }));
}

export const GET: APIRoute = ({ props, site }) => {
  const { entry } = props as { entry: ModelEntry };
  const base = site ?? new URL(SITE.website);
  const abs = (p: string) => new URL(p, base).href;
  const data = buildExplorerData(entry);
  const m: any = data.releases[data.releases.length - 1].model;
  const label = (id: string) => m.concepts.find((c: any) => c.id === id)?.label ?? id;
  const lines: string[] = [
    `# ${entry.title}`,
    "",
    `> ${entry.summary}`,
    "",
    `- Author: ${SITE.author}, Ōtepoti Dunedin, Aotearoa New Zealand`,
    `- Pack version: ${m.meta.pack?.version}`,
    `- Example overlay: ${data.client} (fictional organisation)`,
    `- Canonical: ${abs(modelPath(entry.slug))}`,
    `- Interactive explorer: ${abs(explorerPath(entry.slug))}`,
    `- LinkML pack schema: ${abs(`${modelPath(entry.slug)}/pack.yaml`)}`,
    `- LinkML overlay schema: ${abs(`${modelPath(entry.slug)}/overlay.yaml`)}`,
    "",
    "## Concepts",
    "",
  ];
  for (const a of m.subject_areas.filter((s: any) => s.id !== "reference")) {
    lines.push(`### ${a.name}`, "", `${a.blurb} Owner: ${a.owner_role}.`, "");
    for (const c of m.concepts.filter((x: any) => x.subject_area === a.id)) {
      const aka = c.alt_labels?.length ? ` (also: ${c.alt_labels.join(", ")})` : "";
      lines.push(`- **${c.label}**${aka}: ${c.definition}`);
    }
    lines.push("");
  }
  lines.push("## Relations", "");
  for (const r of m.relations)
    lines.push(`- ${label(r.from)} — ${r.label} → ${r.to.map(label).join(" or ")} (${r.card})`);
  lines.push("", "## Words that mean more than one thing", "");
  for (const t of m.lexicon) {
    lines.push(`### "${t.term}" (${t.risk} risk)`, "");
    for (const s of t.senses) lines.push(`- ${s.context}: ${label(s.concept)}`);
    lines.push("", t.guidance, "");
  }
  lines.push("## Competency questions", "");
  for (const q of m.competency_questions) lines.push(`- ${q.id}: ${q.q}`);
  return new Response(`${lines.join("\n")}\n`, {
    status: 200,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
