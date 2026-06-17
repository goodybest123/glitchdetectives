## Add Explanation Rubric to the Detective's Report

Goal: For each solved glitch, show a clear rubric that scores how well the child's explanation hit the key ideas for that concept, with specific strengths and improvement areas tied to those criteria.

### 1. Extend AI grading to return per-criterion scores (`src/lib/report.functions.ts`)

Expand the `gradeExplanation` output schema with a `rubric` array — one entry per key idea for the concept:

```ts
rubric: z.array(z.object({
  criterion: z.string(),     // e.g. "Names equal parts"
  score: z.enum(["met", "partial", "missing"]),
  evidence: z.string(),      // ≤18 words: what the child said (or didn't) for this idea
})).min(3).max(4)
```

Update the system prompt so ZED-4 derives 3–4 key-idea criteria from the `conceptMastered` + `glitchSummary` (e.g. for Fair Sharing: "Whole is split", "Parts are equal", "Names the fraction", "Connects to the glitch"). Each criterion is scored against the child's actual words. Existing `strengths` / `gaps` / `nextStep` / `note` stay — strengths/gaps become a short human summary; rubric is the structured detail. Add safe defaults in the plain-JSON fallback and the final hard fallback (empty rubric is allowed).

### 2. Persist rubric on the report entry (`src/hooks/useReportStore.ts`)

Add optional field:

```ts
rubric?: { criterion: string; score: "met" | "partial" | "missing"; evidence: string }[]
```

Bump `STORAGE_KEY` to `gd:report:v3` so stale v2 entries don't render a half-empty rubric.

### 3. Forward rubric through the recorder (`src/hooks/useReportRecorder.ts`)

Pass the new `rubric` field from `gradeExplanation`'s result into `patchReportEntry` alongside the existing diagnostic fields.

### 4. Render the rubric in the report (`src/routes/play.report.tsx`)

Inside `GlitchRow`, when `entry.rubric?.length`, render a new "Explanation Rubric" block under the existing strengths/gaps grid:

- Header row: "Explanation Rubric" + a small score summary (e.g. `2 met · 1 partial · 1 missing`).
- A compact table/list, one row per criterion:
  - status chip: green ✓ Met / amber ◐ Partial / red ✗ Missing
  - criterion name (bold)
  - one-line evidence ("You said: …" or "Not mentioned")
- Print-friendly (no hover, `break-inside-avoid`).

The existing `strengths` and `gaps` blocks stay as a quick human-readable summary above the rubric. `nextStep` "Try next" callout stays below.

### 5. Surface in the per-case header

In `CaseSection`, next to the existing `solvedCount`, add a small "rubric coverage" indicator only for entries that have a rubric: total `met` count across the case (e.g. `7/12 key ideas met`). Skip silently when no rubric data exists yet.

### Files
- `src/lib/report.functions.ts` — add `rubric` to schema, prompt, normalize, fallback
- `src/hooks/useReportStore.ts` — extend `ReportEntry`, bump key to `v3`
- `src/hooks/useReportRecorder.ts` — pass `rubric` through
- `src/routes/play.report.tsx` — render rubric block in `GlitchRow`, coverage chip in `CaseSection`

No changes to per-case end screens (`DiagnosticReport.tsx`) — the rubric lives in the full Detective's Report only, keeping the in-case wrap-up uncluttered.
