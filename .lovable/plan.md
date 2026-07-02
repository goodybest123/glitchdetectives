## Goal
Produce a rubric-by-rubric self-assessment of Glitch Detectives against the 2026 BuildVerse Hackathon rubric, saved as `docs/rubric-self-assessment.md` so you can reference it during judging.

## Deliverable
A single markdown doc with one section per rubric criterion. Each section contains:
- **Score (self-rated /5)** — honest, not inflated
- **Evidence** — concrete file paths / features that support the score
- **Gaps** — what a judge could reasonably mark down
- **Quick win** — a small fix (if any) that could raise the score before submission

## Sections (mirroring the rubric)

**Code Quality & Technical Execution**
1. Code Structure & Organisation — routes in `src/routes/`, per-case components in `src/components/caseNN/`, shared UI in `src/components/shared/`, hooks in `src/hooks/`, server logic in `*.functions.ts` / `src/routes/api/chat/*`. Note the clean separation and the one weak spot (case folders duplicate patterns instead of a shared abstraction).
2. Functionality & Completeness — 6 cases live, `/play`, `/play/report`, `/printables`, ZED-4 grading, voice input, TTS, workbook PDFs.
3. Use of Version Control — flag as the biggest unknown; recommend checking README + commit hygiene before judging.
4. Code Readability & Documentation — TypeScript strict, Zod validators, purposeful comments in `useReportRecorder`, `report.functions.ts`, `server.ts`. Gap: no top-level architecture doc.

**AI Integration & Usage**
5. Depth of AI Integration — AI is the product's core loop: ZED-4 makes the glitch, child explains, `gradeExplanation` server fn produces the Cognitive Insights report (4 dimensions × 3 levels + rubric + evidence). Cite `src/lib/report.functions.ts`, `src/routes/api/chat/*`.
6. Quality of AI Outputs — structured output via `Output.object({ schema })`, Zod-normalized, fallback JSON parse, safe defaults on failure. Gap: no eval harness / no sample outputs shown to judges.

**Product Viability & Design**
7. User Experience & Interface — neurodivergent-inclusive: no timers, no red Xs, TTS on every caption (`CaptionLine`, `DetectiveCallout`, `SuccessBanner`), multimodal input (voice/text/tap), calm palette, printable workbook parity.

## Closing section
- **Top 3 things to say out loud during judging** (mapped to weakest rubric rows so you pre-empt them).
- **Top 3 quick wins before submission** (e.g. README polish, add a short `ARCHITECTURE.md`, drop a screenshot of a real Cognitive Insights report into the repo).

## Out of scope
No code changes, no README rewrite, no commit history edits. This turn only produces the assessment doc; you can ask me to act on any quick win afterward.