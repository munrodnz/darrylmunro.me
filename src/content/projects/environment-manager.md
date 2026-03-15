---
title: "Non-Production Environment Manager"
description: "A purpose-built environment management platform giving engineering and operations teams full transparency, control, and automation over production and non-production technology environments."
tag: "DevOps · Platform Engineering"
status: "Speccing"
statusType: "building"
featured: true
sortOrder: 5
techStack: ["Next.js", "React", "Hono", "PostgreSQL", "Redis", "Vercel AI SDK", "Azure AD"]
startDate: "2026-02"
---

## The Idea

Managing technology environments across production and non-production tiers is a critical operational challenge that every enterprise faces and almost none solve well. There's no single source of truth for what environments exist, their health, who's using them, and what versions are deployed. Teams unknowingly book or modify shared environments, causing conflicts and downtime. Non-production environments drift from production over time, leading to deployment failures and unreliable testing. And all the coordination happens through emails, spreadsheets, and tribal knowledge.

The existing market solutions — Enov8, Plutora, Apwide — are either enterprise-heavy with significant licensing costs, SaaS-only with limited customisation, or too lightweight for organisations with complex multi-tier environments. There's a gap for a modern, API-first, developer-friendly platform that handles the full lifecycle: inventory, health monitoring, booking, drift detection, release tracking, and cost transparency.

The Environment Manager was designed to fill that gap — built from firsthand experience managing complex enterprise estates where environment contention, configuration drift, and manual coordination were constant sources of friction and failure.

## Prototype

The specification phase started with a comprehensive competitive analysis of Enov8, Plutora, and Apwide — mapping their strengths, gaps, and pricing models. The core domain model emerged from analysing real environment management workflows across multi-tier landscapes:

```
Organisation → Business Unit → System → Environment Group → Environment Instance → System Component → Component Version
```

Six primary personas were identified, each with distinct needs: Environment Coordinators managing availability and contention, Release Managers tracking deployments through tiers, Platform Engineers monitoring health and responding to incidents, Developers and QA consuming environments, Engineering Directors needing cost visibility, and Security Officers requiring audit trails and compliance data.

Ten feature areas were scoped across three priority tiers, with P0 features forming the MVP: Visual CMDB, Health Monitoring, Booking & Contention, Dashboards, API Framework, and Access Control. P1 features add intelligence: Drift Detection, Release Tracking, Custom Dashboards, and CI/CD integration. P2 features cover knowledge management and architecture visualisation.

## Build Process

The architecture is cloud-native with a self-hosted option for regulated industries:

**Frontend** — Next.js 16 with React 19, ShadCN UI, and Tailwind CSS 4+. The interface is designed to be fast and developer-friendly — the antithesis of legacy enterprise UIs. Pre-built dashboards for Environment Overview, System Health, Booking Calendar, Release Pipeline, and Cost & Utilisation render within 3 seconds. A custom dashboard builder with drag-and-drop widget placement supports counters, charts, tables, heatmaps, calendars, and status indicators.

**Backend** — Hono for API-first design, webhook handling, and real-time capabilities. PostgreSQL for the relational CI hierarchy with JSON support for flexible attributes. Redis for real-time health status, caching, and pub/sub notifications. WebSockets via Socket.io for live dashboard updates and health status streaming. RabbitMQ or Redis Streams for async health checks, webhook delivery, and notification dispatch.

**Visual CMDB** — Full CRUD for all Configuration Item types through both UI and REST API. Bulk import/export via CSV and JSON handling 10,000+ records. Dependency mapping with visual graph representation. Auto-discovery connectors for AWS, Azure, GCP, and Kubernetes. Full field-level audit trail with diff views.

**Health Monitoring** — Automated health probes (HTTP, TCP, custom script) with configurable intervals down to 30-second resolution. Five-state health model (Operational, Degraded, Down, Maintenance, Unknown) with automatic status propagation from component to instance. Availability percentage calculation excluding scheduled maintenance. Notifications within 60 seconds of status change via email, webhook, Slack, or Teams.

**Booking & Contention** — Self-service booking in under 3 clicks with contention detection warning of overlapping reservations. Configurable approval workflows from auto-approve to multi-level. Calendar views with filtering by system, group, and team. Email-based approval for responding directly from notification emails. Contention analytics identifying hotspot environments and peak periods.

**Drift Detection** — Version comparison matrix across all instances of a system. Heatmap visualisation with red/yellow/green severity coding. Baseline definition against a "golden" instance. Automated drift alerts within 5 minutes of a drift-causing deployment. Configuration comparison beyond just version numbers.

**Release & Deployment Tracking** — Release pipeline view showing progress through environment tiers. Gate approvals between tiers (UAT sign-off before staging). CI/CD webhook receivers for Jenkins, GitHub Actions, GitLab CI, and Azure DevOps with version updates within 30 seconds of deployment completion.

**API & Integration** — REST API covering all CRUD operations with OpenAPI documentation and interactive playground. Webhook support for outbound events and inbound CI/CD notifications. Pre-built integrations for CI/CD tools, Slack, Teams, and ITSM platforms (ServiceNow, Jira Service Management). Cloud provider connectors for auto-discovery. API authentication via API keys and OAuth 2.0 with configurable rate limiting.

## Validation

Target metrics define success across operational and adoption dimensions:

| Metric | Target |
|--------|--------|
| Environment catalogue completeness | 100% within 30 days |
| Mean time to book an environment | <5 minutes |
| Non-production availability | >95% during business hours |
| Booking contention reduction | 90% from baseline |
| Drift detection time | <15 minutes from deployment |
| User adoption | 80% weekly active users |
| CI/CD integrations connected | 5+ pipelines |
| Dashboard load time (P95) | <3 seconds |

The scalability targets are enterprise-grade: 10,000+ Configuration Items, 500+ concurrent users, 1,000 API requests/second sustained, and 5,000 health probes/minute. Security requirements include encryption at rest (AES-256) and in transit (TLS 1.3), RBAC with least privilege, and SOC 2 Type II alignment.

The differentiation strategy against established players focuses on five pillars: open and extensible API-first design vs. closed enterprise platforms, modern developer-friendly UX vs. legacy interfaces, self-hosted option for regulated industries, built-in automated health monitoring vs. requiring separate tools, and targeted feature set without paying for unused enterprise modules.

## What's Next

The roadmap follows three phases:

**Phase 1 — Foundation MVP (12-16 weeks)** — Core VCMDB with CRUD, import, and tagging. Health monitoring with status model and basic probes. Booking and contention management with calendar and approvals. Pre-built dashboards. REST API with API keys and outbound webhooks. RBAC, user management, and SSO.

**Phase 2 — Intelligence (8-12 weeks)** — Drift detection with version heatmaps and automated alerts. Release and deployment tracking with pipeline views and gate approvals. Custom dashboard builder. CI/CD integrations and cloud auto-discovery connectors.

**Phase 3 — Knowledge & Visualisation (8-12 weeks)** — Architecture blueprint diagramming with bi-directional CMDB sync. Fact sheets and surveys for structured knowledge capture. ITSM connectors for ServiceNow and Jira integration.

Future considerations include test data management, AI-assisted cost optimisation recommendations, capacity planning and forecasting, Environment-as-a-Service with Terraform provisioning, and a mobile app for on-call environment status.
