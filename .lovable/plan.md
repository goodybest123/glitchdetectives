
# Level 2 — Fraction Discovery Zone

Build a brand-new, mechanically distinct Level 2 with a persistent two-pane "investigation workspace" layout. Reuse the data + progression patterns from Level 1, but introduce a fresh mission engine — none of Level 1's slider/partition mechanics are reused.

## 1. Information architecture

```text
src/components/FractionFactoryLevel2.tsx        # Level shell (intro → mission-select → mission-play)
src/components/level2/
  InvestigationLayout.tsx                       # Persistent left "case file" + dynamic right workspace
  CaseFile.tsx                                  # Left pane: claim, visual, glitch markers, evidence trail
  TopBar.tsx                                    # Progress, replay-instructions, audio, hints, settings
  DialogueDock.tsx                              # Bottom ZED-4 dialogue with captions
  ReplayInstructionsButton.tsx                  # 🔊 "Read Instructions Again"
  HintTray.tsx                                  # Adaptive 3-step hint ladder
  EvidenceTrail.tsx                             # Persists glitch + repair + explanation side-by-side
  fractions/FractionVisual.tsx                  # Holographic shaded shape (bar / circle / grid)
  fractions/FractionNotation.tsx                # Numerator / denominator chip with corrupted-state styling
  fractions/SetVisual.tsx                       # Grouped objects (crystals, gears, batteries)
  workspaces/
    NumeratorScanner.tsx                        # Mission 1 interaction
    DenominatorRepair.tsx                       # Mission 2 interaction
    UnitFractionSorter.tsx                      # Mission 3 interaction
    CollectionVault.tsx                         # Mission 4 interaction
src/lib/level2/
  missions.ts                                   # Data-driven mission + case definitions
  types.ts                                      # Shared types (Case, MissionDef, RepairResult)
  evaluator.ts                                  # Local pre-checks + adaptive hint copy per concept
```

Routing: `src/routes/play.tsx` already gates Level 2 by `useLevelProgress(1).completedCount === 4`. Unlock Level 2, set `unlocked: true` when Level 1 is complete, and mount `<FractionFactoryLevel2 />` when `activeLevel === 2`.

## 2. Persistent investigation workspace (the critical UX rule)

A single `<InvestigationLayout>` is used by all 4 missions. The glitch never disappears — phase changes only swap the right pane.

```text
┌───────────────────────────────────────────────────────────────┐
│ TopBar: M2 ▸ Mission 1/4  •  🔊 Replay  •  💡 Hint  •  ⚙   │
├──────────────────────────────┬────────────────────────────────┤
│ LEFT: Case File (persistent) │ RIGHT: Workspace (phase)       │
│  • CASE FILE #204            │  Detect → Repair → Explain →   │
│  • ZED-4 claim chip          │   Feedback                     │
│  • Visual fraction model     │  (interaction tools change)    │
│  • Corrupted notation badge  │                                │
│  • System warnings           │  Evidence Trail (after repair):│
│  • Evidence pins added       │   ❌ Glitch  ✅ Repair  💬 You │
│    as the child works        │                                │
├──────────────────────────────┴────────────────────────────────┤
│ DialogueDock: ZED-4 line + captions + voice replay            │
└───────────────────────────────────────────────────────────────┘
```

State machine (per case): `briefing → detect → repair → explain → feedback → caseDone`. The left pane re-renders on every phase but never unmounts; on `repair` success, the original glitch is shown as a smaller "before" card so the child can compare original ↔ repaired ↔ their explanation.

## 3. Mission designs (mechanically distinct)

Each mission ships 4 cases. All share the layout above; only the right workspace changes.

**Mission 1 — Numerator Control Room** (`NumeratorScanner`)
- Visual: shaded fraction model (e.g. 3 of 4 cells lit).
- Detect: tap the lit/selected parts to confirm count.
- Repair: drag numeric tiles (1–6) onto the numerator slot of `?/4`.
- Explain: short reasoning prompt — "How did you know the top number?"
- Mechanic theme: holographic scanner sweep over selected cells.

**Mission 2 — Denominator Repair Station** (`DenominatorRepair`)
- Visual: full shape with all equal parts outlined.
- Detect: tap each equal part to count the whole.
- Repair: drag a tile onto the denominator slot of `2/?`.
- Explain: "Why count every part, even unshaded ones?"
- Mechanic theme: structural grid scanner; parts flash as counted.

