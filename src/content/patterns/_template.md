---
# ─────────────────────────────────────────────────────────────────────
# DAZ PATTERNS — page template
# Copy to src/content/patterns/<kebab-case-name>.md
# (this file is ignored because its name starts with "_")
# The file name becomes the URL: /patterns/<kebab-case-name>
# Keep the file name short, lowercase and keyword-led (e.g. secure-file-transfer).
# ─────────────────────────────────────────────────────────────────────

# Plain name of the pattern. Under 60 characters. This is the H1.
title: "Pattern name"

# Optional <title> override, max 60 chars. Use when the H1 alone is too
# thin to rank, e.g. "Secure File Transfer for NZ Exporters". Delete if not needed.
seoTitle: ""

# 70–160 characters. Meta description and card text. Write it as the
# answer to the search someone would type, not a teaser.
description: "One or two sentences that answer: what is this, and when should a NZ organisation use it?"

# 40–80 words, self-contained. The paragraph Google and AI assistants lift.
# Cover: what it is, when it fits, and the cheaper thing to try first.
# Test: does it still make sense pasted into a Teams chat with no context?
summary: >-
  What the pattern is in one sentence. When it fits, in one sentence. What to
  try first before building it, in one sentence. Who it suits in a New Zealand
  organisation, in one sentence.

# 2–3 sentences. The pain, in plain words. No product or technology names.
problem: >-
  Describe what goes wrong and who feels it. Name the actual group — crews and
  supervisors, finance, the divisions, customers — never a vague collective.

# 3–6 things people actually see. Observable, not diagnostic.
symptoms:
  - "Someone exports a spreadsheet every Monday and emails it to..."
  - "Finance and operations report different numbers for the same thing"
  - "Nobody can say who changed what, or when"

# Cheaper rungs to try BEFORE this pattern. Only list rungs that genuinely apply.
# 1 Process & source controls · 2 Configure existing tools
# 3 Aggregate and model the data · 4 Custom development · 5 AI/ML
tryFirst:
  - rung: 1
    action: "The process or ownership fix that might make this unnecessary."
  - rung: 2
    action: "What the tools you already pay for can do if configured properly."

# The rung this pattern itself sits on.
ladderRung: 3

# The point where this is no longer BAU and needs a full solution overview.
significantLine: >-
  e.g. once it writes into a vendor product, changes a shared schema, or needs
  a new platform stood up, stop and do a proper solution overview.

# integration | data | security | cloud | ai | operating-model
domain: integration
# internal | external | saas | cross-cutting
boundary: internal

# Up to 8. Lowercase. Terms people search for, not internal jargon.
tags: []

# Other pattern file names (without .md) to link as related.
related: []

# 2–6 questions people actually ask. Each answer 1–3 sentences, standalone.
# Rendered on the page and emitted as FAQPage structured data.
faq:
  - q: "When is this overkill?"
    a: "Answer plainly in one to three sentences."
  - q: "What does this cost a NZ organisation to run?"
    a: "Give an order of magnitude in NZD and what drives it."

published: 2026-10-27
# Update whenever you re-check the content still holds. Drives "Reviewed" date,
# dateModified and sitemap lastmod. Freshness matters for search and AI engines.
reviewed: 2026-10-27

# true = visible in `bun run dev` and Vercel previews only. Set to false to publish.
draft: true

# Credit where a pattern draws on someone else's work. Delete the item if not.
inspiredBy:
  - name: "Pattern name at IT Architecture Patterns"
    url: "https://itarchitecturepatterns.net/patterns"
    author: "David Tirabassi"

# Optional social card, 1200×630, stored next to this file.
# ogImage: ./pattern-name-og.png
# ogImageAlt: "Diagram showing..."
---

<!--
  BODY: write these four sections, in this order, with these exact H2s.
  The layout already renders: In short, The problem, You'll know you have it when,
  Before you build, Where it stops being BAU, Common questions, Related, Credits.
  Don't repeat those here.

  Writing rules:
  - First sentence under each H2 answers the heading directly. Detail after.
  - Use H3s for sub-points so the page chunks cleanly for AI retrieval.
  - Vendor-neutral by default. Name products only in NZ reality check or the example.
  - Never "the business". Name the group.
  - State the point plainly. No selling.
-->

## The pattern

One-sentence answer: how the pattern works.

### How it works

The moving parts and how data or control flows between them. A diagram earns
its place here — add alt text that describes the flow, not just "diagram".

### When it fits

Conditions where this is the right rung.

### When it doesn't

Conditions where a lower rung is enough, or a different pattern is better.

## NZ reality check

One-sentence answer: what changes when you run this in a New Zealand organisation.

Pick what applies, cut what doesn't:

- **Scale:** what this looks like with one integration person, not a platform team.
- **Privacy Act 2020:** anything leaving NZ, cross-border disclosure (IPP 12), breach notification.
- **Data sovereignty:** where the data sits, Māori data sovereignty where relevant.
- **Public sector:** NZISM and Government cloud guidance if the client is a government agency.
- **Local estate:** the SaaS and vendors NZ organisations actually run, and how they behave here.
- **Cost:** NZD order of magnitude, and whether it's licence, people or cloud consumption.

## Trade-offs and traps

One-sentence answer: the main thing this costs you.

- **Shiny over pragmatic:**
- **New platform as reflex:**
- **Familiar over durable:**
- **Measuring activity, not outcomes:**

### The saved-time test

If this pattern saves time, where does it go: redeployed, absorbs peak, cashed out, or nowhere?

## Worked example

A short NZ scenario, anonymised. Who had the problem, what rung they started on,
what they tried first, where they ended up, and what it changed.
