---
title: "QualityFlow"
description: "An AI-powered Quality Management System replacing legacy tools with mobile-first, offline-capable workflows for food safety and compliance in meat processing."
tag: "Food Safety · Enterprise SaaS"
status: "In development"
statusType: "building"
featured: true
sortOrder: 1
techStack: ["Next.js", "Hasura", "Dapr", "Azure Container Apps", "Claude Agent SDK", "Neo4j", "PostgreSQL", "Playwright"]
startDate: "2025-09"
---

## The Idea

Food safety compliance in ANZ is dominated by tools built for auditors, not for the people on the floor actually doing the work. HACCP plans live in binders. Temperature logs are paper-based. CAPAs are tracked in spreadsheets. Document control is a filing cabinet with a prayer attached.

I spent years watching this gap from the architecture side in meat processing environments. The legacy tools — like InformationLeader — were designed in a different era. They're rigid, desktop-bound, and hostile to the shop floor operators who actually need them. When you're standing in a boning room in PPE and gloves, a desktop application with 47 form fields isn't a quality system. It's a compliance tax.

QualityFlow was born from a simple conviction: quality management should be built for the people doing the work, not the auditors reviewing it. Mobile-first, offline-capable, AI-assisted, and designed around how food safety actually operates in a processing plant.

## Prototype

The first phase was an analysis of InformationLeader's capabilities — a comprehensive teardown of what the legacy system does, what it does badly, and what's missing entirely. This produced the initial PRD mapping every capability to a modern equivalent.

The v2 architecture emerged from applying enterprise patterns learned across 30 years of technology leadership. Rather than building a monolith that would need rearchitecting at scale, the prototype was designed around microservices from day one — with the critical insight that the architecture needed to support AI agent-driven development, not just AI-assisted features.

The key validation at this stage was the architecture itself: could Hasura, Dapr, and Azure Container Apps work together to deliver a platform that was both enterprise-grade and fast to build? The answer was yes, with one significant caveat — Dapr Workflow isn't supported on Azure Container Apps, requiring a pivot to Microsoft's Durable Task Scheduler for workflow orchestration.

## Build Process

QualityFlow v2 is a microservices architecture with four primary layers:

**Hasura GraphQL Engine** serves as the data access layer — instant GraphQL APIs over PostgreSQL with real-time subscriptions and row-level security. This eliminates the typical months of API development. Every table gets a full CRUD API, subscription support, and fine-grained authorization rules out of the box. Hasura's event triggers feed into Dapr pub/sub for event-driven processing.

**Dapr on Azure Container Apps** provides the distributed systems backbone — service-to-service communication, state management (Azure Cosmos DB/Redis), pub/sub messaging (Azure Service Bus), secrets management (Azure Key Vault), and input/output bindings for Azure Blob Storage. Every service runs with a Dapr sidecar, making inter-service communication reliable and observable.

**Durable Task Scheduler** handles workflow orchestration. CAPA workflows, document approval chains, incident investigations — these are all multi-step, long-running processes that need to survive service restarts, support human approval gates, and integrate with AI agent activities. The Durable Task Scheduler provides durable execution, automatic retry with exponential backoff, and native KEDA integration for Container Apps autoscaling.

**Claude Agent Worker Service** is a dedicated microservice built on the Claude Agent SDK that provides AI-powered assistance across all modules. Five specialised agent types — CAPA Analyst, Document Reviewer, Form Assistant, Audit Preparer, and Incident Analyzer — are invoked via Dapr service invocation, pub/sub events, or as workflow activities. A Neo4j knowledge graph with GraphRAG provides business context: food safety regulations, HACCP principles, MPI standards, and organisation-specific procedures.

The frontend is Next.js with React, built as a Progressive Web App for offline capability on the shop floor. Real-time dashboards use Hasura subscriptions — no polling, no stale data.

**Key architecture decisions documented:**
- Durable Task Scheduler over Dapr Workflow (Dapr Workflow is disabled on Azure Container Apps as of January 2026)
- Hasura over a custom GraphQL server (80%+ reduction in data access layer development time)
- Agent Worker as a separate service rather than embedded in the frontend (independence, scalability, governance)

## Validation

The development approach leverages CodeFlow autonomous agents to target 10x velocity improvement. The enterprise architecture with Hasura and Dapr is specifically designed to support agent-driven development — the module decomposition produces 70-87 agent-executable tasks across 8 modules:

| Module | Estimated Issues | Pattern |
|--------|-----------------|---------|
| Core Platform + Auth | 8-10 | Backend |
| Dynamic Forms Engine | 12-15 | Full Stack |
| CAPA Workflow | 10-12 | Full Stack |
| Document Control | 6-8 | Backend |
| Incident Management | 8-10 | Full Stack |
| HACCP/TACCP | 10-12 | Full Stack |
| Agent Worker Service | 8-10 | Backend |
| Reporting & Dashboards | 8-10 | Frontend |

Target metrics for the platform:
- **System uptime:** >99.5%
- **GraphQL query latency (P95):** <200ms
- **Offline sync success:** >99%
- **Paper form elimination:** >90%
- **CAPA response time improvement:** 50% reduction
- **Audit preparation time:** 70% reduction

## What's Next

The implementation follows a phased approach:

**Phase 1 (Foundation)** — Azure infrastructure provisioning, Hasura deployment with initial schema, Dapr configuration, and Agent Worker Service scaffold. This establishes the platform that everything else builds on.

**Phase 2 (Core Features)** — Dynamic Forms Engine with drag-and-drop builder, CAPA Workflow with Durable Task orchestration, and Document Control with versioning and approval workflows. All built via CodeFlow agents with human review gates.

**Phase 3 (Safety & Compliance)** — Incident Management with classification and investigation workflows, HACCP Plan Builder with CCP monitoring and real-time alerts, and full AI agent capabilities across all modules.

**Phase 4 (Enterprise Rollout)** — Pilot site deployment, user training, feedback-driven refinements, and phased rollout to remaining sites with data migration from legacy systems.

The longer-term vision is a platform that serves the broader ANZ food safety market — not just meat processing, but any food manufacturing operation that's drowning in paper-based compliance and legacy tools that weren't built for the people who need them most.
