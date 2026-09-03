# Rebuild Case 01.02 — The Chocolate Bar

## Goal

Build Case 01.02 as a polished, hands-on fair-sharing investigation using the proven Case 01.01 interaction pattern, while leaving Case 01.01, Case 01.03, Cases 02–06, the broader site, and the existing gate unchanged.

The child should discover that giving three people one piece each is not automatically fair: the pieces must contain equal amounts.

## Confirmed architecture

- Case 01.01 is a dedicated experience in `src/components/case01/PizzaCaseActivity.tsx` with its own brief → investigate → detect → repair → explain → solved flow, local observation record, AI dialogue, and report integration.
- Chocolate currently runs through the generic `SubCaseRunner` in `src/routes/play.case-01.tsx` and shared primitives in `src/components/case01/Case01Activity.tsx`.
- The existing chocolate visual and copy are generic slider-based pieces, so the rebuild will give Chocolate its own dedicated experience rather than changing the shared runner used by Canvas.
- Repair interaction choice: use two independently draggable divider lines across the bar, with forgiving snapping toward the two positions that create three equal sections.

## Implementation

1. Create `src/components/case01/ChocolateCaseActivity.tsx` by adapting the established Pizza experience architecture:
   - Add a clear CASE BRIEF with the Chocolate Bar mission, three detective recipients, and ZED-4’s confident but unverified claim.
   - Add a persistent progress indicator for Brief, Investigate, Detect, Repair, and Explain, with the existing shared stepper language and calm responsive layout.
   - Preserve the shared `ZedBubble`, `SpeakButton`, `MicButton`, `ChatPanel`, `CaseStepper`, `DiagnosticReport`, `useReportRecorder`, celebration, and local progress patterns.

2. Build a chocolate-specific investigation scene:
   - Render one recognizable rectangular chocolate bar split into three clearly unequal, realistic sections.
   - Show Maya, Leo, and Sam each holding exactly one piece, with ZED-4’s reasoning shown as separate claim steps and a clearly labeled confidence-only “CASE CLOSED” status.
   - Let the child freely drag pieces around a comparison board, with large touch targets, keyboard movement, optional rotation where useful, reset/undo support, and no interaction gate.
   - Add multi-select Detective Notes without marking observations right or wrong, plus progressive clues matching the specification.

3. Implement the Detect stage as evidence-first reasoning:
   - Present three large fully clickable choices, with “The pieces are different sizes” as the correct choice.
   - For an incorrect choice, use calm reconsideration language and allow retry without penalties.
   - After the correct choice, require an explicit evidence action: choose two pieces, compare them in a focused view, and answer whether they are the same or different sizes before continuing.
   - Record detection, comparison, evidence, hints, retries, and revised answers locally.

4. Implement the Repair stage as a true hands-on bar divider:
   - Start from one whole, undivided chocolate bar with Maya, Leo, and Sam nearby.
   - Let the child drag two divider handles independently along the bar; each divider snaps gently toward approximately one-third and two-thirds rather than requiring pixel-perfect motor control.
   - Render the actual sections as the dividers move, provide reset and keyboard support, and accept either divider order.
   - After three matching sections are formed, let the child distribute one share to each detective through direct drag/drop with an accessible activation alternative.
   - Ask “Is it fair?” with the two specified choices, using calm feedback and no score, timer, lives, or punishment.

5. Implement Explain and Case Closed:
   - Provide the two sentence-building prompts with the exact answer concepts: same amount and different sizes.
   - Offer optional voice input and optional writing, never requiring speech or typing.
   - Keep ZED-4’s AI Guide secondary: preserve the existing chat transport, use progressive questions in the Chocolate system prompt, and only close the case when the child’s explanation demonstrates the equal-amount idea.
   - Show the Chocolate-specific repaired-case message, “Compare before you decide” detective skill, real-world paper/chocolate challenge, and parent information section.

6. Add Chocolate-specific local recording and reporting:
   - Store the requested case data under a Chocolate-specific local key, including `caseId`, current stage, selected detection, evidence attempt, repair attempt/success, explanation method/response, hints used, attempt count, and completion.
   - Feed the child’s explanation and stage evidence into the existing local Cognitive Insights report without adding accounts, backend persistence, subscriptions, analytics, or leaderboards.

7. Wire only Chocolate to the new experience:
   - Update `src/routes/play.case-01.tsx` so `activeCase === "chocolate"` uses the new component while Pizza and Canvas retain their current paths.
   - Update the Chocolate definition in `src/components/case01/cases.ts` for the exact recipients, choices, prompts, explanation copy, challenge, and parent-facing wording.
   - Update `src/routes/api/chat/case-01-chocolate.ts` so the AI follows the specified coaching, vocabulary, retry, and `[[CASE_SOLVED]]` rules.
   - Keep `ChocolateSVG.tsx` and shared generic components available for existing consumers unless the new experience no longer needs a legacy path; do not alter unrelated cases.

## Validation

- Run targeted formatting, lint, typecheck, and production build checks.
- Verify the full flow in the live preview at desktop, tablet, and mobile widths.
- Test dragging and keyboard control for both divider handles, snapping near thirds, reset/retry behavior, piece comparison, evidence confirmation, distribution, optional writing/voice paths, AI chat retry, local report creation, and case completion.
- Confirm no new console or network errors and that Pizza, Canvas, gating, and the rest of the site remain unchanged.

## Technical details

- Keep state local to the Chocolate experience; do not add a database or new server function.
- Use existing semantic design tokens and the shared `Button` component for controls.
- Keep one major task per stage, large interaction targets, short instructions, visible status feedback, reduced animation, and `prefers-reduced-motion`-friendly behavior.