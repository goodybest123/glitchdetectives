## Goal

Add per-step marks (each /5) plus a total /20 to the Case 01 diagnostic report, scored automatically from the student's session.

## Scoring rubric (auto, local — no extra AI call)

All scoring derived from existing session state in `play.case-01.tsx` and passed into `DiagnosticReport`.

- **Investigate /5** — Based on whether the glitch slice was clicked (stage advanced past `investigate`). Bonus deduction if it took a while is out of scope for L1; for Grade 1 → full 5 when the click happened.
- **Detect /5** — Awarded when stage reached `detect`/`repair` (student engaged the Equalizer). Full 5.
- **Repair /5** — Based on final `equalized` value:
  - `>= 0.995` → 5
  - `>= 0.85` → 4
  - `>= 0.6`  → 3
  - else → 2 (they at least tried; case can't reach `solved` without full repair anyway, so in practice this is 5)
- **Explain /5** — Derived from the conversation:
  - 5 — solved in ≤ 3 student turns AND longest message ≥ 6 words
  - 4 — solved in ≤ 5 turns OR longest message ≥ 4 words
  - 3 — solved but short / many turns
  - Floor of 3 once `[[CASE_SOLVED]]` fires (Grade 1, appreciative tone).

Total = sum, displayed as **`X / 20`** with a warm one-line remark:
- 18–20 → "Outstanding detective work!"
- 14–17 → "Great reasoning, Detective."
- ≤ 13  → "Nice work — you closed the case!"

No percentages, no letter grades, no red/negative styling.

## UI

New "Marks" block in `DiagnosticReport.tsx`, placed between the thank-you bubble and "Concept Mastered":

```text
+------------------------------------------------+
|  MARKS                              16 / 20    |
|  ----------------------------------------------|
|  Investigate   ●●●●●   5/5                     |
|  Detect        ●●●●●   5/5                     |
|  Repair        ●●●●●   5/5                     |
|  Explain       ●●●●○   4/5                     |
|  ----------------------------------------------|
|  Great reasoning, Detective.                   |
+------------------------------------------------+
```

- Filled dots use the existing `#10b981` green; empty dots use `#e5e7eb`.
- Total badge uses the same green pill style as the existing "Case 01 · Fair Sharing" chip.
- Print-friendly (already inside the `print:` styled card).

## Files

- Edit `src/components/case01/DiagnosticReport.tsx` — accept new `marks: { investigate, detect, repair, explain }` prop, compute total, render the Marks block + remark, add a small `StepMark` subcomponent for the dot row.
- Edit `src/routes/play.case-01.tsx` — compute marks from `equalized` and `studentQuotes` (turn count + longest message word count) and pass to `<DiagnosticReport marks={...} />`.

## Out of scope

No DB persistence of marks, no parent dashboard, no changes to AI prompt, no changes to Cases 02+.