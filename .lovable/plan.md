# Interactive Workbook Redesign

## Goal
Transform every existing challenge across Cases 01–06 from a split game-screen layout into a continuous, child-friendly workbook page while preserving the current fraction content and repair interactions.

## Experience
Each sub-case becomes one scrollable case file:

```text
CASE FILE #001
Investigate ZED-4’s Work
[large existing activity illustration]
ZED-4 says: “…”

What do you notice?
[detective notes]

Find the Glitch
[annotation and evidence tools]

Repair ZED-4’s Work
[existing slider, stepper, drag/drop, or builder]

Model the Correct Answer
[corrected visual/equation]

Teach ZED-4
[sentence builder, typing, or speech-to-text]

Case Summary
[evidence, explanation, marks, journal action]
```

## Build Plan

### 1. Create the shared workbook system
- Add one reusable workbook page shell used by every case.
- Replace the current card-and-sidebar composition with a paper-like, full-width vertical document.
- Add case-file headers, section dividers, stage status, workbook margins, handwritten-note styling, and responsive mobile/desktop layouts.
- Keep navigation, sound controls, progress, and accessibility support.

### 2. Add detective tools
- Add a notes area for observations before making a verdict.
- Add simple annotation modes: circle, shade/highlight, and cross-out.
- Keep annotations scoped to the current sub-case and provide undo/clear controls.
- Add an evidence tray where the child can save observations made during investigation and repair.

### 3. Reframe existing mechanics as repairs
- Preserve every current visual and interaction in Cases 01–06.
- Present sliders, steppers, swaps, toggles, builders, and drag interactions as tools for repairing ZED-4’s incorrect work.
- Reveal sections progressively as the child investigates, identifies the glitch, repairs it, and explains the correction.
- Show the repaired model directly in the workbook flow rather than switching to a separate game state.

### 4. Build the “Teach ZED-4” section
- Add age-appropriate sentence starters based on each case’s fraction concept.
- Allow free typing and browser speech-to-text using the existing microphone capability.
- Keep transcripts editable before submission.
- Retain the current AI explanation feedback and solved-case grading behavior.

### 5. Add the Detective Journal
- Store completed case summaries locally using the existing progress/report storage pattern.
- Record the case title, repaired concept, saved evidence, child explanation, annotations summary, marks, and completion date.
- Update the report area into a journal-style collection of completed case files.
- Keep printable output available for adults and classroom use.

### 6. Migrate all current cases
- Apply the shared workbook structure to every sub-case in Cases 01–06.
- Use each case’s existing copy, visual, repair controls, success logic, and AI endpoint.
- Standardize section labels and interaction states without changing the underlying mathematics.

### 7. Validate the full flow
- Verify investigate → find glitch → repair → model → teach → journal completion in each case.
- Check speech-to-text fallback behavior when browser recognition is unavailable.
- Check saved journal entries and printable summaries.
- Test desktop and mobile layouts, keyboard use, readable contrast, and annotation controls.

## Technical Approach
- Extract shared workbook components and hooks rather than duplicating the new layout six times.
- Keep case-specific visuals and repair logic inside their current case modules.
- Extend the existing local progress/report records for notes, evidence, transcript, and journal data.
- No new backend or account requirement; workbook progress remains browser-local as it does now.