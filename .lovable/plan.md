## Goal

Turn Case 01 into a small "Fair Sharing" case file with **three sub-cases**. When the page loads (or when the student clicks "Investigate"/the case-file icon), they see a **case picker** with three cards. Picking one runs the existing Investigate → Detect → Repair → Explain → Solved flow for that sub-case. The diagnostic report appears after each sub-case is solved.

Sub-cases:
1. **The Pizza** (Quarters) — existing flow, unchanged conceptually.
2. **The Chocolate Bar** (Thirds) — rectangle split into 3 unequal pieces.
3. **The Painted Canvas** (Halves) — canvas with an off-center vertical line; half is painted blue.

All three are Grade 1, fair-sharing only — same warm tone, no fraction notation in chat copy.

## UX flow

```text
/play/case-01
  ┌───────────────────────────────────────────┐
  │  Case 01 · Fair Sharing                   │
  │  Choose a case to investigate:            │
  │  ┌────────┐  ┌────────┐  ┌────────┐       │
  │  │ Pizza  │  │Chocolate│  │ Canvas │      │
  │  │ ¼ ¼ ¼ ¼│  │  Thirds │  │ Halves │      │
  │  └────────┘  └────────┘  └────────┘       │
  └───────────────────────────────────────────┘
```

- Picker is the default view. Solved cases show a small green check badge on their card.
- Clicking a card mounts the existing case shell (stepper + visual + chat + report) for that sub-case.
- A "← Choose another case" link in the case header returns to the picker. State for each sub-case is kept in memory for the session (so a solved case stays solved on return).
- After a sub-case is solved and the report is shown, a "Try another case" button under the report goes back to the picker.

## Visuals & repair tools (per sub-case)

### 1. Pizza (existing)
- Uses current `PizzaSVG.tsx` and Equalizer slider. No changes.

### 2. Chocolate bar (new `ChocolateSVG.tsx`)
- Horizontal rectangle, brown gradient with subtle grid texture, 3 vertical snap lines.
- Unequal state: divider positions ~12% and ~88% (tiny end slivers, huge middle).
- Equal state: dividers at 33.3% and 66.6%.
- Interpolated by `equalized` 0→1, same as pizza.
- Two small "robot friend" silhouettes flank ZED-4 in the bubble copy ("We each get one!").

### 3. Canvas (new `CanvasSVG.tsx`)
- Wide rectangle (art canvas) with a thin frame.
- Single vertical divider line. Left region painted soft pastel blue (`#bcd8f5`), right region white.
- Unequal: divider at ~15% from left.
- Equal: divider at 50% (the blue half and white half are identical).
- Slider label: **"CENTERING TOOL"** instead of "Equalizer Tool".

All three visuals share the same prop shape: `{ equalized, onGlitchClick, interactive, pulseKey }`.

## Stepper & copy (per sub-case)

The 4-step stepper stays the same. Only the prompts under the visual and ZED-4's bubble change:

| Case | Investigate bubble | Detect bubble | Solved bubble | Caption (investigate) |
|---|---|---|---|---|
| Pizza | "Look! I served exactly four pieces of pizza!" | "Glitch Detected! The pieces don't look fair." | "Logic repaired. The case is yours to close." | "Click the pizza where the sharing is not fair." |
| Chocolate | "I broke it into thirds! We each get one piece!" | "Glitch Detected! Those shares are not fair." | "Logic repaired. Thanks, Detective." | "Click the chocolate bar where it's split unfairly." |
| Canvas | "I just painted exactly half of the canvas!" | "Glitch Detected! The sides do not match." | "Logic repaired. The canvas is balanced." | "Click the line that's splitting the canvas unfairly." |

Step labels in the stepper stay "Investigate / Detect / Repair / Explain".

## AI prompts (per sub-case)

One server route per sub-case keeps the system prompt focused and the `[[CASE_SOLVED]]` detection cleanly scoped.

- `src/routes/api/chat/case-01.ts` — existing pizza prompt, unchanged.
- `src/routes/api/chat/case-01-chocolate.ts` — new. Same shape as pizza prompt but framed around "thirds = three equal pieces"; opening assistant message: *"Great detective work! ZED-4 wanted to give his friends those tiny pieces. Why was it wrong to call them thirds?"*
- `src/routes/api/chat/case-01-canvas.ts` — new. Framed around "half = two matching sides"; opening assistant message: *"Case almost closed! ZED-4 thought any line cuts the canvas in half. What does 'half' really mean?"*

All three prompts keep:
- Grade 1 voice (≤10 word sentences, no fraction notation, no emojis).
- `[[CASE_SOLVED]]` sentinel + warm "thanks for teaching me" close.
- The "must say it in their own words" rule before solving.

## Marks

Same rubric as today — `investigate / detect / repair / explain` each /5, total /20. Computed per sub-case (each sub-case has its own session state). The diagnostic report renders unchanged, but its header chip reads the active case title (e.g. "Case 01 · The Chocolate Bar").

## Files

**New**
- `src/components/case01/CasePicker.tsx` — renders the 3 cards (icon, title, subtitle, solved checkmark) and emits the picked case id.
- `src/components/case01/ChocolateSVG.tsx` — rectangle visual.
- `src/components/case01/CanvasSVG.tsx` — canvas visual.
- `src/components/case01/cases.ts` — small registry mapping `caseId → { title, subtitle, chatEndpoint, welcome, bubbles, caption, Visual, sliderLabel }`. Keeps `play.case-01.tsx` mostly visual-agnostic.
- `src/routes/api/chat/case-01-chocolate.ts`
- `src/routes/api/chat/case-01-canvas.ts`

**Edit**
- `src/routes/play.case-01.tsx`
  - Add `activeCase: "pizza" | "chocolate" | "canvas" | null` state. `null` → render `<CasePicker />`.
  - Per-case session state stored in a `Record<caseId, SubCaseState>` so progress survives going back to the picker. `SubCaseState = { stage, equalized, messages, marks, solved }`.
  - Pick the registry entry by `activeCase`, render its `Visual` + chat endpoint + bubbles + slider label.
  - "← Choose another case" link in the case header.
  - After solved + report, "Try another case" button → returns to picker.
- `src/components/case01/DiagnosticReport.tsx` — accept optional `caseTitle` prop for the header chip (defaults to current "Case 01 · Fair Sharing").
- `.lovable/plan.md` — update to reflect new structure.

**Unchanged**
- `CaseStepper.tsx`, `ZedBubble.tsx`, `SpeakButton.tsx`, `MicButton.tsx`, `PizzaSVG.tsx`, existing pizza chat route.

## Out of scope

- No DB persistence between sessions (picker resets on full reload).
- No new audio/voice changes.
- No Case 02+ work — this is all still inside Case 01.
- No changes to the marks rubric or scoring formulas.
