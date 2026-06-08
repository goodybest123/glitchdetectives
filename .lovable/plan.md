# Case 06: The Mismatched Puzzle (Adding/Subtracting Unlike Denominators)

Final case of the Fraction Factory MVP. Targets the "add straight across" trap with unlike denominators. Three sub-cases share the Investigate → Detect → Repair → Explain loop, with a one-click "slice/calibrate/segment" tool that converts one fraction to a common denominator.

## Sub-cases

| ID | Title | Wrong equation | Repaired equation | Tool label |
|---|---|---|---|---|
| `blueprint` | The Blueprint | 1/2 + 1/4 = 2/6 | 2/4 + 1/4 = 3/4 | Laser Slicer |
| `paint` | The Paint Vats | 1/3 + 1/6 = 2/9 | 2/6 + 1/6 = 3/6 | Grid Calibrator |
| `circuit` | The Circuit Board | 1/2 − 1/8 = 0/6 | 4/8 − 1/8 = 3/8 | Segmenter Tool |

In all three, ZED only broke the left fraction (the one with the smaller denominator). The repair converts it to match the right fraction's denominator; then the equation re-renders with like denominators and the output container morphs into the correct whole.

## Files to create

**Registry & visuals** (`src/components/case06/`)
- `cases.ts` — per sub-case: `id`, `title`, `shortTitle`, `subtitle`, `emoji`, `chatEndpoint`, `left` (original fraction), `right`, `operator` (`"+" | "−"`), `wrongResult` ({n,d} — the impossible answer), `repairedLeft` (the converted left fraction), `repairedResult`, `toolLabel`, `welcomeText`, `bubbles` (investigate/detect/solved), `captions` (per stage), `conceptMastered`, `successBanner`, `Visual`.
- `BlueprintSVG.tsx` — large 1/2 block + small 1/4 block on a factory mat + output box. Props `{ sliced: boolean; pulseKey? }`. `sliced=false`: one big block + small block, mismatched output container (6 tiny slots, 2 filled, big block visibly too big to fit). `sliced=true`: big block split into two 1/4 blocks via CSS transition, output container becomes a 4-slot box with 3 slots filled.
- `PaintVatsSVG.tsx` — two vats. `calibrated=false`: vat A has 3 thick sections (1 filled), vat B has 6 thin sections (1 filled), output vat shows 9 slots with 2 microscopic puddles. `calibrated=true`: horizontal line drops across vat A turning it into 6 sections (2 filled), output vat shows 6 sections with 3 filled (half full).
- `CircuitBoardSVG.tsx` — circuit board with green power cell. `segmented=false`: solid 1/2 power cell, tiny 1/8 chip floating, output board fully empty (vanished). `segmented=true`: grid drops over the 1/2 cell dividing it into four 1/8 segments, one segment pops out, 3/8 remain glowing.
- All three share `VisualProps = { repaired: boolean; pulseKey?: number }` (the prop is named `repaired` internally; each visual reads it).
- `EquationDisplay.tsx` — renders `A/B [op] C/D = N/D2`. Props: `left`, `right`, `operator`, `result`, `resultState` (`"idle" | "glitch" | "solved"`), `clickable`, `onResultClick`. The whole right-hand `N/D2` is the clickable glitch zone (matches the spec: "click the 2/6"). Highlights yellow on glitch, green on solved.
- `RepairToolButton.tsx` — single button with `toolLabel`, `onClick`, `disabled`. Styled to match Case 05's stepper visual weight.
- `CasePicker.tsx` — three sub-case cards, same shape as Case 04/05's picker.

**AI routes** (`src/routes/api/chat/`)
- `case-06-blueprint.ts` — guide child to articulate "pieces must be the same size before adding."
- `case-06-paint.ts` — guide child to articulate "the vats need the same grid/measurement before mixing."
- `case-06-circuit.ts` — guide child to articulate "subtraction also needs same-size pieces."
- All three: Grade 1 voice, kid words only, `[[CASE_SOLVED]]` token, same shape as Case 05 routes.

**Page route**
- `src/routes/play.case-06.tsx` — adapted from `play.case-05.tsx`:
  - Stage machine `investigate → detect → repair → explain`.
  - `detect` triggered by clicking the wrong result fraction (`EquationDisplay`'s glitch zone).
  - `repair` shows `RepairToolButton`; clicking it sets `repaired=true`, swaps the equation to the repaired form, plays the visual transition, shows the green banner, advances to `explain`.
  - Same chat panel, DiagnosticReport, marks rubric, and CasePicker pattern as Case 05.
  - Header title: "Case 06: The Mismatched Puzzle".

## Files to edit
- `src/routes/play.index.tsx` — promote Case 06 from Pending → Active, route `/play/case-06`. Remove from `PENDING_CASES`, add to `ACTIVE_CASES` with subtitle "When pieces don't match, slice before you add."

## Out of scope
- No reducing to lowest terms (3/6 stays 3/6; mention "half" in chat but don't auto-simplify).
- No free-form denominator entry — the repair is a single one-click tool, not a stepper.
- No persistence across sessions.
- No changes to Cases 01–05.
- No new audio assets; reuse existing chat panel components.

## Technical notes
- The right-hand fraction (1/4, 1/6, 1/8) is already the target denominator in all three sub-cases, so the repair just maps left → repairedLeft. No common-denominator computation needed.
- Output container morph is a CSS transition keyed off `repaired`, plus a `pulseKey` remount for the success pulse (same pattern as Cases 04/05).
- Equation re-renders atomically when `repaired` flips; no intermediate "editing" state needed.
- ZED-4 bubbles and captions follow the exact wording from the spec for each sub-case.
