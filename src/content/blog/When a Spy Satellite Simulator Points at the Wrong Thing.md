---
title: "When a Spy Satellite Simulator Points at the Wrong Thing"
description: "What happens when you flip a surveillance tool around? Exploring the ethics and architecture of dual-use technology."
pubDatetime: 2026-03-15T00:00:00+13:00
tags: ["ai", "ethics", "technology"]
draft: true
---
## I read about someone building a surveillance tool and immediately wondered: what happens when you flip it around?

---
_By Darryl Munro | Digital Leadership Academy_

A few weeks ago I came across a Substack post that stopped me mid-scroll.

Bilawal Sidhu — a former Google Maps PM — had spent a weekend building what he called WorldView: a browser-based tool that lets you look at any place on Earth through the eyes of an intelligence analyst. Night vision. Thermal imaging. Live satellite orbits. Real CCTV footage draped over photorealistic 3D city models. Military targeting reticles over London. All of it running in a browser tab. No classified clearances required.

It was remarkable engineering. And it made me deeply uncomfortable in ways I'm still unpacking.

Not because of the technology itself — the same Google 3D Tiles API that powers Google Earth is what's under the hood. The data sources are all public. The discomfort was the aesthetic. The deliberate choice to dress public data in the visual language of surveillance. To make looking at people feel powerful.

Sidhu called the framing he was exploring "sousveillance" — the idea of you watching back, rather than the state watching you. And there's genuine intellectual meat in that framing. Palantir's co-founder even showed up in the comments to defend his company, which tells you something about the nerve that got poked.

But I kept sitting with a different question.

What happens when you take the exact same stack — the 3D terrain, the real-time data fusion, the cinematic rendering that makes you _feel_ what you're seeing rather than just reading a report about it — and point it at something that actually needs to be made visible?

What happens when instead of watching cities from orbit, you watch land heal?

---

## The Problem Nobody's Solving Properly

Let me give you some context on where I've landed professionally. After 30 years in technology and architecture roles, I've recently left Silver Fern Farms to focus on building independent ventures. One of the things I've been exploring is the intersection of spatial intelligence — the ability to make the physical world queryable and programmable — and regenerative agriculture.

Here's what I know about the voluntary carbon market, because I've been researching it obsessively for the past few weeks: it's a mess that's trying very hard to grow up.

The market had a credibility collapse in 2023-2024. Investigations revealed that 50-90% of projects weren't delivering the emissions reductions they claimed. The market contracted by 61%. Companies who'd been buying carbon credits to offset their emissions found out they'd essentially been buying certificates of good intentions rather than evidence of real outcomes.

And yet the underlying need hasn't gone away. Corporate climate commitments have surged 227% in the past 18 months. Buyers are still there. They're just now demanding something they haven't had before: _proof_.

Real, verifiable, independently auditable proof that carbon actually went into the ground and stayed there.

Here's the thing about soil carbon verification in its current form: it's expensive, periodic, and deeply manual. An auditor flies to a farm. Takes physical samples. Sends them to a lab. Waits weeks. Produces a report. Credits get issued based on a snapshot taken on one day, of one set of samples, from one visit.

That's not a living record of what happened. That's a photograph. And in a market that's been burned by people gaming photographs, a photograph isn't enough anymore.

---

## What Satellites Actually See

I want to talk about what's possible here, because I think most people have no idea how much data is already being collected, for free, continuously, at a scale that makes manual verification look like archaeology.

The European Space Agency's Sentinel-2 satellites pass over any given point on Earth roughly every five days. They capture thirteen spectral bands of data at 10-metre resolution. That includes wavelengths we can't see with our eyes but that are directly correlated with vegetation density, photosynthetic activity, soil moisture, and surface organic matter.

When a farmer transitions from conventional to regenerative practices — stops tilling, plants cover crops, integrates livestock, builds soil biology — it shows up in that data. The vegetation index changes. The bare soil periods get shorter. The spectral signature of the soil itself shifts as organic matter builds.

And the Sentinel-1 satellites — which use radar rather than optical cameras — can see through cloud cover. Which matters enormously in New Zealand, where you're not always going to get a clear sky on the day you need to measure something.

This data is free. It's on the Microsoft Planetary Computer right now, indexed and queryable, sitting in a cloud-native catalog that any developer with a laptop can access.

The question isn't whether the data exists. The question is whether anyone has built the infrastructure to turn it into something an auditor would stake their professional reputation on, and something a carbon credit buyer would stake their cheque book on.

That's what I'm building. I'm calling it RegenVerify.

---

## The Inversion of WorldView

Let me come back to Bilawal's project, because the architectural parallels are not superficial.

WorldView fuses multiple real-time data sources — satellite positions, live aircraft, traffic particle systems, CCTV feeds — over Google's photorealistic 3D terrain, and renders it in a browser with cinematic shaders designed to make data _feel_ like intelligence. The magic isn't any single data source. It's the fusion. It's the fact that you can see the city in 3D _and_ the satellite passing overhead _and_ the vehicle movement on the streets _all at once_, and your brain assembles it into meaning in a way that a spreadsheet never could.

