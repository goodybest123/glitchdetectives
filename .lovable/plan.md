
# Level 1 — Fraction Foundations: MVP Refinement Plan

Goal: turn the existing 4-mission vertical slice into a scalable, calm, reasoning-first investigation experience without breaking the detective loop (Investigate → Detect → Repair → Explain).

Work is grouped into 6 phases so you can ship and review progressively.

---

## Phase 1 — Architecture refactor (foundation)

Break the 961-line `FractionFactoryLevel1.tsx` into a data-driven, reusable system.

New structure:
```
src/features/glitch-detectives/
  components/
    MissionHub.tsx            (replaces hub portion of play.tsx)
    MissionCard.tsx
    MissionRunner.tsx         (orchestrates one mission's flow)
    panels/
      InvestigationPanel.tsx
      DetectPanel.tsx
      RepairPanel.tsx
      ExplainPanel.tsx
    feedback/
      ReasoningFeedback.tsx
      AdaptiveHint.tsx
      MissionCompleteModal.tsx
      RewardScreen.tsx
    robot/
      RobotDialogue.tsx       (replaces ZedBubble with personality states)
    repair-widgets/
      SnapHalfWidget.tsx
      RangeQuarterWidget.tsx
      TapEqualPartsWidget.tsx
      DrawPartitionWidget.tsx
      CompareShapesWidget.tsx
      DragLabelWidget.tsx
    layout/
      FactoryBackdrop.tsx     (visual recovery system)
      ProgressBar.tsx
      StepIndicator.tsx
  hooks/
    useMissionProgress.ts
    useMissionFlow.ts
    useSpeechRecognition.ts
    useAccessibility.ts
    useAdaptiveHints.ts
  data/
    level1.missions.ts        (data-driven mission definitions)
    dialogue.ts               (ZED-4 dialogue library)
    keywords.ts               (concept keywords per mission)
  lib/
    reasoning-evaluator.ts    (keyword pre-check + LLM)
    progress-store.ts         (Supabase + local cache)
  types.ts
```

Mission objects become declarative: each mission lists its shapes, repair widget type, expected concept keywords, and dialogue arc. `MissionRunner` reads a mission object and renders the right panels — no per-mission hardcoded JSX.

Delete dead code: `src/components/MissionRunner.tsx` (legacy), unused mission2 shape duplicates if subsumed.

---

## Phase 2 — Persistent progression (Lovable Cloud)

Enable Lovable Cloud and add a small schema:

```
profiles (id, display_name, created_at)
mission_progress (
  id, user_id, world, level, mission_n,
  completed_at, repair_accuracy, reasoning_score,
  attempts, hints_used
)
explanation_logs (
  id, user_id, mission_n, transcript jsonb,
  ai_evaluation jsonb, created_at
)
```

RLS: users can only read/write their own rows. Roles table prepared but unused for MVP.

Anonymous-first: use Supabase anon sign-in so children play without an account; rows are still keyed to a stable `user_id`. Later, link to a real account.

`useMissionProgress` hook:
- loads progress on hub mount,
- exposes `markMissionComplete(n, stats)`,
- computes `unlocked = completed.includes(n-1) || n === 1`,
- writes back to Supabase + mirrors to `localStorage` for offline resilience.

`play.tsx` LEVELS hub becomes dynamic: `done/missions`, lock state, "Continue" CTA come from the hook. The hardcoded `0/4` disappears.

---

## Phase 3 — Reasoning feedback + adaptive hints

Replace the black-box evaluator with a layered system:

1. **Local keyword pre-check** (`reasoning-evaluator.ts`): scan the child's transcript for mission-relevant concept words (`equal`, `same size`, `half`, `quarter`, `fair`, `match`, `even`). Decide a baseline rubric score.
2. **LLM evaluation** (existing `runEvaluate`): now returns structured feedback:
   ```
   { isCorrect, reasoningScore, noticed[], improve[], modelAnswer }
   ```
   Prompt updated to ALWAYS produce these three buckets.
3. **ReasoningFeedback** UI shows three cards:
   - ✅ What you noticed
   - 💡 What to try next
   - 🧠 How ZED-4 would explain it

Vague single-word answers no longer auto-pass: require at least one concept keyword OR explicit equality language.

