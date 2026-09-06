<div align="center">

# Roadmap

### Where Meridian is headed next?

<img src="https://img.shields.io/badge/status-living_document-BA7517?style=for-the-badge&labelColor=1a1a1a" />

</div>

<br/>

> This expands on [Future Improvements](../README.md#future-improvements) in the main README with rough priority and status. Nothing here is a commitment or a deadline. It's a shared view of what's worth doing next, meant to be edited as priorities shift.

<br/>

## Table of Contents

- [How to Read This](#how-to-read-this)
- [Now / Next / Later](#now--next--later)
- [Detail on Each Item](#detail-on-each-item)
- [Ideas Not Yet Prioritized](#ideas-not-yet-prioritized)
- [Updating This Doc](#updating-this-doc)

<br/>

## How to Read This

| Status | Meaning |
|:---:|---|
| 🟢 Now | Actively being worked on or next up |
| 🟡 Next | Agreed as valuable, not yet started |
| ⚪ Later | Worth doing eventually, not urgent |

<br/>

## Now / Next / Later

| Priority | Item | Addresses |
|:---:|---|---|
| ⚪ Later | Streamed pipeline status (WebSocket/SSE) | [Known Limitation: synchronous pipeline](../README.md#known-limitations) |
| ⚪ Later | Multi-provider LLM fallback | [Known Limitation: single LLM provider](../README.md#known-limitations) |
| ⚪ Later | Activate semantic memory (`memory_records`) | [Known Limitation: semantic recall unused](../README.md#known-limitations) |
| ⚪ Later | Exportable reports (PDF / shareable link) | User-facing convenience, not a current gap |
| ⚪ Later | Automated report evaluation (citation coverage, hallucination checks) | [Evaluation & Reliability — where this is headed](EVALUATION.md#where-this-is-headed) |

> All items currently sit at ⚪ **Later**. None are actively in progress yet. Move an item up as work actually starts on it.

<br/>

## Detail on Each Item

### Streamed pipeline status
Replace the client-timed progress animation with real server-pushed stage updates, so the Research Progress screen reflects what the backend is doing at that exact moment rather than an approximation. Likely needs either a WebSocket connection or Server-Sent Events from the `POST /api/research/` handler, plus a matching frontend rework of `ResearchProgress.jsx`.

### Multi-provider LLM fallback
Add a second LLM provider that the Planner, Extraction, Validation, and Report agents can fall back to if Gemini is unavailable or rate-limited, instead of every new job stalling during a provider outage.

### Activate semantic memory
The `pgvector`-backed `memory_records` table already exists in the schema (migration `006`) but isn't read from or written to yet. Wiring it up would let a new brief benefit from related past research instead of starting from zero every time.

### Exportable reports
Let a user download a completed report as a PDF, or generate a read-only shareable link, which is useful for anyone who wants to hand a report to someone without a Meridian account.

### Automated report evaluation
A lightweight eval pass, checking citation coverage and spot-checking for unsupported claims. It is run against every report before it's marked `completed`, rather than relying solely on the Validation agent's own in-pipeline judgment. See [EVALUATION.md](EVALUATION.md) for the full reliability picture this would add to.

<br/>

## Ideas Not Yet Prioritized

Smaller or less-fleshed-out ideas, parked here rather than in the main table until there's more clarity on scope:

- Comparing two reports side by side (e.g. the same market researched a month apart)
- A "regenerate this section" action instead of re-running the whole pipeline for a small correction
- Exposing per-stage timing in the completed job response, to make slow runs easier to diagnose

<br/>

## Updating This Doc

When an item moves forward:
1. Update its status in the [Now / Next / Later](#now--next--later) table.
2. If it ships, remove it from here and add it to [CHANGELOG.md](CHANGELOG.md) under the release it landed in.
3. If a new idea comes up, add it to [Ideas Not Yet Prioritized](#ideas-not-yet-prioritized) first, promote it to the main table once there's a clearer sense of what it actually involves.

