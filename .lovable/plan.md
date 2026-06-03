
# Level 6 — Fraction Nexus

Final level of Fraction Factory. Built using the same Investigation Workspace pattern as Levels 2–5 (persistent Case File left, mission Workspace right, DialogueDock bottom, TopBar top). New visual theme: deep blue / sky blue / white with subtle purple accents, holographic translation portals and data streams — distinct from L5's cyan/violet engineering grid.

## Missions (7 total, 3 cases each → 21 cases + boss)

1. **Fraction Division Reactor** — Dividing fractions. Glitch: `1/2 ÷ 1/4 = 1/8`.
2. **Mixed Number Mechanics** — Add/subtract mixed numbers. Glitch: `1 1/2 + 2 3/4 = 3 4/6`.
3. **Decimal Translator** — Fractions ↔ decimals. Glitch: `1/2 = 0.2`.
4. **Percentage Command Center** — Fractions ↔ percentages. Glitch: `1/4 = 4%`.
5. **Nexus Translator** — Match fraction ↔ decimal ↔ percentage triples (e.g. `1/2`, `0.5`, `50%`).
6. **Multi-System Operations Lab** — Multi-step reasoning chains (add fractions → convert → interpret %).
7. **The Nexus Core (Boss)** — One case from each of M1–M6 chained into a city-wide rescue.

Each mission ships 3 cases so progress + reasoning flow matches L2–L5. Boss is a single integrated screen.

## Per-mission learning loop

Reuse Investigate → Detect → Repair → Explain from L4/L5:
- **Case File (left, persistent)**: original glitch, ZED reasoning, broken system viz, objectives, translation clues.
- **Workspace (right)**: mission-specific repair interactions.
- **Glitch Check panel**: "ZED is right" / "Glitch detected" → Repair.
- **Explain Panel**: free-text + voice, graded by existing reasoning evaluator with the conceptual prompts in the brief ("Why can dividing by a fraction increase the answer?", "What does percent actually mean?", etc.).
- **Dialogue Dock**: ZED-4 narration, captions, replay button.

ZED-4 dialogue evolves across the level toward the final line: *"Fractions, decimals, and percentages aren't competing systems. They're different ways of describing the same reality."*

## New mission-specific workspaces

Seven new components under `src/components/level6/workspaces/`:

1. `DivisionReactor` — fill a 1/2 container with 1/4 "energy packets"; counter shows how many fit. Symbolic repair follows visual.
2. `MixedNumberAssembler` — cargo crates (wholes) + remainder strips; child regroups when remainder ≥ 1 whole.
3. `DecimalTranslator` — fraction bar paired with a 10×10 hundred grid + decimal number line; child shades both to confirm equivalence.
4. `PercentageCommand` — battery/progress gauge; child slides percent bar to match a fraction visual, sees both labels lock.
5. `NexusPortalLinker` — drag-connect 3 portal nodes (fraction / decimal / percentage) sharing one visual quantity. Decoys included.
6. `MultiSystemLab` — multi-step pipeline (Step 1 add fractions → Step 2 convert → Step 3 interpret as %); each step locks before next.
7. `NexusCoreBoss` — composite screen running one mini-version of workspaces 1–6 in sequence.

Shared primitives under `src/components/level6/visuals/`:
- `HundredGrid` — 10×10 grid for decimal/percent shading.
- `TranslationPortal` — three-node holographic connector visual.
- `MixedNumberCrate` — whole + fraction crate visual.

Shared controls reused from L5: `NumberDial`, `LockButton`, `WorkspaceHeader` (via `workspaces/shared.tsx`).

## Files to add

```
src/lib/level6/
  types.ts                 -- L6MissionDef, L6CaseDef, L6Phase, per-mission `spec`
  missions.ts              -- 7 missions × 3 cases (21) + boss spec
src/components/level6/
  CaseFile.tsx
  GlitchCheckPanel.tsx
  visuals/
    HundredGrid.tsx
    TranslationPortal.tsx
    MixedNumberCrate.tsx
  workspaces/
    DivisionReactor.tsx
    MixedNumberAssembler.tsx
    DecimalTranslator.tsx
    PercentageCommand.tsx
    NexusPortalLinker.tsx
    MultiSystemLab.tsx
    NexusCoreBoss.tsx
    shared.tsx
src/components/FractionFactoryLevel6.tsx   -- Intro → MissionSelect → MissionPlay → NexusCoreBoss → Completion
```

## Files to edit

- `src/routes/play.tsx`
  - Import `FractionFactoryLevel6`.
  - Flip Level 6 to `unlocked: true`, update `desc` / `focus` / `missions: 7`.
  - Add `if (activeLevel === 6) return <FractionFactoryLevel6 onExitToHub={...} />`.
  - Wire `useLevelProgress(6)` into the displayed `done`.
- Final completion screen unlocks "Decimal District" placeholder (display-only banner — no new world built).

## Reused infrastructure (no changes)

- `InvestigationLayout`, `L2TopBar`, `DialogueDock`, `ExplainPanel`, `ReplayInstructionsButton`.
- `/api/evaluate*` reasoning evaluator (concept-agnostic via `explainPrompt`).
- `useAutoSpeak`, `useNarrate`, voice settings, `useLevelProgress`.

## Accessibility

- Keyboard navigation across all drag/slider/portal-link interactions.
- Status conveyed via icon + text, never color alone.
- Motion ≤300ms; respects `prefers-reduced-motion`.
- Large tap targets, predictable layout matching L4/L5.
- Replayable narration + captions on every mission.

## Completion

- Badge: 🏆 Fraction Nexus Architect.
- Ceremony screen lists L1–L6 mastered, plays final ZED-4 line.
- "New World Unlocked: Decimal District" banner (no new route).

## Out of scope

- Backend / DB / auth changes.
- Building the Decimal District world (banner only).
- Modifying L1–L5 missions or shared evaluator logic.
- New audio assets beyond TTS.

Ready to switch to build mode and implement?
