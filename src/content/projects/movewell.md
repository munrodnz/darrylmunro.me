---
title: "MoveWell"
description: "A mobile-first movement and mobility platform for meat processing workers, grounded in Kelly Starrett's Ready State methodology. Reducing injury risk through daily practice, not occasional intervention."
tag: "Wellbeing · Workers"
status: "Speccing"
statusType: "building"
featured: true
sortOrder: 4
techStack: ["React", "Vite", "PostgreSQL", "Azure", "PWA"]
startDate: "2026-01"
---

## The Idea

Meat processing workers face some of the highest rates of musculoskeletal injury in any industry. Repetitive cutting motions destroy shoulders, elbows, and wrists. Sustained standing on cold, wet floors wrecks knees and hips. Forward-leaning postures at cutting stations compress spines. Extended grip force on knives and hooks causes tendinopathy. And all of it happens under time pressure, in temperature extremes, across rotating shifts.

The existing approach to worker wellbeing in these environments is reactive — someone gets hurt, they see an OT, they maybe get some exercises, they come back to the same conditions. It's expensive, slow, and doesn't scale.

Kelly Starrett's Ready State methodology has proven results for movement quality and injury prevention. The core principle is simple: **daily practice beats occasional intervention**. Position before force. Pain-free range of motion as the goal. Movement archetypes — squat, hinge, push, pull, lunge, brace, rotate — applied to the actual tasks workers perform every day.

MoveWell brings this methodology to the factory floor. Not as a gym app repurposed for industry, but as a purpose-built platform that understands the physical demands of meat processing, the constraints of the plant environment, and the reality of a multilingual workforce doing physically punishing work.

## Prototype

The specification phase mapped the full scope of physical demands across eight distinct work roles — slaughter floor workers, boners and slicers, packers, chillers and freezer workers, cleaning crews, maintenance staff, quality control, and forklift operators. Each role has different primary injury areas and different movement preparation needs.

Three distinct user types emerged:

**Plant workers** need mobile access to daily movement routines — pre-shift preparation (5-10 minutes), break-time mobility resets (2-3 minutes), and post-shift recovery protocols (5-10 minutes). All role-specific, with video demonstrations, audio cues for hands-free following, and offline capability for areas with poor connectivity on the plant floor.

**Occupational therapists** need a reporting dashboard to track worker progress, log interventions, prescribe custom routines, and monitor caseloads. They're the clinical backbone of the programme.

**Health & Safety teams** need management oversight — participation analytics, compliance reporting, content administration, and the ability to correlate movement programme uptake with injury data.

The content architecture follows Ready State principles directly: tissue mobilisation techniques, position and bracing fundamentals, breathing integration, and daily maintenance protocols. Content categories span pre-shift preparation, break-time resets, post-shift recovery, body area focus, movement fundamentals, and home recovery options.

## Build Process

MoveWell is designed as a mobile-first PWA with offline capability — critical for plant floor use where WiFi coverage is patchy and workers can't be tethered to a desk.

**Worker app** — React with Vite, built as a Progressive Web App with service worker caching for offline video playback. The interface is designed for gloved hands and cold environments: large touch targets (minimum 44px), bottom navigation, swipe gestures for routine progression, and minimal typing. Authentication is simple — employee number plus PIN for fast access. The movement library is categorised by body area, movement archetype, difficulty level, and equipment requirements. Self-assessment uses a tappable body map for indicating problem areas, with suggested routines generated from the assessment.

**OT dashboard** — Web-based interface for managing worker caseloads. Intervention logging captures consultations, assessments, follow-ups, and discharge notes. OTs can modify existing routines for individuals, create custom routines from the movement library, assign specific routines to workers, and set progression plans. Individual worker progress reports show completion history, self-assessment trends, and time-to-improvement metrics.

**H&S admin dashboard** — Plant-wide participation analytics, compliance reporting by department, content management system for video uploads and routine creation, user administration with bulk import from HR systems, and communication tools for broadcast announcements and programme updates.

**Infrastructure** — Azure App Service for hosting, Azure Database for PostgreSQL, Azure Blob Storage with CDN for video delivery, Azure AD B2C for SSO with corporate identity, and Azure Application Insights for analytics. Optional integrations with Dynamics 365 F&O for employee data and existing incident reporting systems.

**Content production** — Video content filmed in realistic meat processing contexts with appropriate PPE, diverse representation, professional quality but authentic feel. All content reviewed by occupational therapy professionals for clinical accuracy, with contraindications and safety warnings clearly noted. Multilingual support starting with English and Te Reo Māori, with Pacific languages, Mandarin, and Filipino on the roadmap.

## Validation

The success metrics are defined across four dimensions:

**Adoption** — 70% of plant workers registered within 3 months, 50% weekly active usage rate, average 3+ routines completed per user per week.

**Engagement** — Average session duration of 5+ minutes, 40% of users maintaining streaks of 5+ days, self-assessment completion rate above 30%.

**Outcomes** — Worker-reported improvement in mobility and comfort, reduction in soft tissue injury rates over time, positive feedback from OTs on tool utility, and H&S team able to demonstrate programme compliance.

**Technical** — Page load under 3 seconds on mobile, smooth video playback on plant floor WiFi, reliable offline functionality, 99.5% uptime.

Key risks identified: the app provides movement guidance not medical advice (clear disclaimers required), health-related data requires careful handling under the NZ Privacy Act, not all workers have smartphones, and supervisor buy-in is essential for adoption. Cultural considerations around Te Ao Māori perspectives on wellbeing and inclusive representation are built into the content development process.

## What's Next

The implementation is planned across six phases:

**Phase 1 (Foundation, 4-6 weeks)** — Database schema, authentication, API framework, user and role management, core data models.

**Phase 2 (Worker Mobile App MVP, 6-8 weeks)** — Mobile-first React PWA, movement library, routine player with video, completion tracking, offline video caching.

**Phase 3 (Self-Assessment and Progress, 4 weeks)** — Body map self-assessment, progress tracking and streak system, personal dashboard, notifications and reminders.

**Phase 4 (OT Dashboard, 4-6 weeks)** — Worker management, intervention logging, custom routine assignment, individual progress reporting.

**Phase 5 (H&S Admin Dashboard, 4-6 weeks)** — Analytics, compliance reporting, content management, user administration, announcements.

**Phase 6 (Polish and Scale, 4 weeks)** — Performance optimisation, Te Reo Māori language support, advanced reporting, optional HR integration, production deployment.

Future enhancements on the horizon: wearable integration for movement quality feedback, AI-powered form checking via camera, integration with ACC injury claims data, cross-plant challenges and competitions, mental wellbeing content, and expansion to other physically demanding industries beyond meat processing.
