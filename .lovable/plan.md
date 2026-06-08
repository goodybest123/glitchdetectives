# Case 05: Combining Matches (Adding/Subtracting Like Denominators)

Three sub-cases targeting the "add the bottoms too" trap. All share the Investigate → Detect → Repair → Explain loop, with a `[ - ] [ + ]` stepper on the wrong denominator instead of Case 03/04's comparator.

## Sub-cases

| ID | Title | Equation shown | Wrong denom | Correct denom | Operation |
|---|---|---|---|---|---|
| `conveyor` | Conveyor Belt | 1/5 + 2/5 = 3/? | 10 | 5 | add |
| `coolant` | Coolant Drain | 5/8 − 2/8 = 3/? | 0 | 8 | subtract |
| `assembly` | Assembly Line | 2/6 + 3/6 = 5/? | 12 | 6 | add |

All three have correct numerator already (ZED only broke the denominator). The mechanic is identical: click the wrong denominator → stepper appears → step to the correct value → visual snaps back to the right whole.

## Files to create

**Registry & visuals** (`src/components/case05/`)
- `cases.ts` — per sub-case: `id`, `title`, `subtitle`, `emoji`, `Visual`, `leftFraction`, `rightFraction`, `operator` (`"+" | "−"`), `correctNumerator`, `wrongDenominator`, `correctDenominator`, `stepperMin`, `stepperMax`, `chatEndpoint`, `bubbles`, `captions`, `welcomeText`, `conceptMastered`, `successBanner`.
- `ConveyorBeltSVG.tsx` — two 5-slot crates + output crate. `solved` prop swaps output between a stretched 10-slot crate with 3 tiny blocks and a normal 5-slot crate with 3 full-size blocks. CSS transition on width/slot count.
- `CoolantDrainSVG.tsx` — 8-section tank. `solved=false`: tank outline missing, 3 floating fluid puddles. `solved=true`: tank outline fades in, 3 sections fill cleanly.
- `AssemblyLineSVG.tsx` — hexagonal motherboard. `solved=false`: 12-sided mutant outline with 5 misaligned chips. `solved=true`: morphs to 6-sided board, chips snap into 5 of 6 slots.
- All three share the contract: `{ solved: boolean; pulseKey?: number }`.
- `EquationDisplay.tsx` — renders `A/B [op] C/D = N/?` where `?` is the clickable/highlighted denominator slot. Props: `leftFrac`, `rightFrac`, `operator`, `resultNumerator`, `denominatorValue`, `denominatorState` (`"idle" | "glitch" | "editing" | "solved"`), `onDenominatorClick`.
- `DenominatorStepper.tsx` — `[ - ] [ + ]` control with current value displayed. Props: `value`, `min`, `max`, `onChange`. Disables `+`/`-` at bounds.
- `CasePicker.tsx` — three sub-case cards, same shape as Case 04's picker.

**AI routes** (`src/routes/api/chat/`)
- `case-05-conveyor.ts` — guide child to articulate "the bottom number is the size of the whole; it doesn't change when we add pieces."
- `case-05-coolant.ts` — guide child to articulate "the tank still has 8 sections even after we drain some; the bottom number is the container."
- `case-05-assembly.ts` — guide child to articulate "the board is still 6-sided; only the filled chips change."
- All three: Grade 1 voice, kid words only, `[[CASE_SOLVED]]` token, same shape as Case 04 routes.

**Page route**
- `src/routes/play.case-05.tsx` — adapted from `play.case-04.tsx`:
  - Stage machine `investigate → detect → repair → explain`.
  - `detect` triggered by clicking the highlighted denominator.
  - `repair` shows `DenominatorStepper`; reaching `correctDenominator` → `solved=true`, success banner, advance to `explain`.
  - Same chat panel, DiagnosticReport, marks rubric, and CasePicker pattern as Case 04.

## Files to edit
- `src/routes/play.index.tsx` — promote Case 05 from Pending → Active, route `/play/case-05`. Replace the `05` pending entry; keep `06` pending.

## Out of scope
- No mixed-denominator addition (that's Case 06).
- No persistence across sessions.
- No changes to Cases 01–04.
- No new audio assets; reuse existing chat panel components.

## Technical notes
- Denominator slot rendered as a `<button>` while `stage === "investigate"`; becomes a non-interactive highlighted box during `detect`/`repair`.
- Stepper bounds: conveyor 5–10, coolant 0–8, assembly 6–12 — so the child can step in the correct direction to reach the answer.
- Crate/tank/board "morph" is a CSS width/scale transition keyed off `solved`; reuse the `pulseKey` remount trick from Case 04 for the success pulse.
- Numerator stays fixed and visually correct throughout — only the denominator is wrong.