**Mission 3 — Unit Fraction Scanner** (`UnitFractionSorter`)
- Visual: 6 holographic fraction cards on a conveyor (`1/2, 2/3, 1/8, 3/4, 1/5, 5/6`).
- Mechanic: drag each card into one of two chambers: **UNIT** (numerator = 1) or **NON-UNIT**.
- Repair: ZED-4 pre-sorts incorrectly; child fixes mis-sorted cards.
- Explain: "What makes a fraction a unit fraction?"

**Mission 4 — Fraction Collection Vault** (`CollectionVault`)
- Visual: a grid of 6–10 objects (crystals/gears/batteries), some glowing.
- Detect: tap glowing items to confirm the selected subset.
- Repair: build the fraction via two number-wheels (numerator / denominator).
- Explain: "Why does the denominator equal the total objects?"

## 4. Mission engine (data-driven)

`src/lib/level2/missions.ts` exports `LEVEL_2_MISSIONS: MissionDef[]`. A `Case` describes everything the engine needs:

```ts
type Case = {
  id: string;                          // "m1-c2"
  caseNumber: string;                  // "CASE FILE #204"
  visual: { kind: "bar"|"circle"|"grid"|"set"; total: number; selected: number[] };
  zedClaim: { numerator: number; denominator: number };
  truth:    { numerator: number; denominator: number };
  corruptedField: "numerator"|"denominator"|"both"|"sort"|"set";
  explainPrompt: string;
  hints: [string, string, string];     // 3-step ladder
  voiceInstructions: string;           // for 🔊 replay
};
```

`MissionView` consumes a `MissionDef` + the workspace component for that mission. Adding a new case is a data edit — no new component code.

## 5. AI evaluation + hints

- Reuse `/api/evaluate` for the Explain phase. Add an `overrideFalse` pre-check that requires at least one concept keyword (`numerator`, `denominator`, `selected`, `total`, `equal parts`, `unit`, etc.). Extend `src/lib/reasoning-evaluator.ts` with a `LEVEL_2_CONCEPT_KEYWORDS` set and a `hintForLevel2(attempt, conceptKey)` helper.
- Feedback panel shows three lines: ✅ what was correct, 💡 what to improve, 🧠 a model reasoning example.
- ZED-4 voice evolves: now struggles with **language**, not fairness. Lines authored per mission (e.g. "Ohhh… the denominator counts ALL equal parts.").

## 6. Voice + accessibility

- `ReplayInstructionsButton` reads `case.voiceInstructions` via existing `speakText()`.
- Every phase exposes the replay button; nothing auto-plays.
- Captions for ZED-4 dialogue always visible in `DialogueDock`.
- Speech-to-text falls back to typing with a clear message if unsupported (already handled by `ExplainInput`).
- Tap targets ≥ 44×44. Focus rings via design tokens. Glitch state encoded by icon + label + outline, never color alone.
- Reduced-motion friendly: scanner sweeps gated by `prefers-reduced-motion`.

## 7. Progression + persistence

- `useLevelProgress(2)` (already generic) tracks 4 missions.
- After each case: `markComplete(missionId, { reasoningScore, repairAttempts, hintsUsed })`.
- Mission unlock rule mirrors L1: M_n requires M_{n-1} complete.
- Level 2 unlock rule on `play.tsx`: requires Level 1 `completedCount === 4`.

## 8. Visual design direction

- Palette: existing `--color-brand-blue` (deep) + a new `--color-brand-cyan` glow token in `src/styles.css`.
- Left pane: dark "case board" surface (`oklch` near brand-blue 20%), holographic cyan stroke, monospaced eyebrow labels.
- Right pane: lighter workstation surface with subtle grid bg.
- Atmosphere: calm, investigative, futuristic — no celebratory confetti before reasoning is captured.

## 9. Build order

1. Scaffold types + missions data (`src/lib/level2/*`) and design tokens.
2. Build `InvestigationLayout`, `CaseFile`, `TopBar`, `DialogueDock`, `HintTray`, `ReplayInstructionsButton`, `EvidenceTrail`.
3. Build `FractionVisual`, `FractionNotation`, `SetVisual`.
4. Build 4 workspace components + the mission engine in `FractionFactoryLevel2.tsx`.
5. Wire into `src/routes/play.tsx`: unlock when L1 done; mount L2 when selected.
6. Extend `reasoning-evaluator.ts` with L2 keyword + hint sets; verify `/api/evaluate` prompt covers numerator/denominator concepts.
7. QA each mission flow against the persistence rule (glitch always visible) and the voice replay rule.

## Technical notes

- No new npm packages required (framer-motion, lucide-react, existing speech helpers cover it).
- Mission data is pure TS — no DB migration.
- Re-use `useLevelProgress` (already supports any level number).
- Keep `FractionFactoryLevel1.tsx` untouched; Level 2 is a sibling component.
