# Case 04: The Scale Weigh-In (Comparing Fractions)

Mirrors Case 03's architecture exactly. Three sub-cases targeting the "Bigger Denominator = Bigger Fraction" trap, all using the same Investigate → Detect → Repair → Explain loop with the `[ < ] [ = ] [ > ]` comparator.

## Sub-cases

| ID | Title | Left | Right | Wrong op | Correct |
|---|---|---|---|---|---|
| `cargo` | Cargo Blocks | 1/8 | 1/4 | `>` | `<` |
| `coolant` | Liquid Coolant | 2/3 | 2/5 | `<` | `>` |
| `beams` | Metal Beams | 3/4 | 3/8 | `<` | `>` |

Unlike Case 03 (all answers `=`), Case 04 answers are strictly `<` or `>`. The runner must support a configurable `correctOperator` per sub-case instead of hardcoding `=`.

## Files to create

**Registry & visuals** (`src/components/case04/`)
- `cases.ts` — per-sub-case metadata: `id`, `title`, `subtitle`, `emoji`, `Visual`, `leftFraction`, `rightFraction`, `wrongOperator`, `correctOperator`, `chatEndpoint`, `bubbles`, `captions`, `welcomeText`, `conceptMastered`, `successBanner`.
- `BalanceScaleSVG.tsx` — fulcrum + two pans with blocks sized proportionally; `tilt` prop (`"left" | "right" | "balanced"`) drives a smooth rotation transform on the beam. Glitch state = tilted toward smaller fraction; solved state = animates to correct tilt.
- `CoolantTubesSVG.tsx` — two identical vertical tubes with fluid fills at proportional heights; on solve, fluid pulses (subtle opacity/scale loop for ~1.5s).
- `MetalBeamsSVG.tsx` — two horizontal bars with proportional widths; on solve, a faint grid background fades in behind to emphasize length difference.
- All three SVGs follow Case 03's `VisualProps` contract: `{ solved: boolean; pulseKey?: number; middleSlot?: ReactNode }`. The `middleSlot` renders the comparator + fraction display between/under the visual.
- `CasePicker.tsx` — three cards with emoji, title, subtitle, solved checkmark. Same look as Case 03's picker.
- `FractionDisplayLine.tsx` — small helper that renders `A/B  [op]  C/D` with the comparator slot in the middle, used inside `middleSlot`.

**Reused from Case 03** (imported, not duplicated)
- `ComparatorSymbol.tsx` and `ComparatorToggle.tsx` — already generic; reuse via `@/components/case03/...`.

**AI routes** (`src/routes/api/chat/`)
- `case-04-cargo.ts` — Grade 1 voice, kid words only ("smaller pieces", "bigger bottom number = smaller slice"). Emits `[[CASE_SOLVED]]` once child explains "8 means cut into 8 little pieces, so each one is tiny."
- `case-04-coolant.ts` — guides child to articulate "thirds are bigger chunks than fifths, so 2 thirds is more liquid."
- `case-04-beams.ts` — guides child to articulate "the bigger the bottom number, the smaller each piece."
- All three use `google/gemini-3-flash-preview` via `createLovableAiGatewayProvider`, same shape as Case 03 routes.

**Page route**
- `src/routes/play.case-04.tsx` — copy of `play.case-03.tsx` adapted to:
  - Compare `operator === c.correctOperator` (not hardcoded `=`) to trigger reveal.
  - Pass `solved` (boolean) + `pulseKey` to visuals instead of `dividersVisible` / `spinKey`.
  - Same stage machine, same marks rubric, same DiagnosticReport flow, same chat panel.

## Files to edit
- `src/routes/play.index.tsx` — promote Case 04 from Pending → Active, route `/play/case-04`.

## Out of scope
- No persistence between sessions.
- No changes to Cases 01–03.
- No new audio assets; reuse existing `SpeakButton` / `MicButton`.
- No leaderboard or timers.

## Technical notes
- Balance scale tilt: rotate the beam group around the fulcrum center using CSS `transition: transform 800ms ease-out`. Pan positions follow via translateY tied to the same tilt state.
- Coolant pulse and beam-grid fade are pure CSS keyframes keyed off `pulseKey` (re-mount trick) like Case 03's spin.
- Block/tube/beam sizes are derived from the fraction values so the visual truth always matches the math (1/4 block visibly 2× the 1/8 block area, etc.).
