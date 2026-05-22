## Goal

Make every right-side panel in Level 2 read its own text aloud, bump font sizes for readability, and unlock all missions in both Level 1 and Level 2.

## 1. Narrate the workspace right side

Use the existing `useNarrate(text, deps)` helper so the spoken text always matches what's on screen and respects the user's mute / auto-speak settings.

Add `useNarrate(...)` calls in:

- `src/components/level2/workspaces/NumeratorScanner.tsx` — narrate the current phase heading + instruction, re-firing when `step` changes:
  - detect: "Phase 1. Scan selected parts. Tap each lit part to register a scan."
  - repair: "Phase 2. Repair numerator. Choose the correct numerator."
- `src/components/level2/workspaces/DenominatorRepair.tsx` — same pattern:
  - detect: "Phase 1. Inspect the whole. Tap every part — lit or dark — to map the whole."
  - repair: "Phase 2. Repair denominator. Choose the correct denominator."
- `src/components/level2/workspaces/UnitFractionSorter.tsx` — narrate once on mount: "Classification chamber. Sort fractions. Move each card into the correct chamber. Tap a card to send it to the other chamber."
- `src/components/level2/workspaces/CollectionVault.tsx` — same step-aware pattern:
  - detect: "Phase 1. Inventory glowing items. Tap each glowing item to inventory it."
  - repair: "Phase 2. Lock in the fraction. Dial the numerator (active) and denominator (total)."

In `src/components/FractionFactoryLevel2.tsx`:

- `BriefingPanel` — already auto-speaks ZED's briefing; also `useNarrate` the on-screen heading + paragraph ("Help ZED-4 read this fraction. Listen to ZED-4. Look at the picture…") so the visible instructions are read.
- `CaseDonePanel` — `useNarrate` the success text: "Case resolved. Glitch repaired. ZED-4 logged your reasoning. The factory's naming systems are coming back online." (swap "Glitch repaired" for "Mission complete!" when `isLast`.)

## 2. Increase font sizes

Bump the readable copy across Level 2 (kept proportional, mobile-safe):

- Workspace headers in all 4 workspaces: `text-xl` → `text-2xl`, eyebrow lines from `label-eyebrow` (small caps) keep size but the helper paragraphs go from `text-sm` → `text-base`.
- `CaseDonePanel` heading `text-2xl` → `text-3xl`, body `text-sm` → `text-base`.
- `BriefingPanel` heading `text-xl` → `text-2xl`, body paragraph to `text-lg`.
- `Intro` body already `text-base sm:text-lg`; bump to `text-lg sm:text-xl`.
- `MissionSelect` card title `text-lg` → `text-xl`, focus line `text-sm` → `text-base`.
- `GlitchCheckPanel` headings / buttons: nudge headings up one step and button labels to `text-lg` for tap clarity.

No design-token changes; just Tailwind class bumps so the theme stays consistent.

## 3. Unlock every mission in Level 1 and Level 2

Currently `useLevelProgress` gates missions behind `id === 1 || prior complete`. Change unlock behavior so all missions are immediately playable while keeping completion tracking intact:

- `src/lib/mission-progress.ts` — change `isMissionUnlocked` to always return `true`. Completion state (`isMissionComplete`, `markComplete`, counts) is unchanged, so the "Done" chip and progress counters keep working.

This automatically unlocks every mission in both Level 1's `MissionSelect` and Level 2's `MissionSelect` (and the level cards on `/play` that rely on unlock state for the level itself remain unaffected — Level 2 is already force-unlocked via `level2Unlocked = true`).

## Files touched

- `src/components/level2/workspaces/NumeratorScanner.tsx`
- `src/components/level2/workspaces/DenominatorRepair.tsx`
- `src/components/level2/workspaces/UnitFractionSorter.tsx`
- `src/components/level2/workspaces/CollectionVault.tsx`
- `src/components/FractionFactoryLevel2.tsx` (BriefingPanel + CaseDonePanel narration, font bumps, Intro/MissionSelect font bumps)
- `src/components/level2/GlitchCheckPanel.tsx` (font bumps only)
- `src/lib/mission-progress.ts` (unlock-all)

## Out of scope

- No changes to `speech.ts`, evaluation logic, or mission content.
- No changes to Level 1 mission flow other than the unlock-all behavior inherited from `mission-progress.ts`.