RegenVerify does the same thing, but the data sources are different and the story is inverted.

Instead of CCTV feeds, I'm pulling Sentinel-2 multispectral imagery. Instead of aircraft positions, I'm pulling NIWA climate data — rainfall, temperature, growing degree days. Instead of military targeting overlays, I'm building a soil carbon heat map: a visual representation of how much carbon is accumulating in each paddock, updating continuously as new satellite passes come in.

The time scrubber — the control that lets you wind time forward and back — is the same concept. But instead of watching surveillance footage from last Tuesday, you're watching a New Zealand hill country farm transform over five years of regenerative management. You're watching the NDVI signal change. Watching the periods of bare soil disappear. Watching the spectral signature of the soil itself shift as organic matter builds.

That's not a photograph. That's a living record. And that's what the market is desperate for.

---

## Why New Zealand First

I'm based in Christchurch and I've spent a chunk of my career in the NZ primary industries sector — most recently in red meat, working on everything from supply chain provenance to EUDR compliance to knowledge graph architecture. So there's personal context here, not just strategic logic.

But the strategic logic is real. New Zealand has infrastructure advantages that most countries would kill for.

LINZ — Land Information New Zealand — publishes farm boundaries, cadastral data, and LiDAR terrain data as open datasets. NIWA makes climate station data available. The Ministry for the Environment and MPI have digitised more of the agricultural data layer than almost any comparable nation.

NZ farms are also large enough to generate meaningful carbon volumes at a paddock level, while being individually legible. You can actually _see_ a Canterbury farm from satellite at 10-metre resolution. You can distinguish paddocks. You can track what's happening in each one separately.

And there's a credibility story that travels. I'm under no illusions that the "clean green New Zealand" brand is contested domestically — anyone who's driven past a lowland waterway in the Waikato knows the gap between aspiration and reality. But in Tokyo, in London, in Brussels, where premium agricultural products need to demonstrate provenance and environmental credentials to command a price, "verified by satellite over NZ regenerative farms" lands differently than "auditor visited once in 2023."

The goal is to build the methodology here, get it recognised, and then export the platform architecture. The NZ market is the laboratory. The world is the opportunity.

---

## Building in Public

Here's where this gets personal, and where this post becomes the first of what I intend to be a running series.

I'm building this in the open. Not because I think radical transparency is always strategically wise — I know it isn't — but because the way I build is part of the point. The tools I'm using, the decisions I'm making, the things that break in my face at 11pm on a Tuesday: I think there's value in showing that work, especially now, when the gap between "I had a conversation with an AI about this" and "I actually built something" is closer than it's ever been.

I spent the past week working through the architecture with Claude. We designed a stack that uses Microsoft Planetary Computer as the data library — 50+ petabytes of open satellite and environmental data, STAC-indexed, queryable via API. Google Photorealistic 3D Tiles for the visualisation layer. Azure-native processing pipelines for the MVP, structured so the whole analytical layer can migrate to Databricks when the scale justifies it.

I wrote a full PRD. Twelve sections, four phases, a day-by-day two-week sprint plan. It exists. It's a real thing.

Now I have to build it.

---

## What I Need From You

This series is called build in public for a reason. I'm not just broadcasting — I'm genuinely trying to learn and course-correct in real time.

A few things I'm actively looking for:

**Regenerative farmers in NZ** — especially if you're already measuring soil carbon or working toward carbon credits. I need an initial enrolled farm for the Phase 1 prototype. I'll do the technical work. You get a 3D viewer of your own land and first right of refusal on the platform when it goes commercial.

**Soil science perspective** — I need a calibration partner. Someone who can tell me whether my satellite proxy approach is scientifically defensible or whether I'm about to build something that looks impressive and means nothing. AgResearch, Lincoln, or anyone working at that intersection.

**Carbon market practitioners** — especially if you're working on the buyer or certification side and you've felt the pain of inadequate verification evidence up close.

**Builders** — if you're a developer who finds this interesting and wants to contribute, I'm all ears.

The next post in this series will be a technical walkthrough of Week 1: what it actually looks like to query the Planetary Computer STAC API, pull Sentinel-2 imagery for a NZ farm, calculate NDVI, and get it rendering in CesiumJS over Google's 3D terrain.

I'll show the code. I'll show what breaks. I'll show the moment it starts to look like something real.

Because that moment — the moment it stops feeling like a demo and starts feeling magical, as Bilawal put it — that's the moment worth documenting.

---

_Darryl Munro is an enterprise architect and digital leadership writer based in Christchurch, New Zealand. He is the founder of Digital Leadership Academy on Substack and is building RegenVerify — a spatial intelligence platform for regenerative farming carbon verification. If you want to follow the build, subscribe below._