**Adaptive hints** (`useAdaptiveHints`):
- After 1 failed attempt: gentle nudge.
- After 2: concrete observation prompt.
- After 3: visual highlight overlay on the unequal regions (already-rendered SVG gets a `data-hint="unequal"` outline). Hints are silent, non-punitive, dismissible.

---

## Phase 4 — Interaction variety + gentle symbolic notation

Each mission gets a distinct repair mechanic, all sharing the same loop:

| Mission | Concept | Repair widget |
|---|---|---|
| M1 | Equal vs unequal parts (mixed shapes) | TapEqualParts — child taps the shape that's already fair |
| M2 | Halves | SnapHalfWidget (existing, polished) |
| M3 | Quarters | DrawPartitionWidget — drag two cut lines onto a shape |
| M4 | Mixed halves & quarters | DragLabelWidget — drop `1/2` or `1/4` onto matching shapes |

Two more widgets (`CompareShapesWidget`, `RangeQuarterWidget`) stay in the library for future missions / variety swaps.

**Symbolic notation** is introduced ONLY after a successful repair, inside ZED-4's dialogue and the reward screen:
> "You repaired one out of two equal parts. That's called **one-half (1/2)**."

M4 is the first mission where the child actively handles `1/2` and `1/4` symbols, after three missions of visual grounding.

---

## Phase 5 — ZED-4 personality + factory recovery visuals

**ZED-4 arc** (data-driven in `dialogue.ts`):
- M1: "I thought any cut made a fraction…"
- M2: "Ohhh — both pieces have to match!"
- M3: "Four equal pieces… like sharing a pizza with friends?"
- M4: "Now I can name them — halves and quarters!"

Dialogue varies by state (greeting, confused, learning, celebrating) and never repeats two turns in a row. Personality tags drive subtle facial/eye animation states in the robot avatar.

**Factory recovery backdrop** (`FactoryBackdrop.tsx`):
- A single SVG factory scene behind the mission.
- Per completed mission: one subsystem lights up (conveyor, reactor core, sorting arm, main power).
- Mission-complete transition: a calm sweep of light across the newly-restored subsystem. No confetti, no loud sound.

**End-of-mission modal** (`MissionCompleteModal`):
- Reasoning highlights (pulled from `explanation_logs`)
- Repair accuracy
- Badge earned (detective rank: Cadet → Investigator → Inspector → Lead Detective)
- "Next mission unlocked" reveal with the factory subsystem lighting up
- Single primary CTA: "Continue investigation"

---

## Phase 6 — Accessibility + neurodivergent inclusion

Baked into every new component, not bolted on:

- **Layout**: predictable 3-zone layout (robot top-left, shape center, controls bottom). No layout shifts between phases — panels swap in place.
- **Motion**: respect `prefers-reduced-motion`; default to short (200–300ms) calm transitions; no parallax, no autoplay video.
- **Color**: never red/green alone. Pair color with icon + outline + label + pattern. Verify AA contrast on dark-blue surface.
- **Keyboard**: every interactive widget operable with Tab/Arrow/Enter. Visible focus ring using existing token, not browser default.
- **Tap targets**: ≥44×44 on mobile; widget hit areas extended with invisible padding.
- **Captions**: every ZED-4 utterance has on-screen text (already present) + a transcript drawer.
- **Speech**: `useSpeechRecognition` returns `{ supported, listening, transcript, error }`. When unsupported, the explain panel falls back to a large textarea + suggestion chips — never blocks progress.
- **Settings drawer** (top-right gear): audio on/off, reduce-motion override, font-size (3 steps), high-contrast mode.

---

## Out of scope for this plan (call out explicitly)

- New worlds (Decimal District, etc.) — architecture is prepared but no new world UI built.
- Parent/teacher dashboard — schema supports it; UI is a later milestone.
- Authentication UI beyond anonymous sign-in.
- Server-side analytics aggregation.
- Internationalization.

---

## Suggested delivery order

1. Phase 1 + Phase 2 together (architecture + persistence) — biggest unlock, everything else depends on it.
2. Phase 3 (reasoning feedback + hints) — highest educational impact.
3. Phase 4 (interaction variety + symbols) — addresses the strongest user feedback.
4. Phase 5 (ZED-4 + factory recovery) — emotional payoff.
5. Phase 6 (accessibility pass) — final hardening before calling Level 1 "MVP-complete".

Each phase ends with a working, shippable build. Approve and I'll start with Phase 1 + 2.
