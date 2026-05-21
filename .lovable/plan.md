## Goal

Two changes across every Level 2 mission and case:

1. **Auto-play voice + on-screen captions** start the moment a child opens any Level 2 screen (Intro, Sector Map, Mission Briefing, Case Briefing, Detect, Repair, Explain). The spoken text and the visible caption must match.
2. **New "Glitch Check" step** inserted before the Repair Room. For every case in Missions 1–4, the child must first decide *"Is ZED right, or is there a glitch?"* and explain the glitch to ZED. Only after ZED confirms understanding does the case advance into the existing Repair workspace.

## New case flow

```text
briefing → glitch-check (NEW) → repair → explain → caseDone
```

`glitch-check` shows:
- The picture + ZED's reading (e.g. `1/4`) exactly as it appears on the case file.
- Two large buttons: **"ZED is right"** and **"It's a glitch!"**.
- If the child taps *"ZED is right"* on a corrupted case, ZED gently says *"Hmm, look again teacher — count with me…"* and stays on the step.
- When the child taps *"It's a glitch!"*, the existing `ConversationPanel` opens with a seed line like *"Oh no — what did I get wrong, teacher? Tell me about the glitch."* The chat uses the already-shared gentle-pacing rules (1.4 s quiet window, 1200 ms appreciation pause, 900 ms mic resume).
- When `ConversationPanel` reports `isCorrect`, ZED gives its warm appreciation, then we advance to `repair`.

For the (rare) cases where ZED's claim happens to be correct (none today, but kept future-safe), tapping *"ZED is right"* is the accepted answer and the case skips straight to caseDone.

## Voice + captions on every screen

A small shared helper `useNarrate(text)` wraps `speakText` with `{ force: false }` (still respects mute) and is called on mount for:

- `Intro` — speaks the "Naming Systems Are Corrupted" paragraph + "Enter Analysis Lab" hint.
- `MissionSelect` — speaks *"Sector Map. Pick a mission to begin."*
- `MissionPlay` briefing — already auto-speaks via `useAutoSpeak`; keep.
- New `GlitchCheckPanel` — speaks *"Look at ZED's reading. Is ZED right, or is there a glitch?"*
- Workspace `NumeratorScanner` / `DenominatorRepair` / `UnitFractionSorter` / `CollectionVault` — speak the current phase heading on mount and on phase change (e.g. *"Phase 1. Tap each lit part to register a scan."*).
- `ExplainPanel` already auto-speaks ZED lines via `DialogueDock` updates; keep.

Captions: every spoken line is already rendered visibly on-screen as the heading/paragraph that drives the speech, so transcription happens by construction. The `DialogueDock` continues to display ZED's live line with `aria-live="polite"`. For the new `GlitchCheckPanel`, the prompt text shown on screen is the exact string spoken.

## Files to change

**New**
- `src/components/level2/GlitchCheckPanel.tsx` — renders the picture (reuse `FractionVisual`), ZED's claim (reuse `FractionNotation`), two large choice buttons, and on "It's a glitch!" mounts `ConversationPanel` seeded with a glitch-specific line. Calls `onResolved()` when ZED accepts the child's explanation.

**Edited**
- `src/lib/level2/types.ts` — add `"glitch-check"` to `CasePhase`.
- `src/components/FractionFactoryLevel2.tsx`:
  - Initial phase after `briefing` becomes `glitch-check` (not `repair`).
  - Render `<GlitchCheckPanel>` when `phase === "glitch-check"`, then transition to `repair` on resolve.
  - `Intro` and `MissionSelect` call the new `useNarrate` helper on mount.
- `src/components/level2/CaseFile.tsx` — show a small "Status: unconfirmed / glitch confirmed / repaired" chip driven by the new phase (display only, no logic changes elsewhere).
- `src/components/level2/workspaces/*.tsx` (all four) — call `useNarrate` for the current phase heading; keep existing detect→repair behaviour intact.
- Optional: small `src/lib/narrate.ts` exporting `useNarrate(text, deps?)` so the speech rule lives in one place.

**Not changed**
- `src/lib/speech.ts` (continuous mic rules already correct).
- `src/lib/evaluate-core.ts` (gentle-learner prompt already covers the glitch-explanation turn — same `mode: "explain"` is reused).
- Mission/case data in `src/lib/level2/missions.ts` (no data shape change required; `corruptedField` already encodes whether a case has a glitch).

## Acceptance check

For every case in every Level 2 mission:
1. On entering the case, ZED speaks the briefing aloud and the same text appears in the dock.
2. The child sees ZED's reading + picture and must choose "right" or "glitch".
3. If they say "glitch", ZED asks them to explain; chat respects the 1.4 s quiet window, never interrupts, and only advances after a warm 2–3 sentence appreciation.
4. Only then does the Repair Room open. After repair, the existing Explain panel runs unchanged.
5. Intro and Sector Map screens auto-narrate on open with on-screen text matching speech.
