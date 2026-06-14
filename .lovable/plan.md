
# Add Context to the EQUALIZER TOOL (Case 01)

The slider in Case 01 currently shows only a tiny `EQUALIZER TOOL` label with `Unfair / Equal` endpoints. The child has no clear instruction telling them *what* the tool does or *how* to use it to repair the glitch. This plan adds a clear, kid-friendly instruction layer to make the repair step obvious — matching the polish level of the other cases for the investor/judge demo.

## Scope

Only Case 01 (`pizza`, `chocolate`, `canvas`) — the EQUALIZER / CENTERING slider tool. No logic changes, no chat changes, no scoring changes. Pure presentation + microcopy.

## Changes

### 1. `src/components/case01/cases.ts`
Add three new optional fields to each `SubCaseDef`:

- `toolTagline` — one short line under the tool title (what the tool does).
  - pizza: `"Drag to slice the pizza into four equal pieces."`
  - chocolate: `"Drag to snap the bar into three matching thirds."`
  - canvas: `"Drag the line until both sides match perfectly."`
- `toolMinLabel` / `toolMaxLabel` — slider endpoint labels overriding the generic `Unfair / Equal`.
  - pizza: `"Lopsided" → "Fair slices"`
  - chocolate: `"Uneven" → "Equal thirds"`
  - canvas: `"Off-center" → "Perfectly half"`
- `toolHint` — a one-line nudge shown while the slider is mid-drag (not yet at target).
  - e.g. `"Almost there — keep equalizing until ZED-4 stops complaining."`

### 2. `src/routes/play.case-01.tsx` — tool panel (lines ~317–346)
Upgrade the slider container into a proper "repair tool" card:

- **Header row**: tool icon (🛠️) + `EQUALIZER TOOL` title + `SpeakButton`.
- **Tagline line**: `c.toolTagline` in muted text directly under the title — answers "what does this do?".
- **Active instruction**: when `stage === "repair"` show a highlighted callout `"⚡ Drag the slider to repair the glitch."` (uses existing `DetectiveCallout` styling for visual consistency).
- **Slider** unchanged structurally; endpoint labels use `c.toolMinLabel` / `c.toolMaxLabel`.
- **Progress feedback**: a small live readout under the slider — `"Equalizing… 62%"` while dragging, swapping to a green `"✓ Balanced!"` chip when `equalized >= 0.97`.
- **Locked state**: when `stage === "explain" || "solved"` the card dims and shows `"Tool locked — explain your reasoning to close the case."` instead of the active instruction.

### 3. Visual polish
- Card background gets a subtle gradient ring (`from-[#dbeafe] to-[#f8fafc]`) to read as a "tool" rather than a plain box, matching the energy of Case 06's BlueprintSlicer / PaintCalibrator.
- Slider thumb scaled up via accent color already in use; no new tokens.

## Out of scope

- Cases 02–06 already have richer interactive repair tools; no changes there.
- No new SFX, no new routes, no schema/AI changes.
- Diagnostic Report unchanged.

## Files touched

- `src/components/case01/cases.ts` (add 4 microcopy fields × 3 sub-cases)
- `src/routes/play.case-01.tsx` (replace the slider block ~317–346)
