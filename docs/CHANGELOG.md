<div align="center">

# Changelog

### All notable changes to Meridian, in one place

<img src="https://img.shields.io/badge/format-Keep_a_Changelog-BA7517?style=for-the-badge&labelColor=1a1a1a" />
<img src="https://img.shields.io/badge/versioning-SemVer-534AB7?style=for-the-badge&labelColor=1a1a1a" />

</div>

<br/>

> Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/); versions follow [Semantic Versioning](https://semver.org/). Newest entries go at the top.

<br/>

## [Unreleased]

Nothing currently staged for the next release. Add entries here as you work, under `Added` / `Changed` / `Fixed` / `Removed` as appropriate — then move the whole section under a new dated version heading when you cut a release.

<br/>

## [1.0.0] — 2026-09-05

Baseline snapshot of the project as documented in this update to the docs set.

### Added
- Full-stack multi-agent research pipeline — Planner, Research, Extraction, Validation, Citations, Report, and Linker agents running as one sequential pipeline per job.
- React 19 + Vite frontend: Login/Signup, Dashboard, animated Research Progress screen, and a tabbed Report / Evidence / Sources view.
- FastAPI backend with Supabase Auth (server-verified JWT) protecting every `/api/research` route, plus per-job ownership checks.
- Nine ordered Supabase/Postgres migrations, including a `pgvector`-backed `memory_records` table reserved for future semantic recall.
- Retry logic on pipeline stages, reducing job failures from transient search/LLM errors.
- Documentation set: `README.md`, `docs/API.md`, `docs/ARCHITECTURE.md`, `docs/DEPLOYMENT.md`, `docs/EVALUATION.md`, `docs/SECURITY.md`, `docs/CONTRIBUTING.md`.
- Live deployment of the frontend to Vercel.

### Known limitations at this version
See [Known Limitations](../README.md#known-limitations) in the main README — notably, the pipeline runs synchronously with no server-pushed progress feed, and there's a single LLM provider with no fallback.

<br/>

## How to Add an Entry

When you ship something worth noting:

1. Add a bullet under `[Unreleased]`, in the right category:
   - **Added** — new features
   - **Changed** — changes to existing behavior
   - **Fixed** — bug fixes
   - **Removed** — deprecated or deleted functionality
   - **Security** — vulnerability fixes (coordinate with [SECURITY.md](SECURITY.md) if it was a reported issue)
2. When you're ready to tag a release, rename `[Unreleased]` to `[x.y.z] — YYYY-MM-DD` and start a fresh empty `[Unreleased]` above it.

