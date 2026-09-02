# Rebuild Case 01.01 — The Pizza

## Goal

Turn the Pizza experience into the first polished Glitch Detectives investigation: a calm, reasoning-first journey where a child audits ZED-4's confident claim, gathers visual evidence, repairs the pizza, explains the reasoning, and optionally applies it to a real-world sharing situation.

The existing Case 01 picker and the other Case 01 sub-cases will remain available and unchanged in scope. The current picker will continue to be the entry point; selecting Pizza opens the rebuilt Case 01.01 experience.

## Experience flow

```text
CASE BRIEF → INVESTIGATE → DETECT → REPAIR → EXPLAIN → APPLY → CASE CLOSED
```

1. **Case brief** — Show `CASE 01.01 · THE PIZZA`, `THE FAIR-SHARE GLITCH`, the recipients, the friendly overconfident ZED-4 claim, and one clear `START INVESTIGATION` action without teaching the answer.
2. **Investigate** — Present ZED-4's completed solution with four visibly unequal pizza pieces and one piece assigned to Maya, Leo, Sam, and ZED-4. Add a tactile comparison board where pieces can be dragged, selected, and moved with keyboard controls. Include simple Move, Rotate, Compare, and Undo support where it improves the investigation without making precision mandatory.
3. **Detect** — Offer three large whole-card choices. Keep feedback calm and non-punitive, allow retries, and require evidence for the correct claim by having the child compare two pieces and select whether they match or differ before continuing.
4. **Repair** — Present an initially whole pizza and a simple, forgiving cut interaction. Support a first and second cut that resolves to four equal regions for reasonable horizontal/vertical attempts, then let the child assign one repaired share to each recipient. Confirm fairness with a clear same-amount check.
5. **Explain** — Make sentence-building the primary path, with the two required understanding prompts. Keep speaking available through the existing microphone control and make writing optional rather than the required response mode. Connect the completed explanation to the existing ZED-4 AI dialogue and preserve streaming/retry behavior.
6. **Apply and close** — Show the optional one-sandwich/two-people Detective Challenge, then the calm `CASE REPAIRED` recognition and `CHECK BEFORE YOU TRUST` detective skill. Keep the parent-facing report link and locally recorded completion data, without scores, timers, lives, or leaderboards.

## Interaction and accessibility requirements

- Use the existing dark-blue, sky-blue, light-background visual language and semantic design tokens; no gradients, glass effects, flashing, excessive motion, or punitive error states.
- Keep the existing sticky `INVESTIGATE → DETECT → REPAIR → EXPLAIN` stepper, predictable primary action placement, short instructions, large targets, and speak-aloud controls.
- Support mouse, touch, and keyboard operation for movable pieces and repair controls, with visible focus and selected/dragged feedback.
- Provide reset/undo and progressive `NEED A CLUE?` hints without requiring a minimum number of interactions before advancing.
- Respect reduced-motion preferences and ensure tablet is the primary spacious interaction layout, with stacked mobile behavior and a usable desktop board.

## Technical implementation

- Refactor the Case 01 activity into Pizza-specific reusable components/data while preserving the shared case architecture for future templates.
- Extend structured Pizza case data for the brief, recipients, detection choices, evidence prompts, repair stages, hints, explanation choices, application challenge, and completion copy rather than scattering copy through the route.
- Track the MVP state locally: current stage, selected detection, evidence attempt, repair/cut state, distribution, explanation method/response, hints, attempts/revisions, and completion. Keep existing progress/report persistence compatible.
- Keep the existing AI endpoint contract and safe chat validation. Update the Pizza prompt only as needed so ZED-4 remains confident but fallible, asks for evidence, avoids giving away the answer too early, and closes only after the child explains equal/same-size reasoning.
- Avoid changes to Cases 02–06, unrelated company/platform pages, authentication/access gating, or backend/database work.

## Verification

- Test the complete Pizza path from brief through case closure, including retrying an incorrect detection, evidence confirmation, cut/repair, share distribution, sentence choices, optional speak/write paths, hints, reset/undo, and AI retry behavior.
- Check keyboard and touch interactions plus tablet, desktop, and mobile layouts for readable text, stable controls, no overlap, and no accidental scrolling issues.
- Run the project TypeScript check, targeted lint, production build, and live browser checks with no new console/runtime errors.
