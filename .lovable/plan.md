# Fix Chocolate Squares picture mismatch + clearer repair guidance

## The two problems (confirmed in code)

1. **Chocolate Squares shows the wrong picture while investigating.** The case says ZED-4 wrote 2/6, but `model.selectedParts` is set to `3`, so during INVESTIGATE and DETECT the chocolate bar shows 3 highlighted squares next to a 2/6 fraction — the picture contradicts the story before the child is told the picture is the glitch. Per the script, ZED-4's wrong 3-square picture should only appear as the starting point of REPAIR.
2. **The repair stage doesn't tell the child what to do.** The workspace shows the instruction and a live counter ("6 equal parts in the whole · 2 chosen"), but nothing says "tap a square to choose it" or names what the numerator and denominator are doing while they build.

## What changes for the child

**Case 02.02 — Chocolate Squares**
- During INVESTIGATE and DETECT, the bar now honestly shows 2 highlighted squares out of 6, matching the 2/6 fraction in the story.
- When REPAIR opens, the bar shows ZED-4's wrong picture (3 highlighted), and the child fixes it to 2 — the mismatch becomes the thing they repair, exactly as the script describes.

**Repair guidance (all four Level 2 cases)**
- A short "how to fix it" line appears inside the repair workspace, read-aloud enabled, e.g. for the bar: "Tap a square to choose it or put it back. The bottom number (denominator) counts all 6 equal squares — that stays. The top number (numerator) counts the ones you chose — make it 2."
- A small pointer hint under the counter: "You can tap the pieces above — watch this counter change: 6 equal parts in the whole · 2 chosen."
- Each Level 2 case gets its own wording for this line so the numbers named match the case (3/4 tray, 2/6 bar, 4/5 wall, 3/5 strip).

## Technical notes

- `src/components/level02/cases.ts` (squares): `selectedParts: 3` → `2`; add `repair.startSelected: 3` so only the repair starts from ZED-4's wrong picture; rewrite `repair.text` / `model.repair.instruction` for the new flow.
- `src/components/investigation/types.ts`: add optional `howTo?: string` to `PartsModelConfig.repair`.
- `src/components/investigation/InvestigationCase.tsx` repair stage: render `repair.howTo` (with SpeakButton) under the instruction; add the "tap the pieces — watch the counter" hint near the live counter. Both are optional/generic so Level 1 and Levels 3–6 are untouched.
- Add `howTo` text to all four Level 2 case definitions.
- Verify with a Playwright run of Case 02.02: investigate shows 2/6 with 2 highlighted, repair starts with 3 highlighted, guidance line is visible, and fixing to 2 highlighted completes the repair.
