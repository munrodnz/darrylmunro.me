---
title: "Data modelling"
seoTitle: "Data Modelling: A Pragmatic Guide for NZ Teams"
eyebrow: "Guide · Ladder rung 3"
description: "What data modelling is, the signs you need it, and how NZ teams can model data properly before building new systems, dashboards or AI."
summary: >-
  Data modelling is agreeing what your organisation's data means, what each
  thing is called, how things relate and how they are stored, so everyone
  gets the same answer to the same question. It is rung 3 of the Daz Method
  ladder: many requests for a new system, dashboard or AI tool are really a
  missing data model. Model the data properly before building anything.
links:
  - label: "The Daz Method"
    url: "/daz-method"
  - label: "Pattern library"
    url: "/patterns"
relatedGuides: ["daz-method"]
relatedModels: ["nz-infrastructure-contractor"]
relatedPatterns: []
faq:
  - q: "Do I need a data warehouse to model data?"
    a: "No. A model is an agreement about meaning and structure. It can live in a Power BI semantic model, a set of database views or a small warehouse. Choose the smallest home that meets the need."
  - q: "What is the difference between a data model and a database?"
    a: "The model is the design: the things, their definitions and how they relate. The database is one place that design gets stored. The same model can be built in different tools."
  - q: "Should we use a star schema or a data vault?"
    a: "For reporting and analysis, start with a star schema. A data vault earns its extra complexity only when you integrate many changing sources and must keep full, auditable history."
  - q: "Do we need a data model before using AI on our data?"
    a: "Yes. AI tools answer confidently from whatever definitions they find. If finance and operations define a customer differently, the AI will mix them. Agree the definitions first."
published: 2026-10-28
reviewed: 2026-10-28
draft: false
---

## What it is

A data model is an agreement. It says which things your organisation cares about, what each one is called, how they relate to each other, and how they are stored. Get it right and finance, operations and IT get the same answer to the same question.

It is not a diagram exercise. The diagram is a by-product. The value is in the arguments you have while drawing it: what counts as a customer, when an order is complete, which site an asset belongs to.

## Why it is rung 3

On the [Daz Method](/daz-method) ladder, modelling the data sits above fixing the process and configuring existing tools, and below custom development and AI.

That placement is deliberate. A lot of requests for a new system, a new dashboard or an AI assistant are really requests for data that already exists but nobody has joined up, defined or trusted. Modelling it properly is cheaper than building around it, and anything you build later needs the model anyway.

## Signs you need it

- Two reports show different numbers for the same thing, and both are "right".
- Every new report needs an analyst to rebuild the same joins in a spreadsheet.
- People argue about what a word means: customer, active, completed, site.
- A dashboard project stalls because nobody can say where the source of truth is.
- An AI pilot gives confident answers that the people doing the work know are wrong.

## Start with the words

Before tables or tools, agree a glossary. Write down the ten or twenty terms that matter to the problem, with one definition each and an owner for each definition.

This is the cheapest and most skipped step. Most data quality arguments are definition arguments, and no platform settles them for you.

## Three levels

**Conceptual.** The things that matter and how they relate, in plain language. Build this with the people who do the work, not just the data team.

**Logical.** The attributes, keys and rules for each thing, independent of any tool. This is where you decide what makes a record unique and which system owns it.

**Physical.** How the model is stored in a particular database or platform. This is the part tools help with, and the part people often start with by mistake.

For most everyday problems, getting the conceptual and logical levels right does most of the work. The physical model can often live in tools you already have.

## Pick the shape for the job

**Operational systems: normalised.** Store each fact once, so data entry stays consistent. This is how most transactional systems are designed, and usually not something you change.

**Reporting and analysis: dimensional.** A star schema separates facts (the events you measure, like a delivery or a fault) from dimensions (the things you describe them by, like customer, site and date). It is easy to query, fast, and suits Power BI's model well. For most reporting problems, this is the right place to start.

**History across many sources: data vault.** Designed for integrating many changing sources while keeping full, auditable history. It is powerful and heavy. Most NZ teams do not need it until they have outgrown a dimensional model.

**AI and assistants: a semantic layer.** AI tools need definitions, relationships and agreed measures in a form they can read. Without that, they answer from whichever table they find first. A semantic or context layer is a data model written for machines as well as people.

## NZ reality check

- **Scale:** many NZ organisations have one or two data people. A model they can maintain beats a perfect one nobody can.
- **Tools you own:** a well-built Power BI semantic model or a set of database views is often enough. Start there before buying a platform.
- **Personal information:** model personal data deliberately under the Privacy Act 2020. Collect and keep only what the purpose needs.
- **Māori data:** if the data relates to Māori people, land or taonga, consider Māori data sovereignty principles in how it is held, governed and shared.

## Traps

- **Modelling everything:** model what the problem needs. You can extend a good model later.
- **Tool first:** buying a data platform before agreeing definitions moves the argument into a more expensive place.
- **The orphaned diagram:** a model nobody owns goes stale. Name an owner and keep it next to the data.
- **Ignoring the input:** if the data is wrong when it is entered, no model fixes it. That is a rung 1 problem, and it comes first.

## Where it stops being BAU

Changing a shared schema that other systems depend on, or standing up an enterprise data platform, crosses the significant line. At that point the work needs a full solution overview with proper governance, not an afternoon's modelling.
