
# Level 4 — Fraction Repair Systems

Build a new playable level following the same architecture as Level 3, focused on fraction operations (add, subtract, equivalence, simplification). Children act as Fraction Repair Engineers diagnosing broken arithmetic engines and teaching ZED-4 *why* operations work.

## Architecture (reuses existing shell)

- Reuse `InvestigationLayout`, `L2TopBar`, `DialogueDock`, `ExplainPanel`, `ReplayInstructionsButton`, `useNarrate`, `useAutoSpeak`, `mission-progress`.
- Persistent left **Case File** (Level 4 variant), dynamic right **Workspace**, bottom dialogue dock, top bar with replay/voice — identical pattern to Level 3.
- Phase machine per case: `intro → glitch-check → workspace-repair → explain → teach-zed → success`.
- Voice instructions on every screen via existing `narrate` + 🔊 Read Instructions Again button.

## New files

**Domain / data**
- `src/lib/level4/types.ts` — `L4MissionDef`, `L4CaseDef`, op specs (`addLike`, `subtractLike`, `denominatorStability`, `equivalence`, `simplify`, `mixed`), `Phase` union.
- `src/lib/level4/missions.ts` — 6 missions × 3 cases each (18 cases), each with `zedClaim` (wrong equation), `truth`, `visualModel`, `voiceInstructions`, `explainPrompt`, `teachPrompt`.
- `src/lib/level4/evaluator.ts` — keyword sets for new concept keys: `add-like`, `subtract-like`, `denominator-stability`, `equivalence-generation`, `simplification`, `mixed-ops`. Mirrors `level2/evaluator.ts`.

**Orchestrator**
- `src/components/FractionFactoryLevel4.tsx` — intro → mission-select → mission-play, same shape as `FractionFactoryLevel3.tsx`. Theme: futuristic arithmetic repair facility (warmer amber/copper accents on existing deep-blue base).

**Shared UI**
- `src/components/level4/CaseFile.tsx` — persistent investigation board showing broken equation, ZED's incorrect reasoning, visual model, repair alert.
- `src/components/level4/GlitchCheckPanel.tsx` — initial "is this calculation right?" gate.
- `src/components/level4/visuals/FractionBar.tsx` — segmented bar with shaded/unshaded parts (shared across missions).
- `src/components/level4/visuals/QuantityObject.tsx` — themed object renderer (pizza, fuel tank, candy jar, battery, juice, chocolate bar, energy cell, snack box, treasure crate).
- `src/components/level4/visuals/OperationStrip.tsx` — renders `A op B = ?` visually with two model bars + result slot.

**Workspaces (one per mission)**
- `src/components/level4/workspaces/SupplyMergeStation.tsx` (M1 — add like): drag/combine themed quantities into a merged tank; live numerator counter; denominator locked & labeled "equal parts stay equal parts".
- `src/components/level4/workspaces/LeakDetector.tsx` (M2 — subtract like): remove portions from a starting quantity; verify result matches truth.
- `src/components/level4/workspaces/DenominatorCore.tsx` (M3 — structural reasoning): side-by-side partitioned wholes; child confirms partition consistency by aligning grids and rejecting tempting wrong-denominator answers.
- `src/components/level4/workspaces/EquivalenceBooster.tsx` (M4 — equivalent fractions): multiplier dial that splits each part into N sub-parts; visual proves 1/2 = 2/4 = 3/6; child matches required booster value.
- `src/components/level4/workspaces/SimplificationEngine.tsx` (M5 — simplify): group equal slices into bigger chunks; pick the divisor that fully reduces; visual collapse animation.
- `src/components/level4/workspaces/MasterRepairStation.tsx` (M6 — mixed): multi-step pipeline (add → simplify, or equivalence → subtract); each stage gated by previous repair.

## Missions

| # | Title | Concept | Workspace | Sample glitch |
|---|---|---|---|---|
| 1 | Fraction Supply Merge | Add like fractions | SupplyMergeStation | 1/4 + 2/4 = 3/8 |
| 2 | Subtraction Leak Detector | Subtract like fractions | LeakDetector | 5/8 − 2/8 = 3/16 |
| 3 | Denominator Stability Core | Why denominators stay | DenominatorCore | "everything changes when adding" |
| 4 | Equivalence Booster | Generate equivalents | EquivalenceBooster | 1/2 = 2/4 |
| 5 | Fraction Simplification Engine | Reduce to simplest form | SimplificationEngine | 6/8 = 3/4 |
| 6 | Master Repair Station | Mixed operations | MasterRepairStation | chained multi-step |

## Integration

- `src/routes/play.tsx`:
  - Import `FractionFactoryLevel4`; route `activeLevel === 4` to it.
  - In `LEVELS`, mark Level 4 `unlocked: true` and update `desc`/`focus` to match brief.
  - Add `const level4 = useLevelProgress(4);` and reflect `completedCount` (out of 6).

## Reasoning / Teach the AI

- Reuse Level 2/3 `ConversationPanel` pattern. Extend `buildHelperLine()` (or add a Level 4 variant) with model-reasoning lines per new concept key:
  - add-like: "We add the top numbers because the parts are the same size; the bottom number names the size."
  - subtract-like: parallel framing.
  - denominator-stability: "The whole was split the same way before and after, so the bottom number can't change."
  - equivalence-generation: "Splitting each piece into N smaller pieces multiplies top and bottom by N."
  - simplification: "Group equal pieces into bigger equal chunks — same amount, fewer parts."
- ZED-4 voice: operation-confusion era. Curious, slightly embarrassed, teachable. Example: "Wait… why didn't the denominator change?"

## Accessibility / UX

- Persistent glitch + visual model visible at all times.
- Large drag targets, snap-to-grid; keyboard-equivalent +/− buttons on every slider/dial.
- Calm transitions (existing motion variants), no flashing.
- 🔊 Read Instructions Again on every phase; captions under all ZED audio.
- Adaptive hint tray (reuse `level2/HintTray.tsx`) with 3 graduated hints per case.

## Visual direction

- Base: existing deep-blue radial. Accent: warm amber/copper for "repair facility" feel (define as `--l4-accent` tokens in `src/styles.css`, not hard-coded).
- Workspace chrome: subtle bolt/rivet motifs, glowing arithmetic conduits between operand and result slots.
- Object art: simple flat SVG (pizza, fuel tank, battery, juice, chocolate) — reuse across missions for cohesion.

## Out of scope (for future levels)

- Unlike denominators / LCM (Level 5).
- Multiplication, division, mixed numbers (Level 5).
- Ratios / proportional reasoning (Level 6).

## Verification

- After build, walk through Mission 1 case 1 in preview: glitch-check → repair → explain → teach → success → progress increments.
- Spot-check Mission 4 (equivalence) and Mission 6 (mixed) since they have the most novel mechanics.
- Confirm Level 4 card on `/play` shows "0/6 missions completed" and "Enter Level" is active.
