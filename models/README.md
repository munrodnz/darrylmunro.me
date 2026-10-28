# Data models

LinkML sources for the data models published at `/models` on darrylmunro.nz. These YAML files are the only source: the website reads them at build time (`src/utils/models.ts`) to produce the overview page, the explorer, the Markdown version and the downloads. Nothing is hand-copied.

## Layout

```
models/
  packs/<pack>/schema.yaml          LinkML industry pack: classes, slots, enums, subsets
  packs/<pack>/explorer.yaml        Pack narrative: levels, lexicon, questions, rules, dilemmas
  overlays/<client>/schema.yaml     LinkML overlay: imports the pack, adds the client's enums
  overlays/<client>/explorer.yaml   Overlay narrative: meta, context, divisions, concept overrides, open questions
```

Each published model pairs one pack with one overlay; register it in `src/data/models.ts`.

## How the model maps to LinkML

| Model element | LinkML |
|---|---|
| Concept | class (`title`, `description`, `aliases`, `examples`, `attributes`, `disjoint_with`) |
| Relation | slot (`domain`, `range` or `any_of`, `multivalued`, `required`) with `relation_id`, `cardinality`, `characteristics` and `role` annotations |
| Reference vocabulary | enum, with `inherits` for client extensions |
| Subject area | subset; concepts use `in_subset` |
| Scope, excludes, identity, vagueness, owner | class annotations (`non_examples` is ` \| `-separated) |
| Databricks industry model fit | `exact_mappings` (full), `close_mappings` (partial), `related_mappings` (misfit or gap), plus `reference_model_fit` and `reference_model_change` annotations |

Client-specific detail on pack concepts (examples, semantic-change notes) goes in the overlay's `concept_overrides`; the explorer tags those fields with the client's name.

## Validate

```bash
pip install linkml
linkml-lint models/packs/nz-infrastructure-contractor/schema.yaml
linkml-lint models/overlays/kotuku-civil/schema.yaml
gen-json-schema models/overlays/kotuku-civil/schema.yaml > /dev/null   # proves the overlay resolves the pack import
```

Lint reports style warnings only (enum values in plain English, relation slots without descriptions).

## Publishing

Models start as `draft: true` in `src/data/models.ts`: visible in `bun run dev` and Vercel previews, never in production. Set `draft: false` to publish; the overview joins the sitemap and `/llms.txt`, and the Data modelling guide shows it as a worked example.

## Kōtuku Civil is fictional

The overlay's organisation, councils, places, projects and dates are invented. Keep it that way: client models stay out of this public repository.
