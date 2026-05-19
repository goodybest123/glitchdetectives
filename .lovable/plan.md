## Goal

Rebuild Level 1 with a clean, calm, futuristic detective UI. Three views managed by a single `currentView` state: `intro`, `mission-select`, `mission-1-investigate`. Reuse the existing backend routes (`/api/evaluate-detect-reasoning`, `/api/evaluate-reasoning`, `/api/transcribe`, plus a new `/api/evaluate-wrong-reasoning`). Keep ZED-4 persona, TTS, and continuous-speech helpers from `src/lib/speech.ts`.

## Design tokens (added to `src/styles.css`)

- `--color-brand-blue` deep navy (`oklch(0.22 0.06 255)`)
- `--color-brand-sky` (`oklch(0.78 0.10 235)`)
- `--color-brand-yellow` `#FFDE59`
- `--color-brand-red` soft alert red
- Background: brand-blue gradient → near-black. Cards: glass/translucent navy with `rounded-3xl`, subtle sky-blue borders.
- Typography: existing stack, large generous spacing. Never overstimulating — at most one animated accent per view.

## View 1 — Intro (`currentView === 'intro'`)

- Centered card, rounded-3xl, glass surface.
- Large pulsing `Zap` icon inside a light-red circle (Tailwind `animate-pulse`, framer-motion scale loop).
- H1 "System Failure Detected" (yellow).
- Paragraph: factory partition machines malfunctioning… "Can you repair the system?"
- Status row: red "Glitching" dot + badge "0 / 4 Missions Completed".
- Yellow CTA `Access Mission Map` → sets `currentView = 'mission-select'`.
- Volume toggle button (top-right). When unmuted, auto-TTS reads title + paragraph on mount.

## View 2 — Mission Select Map

- Header: "Mission Map" + back arrow → intro.
- 2×2 grid of mission cards (rounded-3xl).
- Mission 1: yellow play button, `Zap` icon, label "Broken Partition Scanner". Click → `mission-1-investigate`, `missionState = 'briefing'`.
- Missions 2–4: grayed, lock overlay (`Lock` icon), "Locked" text, not clickable.
- TTS reads "Choose a mission to begin" on entry.

## View 3 — Mission 1 (split-screen, state machine)

Layout: header bar (back, mission title, volume); below it a 2-column grid (`lg:grid-cols-[1.1fr_1fr]`). Left = shape/puzzle. Right = ZED-4 dialogue bubble + interaction area. Framer-motion `AnimatePresence` per state with fade + small y-translate.

State machine (`missionState`):

1. **briefing** — Left: dashed empty circle "Target Area". Right: ZED-4 intro line for the current glitch. Button: `Start Scanner` → `investigate`. Auto-TTS.
2. **investigate** — Left: shape rendered (e.g. unequal pizza). Right: ZED claim + helper "Look closely — are the parts really equal?". Two buttons: `Yes, robot is right` → `explainWrong`, `No, it's a glitch!` → `detect`.
3. **detect** — Left: shape. Right: red-tinted action area. Textarea + mic button + `Submit Explanation`. POST `{text, mode:'detect', shapeContext, history}` to `/api/evaluate-detect-reasoning`. Render ZED reply. If `isCorrect` → show `Next` → `repair`. Else show `Try Again` (clears last child/zed pair). Mic: Web Speech API first, fallback to `MediaRecorder` → `/api/transcribe`.
4. **explainWrong** — Right: "Hooray! I knew I was right!" then prompt child to prove it. POST to new `/api/evaluate-wrong-reasoning` (gentle challenge prompt; reuses `runEvaluate` with mode `wrong`). Button `I changed my mind` → back to `investigate`. After 2 child turns, auto-concede and route to `repair` (existing behavior preserved).
5. **repair** — Left: shape with draggable slider/line (existing slider logic). Once parts are mathematically equal (within tolerance), enable green `Repair successful!` button → `explain`.
6. **explain** — Left: fixed equal-parts shape. Right: ZED "Wait, why was it wrong?…". Action: mic/text → `/api/evaluate-reasoning` (`mode:'explain'`, strict rubric already in place). On correct → `glitchSuccess`.
7. **glitchSuccess** — Left: green glow scale-in animation. Right: success copy + `Glitch Repaired!` → advances to next glitch in array (resets to `briefing`) or → `success` final state with "Mission Complete" card and "Back to Map" button.

Global per state: every ZED line auto-TTS via `speakText`. Continuous mic paused while TTS speaks (already handled in `useContinuousSpeech`). Always show a back arrow except during `repair` mini-game.

## Backend touches

- **New** `src/routes/api/evaluate-wrong-reasoning.ts` — thin route, calls `runEvaluate` with `mode:'wrong'`. (Currently `/api/evaluate-detect-reasoning` also handles `wrong`; splitting per spec naming. The shared system prompt already covers the "wrong" mode behavior, so no prompt rewrite.)
- Keep `/api/evaluate-detect-reasoning`, `/api/evaluate-reasoning`, `/api/transcribe`, `/api/evaluate` as-is.

## Files

- **Rewrite** `src/components/FractionFactoryLevel1.tsx` — clean 3-view structure, new visuals, state machine above. Split sub-components inline: `IntroView`, `MissionSelectView`, `Mission1View`, `ShapeStage`, `ZedBubble` (or reuse existing), `ActionPanel`, `RepairSlider`, `MicTextInput`.
- **Edit** `src/styles.css` — add brand color tokens.
- **New** `src/routes/api/evaluate-wrong-reasoning.ts`.
- **Keep** `src/lib/speech.ts`, `src/lib/glitches.tsx`, `src/lib/evaluate-core.ts`, existing api routes.
- **Edit** `src/routes/play.tsx` only if needed to render the new entry view (likely just continues to render `<FractionFactoryLevel1 />`).

## Out of scope

- Missions 2–4 gameplay (just locked tiles).
- Auth, persistence of progress (in-memory state only).
- Changing ZED-4 system prompt or evaluation rubric.
