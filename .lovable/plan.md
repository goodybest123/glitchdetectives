## Goal
Add a transition step before the Repair mini-game where ZED-4 asks the child for help, with an "Enter the Repair Room" button that reveals the repair UI.

## Change
Insert a new phase `repairPrompt` between the current detect/explainWrong success and `repair` in `src/components/FractionFactoryLevel1.tsx`.

### Flow update
- `detect` → on correct answer → `repairPrompt` (was `repair`)
- `explainWrong` → on auto-concede after 2 turns → `repairPrompt` (was `repair`)
- `repairPrompt` → user clicks "Enter the Repair Room" → `repair`

### `repairPrompt` UI
- **Left panel**: keep the broken shape on display (same as `detect`), no slider yet.
- **Right panel (ZED bubble)**: short plea, e.g. "You spotted the glitch! I can't fix this alone — will you help me repair it?" (auto-TTS).
- **Action**: single yellow CTA button `Enter the Repair Room` with `Wrench` icon (lucide-react) → `setPhase("repair")`.
- Back arrow remains available (only `repair` itself hides it).

### Files
- `src/components/FractionFactoryLevel1.tsx` — add `"repairPrompt"` to `Phase`, add a new ZED line per shape (fallback to a generic string if shape doesn't define one), branch in the render switch, update `onCorrectDetect` and the explainWrong concede handler to set `repairPrompt` instead of `repair`.

No backend, no styling system, no other view changes.
