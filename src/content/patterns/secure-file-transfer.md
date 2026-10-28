---
title: "Secure File Transfer"
seoTitle: "Secure File Transfer for NZ Organisations"
description: "When files are still the right way to swap data with a partner, and how NZ organisations can make the exchange auditable before buying an integration platform."
summary: >-
  Secure file transfer moves batch files between your systems and a partner's
  through one controlled, logged drop point instead of email and personal
  OneDrive links. Use it when a partner can only send or receive files. Before
  buying anything, name an owner for each exchange and move it onto the
  SharePoint or SFTP capability you already pay for.
problem: >-
  Data reaches customers, regulators and suppliers as attachments and shared
  links that nobody tracks. When a file goes missing or lands in the wrong
  inbox, finance and operations find out from the partner, and nobody can show
  what was sent, when, or to whom.
symptoms:
  - "Order, pricing or compliance files go out as email attachments from a personal mailbox"
  - "Only one person knows the password to a partner's SFTP site"
  - "A partner rings to say Monday's file never arrived, and nobody can prove it was sent"
  - "Files with customer or staff details sit in shared links with no expiry"
tryFirst:
  - rung: 1
    action: "List every file exchange, give each one a named owner, and agree a schedule and a 'file missing' contact with the partner. Some exchanges will turn out to be unnecessary."
ladderRung: 2
significantLine: >-
  Once you need guaranteed delivery, automatic retries and transformation across
  more than a handful of partners, or the files feed straight into a vendor
  product, this is no longer a file-drop job. Stop and do a proper solution
  overview for a managed transfer or integration platform.
domain: integration
boundary: external
tags: ["sftp", "file transfer", "batch integration", "edi", "partner integration", "privacy", "asset data"]
related: []
faq:
  - q: "Is secure file transfer outdated?"
    a: "No. Plenty of NZ partners, freight forwarders and government systems still only exchange files. The problem is unmanaged file transfer, not files themselves."
  - q: "Do I need a managed file transfer product?"
    a: "Usually not at first. A handful of partners can run on SFTP or SharePoint you already pay for, as long as each exchange has an owner and logging. Buy a product when the number of partners or the need for guaranteed delivery outgrows that."
  - q: "What does the Privacy Act mean for file transfer?"
    a: "If a file holds personal information and goes to an overseas party, check the cross-border disclosure rules in the Privacy Act 2020 before it leaves, and make sure you can tell what was sent if there is a breach."
published: 2026-10-27
reviewed: 2026-10-27
# BEFORE PUBLISHING: the worked example was drafted by Claude from your
# description of utilities work (sharing asset data with third parties).
# Check every detail matches what actually happened, especially the outcome
# in its last paragraph, then delete this note and set draft to false.
draft: true
inspiredBy:
  - name: "Secure File Transfer pattern at IT Architecture Patterns"
    url: "https://itarchitecturepatterns.net/patterns"
    author: "David Tirabassi"
---

## The pattern

One controlled drop point sits between you and the partner, and every file passes through it with an owner, a schedule and a log.

### How it works

Your system writes the file to an outbound folder. The transfer service picks it up, encrypts it in transit, delivers it to the partner's endpoint, and records the result. Inbound files land in a quarantine folder, get checked for shape and size, and only then move to the folder your system reads from. Failures alert the named owner, not a shared inbox.

Start with what you already license: a locked-down SharePoint site with external sharing, or the SFTP capability in your existing cloud or ERP platform, with logging turned on.

### When it fits

The partner can only work in files. Volumes are batch, not real time. A few minutes or hours of delay is fine.

### When it doesn't

The partner offers an API and you need near real time, or the same data goes to many partners and you are copying files to each of them. Look at API management or event streaming instead.

## NZ reality check

Most NZ organisations run this with one person who also does three other jobs, so the design has to survive that person going on leave.

- **Scale:** two or three partners do not need a platform. Twenty do.
- **Privacy Act 2020:** files with personal information going offshore need a cross-border disclosure check first.
- **Critical infrastructure:** location data for lines, substations, pipes and plant needs a deliberate decision about who sees what level of detail. Share what the requester needs for the job, not the whole network.
- **Local estate:** many NZ organisations already have SharePoint and an Azure or AWS subscription. Use them before buying a dedicated product.
- **Cost:** the main cost is staff time chasing failed files, not licences. Count that before comparing products.

## Trade-offs and traps

The main cost is that files are always behind reality, so anything downstream works from a snapshot.

- **New platform as reflex:** buying managed file transfer to fix what is really an ownership gap.
- **Familiar over durable:** keeping the old SFTP box because one person knows it.
- **Measuring activity, not outcomes:** counting files sent instead of files the partner could actually use.

### The saved-time test

Time saved chasing missing files should go back to the people who were chasing them. If nobody can say where it goes, the saving is on paper only.

## Worked example

A South Island electricity distribution business shared asset data with a steady stream of outside parties: contractors planning work near the network, councils and developers scoping new subdivisions, and other utilities wanting to share trenches. Each needed to know what was in the ground and what they could work with.

Requests went to whoever in the GIS team picked them up. That person pulled an extract, saved it as a shapefile or spreadsheet, and emailed it or sent a shared link. Nobody could say later who held which version. Some extracts carried more detail about critical assets than the requester needed.

The first step cost nothing. The team agreed what each type of requester could see, named one owner for external data requests, and wrote a short set of terms covering use and refresh.

The second step used tools they already had. Standard extracts came out of the existing GIS platform on a schedule, landed in a controlled share with access per partner, and every download was logged.

Partners worked from a known version, routine requests no longer needed an analyst's time, and a dedicated data-sharing platform was left until volumes justify it.
