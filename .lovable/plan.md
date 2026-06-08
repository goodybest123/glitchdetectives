# Case 03: The Shape Shifters

Three sub-cases teaching equivalent fractions through visual equivalence (no multiplication tables). Same Investigate → Detect → Repair → Explain loop as Cases 01/02, with a shared `[ < ] [ = ] [ > ]` comparator toggle.

## Sub-cases

1. **Fuel Tanks** — `1/2 ? 2/4`, ZED-4 picks `>`. Two vertical tanks, identical blue fill height.
2. **Garden Beds** — `1/3 ? 2/6`, ZED-4 picks `<`. Two horizontal beds, identical green area.
3. **Memory Disks** — `3/4 ? 6/8`, ZED-4 picks `<`. Two pie-style disks, identical purple sweep.

All three share one mental model: same shaded amount, different slice counts. Target answer is always `=`.

## New files

- `src/components/case03/cases.ts` — registry: `id`, `title`, `subtitle`, `emoji`, `Visual`, `leftFraction`, `rightFraction`, `wrongOperator` (`>` or `<`), `chatEndpoint`, `bubbles`, `captions`, `welcomeText`, `conceptMastered`, `successBanner`.
- `src/components/case03/FuelTanksSVG.tsx` — two vertical tanks; props: `dividersVisible` (animated fade for Repair success).
- `src/components/case03/GardenBedsSVG.tsx` — two horizontal beds, same fade behavior.
- `src/components/case03/MemoryDisksSVG.tsx` — two circular disks with slice lines; same fade behavior; gentle 360° rotation on solve.
- `src/components/case03/ComparatorToggle.tsx` — three soft buttons `[ < ] [ = ] [ > ]`, disabled state when solved.
- `src/components/case03/ComparatorSymbol.tsx` — large center symbol; clickable in Detect; highlights pastel yellow.
- `src/components/case03/CasePicker.tsx` — sub-case grid mirroring Case 02.
- `src/routes/api/chat/case-03-tanks.ts`
- `src/routes/api/chat/case-03-garden.ts`
- `src/routes/api/chat/case-03-disks.ts`

Each AI route: warm Grade-1 voice, kid words only ("same amount", "smaller pieces", "more cuts"), forbid words like "denominator/numerator/multiply", emit `[[CASE_SOLVED]]` once the child shows they understand "more pieces just means smaller pieces, not more stuff".

## Edited files

- `src/routes/play.case-03.tsx` — new page: `CasePicker` → `SubCaseRunner` keyed by sub-case id. Stages: `investigate | detect | repair | explain | solved`. State: `operator` (`<`|`=`|`>`), `dividersVisible`, `pulseKey`, per-case marks, chat. Marks rubric per sub-case (/20): investigate 5 (on entering Detect), detect 5 (clicking the wrong symbol), repair 5 (selecting `=` on first try → 5; second → 3; third+ → 1), explain 5 (heuristic reused from Case 01/02 on `[[CASE_SOLVED]]`).
- `src/routes/play.index.tsx` — promote Case 03 from PENDING to ACTIVE, route `/play/case-03`.
- Reuse `case01/CaseStepper.tsx`, `ZedBubble.tsx`, `SpeakButton.tsx`, `MicButton.tsx`, and Case 01's `DiagnosticReport.tsx` (already parametrized).

## Interaction details

- **Investigate**: large wrong operator visible between visuals, ZED-4 bubble shows the wrong claim. Clicking the operator advances to Detect.
- **Detect**: operator pulses pastel yellow; bubble updates to "Glitch Detected!"; `ComparatorToggle` slides in below.
- **Repair**: selecting `=` updates the symbol, fades internal divider lines for ~2s (Memory Disks also rotates 360°), shows green success banner with `successBanner` text, unlocks chat.
- **Explain**: chat panel enables, auto-posts the case's `welcomeText` as first ZED-4 message. On `[[CASE_SOLVED]]`, mark sub-case solved and show diagnostic report with "Try another case" → returns to picker.

## Out of scope

No persistence between sessions, no changes to Case 01/02, no new audio assets, no leaderboard.
