<div align="center">

# Contributing to Meridian

<img src="https://img.shields.io/badge/PRs-welcome-2e7d32?style=for-the-badge&labelColor=1a1a1a" />
<img src="https://img.shields.io/badge/setup-see_below-185FA5?style=for-the-badge&labelColor=1a1a1a" />

</div>

<br/>

Thanks for taking the time to contribute. This doc covers how to get set up, how changes are structured, and what to check before opening a pull request.

<br/>

## Table of Contents

- [Before You Start](#before-you-start)
- [Local Setup](#local-setup)
- [Project Layout](#project-layout)
- [Branching](#branching)
- [Commit Messages](#commit-messages)
- [Pull Requests](#pull-requests)
- [Where Different Kinds of Changes Go](#where-different-kinds-of-changes-go)
- [Reporting Bugs](#reporting-bugs)
- [Proposing Features](#proposing-features)

<br/>

## Before You Start

- For anything beyond a small fix, open an issue first describing what you want to change and why, so it is a lot easier to align on approach before code is written than after.
- Check [Known Limitations](../README.md#known-limitations) and [Future Improvements](../README.md#future-improvements) in the main README. Your idea might already be tracked there, or might explain a design decision that looks like a bug but isn't.
- Security issues should **not** go through a public issue or PR, see [SECURITY.md](../SECURITY.md).

<br/>

## Local Setup

Full step-by-step instructions already live in [Getting the Project Running Locally](../README.md#getting-the-project-running-locally). That is the source of truth. In short:

1. Fork the repo and clone your fork.
2. Set up Supabase and run the migrations (`backend/db/migrations/001` → `009`).
3. Set up the backend (`Backend McKinsey/mckinsey-research-engine/`) with its own virtualenv and `.env`.
4. Set up the frontend (`Frontend McKinsey/vite-project/`) with `npm install` and its own `.env`.
5. Confirm both run locally and a test research brief completes end to end before making changes.

<br/>

## Project Layout

| Area | Path |
|---|---|
| Backend (FastAPI, AI pipeline) | `Backend McKinsey/mckinsey-research-engine/` |
| Frontend (React + Vite) | `Frontend McKinsey/vite-project/` |
| Database migrations | `Backend McKinsey/mckinsey-research-engine/backend/db/migrations/` |
| Project-level docs | `docs/` |

See [ARCHITECTURE.md](ARCHITECTURE.md) for how these pieces relate, and the folder breakdowns in the main README's [Backend](../README.md#backend--fastapi-service) and [Frontend](../README.md#frontend--react--vite-dashboard) sections for the full file tree.

<br/>

## Branching

- Branch off `main`.
- Prefix branches by what they do: `feat/`, `fix/`, `docs/`, `refactor/`, `chore/`. E.g. `feat/streamed-pipeline-status`, `fix/report-linker-null-source`.
- Keep branches scoped to one change. A PR that mixes a bug fix with an unrelated refactor is harder to review and harder to revert if something goes wrong.

<br/>

## Commit Messages

Use [Conventional Commits](https://www.conventionalcommits.org/) style:

```
<type>(<scope>): <short summary>

<optional longer description>
```

**Types:** `feat`, `fix`, `docs`, `refactor`, `test`, `chore`

**Examples:**
```
feat(pipeline): add retry logic to research agent
fix(auth): reject expired tokens instead of 500ing
docs(api): document job-scoped sub-resource routes
```

<br/>

## Pull Requests

Before opening one:

- [ ] The change runs locally end-to-end (a test research brief completes without error)
- [ ] No secrets, API keys, or `.env` files are included in the diff
- [ ] New environment variables are documented in the relevant `.env.example` and in [DEPLOYMENT.md](DEPLOYMENT.md) if they affect production
- [ ] Docs are updated if the change affects behavior described in `README.md` or `docs/` (e.g. a new route → update [API.md](API.md))

In the PR description, include:
- What the change does and why
- Which part of the system it touches (frontend / backend / pipeline / schema)
- Screenshots, for any UI change

<br/>

## Where Different Kinds of Changes Go

| You want to... | Look at |
|---|---|
| Change what a pipeline stage does | `ai/<stage>/` in the backend, see [The Multi-Agent Research Pipeline](../README.md#the-multi-agent-research-pipeline) |
| Add or change an API route | `backend/api/`. Update [API.md](API.md) to match |
| Add a new page or route to the UI | `src/pages/` and `src/App.jsx` in the frontend. Update the [Routing Map](../README.md#routing-map) |
| Change the database schema | Add a new numbered migration under `backend/db/migrations/`. Never edit an existing one that's already been applied anywhere |
| Change deployment steps | [DEPLOYMENT.md](DEPLOYMENT.md) |

<br/>

## Reporting Bugs

Open a GitHub issue with:
- What you expected to happen vs. what actually happened
- Steps to reproduce
- Whether it happened locally, on the [live demo](../README.md#live-demo), or both
- Relevant logs (with any tokens or keys redacted)

<br/>

## Proposing Features

Open a GitHub issue describing the problem the feature solves, not just the feature itself. It's easier to evaluate "analysts want to compare two reports side by side" than "add a compare button." If it's related to something already listed under [Future Improvements](../README.md#future-improvements), reference that so discussion builds on existing context instead of starting over.

