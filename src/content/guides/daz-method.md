---
title: "The Daz Method"
seoTitle: "The Daz Method: Pragmatic Problem-Solving for IT"
eyebrow: "Method"
description: "A human-led, AI-assisted way to solve everyday IT and operational problems: understand the problem, agree what matters, and climb only as far as you need to."
summary: >-
  The Daz Method is a five-move approach to change for people solving
  everyday problems, not running big projects. Replay the problem, put it in
  context, agree the criteria, then climb a five-rung ladder from fixing the
  process to adding AI, stopping at the first rung that works. People make the
  decisions; AI agents help with the legwork. It runs in an afternoon and is
  open source on GitHub.
links:
  - label: "Templates on GitHub"
    url: "https://github.com/Digital-Leadership-Academy/daz-method"
  - label: "Pattern library"
    url: "/patterns"
relatedGuides: ["data-modelling"]
relatedPatterns: ["secure-file-transfer"]
faq:
  - q: "Do I need an AI agent to use the Daz Method?"
    a: "No. The templates work on their own. An agent can help interview, organise evidence and draft each move, but a person approves every decision."
  - q: "Does it replace our project or delivery methodology?"
    a: "No. It produces an agreed brief for the people and tools doing the work. Delivery happens outside the method, and the method comes back for an outcome review."
  - q: "When is a problem too big for the Daz Method?"
    a: "When the answer crosses the significant line: writing into a vendor product, changing a shared schema or standing up a new platform. At that point it needs a full solution overview."
  - q: "Is it free to use?"
    a: "Yes. The method and templates are MIT licensed on GitHub. It is an early community draft, and feedback from real use is welcome."
published: 2026-10-28
reviewed: 2026-10-28
draft: false
---

## Why it exists

Most problems arrive already shaped as a solution: "we need a dashboard", "can we get an app for this", "let's use AI". The Daz Method starts one step earlier, with the complaint or opportunity itself, and does not assume software or AI is the answer.

It is written for the people who look after things day to day, not for big programmes. A full high-level solution overview is the right tool for a major change. For the everyday problems that land on an IT or operations team, it is too slow and too heavy, so most of them get no design thinking at all. The Daz Method sits in between. A small team can run it in an afternoon.

## The rule

**Climb only as far as the problem forces you.** Find the lowest-cost, lowest-complexity change that actually resolves the problem, and stop there. Climbing higher is what you have to justify, not staying low.

## The five moves

The moves run in order. Each one ends with a decision that a person makes, not an agent.

| Move | Purpose | The decision |
| --- | --- | --- |
| 1. Replay | Separate the underlying problem from the solution someone has already assumed. | Is this the real problem? |
| 2. Spine | Establish the context: who is affected, what they depend on, and why action matters now. | Have we understood who is affected and why it matters? |
| 3. Lens | Agree criteria, constraints and non-goals before anyone considers options. | What must a good answer achieve? |
| 4. Ladder | Test interventions against the agreed lens, from the bottom rung up. | How far do we need to climb? |
| 5. Check | Challenge the choice and how its benefit will be measured. | Does the choice hold up, and how will we know? |

After the fifth move, the lead agrees a handoff. Delivery happens outside the method, using whatever process or tools the team already uses. The method comes back afterwards for an outcome review.

### Move 2: the forcing function and the three-way split

The spine names the forcing function, the real reason this has to happen now, as distinct from a preference. It then splits the problem three ways:

- **Automatable:** work a system can do reliably.
- **Needs a person with local context:** judgement that depends on knowing the site, the customer or the history.
- **Input prevention:** problems caused upstream that no software will fix. Bad data going in has to be stopped where it starts.

Most problems have all three parts. Treating them all as automatable is how projects overreach.

### Move 4: the pragmatism ladder

1. **Process and source controls.** Fix the process, the ownership or the point where bad inputs enter.
2. **Configure existing tools.** Use what you already license properly before buying anything.
3. **Aggregate or model the data.** Many "we need a new system" problems are really "nobody has modelled this data" problems. See [Data modelling](/data-modelling).
4. **Custom development.** Build something, with the maintenance cost that comes with it.
5. **AI and machine learning.** The last resort, not the starting point.

A higher rung is not a better result. Before climbing, record why the lower rungs cannot meet the agreed criteria.

### The significant line

Some answers stop being business-as-usual: writing into a vendor product, changing a shared schema, or standing up a new platform. Crossing that line means the work needs a full solution overview with proper governance, not an afternoon's analysis. The Daz Method's job at that point is to recognise it and escalate.

### Move 5: keeping yourself honest

The check looks for four traps:

- **Shiny over pragmatic:** choosing the interesting option over the one that solves the problem.
- **New platforms as a reflex:** reaching for a new product when existing tools would do.
- **Familiar over durable:** choosing what the team knows over what will last.
- **Measuring activity, not outcomes:** counting what was done rather than what changed.

It then tests the claimed benefit. If the change saves time, where does that time go? It is either **redeployed** to other work, **absorbs peak** demand, is **cashed out** as reduced spend, or goes **nowhere**. Each answer needs evidence, and released time is not a cash saving unless spending actually falls. The check also asks what new cost or work the change creates, and who carries it.

## Two non-negotiables

**Criteria before options.** Nobody, person or agent, proposes solutions until the lens is agreed.

**Shipping is not the finish line.** The case closes with a review of the actual result against the agreed criteria and the saved-time claim.

## Human-led, AI-assisted

People make the decisions. AI agents help interview stakeholders, organise evidence, draft each move and challenge assumptions. They never approve a move, choose a rung or decide what gets built.

If you use an agent, give it the case files and an instruction like this one from the repository:

> Help me work through the current Move of the Daz Method. Read CASE.md and the existing case documents first. Ask focused questions and distinguish evidence, assumptions and unanswered questions. Do not propose solutions before I have explicitly approved the lens. Never approve a gate, select a rung or build target, or advance the case without my explicit decision.

## Try it

The templates are on [GitHub](https://github.com/Digital-Leadership-Academy/daz-method). Copy the `templates/case/` folder somewhere you control, pick a small real problem, and name a person as the lead in `CASE.md`. Work through the numbered files in order and record each decision before moving on. No installation is needed, and you can run it without an agent.

The case folder becomes the record. Keep the evidence, decisions and glossary together, and mark superseded reasoning rather than deleting it.

## Where it is heading

The method is an early community draft. Planned additions include agent skills for each move, guided and practitioner modes, and handoffs into delivery tools such as GitHub Spec Kit, BMAD and SPARC. None of that is built yet. If you try the templates, reports of where you got stuck are the most useful contribution.

## How it connects to the patterns

Every pattern in the [pattern library](/patterns) is placed on the ladder. Its "Before you build" section is move 4 applied: the lower rungs to try first, and the point where the pattern itself is justified.
