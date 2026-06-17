## Goal

Replace numeric scoring in the Detective's Report with a parent/educator-facing **Cognitive Insights** panel. The AI parses the child's spoken/typed reasoning and outputs qualitative labels (Emerging / Developing / Secure) across four critical-thinking dimensions, each with a short evidence quote from what the child actually said.

## What gets removed

- The 4-bar **Marks** block (Investigate / Detect / Repair / Explain) on each glitch row in `play.report.tsx`.
- The `marks` data is no longer rendered (kept in the type for backward-compat with stored entries; not displayed).

## What stays

- Verdict pill (Solved / Almost there / Review)
- Understanding meter (5 dots)
- Strengths / Could be clearer bullets
- "Try next" callout
- Rubric coverage counter and per-key-idea rubric chips

## What's new: Cognitive Insights (parent/educator view)

A new block on each solved glitch row, framed for adults, with 4 fixed dimensions:

1. **Conceptual Understanding** — grasp of the core fraction idea (equal parts, whole, fair share, etc.)
2. **Reasoning & Justification** — does the child explain the *why*, not just the *what*
3. **Vocabulary & Precision** — accurate use of math terms (numerator, denominator, equal, whole…)
4. **Problem Decomposition** — breaking the glitch into steps before fixing it

Each renders as a qualitative label chip + one-line evidence:

```text
Conceptual Understanding   [Secure]      "Said the pizza needs 4 equal slices for 4 friends."
Reasoning & Justification  [Developing]  "Gave the fix but didn't explain why unequal parts are unfair."
Vocabulary & Precision     [Emerging]    Used 'pieces' instead of 'equal parts'; no fraction words.
Problem Decomposition      [Secure]      "First I see the bad slice, then I cut it even."
```

Label color coding: Secure = green, Developing = amber, Emerging = slate.

Header reframing on the report page: tagline becomes *"Real-time critical-thinking insights from your child's reasoning."*

## Technical changes

**`src/lib/report.functions.ts`**
- Extend `GradeResult` schema with:
  ```ts
  insights: z.array(z.object({
    dimension: z.enum([
      "Conceptual Understanding",
      "Reasoning & Justification",
      "Vocabulary & Precision",
      "Problem Decomposition",
    ]),
    level: z.enum(["Emerging", "Developing", "Secure"]),
    evidence: z.string(), // ≤22 words, paraphrase or short quote
  })).length(4)
  ```
- Update system prompt: add instructions to score each of the 4 dimensions using only evidence from the child's text; "Emerging" if absent, "Developing" if partially shown, "Secure" if clearly demonstrated. Evidence must reference what the child said (or "Not mentioned").
- Add `normalizeInsights()` that guarantees all 4 dimensions are present, defaulting missing ones to `Emerging` + `"Not mentioned in explanation."`
- Add `insights: []` (then normalized to 4 defaults) in the plain-JSON fallback and the final catch-all fallback.

**`src/hooks/useReportStore.ts`**
- Add optional `insights?: { dimension; level; evidence }[]` to `ReportEntry`.
- Bump `STORAGE_KEY` to `gd:report:v4`.

**`src/hooks/useReportRecorder.ts`**
- Forward `insights: res.insights` into `patchReportEntry`.

**`src/routes/play.report.tsx`**
- Remove the `MarksBar` (or equivalent 4-bar marks rendering) from `GlitchRow`. Leave the `marks` field untouched in the store; just don't render it.
- Add `CognitiveInsights` component rendered in `GlitchRow` below the rubric block:
  - Section heading: "Cognitive Insights" with small subtitle "For parents & educators".
  - 4 rows, each: dimension name, level chip (color by level), evidence line in muted text.
- Update the page intro copy under the report title to the parent/educator framing above.

## Out of scope

- No change to per-case end screen (`DiagnosticReport.tsx`).
- No change to chat prompts in `src/routes/api/chat/*` — insights are derived from the child's final explanation only, same as the current grader.
- Marks data is preserved in storage for older entries; only the UI is removed.