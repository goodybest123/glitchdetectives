# Case 01.03 + the Detective's Report

Two pieces of work: finish Case 01 by rebuilding The Painted Canvas hands-on like the Chocolate Bar, and replace the current report page with an evidence-based Detective's Report that shows how the child reasoned, not a score.

## Part 1 — Case 01.03: The Painted Canvas

Same shape of experience as the Chocolate Bar, so the child transfers the fair-share idea to a new object and a new number of parts (one canvas, two matching halves, shared with Nia).

Flow: CASE BRIEF → INVESTIGATE → DETECT → REPAIR → EXPLAIN → REAL-WORLD CHALLENGE → CASE CLOSED.

- **Brief.** ZED-4 confidently says "one painted side and one plain side, so that's half." The painted side is visibly bigger.
- **Investigate.** The child drags the two regions onto a compare board, holds them side by side, and jots optional un-graded notes. Sizes are drawn proportionally, so the mismatch is genuinely visible. Progressive hints, no timer.
- **Detect.** Pick the observation ("the two sides are not the same size"), then show the evidence by comparing before any right/wrong feedback. Wrong picks are recoverable and gentle.
- **Repair.** A draggable dividing line on the canvas with forgiving snapping near the true middle, plus keyboard arrows. The child then confirms the two matching halves.
- **Explain.** Sentence-building words, optional typing and voice, plus ZED-4 chat with the existing gentle prompt. Read-aloud buttons throughout.
- **Real-world challenge + case closed.** Fold a piece of paper into two matching parts and prove it.

Pizza, Chocolate, the other worlds, the passcode gate and the AI all stay exactly as they are.

## Part 2 — The Detective's Report

### What the child sees (Case Reflection)
At the end of a case: "CASE CLOSED — You caught the glitch!", the detective skill for that case, a short tick list of what they actually did, and one encouraging line. No score, no percentage. Two buttons: **View Detective's Report** and **Continue to next case**.

### What the parent sees (Level Report)
The existing `/play/report` page is replaced by a calm case-file style report:

- Header: Detective's Report, "Your child's current reasoning snapshot", "Based on X completed investigations", plus an honest "Early snapshot" line.
- Warm intro explaining that this shows reasoning, not answers.
- **What your child is showing** — 2–3 insight cards generated only from real recorded behaviour; otherwise "We're still collecting evidence about this skill."
- **Reasoning profile** — NOTICE, CHECK, REPRESENT, REVISE, EXPLAIN, each with a level (Emerging / Developing / Consistent), a plain description, and a "How we know" line quoting the actual case moment. Levels never reach Consistent from a single case.
- **Mathematical understanding** — kept separate from reasoning, with a "what they can currently do" list showing only supported items.
- **The evidence behind this report** — chronological cases, each expandable into Investigate / Detect / Repair / Explain.
- **What this may suggest** — cautious, observational, never diagnostic.
- **The next step** — exactly one priority, with a better question to ask.
- **Try this at home** — one concrete activity plus "Show me how you know."
- **Why we report reasoning** and **Your Detective Journey** (honest placeholder until enough cases exist).
- Low-data and no-data states, both honest, with a Start Investigating button.

Language rules are enforced in the copy: observable behaviour only, no labels, no diagnoses, no grade levels, no scores. Hints are recorded as support, never as failure. Changing your mind after evidence counts positively toward REVISE.

### Design
Existing Glitch Detectives identity — dark blue, sky blue, white, rounded cards, subtle shadows, generous whitespace. No gradients, no glass, no transparency. Levels are shown with words and icons, not colour alone. Stacks cleanly on mobile with large tap targets, no horizontal scroll, no motion or countdowns. ZED-4 appears briefly for personality only.

## Technical notes

- New `src/lib/reasoning/` module: the `CaseResult` evidence shape (investigation, detection, repair, explanation, support, interaction), a `detectiveProfile` aggregate, a configurable `reasoningEvaluation` with thresholds, and deterministic `generateCaseSnapshot` / `generateLevelSnapshot` functions, with `generateCumulativeSnapshot` stubbed so Level 3 slots in later. No AI narrative in the report — rules only.
- A storage service layer (`saveCaseResult` / `getProfile`) backed by localStorage today, so the database can replace it without touching the report UI.
- Pizza, Chocolate and Canvas each emit a `CaseResult` at completion; the existing `useReportRecorder` / AI grading for the older cases stays intact so nothing regresses.
- New `Case01CanvasActivity.tsx` modelled on `ChocolateCaseActivity.tsx`, wired through `src/routes/play.case-01.tsx`; canvas metadata and chat prompt updated in place.
- Report page rebuilt at `/play/report` from the snapshot functions; report links added to case completion and the worlds dashboard.
- Verification: typecheck, build, and a browser pass through Canvas end to end plus the report at desktop and mobile widths, checking that the report content actually changes with different child behaviour.

Case 01.04 (The Mystery Share) is not built here — the data model leaves room for it.
