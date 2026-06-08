## Goal

Tighten Case 01 to a Grade-1 "fair sharing" concept, let ZED-4 decide when the student's explanation is solid, then reveal an appreciative, automated diagnostic report on the case page.

## 1. Rewrite the AI Guide for Grade 1 "fair sharing"

Edit `src/routes/api/chat/case-01.ts` system prompt so ZED-4:

- Stays strictly on **fair sharing** (equal-sized parts of one whole). No fraction notation talk, no numerators/denominators, no percentages.
- Uses ~8–10 word sentences, warm and curious ("Ooh, tell me more — were the pieces the same size?").
- Asks ONE tiny guiding question at a time.
- Affirms partial ideas, never gives the answer.
- Has a single hidden job: decide when the child's explanation clearly shows the "equal/fair parts" idea.

Add a **structured completion signal** using AI SDK's `Output.object` (zod schema) returned alongside the streamed reply, OR a simpler convention: ZED-4 ends its final message with a sentinel token `[[CASE_SOLVED]]` plus a short thank-you line. We'll use the sentinel approach — it works cleanly with `streamText` + `toUIMessageStreamResponse` without a second model call. The sentinel is stripped before render.

Criteria ZED-4 is instructed to look for before emitting the sentinel:
- Child mentions pieces being **equal / same size / fair / not fair**, in their own words.
- At least one back-and-forth has happened (avoid instant-solve on a lucky guess).

## 2. Detect completion on the client

In `src/routes/play.case-01.tsx`:

- After each assistant message, check the concatenated text for `[[CASE_SOLVED]]`.
- When found: strip the token from the displayed message, set new stage `solved`, disable composer, and reveal the diagnostic report card.
- Add a manual "I'm done explaining" secondary button as a fallback (kid or teacher escape hatch) that also triggers `solved`.

Extend the `Stage` union to include `"solved"` and pass through `CaseStepper` (Explain stays "complete" in solved state — all 4 steps filled green).

## 3. Diagnostic Report component

New `src/components/case01/DiagnosticReport.tsx`, mounted below the pizza card when `stage === "solved"`.

Content (all derived locally from session state, no extra AI call):

- **Header**: "Case Closed 🗂️" + warm thank-you line: *"Thank you for teaching me, Detective. You helped me learn what fair sharing really means."*
- **Concept mastered**: "Fair Sharing — equal parts of one whole" with a green check.
- **Evidence collected** (auto-filled from what actually happened):
  - Spotted the glitch in ZED-4's pizza ✓
  - Repaired the slices to be equal ✓
  - Explained the idea in their own words ✓ (with the child's longest/last user message quoted as the "evidence statement")
- **Conversation summary**: number of turns it took + a short list of the child's own sentences (so a parent/teacher can see the actual reasoning).
- **Suggested next focus** (static for L1): "Ready for Case 02: comparing fair shares."
- **Actions**: "Back to Cases" (link to `/play`) and "Print Report" (uses `window.print()` with a print-friendly stylesheet scoped to the report card).

Tone: appreciative, warm, no scores/percentages/emojis-as-grades. Matches existing palette (`#10b981` green, `#eaf2ff` blue, soft shadow, rounded-3xl).

## 4. UI polish

- When `solved`, dim/disable the chat composer with a soft "Case closed — great work!" placeholder.
- Replace the "SUBMIT EVIDENCE" button with a "VIEW REPORT" anchor that smooth-scrolls to the report.
- Keep `SpeakButton` available on the thank-you line so the child can hear ZED-4's appreciation read aloud.

## Out of scope

No database persistence, no auth, no new routes, no changes to pizza/repair mechanic, no changes to Cases 02+.

## Files

- Edit: `src/routes/api/chat/case-01.ts` (new system prompt + sentinel instructions)
- Edit: `src/routes/play.case-01.tsx` (stage `solved`, sentinel detection, mount report, composer states)
- Edit: `src/components/case01/CaseStepper.tsx` (accept `solved` stage; all steps complete)
- New: `src/components/case01/DiagnosticReport.tsx`
