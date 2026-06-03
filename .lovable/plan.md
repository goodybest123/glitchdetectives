## Goal
Extend the 🧩 Sentence Builder modality (already live in Level 1) to **every world and level** of Fraction Factory, so kids who struggle with open-ended typing/speech can still demonstrate reasoning.

## Current state

- **Level 1** (`MissionRunner.tsx`) already uses `ExplainInput` with a `builder={builderForGlitch(...)}` prop, exposing 🧩 Build · ⌨️ Type · 🎤 Voice tabs.
- **Levels 2–6** all route their **Glitch‑Check explain** *and* **post‑repair explain** phases through `level2/ConversationPanel.tsx` (via `level2/ExplainPanel.tsx` and `level2/GlitchCheckPanel.tsx`). That panel only supports mic + free‑form text — no builder.
- Per‑case concept is already tagged via `caseDef.conceptKey` (L2 types) and is shared by L3–L6 case shapes (they all reuse `CaseDef` from `lib/level2/types.ts` via their own type files, or set `conceptKey` directly on their cases).

## What to build

### 1. Concept → BuilderConfig factory
New file `src/lib/builders/conceptBuilders.ts`:

- Export `getBuilderConfig(caseDef, mode: "detect" | "explain"): BuilderConfig`.
- Keyed off `caseDef.conceptKey` (all 14 keys already enumerated in `lib/level2/types.ts`: `numerator`, `denominator`, `unit-fraction`, `fraction-of-set`, `number-line`, `equivalence`, `comparison`, `whole-as-fraction`, `add-like`, `subtract-like`, `denominator-stability`, `equivalence-generation`, `simplification`, `mixed-ops`).
- For L6 concepts (decimal, percent, mixed number, division-as-fraction, nexus) extend the L6 type union if `conceptKey` isn't already present; otherwise add new keys (`decimal-link`, `percent-link`, `mixed-number`, `division-as-fraction`, `multi-system`) and map them here too.
- Each entry returns:
  - `stem`: child-facing sentence stem (e.g. *"The glitch is because…"* for detect, *"The answer is right because…"* for explain).
  - `chips`: 5–7 chips, **2–3 marked `isStrong: true`** containing the target vocabulary (e.g. *"the pieces are not the same size"*, *"the bottom number names the slice size"*), the rest plausible-but-wrong distractors. Numeric chips are interpolated from `caseDef.truth` / `zedClaim` (e.g. *"the top is {truth.n}"*).
- Numbers and visual nouns (slices, cells, tank pieces, energy cells, percent grid squares) come from the active `caseDef.visual.kind` and the level theme.

### 2. Add Build tab to `ConversationPanel`
Edit `src/components/level2/ConversationPanel.tsx`:

- Accept a new optional prop `builderMode?: "detect" | "explain"` (default `"explain"`).
- Add a tab bar identical in spirit to `ExplainInput.tsx`: 🧩 Build · ⌨️ Type · 🎤 Voice. Default to Build when chips exist, otherwise fall back to Type.
- Render `SentenceBuilder` (existing `src/components/SentenceBuilder.tsx`) using `getBuilderConfig(caseDef, builderMode)`. On submit, call the existing `sendToZed(fullSentence)` so the LLM evaluator pipeline and "3 misses → ZED teaches" flow are unchanged.
- Keep the existing mic + typed input wired for the other tabs. No backend changes.

### 3. Wire `builderMode` through the two entry points
- `src/components/level2/ExplainPanel.tsx` → pass `builderMode="explain"` to `ConversationPanel`.
- `src/components/level2/GlitchCheckPanel.tsx` → pass `builderMode="detect"` to its inner `ConversationPanel` (the "Tell ZED what's wrong" stage).

### 4. L6 concept coverage
L6 missions use new mechanics (decimals, percent, mixed numbers, division-as-fraction, Nexus). If their `conceptKey` doesn't already match one of the 14 L2 keys, extend `src/lib/level6/types.ts` with the additional keys and ensure each L6 mission/case sets `conceptKey`. Then add those entries in `conceptBuilders.ts`.

### 5. Level 1 untouched
`MissionRunner.tsx` keeps its own `builderForGlitch` factory — no regression risk, since L1 has unique glitch shapes (halves/quarters/etc.) that don't share the L2 concept taxonomy.

## Accessibility & UX
- Build tab honors existing per-chip 🔊 speak buttons in `SentenceBuilder`.
- "Send to ZED-4" gating still requires at least one **strong** chip, preventing kids from sending pure distractors.
- Animations stay ≤ 300 ms; semantic tokens from `src/styles.css`; no new colors.

## Out of scope
- Reasoning Score & Detective Report changes (already shipped for L1; extending to L2–L6 is a follow-up).
- Detective Rank changes.
- LLM prompt / `/api/evaluate*` changes — the builder output is just a regular sentence the evaluator already handles.
- Parent/teacher dashboard.

## Files

**New**
- `src/lib/builders/conceptBuilders.ts`

**Edited**
- `src/components/level2/ConversationPanel.tsx` (add Build tab + `builderMode` prop)
- `src/components/level2/ExplainPanel.tsx` (forward `builderMode="explain"`)
- `src/components/level2/GlitchCheckPanel.tsx` (forward `builderMode="detect"`)
- `src/lib/level6/types.ts` + `src/lib/level6/missions.ts` (only if L6 concept keys need adding)
