
# Reasoning Layer Upgrade — Glitch Detectives

Three tightly-scoped additions that turn the app from "math game with AI feedback" into a measurable reasoning platform. Built as shared primitives so every world (Fraction Factory L1–L6, future Decimal District, etc.) opts in with one prop.

## 1. Sentence Builder (universal explain modality)

A third way to answer any "Explain" prompt, alongside Voice and Type.

**New shared component** `src/components/SentenceBuilder.tsx`
- Renders a sentence stem ("The glitch happened because…") and a chip grid of 4–6 candidate clauses.
- Multi-select chips; selected chips assemble into a live sentence preview.
- "Send to ZED-4" submits the assembled sentence as plain text to the existing `/api/evaluate*` pipeline — no backend change, no separate evaluator.
- Each chip has `{ id, text, isStrong }`. `isStrong` chips contain a target concept keyword (equal, same size, fair, etc.); at least one strong chip required to enable Send. This gives the existing `hasConceptKeyword` / `shouldOverrideToFalse` checks something to bite on.
- Accessibility: large tap targets, keyboard navigable, chips speak on tap via `speakText`.

**Refactor** `src/components/ExplainInput.tsx`
- Wrap current textarea/mic in a tabbed shell with three tabs: 🎤 Voice · ⌨️ Type · 🧩 Build.
- New optional prop `builder?: { stem: string; chips: Chip[] }`. When present, the Build tab renders `<SentenceBuilder>`. When absent, the Build tab is hidden (back-compat).
- All three tabs converge on the same `onSubmit(text)` callback, so MissionRunner and every level runner work unchanged.

**Content** — add a small chip bank per mission
- Extend `src/lib/glitches.tsx` and each `src/lib/levelN/missions.ts` `Mission`/`Glitch` type with optional `explainBuilder: { stem, chips }` and `wrongBuilder`, `detectBuilder` variants.
- Author chip banks for L1 first (highest impact for ELL / younger kids), then L2–L6. Each bank: 4 strong concept chips + 2 distractor chips.

## 2. Reasoning Score & Detective Report

Replace the implicit pass/fail with a visible, multi-dimensional score after every mission.

**New shared module** `src/lib/reasoning-score.ts`
- Pure functions that turn per-phase telemetry into a 0–100 score across six categories:
  Investigation · Error Detection · Repair Accuracy · Explanation Quality · Mathematical Vocabulary · Critical Thinking.
- Inputs (all already available in MissionRunner / level runners):
  - phase reached without hint
  - repair attempts vs target
  - hints used
  - per-explain `reasoningScore` from the LLM (1–3)
  - per-explain text → counted concept keywords via `CONCEPT_KEYWORDS`
  - which explain modality was used (Build/Type/Voice — Build still scores fully; we evaluate the assembled sentence, not the modality)
- Returns `{ overall, breakdown, strengths[], growthAreas[] }`.

**New shared component** `src/components/DetectiveReport.tsx`
- Replaces the existing "Mission Complete" screen. Shows:
  - big circular Reasoning Score (0–100)
  - 6-bar breakdown with category labels and 0–100 bars
  - 2–3 strengths bullets, 1–2 growth-area bullets, generated from the score breakdown
  - "Next mission" / "Replay" buttons (existing behavior)
- Used by `MissionRunner` and every `FractionFactoryLevelN.tsx` success screen.

**Extend** `src/lib/mission-progress.ts`
- `MissionStats` gains: `score: number` (0–100) and `breakdown: Record<Category, number>`.
- `markComplete` keeps the existing "don't overwrite better" rule, now keyed on `score`.
- Back-compat: missing fields default to derived values from existing `reasoningScore`.

## 3. Detective Rank (progression system)

Cross-level rank derived from cumulative reasoning quality.

**New shared module** `src/lib/detective-rank.ts`
- Reads all levels via existing `getLevelCompletedCount` + a new `getAllMissionStats()` helper in `mission-progress.ts`.
- Computes average score across completed missions and returns one of:
  Rookie Detective → Junior Investigator → Glitch Hunter → Reasoning Expert → Master Detective → Nexus Architect.
- Rank thresholds based on (avg score) × (missions completed weight) so rank is earned by quality, not grinding.

**New shared component** `src/components/DetectiveRankBadge.tsx`
- Small badge: icon + rank name + tiny progress bar to next rank.
- Mounted in the top bar of `src/routes/play.tsx` (the hub) and on the DetectiveReport screen with a rank-up animation when the rank changes.

## Roll-out order

1. `SentenceBuilder` + `ExplainInput` tabs + chip banks for L1.
2. `reasoning-score.ts` + `DetectiveReport` wired into `MissionRunner` (L1).
3. Extend `mission-progress.ts` schema + `DetectiveRankBadge` in hub.
4. Author chip banks for L2–L6 and swap each level's success screen to `DetectiveReport`.

## Out of scope (deliberately)

- Teacher / Parent dashboard (item 4 in the brief) — separate phase, needs auth + Cloud schema.
- Server-side persistence of scores — keep `localStorage` for now; the new schema is shaped so a future Supabase sync is a drop-in.
- No changes to the LLM prompt or `/api/evaluate*` endpoints — the assembled sentence flows through the existing pipeline.

## Technical notes

- All new components live in `src/components/` and `src/lib/`; no route changes required beyond importing the rank badge in `play.tsx`.
- Strict TS, semantic tokens from `src/styles.css` only (no raw colors).
- Animations via existing `framer-motion`, kept ≤300ms per the accessibility rules already in the project.
