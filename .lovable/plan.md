
# Level 3 — Fraction Pathways & Equivalence City

A new Grade 3 level inside Fraction Factory. Same reasoning loop (Investigate → Detect → Repair → Explain), evolved mechanics: **navigation, matching, comparison, transformation** — not slice-counting.

## 1. Wire it into the hub

- **`src/routes/play.tsx`** — add `if (activeLevel === 3) return <FractionFactoryLevel3 …/>`. Mark Level 3 unlocked, retitle to **"Fraction Pathways & Equivalence City"**, refresh focus copy, wire `useLevelProgress(3)` for `done` count.

## 2. Reuse the proven shell

Level 3 reuses, unchanged:
- `InvestigationLayout` (left case file + right workspace + bottom dock)
- `L2TopBar`, `DialogueDock`, `ReplayInstructionsButton`, `VoiceSettingsButton`
- `CaseFile`, `GlitchCheckPanel`, `ExplainPanel`
- `speech.ts` queue + `useNarrate` (already fixed)
- `mission-progress.ts` (works for any levelId)
- `/api/evaluate-reasoning` (ZED's teach-back AI is concept-agnostic — pass new `shapeContext` strings)

The reasoning loop, voice rules, "glitch stays visible after repair", and ZED's humble-learner persona all carry over.

## 3. New types — `src/lib/level3/types.ts`

Extend the Level 2 `CaseDef` shape with mission-specific payloads:

```ts
type L3ConceptKey = "number-line" | "equivalence" | "comparison" | "whole-as-fraction";

type NumberLineSpec  = { min: 0; max: 1 | 2; ticks: number; target: { n:number; d:number };
                         zedDropAt: number; theme: "bridge"|"track"|"trail" };
type EquivalenceSpec = { left: { n:number; d:number; visual: VisualKind };
                         right:{ n:number; d:number; visual: VisualKind };
                         pool: Array<{ n:number; d:number }>;   // drag-to-link options
                         correct: { n:number; d:number } };
type ComparisonSpec  = { a:{n:number;d:number}; b:{n:number;d:number};
                         zedClaim: "<"|"="|">"; truth: "<"|"="|">";
                         object: "juice"|"battery"|"pizza"|"fuel"|"candyjar" };
type WholeSpec       = { whole: number;            // e.g. 1, 2, 3
                         zedClaim: { n:number; d:number };
                         truth:    { n:number; d:number };       // e.g. 4/4 for whole=1
                         object: "pizza"|"chest"|"snackpack"|"battery" };

type L3CaseDef = BaseCase & (
  | { mission: 1; spec: NumberLineSpec }
  | { mission: 2; spec: EquivalenceSpec }
  | { mission: 3; spec: ComparisonSpec }
  | { mission: 4; spec: WholeSpec }
);
```

Each case keeps `zedBriefing`, `voiceInstructions`, `explainPrompt`, `caseNumber` — the persistent case-file fields the kids rely on.

## 4. Four workspace components

All live in `src/components/level3/workspaces/` and follow the same contract as Level 2 (`{ caseDef, step, onRepairComplete, onWrongAttempt }`), with a `ReplayInstructionsButton` next to the `h3` and `useNarrate` on phase change.

### 4a. `PathwayNavigator.tsx` — Mission 1 (Number Lines)
- Renders a glowing horizontal **pathway** (bridge / race track / candy trail per case) with tick marks and labels (`0`, `1/4`, `1/2`, `3/4`, `1`).
- ZED's snack-cart icon sits at `zedDropAt` (wrong position).
- Detect phase: child taps the cart or anywhere on the rail to mark "this is wrong".
- Repair phase: drag the cart to the correct tick. Snap within ±6% of target. Lit checkpoint glow + soft chime on snap.
- Comparison overlay: ghost of ZED's original drop stays visible after snap.

### 4b. `EquivalenceReactor.tsx` — Mission 2 (Equivalent Fractions)
- Two **reactor chambers** side-by-side showing visual models (pizza, waffle grid, chocolate bar, battery cell).
- Left chamber = fixed fraction. Right chamber = empty / corrupted.
- A **pool of fraction cards** at the bottom; child drags the equivalent one into the right chamber.
- On match: an **energy beam** lights between chambers, both visuals overlay to show equal shaded area.
- Wrong drop: gentle shake, beam stays dark, card returns. No "X" / no red flash.

### 4c. `ComparisonObservatory.tsx` — Mission 3 (Compare Fractions)
- Two **object meters** (juice bottles, robot batteries, fuel tanks) side-by-side with fill levels = fraction value.
- ZED's claim shown as a glowing operator chip (`<`, `=`, `>`) between them.
- Detect: tap the operator chip to flag the glitch.
- Repair: drag one of three operator chips (`<`, `=`, `>`) into the slot. A balance-scale tips visually based on choice; only the truthful operator locks in.
- Always show numeric fractions + visual fill so kids reason from quantity, not symbols.

### 4d. `TransformationChamber.tsx` — Mission 4 (Whole as Fraction)
- A **conversion vault**: left side shows a whole-number quantity as concrete objects (1 whole pizza, 3 full chests, 2 charged batteries). Right side is an empty fraction slot.
- Pool of fraction cards (`4/4`, `3/3`, `2/1`, `3/1`, `6/6`…); drag the correct one in.
- On match: morphing animation — objects re-segment into fraction parts, then re-merge to whole. Both representations stay on screen with an `=` between them.

## 5. Mission data — `src/lib/level3/missions.ts`

4 missions × 4 cases each (16 cases total). Each case grounded in a relatable object from the brief (pizzas, juice, batteries, candy trails, treasure chests). Each ZED briefing is a humble misconception in kid-language:

- M1: *"I think the cart stops at one-half… right here near the end?"* (drops 1/2 at 0.85)
- M2: *"Two-fourths and one-half look like different amounts to me — the numbers are different!"*
- M3: *"One-fourth is bigger than one-half because four is bigger than two… right?"*
- M4: *"A whole pizza can't be a fraction. Fractions are only pieces!"*

Each case includes `voiceInstructions` (read aloud on the right side), `explainPrompt`, and a 3-step hint ladder.

## 6. `FractionFactoryLevel3.tsx`

Mirror `FractionFactoryLevel2.tsx`:
- `intro` → `mission-select` → `mission-play` views.
- New intro copy: *"The mapping systems are corrupted. Pathways, equivalence reactors, comparison scanners, and identity vaults are offline. Welcome to Equivalence City, navigator."*
- Mission cards themed by sector: **Pathways District**, **Equivalence Energy Station**, **Comparison Observatory**, **Identity Vault**.
- Phase machine identical to L2: `briefing → glitch-check → detect → repair → explain → feedback → caseDone`, with `GlitchCheckPanel` reused verbatim.
- Per-mission workspace switch picks one of the 4 new components.

## 7. Visual identity

- Same dark-blue → cyan radial background as L2, slightly more saturated with **animated grid floor lines** suggesting a city.
- Each mission accent: M1 cyan rails, M2 violet-cyan beams, M3 amber observatory glow, M4 emerald vault.
- All glow / beam animations are slow loops (3–5s, easeInOut) — no flashes, no sudden movement (neurodivergent-safe).
- All interactive targets ≥ 56px tap area, large 20–24px labels, captions always visible.

## 8. Voice & accessibility (carryover)

- Every workspace mounts with `useNarrate(voiceInstructions, [phase, caseId])` — already queue-safe.
- `ReplayInstructionsButton` next to every right-side `h3`.
- Captions in `DialogueDock` for every ZED line.
- Operators / equivalence indicated by both **color + icon + label** (never color alone).
- Drag interactions also accept **tap-to-pick + tap-to-place** fallback for keyboard / motor accessibility.

## 9. AI feedback

Pass `mode: "explain"` + a concept-aware `shapeContext` string to `/api/evaluate-reasoning`, e.g.:
- M1: `"a number line from 0 to 1 with the fraction 1/2 placed correctly at the midpoint"`
- M2: `"two pizzas: one cut in 4 with 2 shaded, one cut in 2 with 1 shaded"`

The existing ZED system prompt already accepts new concepts; no server change required beyond passing the right context strings.

## 10. Files touched / created

**Create**
- `src/lib/level3/types.ts`
- `src/lib/level3/missions.ts`
- `src/components/FractionFactoryLevel3.tsx`
- `src/components/level3/workspaces/PathwayNavigator.tsx`
- `src/components/level3/workspaces/EquivalenceReactor.tsx`
- `src/components/level3/workspaces/ComparisonObservatory.tsx`
- `src/components/level3/workspaces/TransformationChamber.tsx`
- `src/components/level3/visuals/NumberLine.tsx` (shared rail renderer)
- `src/components/level3/visuals/ObjectMeter.tsx` (juice / battery / fuel fills)

**Edit**
- `src/routes/play.tsx` — mount Level 3, unlock card, retitle.

**Reuse unchanged**
- All `level2/` shell components (Layout, TopBar, CaseFile, DialogueDock, GlitchCheckPanel, ExplainPanel, ReplayInstructionsButton, VoiceSettingsButton, FractionVisual, FractionNotation).
- `lib/speech.ts`, `lib/narrate.ts`, `lib/mission-progress.ts`, `lib/level2/evaluator.ts` (concept-agnostic), and the 3 evaluate API routes.

## Out of scope

- No backend / DB / migrations.
- No changes to Levels 1–2 mechanics or copy.
- No new AI model / no new API endpoint.
- No audio assets beyond existing speech synthesis.

After approval I'll implement, then walk Mission 1 → Mission 4 in the preview to verify navigation snap, equivalence beam, operator drop, and whole-conversion morph each fire cleanly with voice narration playing on the right-side workspace.
