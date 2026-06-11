# Judge-Friendly Diagnostic Report

A new master report page summarizing every glitch the child has tackled across all six case files, with ZED-4's AI verdict on each explanation.

## What the judge will see

Route: `/play/report` (linked from `/play` header and from the "Case Closed" screen of every sub-case).

Sections, top to bottom:
1. **Header strip** — "Detective's Report", child-friendly subtitle, totals (e.g. "14 of 18 glitches solved · 12 marked correct by ZED-4"), and a **Print / Save PDF** button (uses `window.print()` with a print stylesheet).
2. **At-a-glance grid** — one card per case file (01–06) showing: case title, emoji, sub-cases completed (e.g. 3/3), correctness dots (green/amber/grey).
3. **Per-glitch rows** — grouped by case file, each row contains:
   - Glitch summary (one sentence from the case data, e.g. "The 1/2 block is upside-down.").
   - The child's explanation quote (longest student chat message from Explain stage).
   - ZED-4 verdict pill: **Correct**, **Almost — needs review**, or **Not attempted**, plus a one-line ZED-4 comment.
   - Marks bar (Investigate / Detect / Repair / Explain — reuses existing `marks` shape).
4. **Footer** — "Made with Glitch Detectives" + back link to `/play`.

Empty / partial states: rows for un-attempted sub-cases show a muted "Not attempted yet" pill instead of marks.

## How it works

### 1. Capture data per sub-case (localStorage)

Extend the existing `gd:progress:v1` store (today only booleans) to a richer record. Bump key to `gd:report:v1` and keep the old key readable for one release.

Shape:
```
{
  [caseId]:                 // "case-01" … "case-06"
    [subCaseId]: {
      title: string,        // sub-case display title
      glitchSummary: string,// short one-liner from cases.ts
      explanation: string,  // longest student message
      marks: { investigate, detect, repair, explain },
      verdict: "correct" | "review" | "pending",
      verdictNote: string,  // ZED-4's one-liner from AI
      solvedAt: number      // epoch ms
    }
}
```

Write happens once per sub-case when the child enters the `solved` stage. Each `play.case-0X.tsx` already computes `marks` and `studentQuotes`; we add a small `useEffect` that, on first transition to `solved`, calls `saveReportEntry(caseId, subId, …)`.

New helper: `src/hooks/useReportStore.ts` with `saveReportEntry`, `getReport`, `clearReport` (all SSR-safe, `typeof window !== "undefined"`). `useCaseProgress` keeps working — it now reads "solved" from the new store.

### 2. ZED-4 AI verdict (Lovable AI Gateway)

New server function `gradeExplanation` in `src/lib/report.functions.ts` using `createServerFn` + `generateText` with `Output.object` schema:
```
{ verdict: "correct" | "review", note: string (≤120 chars) }
```
Inputs: `{ caseTitle, subTitle, glitchSummary, conceptMastered, childExplanation }`.
Model: `google/gemini-3-flash-preview` via the existing `src/lib/ai-gateway.ts` helper.
System prompt frames ZED-4 as an encouraging robot tutor grading a child's fraction explanation; mark "correct" if the explanation captures the core idea, otherwise "review" with a one-line nudge.

Call site: same `useEffect` that writes the report entry. Optimistic record is written with `verdict: "pending"`, then the AI response patches the record. If the call fails (offline, 429, 402), we leave it as `pending` with `verdictNote: "ZED-4 couldn't grade this right now."` — the row still appears with marks intact.

### 3. New route `src/routes/play.report.tsx`

- Loads the report from localStorage on mount (client-only — no loader, so no SSR/auth issues per `auth-protected-server-functions`).
- Iterates `SUB_CASE_ORDER` for each case (case-01 already exports it; case-02–06 export equivalent metadata in their `cases.ts` — verified during exploration) and renders attempted/non-attempted rows.
- Includes print stylesheet (extend existing `print:` utilities already used in `DiagnosticReport.tsx`).

### 4. Entry points

- Add a "View Report" button in `src/routes/play.index.tsx` header.
- Add a secondary "View full report" button inside the existing per-case `DiagnosticReport` action bar.
- Optional: small "Reset report" link on `/play/report` that clears `gd:report:v1` for demo replays.

## Technical details

**Files created**
- `src/routes/play.report.tsx` — the master report page (client-rendered).
- `src/hooks/useReportStore.ts` — localStorage read/write + types.
- `src/lib/report.functions.ts` — `gradeExplanation` server function (Lovable AI Gateway).
- `src/components/report/ReportRow.tsx`, `ReportCaseCard.tsx`, `VerdictPill.tsx` — presentational pieces.

**Files edited**
- `src/routes/play.case-01.tsx` … `play.case-06.tsx` — one `useEffect` on `solved` to call `saveReportEntry` + `gradeExplanation`; add "View full report" link in the report action bar.
- `src/components/case01/DiagnosticReport.tsx` — add the extra action button (only this file; other cases reuse it or have their own — exploration showed only case-01 hosts `DiagnosticReport`; cases 02–06 import it from `case01/`. Verified.)
- `src/routes/play.index.tsx` — header "View Report" link.
- `src/hooks/useProgress.ts` — keep API, but `markSolved` now also writes to the new report store (or the route does it directly; pick one path during build).
- `src/styles.css` — minor print rules + verdict pill colors.

**Out of scope**
- No backend tables, no auth, no cross-device sync (per user choice).
- No edits to existing chat routes or repair mechanics.
- No new fraction content.

## Acceptance checks
- Solve at least one sub-case from two different case files, reload, open `/play/report` → both rows appear with the child's quote, marks, and a ZED-4 verdict pill.
- Disable network during the Explain → Solved transition → row still appears with `pending` verdict and graceful note.
- Print preview renders cleanly without nav chrome or buttons.
- "Reset report" empties the page back to all "Not attempted yet" rows.
