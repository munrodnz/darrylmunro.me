/**
 * Model downloads: the LinkML sources served as-is, plus the merged explorer data.
 */
import type { APIRoute } from "astro";
import type { ModelEntry } from "@/data/models";
import { buildExplorerData, getModels, readModelText } from "@/utils/models";

const FILES: Record<string, (e: ModelEntry) => { body: string; type: string }> = {
  "pack.yaml": (e) => ({ body: readModelText(e.packDir, "schema.yaml"), type: "text/yaml" }),
  "pack-explorer.yaml": (e) => ({
    body: readModelText(e.packDir, "explorer.yaml"),
    type: "text/yaml",
  }),
  "overlay.yaml": (e) => ({ body: readModelText(e.overlayDir, "schema.yaml"), type: "text/yaml" }),
  "overlay-explorer.yaml": (e) => ({
    body: readModelText(e.overlayDir, "explorer.yaml"),
    type: "text/yaml",
  }),
  "model.json": (e) => ({
    body: JSON.stringify(buildExplorerData(e), null, 2),
    type: "application/json",
  }),
};

export async function getStaticPaths() {
  return getModels().flatMap((entry) =>
    Object.keys(FILES).map((file) => ({
      params: { slug: entry.slug, file },
      props: { entry, file },
    }))
  );
}

export const GET: APIRoute = ({ props }) => {
  const { entry, file } = props as { entry: ModelEntry; file: string };
  const { body, type } = FILES[file](entry);
  return new Response(body, {
    status: 200,
    headers: { "Content-Type": `${type}; charset=utf-8`, "Cache-Control": "public, max-age=3600" },
  });
};
