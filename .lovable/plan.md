# Level 5 — Fraction Power Grid

A new 6-mission level inside Fraction Factory, built using the same Investigation Workspace pattern as Levels 2–4 (persistent Case File on the left, mission-specific repair Workspace on the right, dialogue dock at the bottom, top bar with replay/voice). Visual theme: futuristic engineering city — glowing rails, holographic panels, calm dark-blue/cyan/violet palette (distinct from L4's amber).

## Missions

1. **Power Grid Synchronizer** — Adding unlike fractions. Glitch: `1/2 + 1/4 = 2/6`.
2. **Resource Balance Core** — Subtracting unlike fractions. Glitch: `3/4 - 1/2 = 2/2`.
3. **Scaling Reactor** — Multiplying fractions (part of a part). Glitch: `1/2 × 1/3 = 2/5`.
4. **Energy Booster Network** — Fraction × whole number. Glitch: `3 × 1/4 = 3/12`.
5. **Distribution Tunnel** — Dividing unit fractions / whole ÷ unit fraction. Glitch: `1/2 ÷ 2 = 1`.
6. **Central Command Grid** — Fractions as division. Glitch: ZED claims `3/4` and `3 ÷ 4` are unrelated.

Each mission ships 3 cases (18 total) so it matches the existing case-by-case progress + reasoning flow used by L2–L4.

After all 6 missions are complete, a **Fraction Power Grid Emergency** boss screen chains one case from each mission into a single city-wide rescue, then awards the **Fraction Systems Engineer Badge**.

## Per-mission learning loop

Reuse the existing Investigate → Detect → Repair → Explain loop from Level 4:

- **Case File (left)**: original glitch, ZED's reasoning, broken visualization, fraction model, objectives, system status. Persistent — never unmounts.
- **Workspace (right)**: mission-specific repair interactions (see below).
- **Glitch Check panel**: choose "ZED is right" / "Glitch detected", then enter Repair.
- **Explain Panel**: free-text + voice, graded by the existing reasoning evaluator with conceptual prompts ("Why must units match?", "What does 'of' mean?", etc.).
- **Dialogue Dock**: ZED-4 narration with calm captions; "Read instructions again" replay button.

## New mission-specific repair workspaces

Six new components under `src/components/level5/workspaces/`:

1. `SynchronizerRail` — drag two energy cells onto a rail; expand each cell's partition grid (×2, ×3, …) until denominators match, then merge into a combined cell. Confirms repaired sum.
2. `ResourceBalanceCore` — two fraction tanks; user matches denominators via partition controls, then removes the smaller quantity to reveal the stabilized output.
3. `ScalingReactorGrid` — overlay two fraction strips at 90° to form an a/b × c/d grid; user shades the overlap region; reactor restarts when shaded cells = numerator and total cells = denominator.
4. `BoosterTrainLine` — duplicate a unit fraction cell N times along a train track; total fills a power gauge showing N × 1/d = N/d.
5. `DistributionTunnel` — take a unit-fraction packet and split it into k equal sub-packets; visualization shows 1/d ÷ k = 1/(d·k); also supports whole ÷ unit fraction (how many 1/d fit in W).
6. `CommandGridLinker` — drag-connect a fraction node (a/b) to its matching division node (a ÷ b) and to a shared visual (bar split into b parts, a shaded). All connections lit = command tower powers up.

All workspaces use the shared `FractionBar` / `OperationStrip` visuals from L4 where appropriate, plus a new `EnergyCell` and `GridOverlay` primitive under `src/components/level5/visuals/`.

## Files to add

```
src/lib/level5/
  types.ts                 -- L5MissionDef, L5CaseDef, L5Phase, per-mission `spec`
  missions.ts              -- 6 missions × 3 cases (18 cases) with zedClaim / truth / explainPrompt / l5.spec
src/components/level5/
  CaseFile.tsx             -- L5 themed case file (cyan/violet)
  GlitchCheckPanel.tsx     -- thin wrapper around the L4 panel shape
  visuals/
    EnergyCell.tsx
    GridOverlay.tsx
  workspaces/
    SynchronizerRail.tsx
    ResourceBalanceCore.tsx
    ScalingReactorGrid.tsx
    BoosterTrainLine.tsx
    DistributionTunnel.tsx
    CommandGridLinker.tsx
src/components/FractionFactoryLevel5.tsx   -- Intro → MissionSelect → MissionPlay → BossChallenge
```

## Files to edit

- `src/routes/play.tsx`
  - Import `FractionFactoryLevel5`.
  - Set Level 5's `unlocked: true`, update its `desc` and `focus` text to match the brief, keep `missions: 6`.
  - Add `if (activeLevel === 5) return <FractionFactoryLevel5 onExitToHub={...} />`.
  - Wire `useLevelProgress(5)` into the displayed `done` count.
- `src/lib/mission-progress.ts` — only if level 5 isn't already a generic level; otherwise no change (L4 used the same hook generically).

## Reused infrastructure (no changes needed)

- `InvestigationLayout`, `L2TopBar`, `DialogueDock`, `ExplainPanel`, `ReplayInstructionsButton`
- Reasoning evaluator endpoints (`/api/evaluate*`) — already concept-agnostic via `explainPrompt`
- `useAutoSpeak`, `useNarrate`, voice settings, accessibility helpers

## Accessibility

- Keyboard-navigable controls on all new drag/partition interactions (arrow keys to adjust denominator splits, Enter to merge/split).
- Each interactive element labeled; status conveyed by icon + text, never color alone.
- Calm motion (≤300ms, no flashing); respects `prefers-reduced-motion`.
- Large tap targets, predictable layout mirroring L4.

## Out of scope

- New backend / DB / auth changes.
- Modifying L1–L4 missions or shared evaluator logic.
- Audio asset additions beyond existing TTS narration.

Ready to switch to build mode and implement?
