## Goal
Apply the workbook’s activity format to the **Detect** and **Repair** areas across all 18 existing sub-cases. Keep the current page shell, AI guide, stage flow, scoring, diagnostic report, narratives, and local progress unchanged.

## Experience to build

### 1. Shared digital-workbook activity frame
Create a reusable activity-area treatment that gives each task the visual rhythm of a workbook mission:
- Mission/activity heading and short child-friendly instruction
- Large central diagram or equation with generous working space
- Distinct **DETECT** prompt: “Tap the part where ZED-4’s work went wrong”
- Distinct **REPAIR** prompt: a named tool, one-line instruction, and visible goal
- Workbook-style visual cues such as dotted annotation lines, circled glitch states, correction marks, and a repaired stamp/check state
- Spoken instructions through the existing accessibility control
- Clear active, incorrect-tap, selected, repairing, and completed feedback

### 2. Make detection precise and visual
Remove broad click-anywhere shortcuts where they currently exist. Detection will require selecting the actual incorrect part:
- **Case 01:** unfair divider/slice
- **Case 02:** numerator, denominator, or whole fraction
- **Cases 03–04:** incorrect comparison symbol
- **Case 05:** incorrect result denominator
- **Case 06:** incorrect result

A correct selection will visibly circle/mark the glitch and open Repair. An incorrect selection will give a gentle visual nudge without advancing. Existing marks and stage tracking remain intact.

### 3. Turn every repair into a workbook manipulation
Keep each case’s mathematical model, but present the control as direct work on the diagram rather than a detached generic control:
- **Case 01:** drag the divider/equalizer and watch pieces align live
- **Case 02:** edit the fraction with number steppers or physically swap top and bottom values, with the model updating live
- **Case 03:** choose the relation symbol while equivalent areas visually align/reveal
- **Case 04:** choose the comparison symbol while the scale, liquid, or beam model responds
- **Case 05:** correct the denominator directly in the displayed equation while the container/board model retains its whole
- **Case 06:** preserve the existing slicer, grid calibration, and segment tools, but place them in the same workbook repair frame with progress cues and a clear completed correction

### 4. Add case-specific workbook copy
Extend each case definition with concise activity metadata where needed:
- Detect instruction
- Repair tool name and instruction
- Goal/endpoint labels
- Contextual hint
- Success/correction label

This keeps all 18 activities specific to their visual story instead of repeating generic “click the glitch” text.

### 5. Preserve the rest of the product
Do not redesign the surrounding case page. Keep:
- Current case picker and navigation
- Investigate and Explain behavior
- AI chat and voice controls
- Scoring, report recording, and localStorage progress
- Existing mathematical answers and case narratives

## Technical approach
- Add focused shared presentation components for the workbook activity frame, Detect prompt, Repair tool header/status, and completion state.
- Adapt each route to use those shared components while retaining its existing state machine and grading calculations.
- Update existing SVG/task components only where needed for exact hit targets, wrong-selection feedback, live repair state, and keyboard accessibility.
- Use the project’s semantic design tokens and established brand palette; avoid introducing a separate visual theme.
- Verify every activity at desktop and mobile widths, including pointer and keyboard interaction, stage transitions, scoring, and report creation.