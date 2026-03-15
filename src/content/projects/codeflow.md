---
title: "CodeFlow"
description: "An autonomous coding pipeline manager that transforms AI-assisted development from command-line chaos into a visual, governed workflow — from idea to deployed application."
tag: "Developer Tooling · AI"
status: "MVP Built"
statusType: "live"
featured: true
sortOrder: 3
techStack: ["Next.js", "React", "Convex", "Clerk", "Claude API", "Linear API", "Vercel AI SDK", "Playwright"]
startDate: "2024-12"
---

## The Idea

Current autonomous coding pipelines are powerful but painful. They live in terminals, scatter context across tools, and require deep technical knowledge just to get started. The gap between "I have an idea for an app" and "an AI agent is building it" is filled with friction — disconnected workflows, manual specification writing, invisible agent progress, and no governance.

I'd spent months working with Claude Code and autonomous agents, building MVPs at pace. The pattern was always the same: describe what I wanted in a chat, manually translate that into specs, create Linear tickets by hand, kick off agents, then juggle terminal windows to track progress. Every project repeated the same overhead.

CodeFlow was born from the realisation that this entire lifecycle — requirements gathering, specification, project tracking, and agent orchestration — could be unified into a single visual interface. Not to replace the command line, but to make autonomous coding accessible to technical product managers, founders, and architects who shouldn't need to be terminal warriors to leverage AI-assisted development.

## Prototype

The first version was deliberately scoped: a web interface where you chat with Claude acting as a senior software architect. You describe your application in natural language — the users, the features, the data model — and the AI asks clarifying questions, probes edge cases, and thinks about UX. When you're satisfied, it generates a comprehensive XML specification covering everything an autonomous agent needs: tech stack, database schema, API endpoints, UI layout, implementation steps, and success criteria.

The early validation was immediate. The specification quality from a 20-minute conversation consistently exceeded what I'd produce in hours of manual writing. The AI caught assumptions I'd missed, asked about error handling I'd forgotten, and structured the output in a way that agents could consume without rework.

## Build Process

The architecture reflects the workflow it serves:

**Conversational requirements gathering** — A streaming chat interface powered by the Vercel AI SDK and Claude. The AI operates under a carefully crafted system prompt that makes it behave like a senior architect, not a chatbot. It asks about scope, users, data models, edge cases, and design preferences before generating anything.

**Structured specification generation** — From the conversation, Claude generates a comprehensive XML specification. This isn't a summary — it's a complete technical blueprint covering the overview, technology stack, core features with priorities, database schema with relationships, API endpoints, UI component hierarchy, design system tokens, ordered implementation steps, and measurable success criteria.

**Feature extraction and tracking** — A second AI pass parses the specification to extract individual features as structured data: title, description, priority (P0-P3), and estimated complexity (1-5). These become trackable items with status indicators.

**Linear integration** — One click syncs the entire project to Linear. Features become issues with mapped priorities (P0→Urgent, P1→High, P2→Normal, P3→Low). The Linear project ID and issue URLs are stored for cross-referencing. This bridges the gap between AI-generated specifications and professional project management.

**Prompt template management** — A visual editor for creating, versioning, and testing the AI prompts used throughout the pipeline. Includes variable interpolation, AI-assisted prompt enhancement (the "magic wand"), and effectiveness tracking. This is where the governance lives — standardised prompts mean consistent agent behaviour across projects.

**Technology stack library** — A curated catalogue of frameworks, databases, auth providers, and deployment targets with compatibility matrices and AI-powered stack recommendations based on project requirements.

The tech stack is Next.js 16 with App Router, Convex for real-time data, Clerk for authentication, and Tailwind CSS with shadcn/ui components. The dark-first aesthetic uses deep blues and blacks with cyan and amber accents — it looks and feels like a tool built for developers.

## Validation

CodeFlow has been used internally to spec and ship multiple projects, including some of the tools showcased on this site. The core metrics from the PRD held up well:

- **Time from idea to specification:** consistently under 30 minutes for a well-scoped application
- **Specification completeness:** features extracted without rework in the vast majority of cases
- **Linear sync reliability:** near-perfect success rate

The biggest learning was around prompt quality. The difference between a good system prompt and a great one is the difference between a vague outline and a deployable specification. The prompt template management system — which started as a nice-to-have — turned out to be the most valuable part of the platform.

The technology recommendation engine also proved its worth. When users describe their requirements in conversation, the AI doesn't just acknowledge them — it actively suggests technology choices based on scale, team expertise, compliance needs, and budget constraints. This has caught several cases where the "obvious" tech choice would have been the wrong one.

## What's Next

The roadmap is focused on closing the loop from specification to deployed code:

- **Autonomous agent execution** — Trigger and monitor Claude Agent SDK sessions directly from the UI, with real-time progress tracking and the ability to pause, resume, or redirect agents
- **Git integration** — Track commits, branches, and PRs generated by agent sessions, with diff previews and one-click merge
- **Bidirectional Linear sync** — Webhooks to push status changes from Linear back to CodeFlow, keeping both systems in lockstep
- **Automated testing** — AI-generated Playwright tests from feature specifications, with Stagehand integration for self-healing selectors
- **Team collaboration** — Multi-user access, comments, approval workflows, and organisation-specific prompt libraries

The longer-term vision is a prompt marketplace where teams share and discover high-quality prompts, and a visual workflow builder for orchestrating multi-agent pipelines. But the immediate priority is making the spec-to-deployed-code path as frictionless as the idea-to-spec path already is.
