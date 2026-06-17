## Goal
Turn the Diagnostic Report from a one-line verdict into a clear, kid-friendly diagnostic that shows **how** the child explained each concept, **what they got right**, **where they're shaky**, and **what to practice next** — both per glitch and as an overall roadmap.

## Changes

### 1. Richer AI grading (`src/lib/report.functions.ts`)
Expand `gradeExplanation` to return a structured diagnostic instead of just `{verdict, note}`:
- `verdict`: `correct | partial | review` (add a middle tier so "almost there" isn't lumped with wrong)
- `understandingLevel`: 1–5 (how well the core idea came through)
- `strengths`: 1–2 short bullets ("You named the whole and the parts")
- `gaps`: 0–2 short bullets ("Didn't mention that parts must be equal")
- `nextStep`: one concrete practice suggestion ("Try drawing 3 equal slices and naming each as 1/3")
- `note`: existing one-sentence ZED-4 message (kept for backward compat)

Keep the plain-JSON fallback already in place; widen it to the new shape. Tighten the schema to stay within Gemini's constrained-decoding limits (short field names, no enums beyond verdict, bounded array lengths).

### 2. Store the new fields (`src/hooks/useReportStore.ts`)
Extend `ReportEntry` and `Verdict` with the new optional fields. Old localStorage entries keep working (all new fields optional). Bump `STORAGE_KEY` to `gd:report:v2` so stale v1 entries don't render half-empty diagnostics.

### 3. Wire grading result through (`src/hooks/useReportRecorder.ts`)
Pass the new fields from `gradeExplanation` into `patchReportEntry`. No behavior change for the recording trigger.

### 4. Expanded per-glitch card (`src/routes/play.report.tsx` → `GlitchRow`)
For each solved glitch, render:
- Header: emoji, title, verdict pill (now 3 tiers), understanding meter (1–5 dots)
- **Glitch** (what was wrong) — already shown
- **Concept** (what this glitch teaches) — pulled from `conceptMastered`, currently unused in UI
- **What you said** — the child's quote (already shown)
- **ZED-4's read** — two-column block:
  - ✓ Strengths (green bullets)
  - △ Could be clearer (amber bullets)
- **Try next** — one-line practice suggestion in a highlighted box
- Marks row stays at the bottom

Empty/legacy entries (no AI diagnostic yet) fall back to today's single-line note.

### 5. Roadmap section on the report (`play.report.tsx`)
Add a new section above the per-case list:
- **Concepts mastered** — list of `conceptMastered` strings from glitches graded `correct`
- **Focus areas** — list of concepts from glitches graded `partial` or `review`, each with the AI's `nextStep`
- **Suggested replay path** — first 3 unattempted or `review` sub-cases, as `<Link>`s back into `/play/case-XX`

This gives the child (and a parent reading along) a clear "you've got this / work on this / do this next" roadmap.

### 6. Verdict pill + meter components
- `VerdictPill` gains a `partial` variant (blue/indigo "Almost there").
- Small `UnderstandingMeter` component (5 dots, filled by `understandingLevel`).

## Technical notes
- Schema kept small to avoid Gemini "too many states" errors: `verdict` enum only, other fields are plain strings/numbers with bounded arrays (`max(2)`).
- All new `ReportEntry` fields are optional; the UI renders gracefully when missing so existing saved reports still display.
- Storage key bump avoids confusing partial-shape rows from earlier sessions.
- No backend/schema changes; purely client + existing server function.

## Files touched
- `src/lib/report.functions.ts` — expanded schema + fallback
- `src/hooks/useReportStore.ts` — extended `ReportEntry`, `Verdict`, bumped key
- `src/hooks/useReportRecorder.ts` — forward new fields
- `src/routes/play.report.tsx` — richer `GlitchRow`, new roadmap section, updated pills/meter
