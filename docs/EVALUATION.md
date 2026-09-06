<div align="center">

# Evaluation & Reliability

### How Meridian keeps a generated report trustworthy?

<img src="https://img.shields.io/badge/approach-structural%2C_not_scored-BA7517?style=for-the-badge&labelColor=1a1a1a" />
<img src="https://img.shields.io/badge/every_finding-citation--linked-534AB7?style=for-the-badge&labelColor=1a1a1a" />

</div>

<br/>

> This expands on the [Evaluation & Reliability](../README.md#evaluation--reliability) section in the main README. Read that first for the summary table. This covers each mechanism in more depth, and is honest about what isn't measured yet.

<br/>

## Table of Contents

- [The Core Idea](#the-core-idea)
- [Mechanism 1 — Validation Agent](#mechanism-1--validation-agent)
- [Mechanism 2 — Citation Linking](#mechanism-2--citation-linking)
- [Mechanism 3 — Fail-Fast on Weak Results](#mechanism-3--fail-fast-on-weak-results)
- [Mechanism 4 — Server-Verified Access](#mechanism-4--server-verified-access)
- [What This Doesn't Cover](#what-this-doesnt-cover)
- [How to Manually Spot-Check a Report Today](#how-to-manually-spot-check-a-report-today)
- [Where This Is Headed](#where-this-is-headed)

<br/>

## The Core Idea

Meridian doesn't have a separate "grading" step that scores a finished report after the fact. Instead, reliability is built into the pipeline as it runs. Each stage is responsible for not passing weak or unsupported output to the next one. The idea is closer to manufacturing quality control (catch a defect at the station that produced it) than to a final QA audit.

That's a deliberate trade-off: it means correctness is enforced consistently on *every* job, not just the ones someone happens to review, but it also means there's currently no aggregate score like "94% of claims were well-supported this month." See [What This Doesn't Cover](#what-this-doesnt-cover).

<br/>

## Mechanism 1 — Validation Agent

**Where:** `ai/validation/validation_agent.py`

Before any extracted evidence is allowed into a report, the Validation agent cross-checks it against the source it was pulled from and assigns a confidence verdict. This is what stands between "the LLM extracted a claim that sounded right" and "the claim is actually backed by what the source says."

Concretely, this stage exists to catch:
- Evidence that misrepresents or overstates what a source actually said
- Extraction errors (e.g. a quote pulled out of context)
- Low-confidence claims that shouldn't be presented with the same weight as well-supported ones

<br/>

## Mechanism 2 — Citation Linking

**Where:** `ai/report/report_linker.py` and `ai/report/citation_builder.py`

After the report is drafted, the Report Linker rewrites it so that every key finding links back to the exact evidence and source behind it. This is the mechanism that powers the **Report / Evidence / Sources** tabs in the UI. A user isn't asked to take a finding on faith; they can click through to the original web page.

This also acts as a passive check on the report itself: a finding that can't be traced back to real evidence has no citation to attach, which makes gaps visible rather than silently accepted.

<br/>

## Mechanism 3 — Fail-Fast on Weak Results

**Where:** the pipeline orchestration in `ai/pipeline/research_pipeline.py`

If any stage comes back with an empty result, i.e., no research tasks, no sources found, no evidence extracted, even after its retries, the pipeline stops immediately and marks the job `failed`, rather than letting a thin, low-confidence pipeline run limp forward into a report that reads as complete but isn't.

This means a `completed` job status is itself a (weak) reliability signal: it implies every stage produced *something*, not that the something was necessarily excellent, but it does rule out the worst failure mode of a hollow report presented as a finished one.

<br/>

## Mechanism 4 — Server-Verified Access

**Where:** `backend/core/auth.py`

Not a correctness check on the report's *content*, but a reliability guarantee on its *custody*: every bearer token is independently re-verified against Supabase on every request, and job ownership is enforced server-side. A user can trust that the report they're looking at was generated from their own brief and hasn't been tampered with or substituted via a client-side bug.

<br/>

## What This Doesn't Cover

Being direct about the gap, rather than implying more rigor than exists today:

| Not currently measured | What that means in practice |
|---|---|
| **Aggregate accuracy rate** | There's no number like "X% of claims are well-supported". Reliability is enforced per-job, not tracked across jobs. |
| **Hallucination detection beyond the Validation agent's own judgment** | The Validation agent is itself an LLM call; there's no independent, separately-trained check on *it*. |
| **Automated regression testing on report quality** | Nothing currently re-runs a fixed set of test briefs and diffs the output when the pipeline's code or prompts change. |
| **Citation coverage as a metric** | The system either links a finding to a citation or (implicitly) it does not. There's no reported percentage of findings that ended up fully cited. |

<br/>

## How to Manually Spot-Check a Report Today

Until the automated tooling below exists, the fastest manual check for a given `job_id`:

1. Fetch the report: `GET /api/research/{job_id}/report`
2. Fetch its evidence and sources: `GET /api/research/{job_id}/evidence` and `.../sources`
3. Pick 2–3 key findings and confirm the source they link to actually supports the claim as written
4. Check `.../validations` for that evidence, a low-confidence verdict on evidence backing a headline finding is worth a closer look

(See [API.md](API.md) for the full route reference.)

<br/>

## Where This Is Headed

Tracked in more detail under [Future Improvements](../README.md#future-improvements) in the main README, but specifically for evaluation:

- A lightweight automated eval pass, citation-coverage checks and hallucination spot-checks, run against every generated report before it's marked `completed`, rather than relying solely on the Validation agent's own pass.
- A small fixed set of benchmark briefs, re-run whenever pipeline prompts or logic change, to catch quality regressions before they ship.

