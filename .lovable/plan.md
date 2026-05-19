# Level 2 — Half Repair Station (Level-1 Parity Rebuild)

Make Level 2 feel identical in structure to Level 1: same intro, same mission-map screen, same phase loop (briefing → investigate → detect/explainWrong → repairPrompt → repair → teach → shapeDone → missionDone), same ZED-4 dialogue + mic + AI evaluation. Only the content and the repair widget differ.

## 1. New file: `src/lib/glitches-level2.tsx`

A `LEVEL2_GLITCHES: Glitch[]` array (reusing the existing `Glitch` type from `src/lib/glitches.tsx`) with 4 items, all framed as Half Repair Station machines using ZED-4's voice from the briefing:

1. **Energy Bar** — horizontal bar split into 2 unequal pieces. `parts: 2`, drag-snap mechanic.
2. **Reactor Core** — circular disc split into 2 unequal wedges. `parts: 2`, drag-snap mechanic.
3. **Software Disk** — disc split into 4 parts where 2 are uneven (still a "halves" lesson — two of the four are oversized). `parts: 4`, range-slider mechanic.
4. **Power Cell** — vertical pill split into 3 stacked sections, middle one oversized. `parts: 3`, range-slider mechanic.

Each entry includes `robotBriefing`, `robotInvestigate`, `robotDetect`, `robotExplainWrong`, `robotExplain`, `robotRepair`, `robotSuccess`, `initialVals`, `target`, `tolerance`, plus a `render(vals, repaired)` SVG (reuse the existing `EnergyBarShape`, `ReactorDiscShape`, `PowerCellShape` from `src/components/mission2/shapes.tsx`, add a `SoftwareDiskShape` next to them).

A second exported tag per glitch — `mechanic: "snap" | "range"` — drives which repair widget renders.

## 2. New file: `src/components/FractionFactoryLevel2.tsx`

A near-clone of `FractionFactoryLevel1.tsx` adapted for Level 2:

- **Intro view** ("System Failure Detected" briefing card): uses the user-supplied ZED-4 intro copy, Read Aloud, mute toggle, voice-command toggle, "Access Mission Map" CTA. Same layout/tokens as Level 1.
- **Mission Select view**: 4 mission cards in the same grid style as Level 1's MissionMap. Card 1 ("Half Repair Station") unlocked; cards 2–4 shown locked with grey lock chips. Same `Return to Hub` link wired to `onExitToHub`.
- **Mission gameplay**: identical `Phase` type and `PhaseControls` flow as Level 1 (`briefing` → `investigate` → `explainWrong` / `detect` → `repairPrompt` → `repair` → `teach` → `shapeDone` → `missionDone`). Iterates through the 4 glitches.
- **ReasoningBox** reused as-is — same `/api/evaluate-reasoning`, `/api/evaluate-wrong-reasoning`, `/api/evaluate-detect-reasoning` endpoints, same mic + typed input + ZED-4 turn log + auto-TTS + "force advance after 2 turns" behavior.
- **TTS / voice commands / mute**: reuse Level 1's `speakText`, `useContinuousSpeech`, and the voice-command list (next, replay, return to map, etc.).
- **Repair widget switch** based on `glitch.mechanic`:
  - `"snap"` → render the existing `DragSlider` from `src/components/mission2/DragSlider.tsx` over the SVG. Correct on snap-to-50%.
  - `"range"` → render Level 1's range-input dividers + "Check Repair" button using `vals` / `target` / `tolerance` exactly like Level 1.

## 3. Edit `src/routes/play.tsx`

Replace the `activeLevel === 2` branch:

```diff
- import Mission2HalfRepairStation from "@/components/Mission2HalfRepairStation";
+ import FractionFactoryLevel2 from "@/components/FractionFactoryLevel2";
...
- if (activeLevel === 2) {
-   return <Mission2HalfRepairStation onExit={() => setActiveLevel(null)} />;
- }
+ if (activeLevel === 2) {
+   return <FractionFactoryLevel2 onExitToHub={() => setActiveLevel(null)} />;
+ }
```

Mission count on the Level 2 card updates from `missions: 4, done: 0` to stay `missions: 4, done: 0` (matches "1 mission, 4 items" interpretation — the 4 cards on the inner map; only 1 currently playable, consistent with Level 1's locked-mission pattern).

## 4. Files to leave alone

- `src/components/FractionFactoryLevel1.tsx` — untouched.
- `src/lib/glitches.tsx` — untouched (only the `Glitch` type is imported).
- `src/components/mission2/DragSlider.tsx`, `shapes.tsx`, `ZedConsole.tsx` — DragSlider + shapes are reused; `ZedConsole` is no longer used by Level 2 (Level 1's right-column dialogue panel is used instead) and `Mission2HalfRepairStation.tsx` becomes orphaned. Both files are deleted to keep the tree clean.
- `src/lib/evaluate-core.ts` and the `/api/evaluate-*` routes — untouched.

## Out of scope

- No new API endpoints, no DB changes, no Mission 3+/Level 3+ work.
- No design-system token changes; everything reuses Level 1's styling.
- No changes to Level 1 gameplay or content.
