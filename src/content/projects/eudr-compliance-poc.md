---
title: "EUDR Compliance POC"
description: "Neo4j-powered knowledge graph mapping 10,000+ operational procedures to EU Deforestation Regulation traceability requirements — proving that compliance isn't a spreadsheet problem, it's a graph problem."
tag: "Knowledge Graph · Compliance"
status: "POC complete"
statusType: "live"
featured: false
sortOrder: 2
techStack: ["Neo4j", "Python", "GraphRAG", "Azure"]
startDate: "2025-03"
---

## The Idea

The EU Deforestation Regulation (EUDR) landed like a quiet bomb in ANZ export industries. From December 2025, any company exporting cattle, soy, palm oil, wood, rubber, coffee, or cocoa products to the EU must prove — with geolocation data and full supply chain traceability — that their products are not linked to deforestation or forest degradation. For New Zealand's meat processing sector, that means tracing every animal from paddock to port, linking it to land use data, and mapping the entire operational chain to regulatory requirements.

The problem isn't the regulation itself — the intent is sound. The problem is that most organisations have their compliance knowledge scattered across thousands of operational procedures, SOPs, quality manuals, and regulatory filings that were never designed to be queried as a connected system. When an auditor asks "show me how your supply chain from this farm to this shipment complies with Article 4(2)(a) of the EUDR," the answer is buried across dozens of documents, owned by different teams, with relationships that exist only in people's heads.

Traditional approaches — spreadsheets, document registers, compliance checklists — can't handle this. The relationships between procedures, regulations, supply chain entities, and geographic data are inherently graph-shaped. A knowledge graph doesn't just store the data; it makes the connections explicit, queryable, and auditable.

## Prototype

The first step was ingesting a real corpus of operational procedures — over 10,000 documents spanning quality management, supply chain operations, animal welfare, environmental compliance, and food safety. These weren't clean, structured datasets. They were Word documents, PDFs, SharePoint files, and legacy system exports accumulated over decades.

The ingestion pipeline used Python to extract, parse, and normalise the documents, then fed them into a Neo4j graph database. The graph model was designed around five core node types:

- **Regulation** — EUDR articles, clauses, and sub-requirements
- **Procedure** — Operational SOPs, work instructions, and quality documents
- **Supply Chain Entity** — Farms, processing plants, transport operators, ports, customers
- **Geographic Data** — Land parcels, coordinates, deforestation risk zones
- **Compliance Evidence** — Audit records, certifications, test results, traceability data

The relationships between these nodes are where the value lives. A Procedure `IMPLEMENTS` a Regulation. A Supply Chain Entity `OPERATES_AT` a Geographic location. A Compliance Evidence record `SATISFIES` a Regulation requirement `FOR` a specific Supply Chain Entity. These aren't flat mappings — they're multi-dimensional relationships with properties like date ranges, confidence scores, and gap indicators.

The key insight from the prototype was that GraphRAG — combining the structured knowledge graph with LLM-powered retrieval — made the system genuinely useful for compliance teams. Instead of navigating a graph database directly, users could ask natural language questions like "Which procedures cover EUDR Article 3 traceability requirements for our North Island supply chain?" and get answers grounded in the actual graph data, with citations back to specific documents and relationships.

## Build Process

The technical architecture has three layers:

**Data ingestion** — Python pipelines for document extraction (PyPDF2, python-docx, SharePoint API), text chunking, entity recognition, and relationship extraction. An LLM-assisted step identifies regulatory references, procedure cross-references, and supply chain entities within documents. The output is a structured set of nodes and relationships ready for Neo4j import.

**Knowledge graph** — Neo4j as the graph database, chosen for its mature Cypher query language, built-in graph algorithms (for pathfinding, community detection, and similarity), and strong Python/JavaScript driver support. The schema is designed for compliance querying: "Given this regulation requirement, show me all procedures that address it, all supply chain entities they cover, and any gaps where no procedure exists."

**Query and retrieval** — GraphRAG layer combining Neo4j vector search with structured graph traversal. When a user asks a compliance question, the system first identifies relevant nodes via semantic similarity, then traverses the graph to find connected regulatory requirements, procedures, and evidence. The LLM synthesises the results into a coherent answer with citations — effectively turning a messy document corpus into an auditable compliance knowledge base.

Key technical decisions:
- Neo4j over a relational database because compliance relationships are inherently graph-shaped — traversing "which procedures implement which regulations for which entities" is a natural graph query, not a series of JOINs
- GraphRAG over pure RAG because the structured relationships in the graph provide context that pure vector search misses — knowing that a procedure is linked to a specific regulation clause is more valuable than just finding semantically similar text
- Python for the pipeline because of the NLP ecosystem (spaCy, transformers) and Neo4j driver maturity

## Validation

The POC demonstrated several things convincingly:

**Coverage mapping works.** The graph successfully mapped 10,000+ procedures to EUDR requirements, identifying which regulatory clauses were well-covered, which had partial coverage, and which had genuine gaps. This gap analysis alone justified the POC — it surfaced compliance blind spots that weren't visible in existing document registers.

**Natural language querying is viable.** Compliance teams could ask questions in plain English and get grounded, cited answers from the knowledge graph. This dramatically reduced the time to answer auditor queries — from hours of manual document searching to seconds of graph traversal.

**The graph reveals hidden dependencies.** By making procedure-regulation-entity relationships explicit, the graph surfaced dependencies that nobody had documented. Changes to one procedure could affect compliance status for multiple regulations across multiple supply chain entities — visibility that didn't exist before.

**Scalability is proven.** Neo4j handled the 10,000+ document corpus with sub-second query response times for typical compliance questions. The graph model scales linearly with additional documents and entities.

The main limitation identified was data quality — the value of the knowledge graph is directly proportional to the quality of entity extraction and relationship mapping during ingestion. Garbage in, garbage out, but with graph-shaped garbage.

## What's Next

The POC proved the concept. The question now is commercialisation and scale:

**Broader regulatory coverage.** The graph model isn't EUDR-specific — the same node types and relationship patterns apply to any regulation that requires supply chain traceability. FSANZ food safety standards, MPI export requirements, Modern Slavery Act compliance — all are graph problems dressed up as document problems.

**Continuous ingestion.** The POC was a one-time import. A production system needs to continuously ingest new and updated documents, detect changes in regulatory requirements, and flag when compliance status changes as a result.

**Integration with QualityFlow.** The knowledge graph is a natural backend for QualityFlow's AI agents — the CAPA Analyst, Document Reviewer, and Audit Preparer agents can all query the graph for regulatory context, procedure relationships, and compliance evidence.

**Industry offering.** Every meat processor, dairy company, forestry operation, and agricultural exporter in ANZ faces the same EUDR challenge. The knowledge graph approach is replicable across organisations — the graph model is the same, only the documents and entities change.

The longer-term vision is a compliance knowledge graph platform that any regulated industry can deploy — not just for EUDR, but for any regulatory framework where the answer to "are we compliant?" is scattered across thousands of documents that were never designed to answer that question.
