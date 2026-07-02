## Goal
Lift the two weakest rubric rows (Version Control + Code Readability & Documentation) with docs a judge will actually open. No source-code refactors — pure documentation.

## Deliverables

### 1. `README.md` (repo root) — the judge's landing page
- One-line pitch + tagline ("Don't solve. Investigate. Detect. Repair.")
- Live URL: https://glitchdetectives.lovable.app
- 3-sentence "why it exists" (AI-era critical thinking, role reversal, neurodivergent-inclusive)
- Screenshot placeholders: landing, a case in play, the Cognitive Insights report, a workbook page
- **How it works** — the 4-step loop, one paragraph
- **Tech stack** — TanStack Start (React 19, Vite 7), TypeScript strict, Tailwind v4, Lovable Cloud (Supabase), Lovable AI Gateway (Gemini), Cloudflare Workers runtime
- **Run locally** — `bun install`, `bun dev`, env vars needed
- **Project structure** — 8-line tree with one-line descriptions
- **Links** — demo video, architecture doc, self-assessment
- License: MIT (safe hackathon default)
- **No founder name / no personal contact** — kept anonymous per your call

### 2. `docs/ARCHITECTURE.md` — the "another developer can understand it" doc
- **Runtime topology** ASCII diagram: browser → TanStack Router → server fn / API route → Lovable AI Gateway → Zod-normalised response → localStorage report store → `/play/report`
- **Routing map** — table of every route in `src/routes/` with purpose
- **The 6 cases** — table: case id, concept, folder, chat endpoint
- **AI grading pipeline** — walk through `useReportRecorder` → `gradeExplanation` → structured output → Zod normalise → fallback JSON → safe defaults
- **Report data model** — `ReportEntry` shape, storage key, versioning note
- **Server runtime constraints** — Cloudflare Worker + `nodejs_compat`, why we avoid Node-only packages
- **Auth** — Supabase middleware (`requireSupabaseAuth`, `attachSupabaseAuth`) and where it's used (or not used yet)
- **Extending** — how to add Case 07 in 5 steps

### 3. `docs/CONTRIBUTING.md` — signals a maintained repo
- Branching convention (`main` protected, `feat/*`, `fix/*`)
- Conventional Commits style (`feat:`, `fix:`, `docs:`, `chore:`)
- PR checklist (typecheck passes, screenshot for UI, updated docs)
- Local dev + how to run a single route

### 4. Light JSDoc pass on public boundaries only (no logic changes)
- `src/lib/report.functions.ts` — what the server fn does, inputs, outputs, failure modes
- `src/hooks/useReportStore.ts` — storage contract, versioning key
- `src/hooks/useReportRecorder.ts` — when it fires, idempotency guarantee
- `src/router.tsx` — how routes get registered

Files already well-commented (leave alone): `src/server.ts`, `src/components/shared/*`.

## Out of scope
- Rewriting git history / squashing / tagging — Lovable commits per turn; if you want a `v1.0-hackathon` tag, do it in GitHub after this lands (or ask and I'll give exact CLI steps).
- Branch protection rules — GitHub-side setting.
- Refactoring `case01`–`case06`.
- Actual screenshot capture — I'll leave `![...](docs/samples/*.png)` placeholders with one-line capture instructions.