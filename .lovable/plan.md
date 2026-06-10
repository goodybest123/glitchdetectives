## Goal
Make every on-screen text voice-first across all 6 cases by attaching `SpeakButton` to verdict buttons, captions, and any remaining un-spoken text.

## Cross-device note
`SpeakButton` already uses `window.speechSynthesis` (Web Speech API), supported on iOS Safari, Android Chrome, desktop Chrome/Edge/Safari/Firefox. The button auto-hides when unsupported. No new dependency required — works on all devices that ship a system TTS voice.

## Changes

### 1. `src/components/shared/VerdictButtons.tsx`
- Already speaks the prompt. Add a small `SpeakButton` next to each of the two verdict buttons:
  - "There is a glitch" → speaks "There is a glitch"
  - "No glitch" → speaks "No glitch"
- Place the speaker as a sibling pill to the right of each button (not inside, to avoid nested button a11y issues).
- Also wrap the "Look again, Detective…" hint with a SpeakButton.

### 2. `src/components/shared/CaptionLine.tsx`
- Already has a SpeakButton. No change (this covers the new "Click on the glitch." caption automatically across all 6 cases).

### 3. Audit remaining on-screen text and add `SpeakButton` where missing

Per the case-01 route (representative of all six), add speakers to:
- **CaseStepper** stage labels (`src/components/case01/CaseStepper.tsx`) — add one speaker that reads the current stage name.
- **DetectiveCallout** (`src/components/shared/DetectiveCallout.tsx`) — verify/ensure speaker exists for its text.
- **ZedBubble** — verify `speakable` prop is set (already done in case-01 route).
- **Slider label** (`c.sliderLabel`) and the "Unfair / Equal" endpoints — add a speaker next to the slider label.
- **Chat panel header subtitle** ("Unlocks after you repair…", "Explain your reasoning…", "Case closed…") — add a small speaker.
- **Chat user messages** — add a speaker next to user bubbles too (assistant already has one).
- **"AI is thinking…"** — no speaker needed (transient).
- **Submit / View Diagnostic Report buttons** — add speaker next to the button label.
- **PageShell header title and "← Back" link** — add small speakers.
- **DiagnosticReport** — verify each text block (case title, marks, quotes, next-case label) has a speaker; add where missing.
- **CasePicker** — add speakers next to each sub-case card title/description.

### 4. Apply identical treatment to cases 02–06
The same five route files (`play.case-02.tsx` … `play.case-06.tsx`) plus their per-case components (case0X/CasePicker, case0X-specific repair controls like NumberStepper, SwapControl, ComparatorToggle, DenominatorStepper, RepairToolButton, EquationDisplay) — add SpeakButton to any visible label / instruction text that does not yet have one.

### 5. Repair-tool button labels
Wrap visible labels of `NumberStepper`, `SwapControl`, `ComparatorToggle`, `DenominatorStepper`, `RepairToolButton`, `EquationDisplay` with a sibling SpeakButton (one per label, not per number tick).

## Out of scope
- No new TTS provider (keep Web Speech API; no ElevenLabs).
- No changes to game logic, scoring, or flow.
- SVG visuals' internal numeric labels are not individually speakable (the caption + ZED bubble cover them).

## Files touched
- `src/components/shared/VerdictButtons.tsx`
- `src/components/shared/DetectiveCallout.tsx` (verify)
- `src/components/case01/CaseStepper.tsx`, `CasePicker.tsx`, `DiagnosticReport.tsx`
- `src/components/case02/CasePicker.tsx`, `NumberStepper.tsx`, `SwapControl.tsx`
- `src/components/case03/CasePicker.tsx`, `ComparatorToggle.tsx`
- `src/components/case04/CasePicker.tsx`
- `src/components/case05/CasePicker.tsx`, `DenominatorStepper.tsx`, `EquationDisplay.tsx`
- `src/components/case06/CasePicker.tsx`, `RepairToolButton.tsx`, `EquationDisplay.tsx`
- `src/routes/play.case-01.tsx` … `play.case-06.tsx` (slider label, chat header subtitle, user bubbles, submit/report buttons, page header)
