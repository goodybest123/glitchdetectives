
# Voice-first reasoning + investigation polish

Two big shifts:
1. **Investigation feel** — remove all "mismatch detected" warnings, hint trays, and exposed truth scaffolding. The child investigates and decides.
2. **Conversation feel** — ZED-4 auto-speaks every prompt and every reply, the mic is always one tap away, and a real back-and-forth LLM chat decides when the child "gets it." After 3 misses the robot gently teaches.

## Scope

- Level 2 (full rework of voice + reasoning + visuals + tone).
- Level 1 (swap the keyword/hint evaluator for the same LLM-conversational reasoning panel used in Level 2). All other Level 1 mechanics stay.

## Changes

### 1. Strip "investigation spoilers" (Level 2)

- **`CaseFile.tsx`**: remove the red `AlertTriangle` "warning" pill entirely. The case file just shows the visual + ZED's spoken claim — no "Numerator mismatch detected" banner.
- **`missions.ts`**: drop the `warning` strings from the case data (or keep field optional and unused). Soften `zedBriefing` lines so ZED sounds unsure ("I think this is one-fourth… but I'm not sure, teacher"), never accusatory.
- **`types.ts`**: make `warning` optional and `hints` optional (still typed but unused).
- **`HintTray.tsx`**: stop rendering it in `ExplainPanel`. Keep the file but remove the import/usage. No hints surface to the child during reasoning.

### 2. Clearer fractions + familiar objects

- **`FractionVisual.tsx`**: bump partition stroke width (bar/circle/grid dividers) ~3× and use a high-contrast color (white at higher alpha + subtle outer glow) so divisions read instantly. Add a subtle "lit" glow on selected parts.
- **New visual kind: `pizza`** in `FractionVisualSpec` (a circle styled as a pizza with crust + simple toppings on lit slices). Use it for Mission 1 case 1 and Mission 2 case 1 so the child starts with something familiar before abstract bars/grids.
- Mission 2 case 1 already uses a circle — rebrand a couple of opening cases as pizza/chocolate-bar for warmth.

### 3. Auto voice guidance at every step (Level 2)

- Add `useAutoSpeak(zedLine)` (already exists in `src/lib/speech.ts`) inside `MissionPlay` so every ZED line auto-plays, including:
  - case briefing (`zedBriefing`)
  - the explain prompt when phase flips to `explain`
  - every conversation reply
  - case-done celebration
- `DialogueDock` keeps the tap-to-replay button.
- `BriefingPanel` reads the briefing line on mount.

### 4. Conversational LLM reasoning (replaces single-shot evaluator)

New component `src/components/level2/ConversationPanel.tsx` replacing `ExplainPanel`'s body:

- Holds a `messages: {role:'zed'|'child', text}[]` transcript.
- Renders as a small chat: ZED bubbles + child bubbles, autoscroll.
- Persistent input row: textarea + **mic button** (always visible, using existing `useSpeechToText`) + Send. Transcribed speech populates the input and the child can edit/send.
- Each child submission POSTs `{ text, mode: 'explain', shapeContext, history }` to `/api/evaluate` — the endpoint and `runEvaluate` already accept `history`.
- On reply: append ZED message, auto-speak it.
  - If `isCorrect === true` → show a "Great job!" affirm bubble for ~1.5s then call `onComplete`.
  - If `isCorrect === false` → just stay in the chat. Increment `attempts`. No hints shown.
- **After 3 unsuccessful child turns**: surface a "ZED can help" message — append a friendly teacher line built server-side (see §5) that gives the answer in kid words, then unlock a **"I get it now ✓"** button that finalizes the case (counts as taught-by-ZED, lower reasoning score).
- Reasoning score: 3 if solved in 1 turn, 2 in 2, 1 in 3+ or ZED-assisted.

### 5. Server: kid-friendly conversational ZED + helper turn

Update `src/lib/evaluate-core.ts` SYSTEM prompt for Level 2's concept range:

- ZED is a Grade 2 learner — short sentences, no jargon ("numerator", "denominator" only if the child uses them first; otherwise "top number"/"bottom number").
- Never confusing or multi-part questions. At most ONE tiny question per reply.
- Accept generous correctness: any clear statement that maps the top number → lit/selected parts (or bottom → total equal parts, or unit → "just one piece on top", or set → "out of all of them") counts as `isCorrect=true`.
- Pass `conceptKey` through the request so the system prompt can adapt the rubric. Extend `EvaluateBodySchema` with optional `conceptKey`.
- Add an explicit "helper" mode: when client posts `mode: 'help'`, ZED returns a 1–2 sentence kid-friendly explanation of the answer (uses `shapeContext` truth) — used after attempt 3.

### 6. Level 1 — swap to the same conversation

- In `FractionFactoryLevel1.tsx`, replace the existing single-shot `teach`/`explainWrong` flows (which currently use `shouldOverrideToFalse` + `hintForAttempt`) with the new `ConversationPanel` (made generic, takes `{ shapeContext, conceptKey: 'equal-parts', onComplete, onHelp }`).
- Remove `hintForAttempt` usage; keep `reasoning-evaluator.ts` file untouched for now (other code may import it).
- Auto-speech behavior in Level 1 already exists via `useAutoSpeak`; just make sure the conversation's ZED replies also auto-speak (the panel handles it).

### 7. Tone cleanup

- Replace "Numerator mismatch detected.", "Denominator under-count.", etc. with — nothing visible. Internally these strings stop rendering.
- Rename the L2 left-pane heading from `"Numerator corruption detected"` to neutral `"ZED's reading"` so the child investigates rather than being told there's an error.
- BriefingPanel: drop the "Detect / Repair / Explain" step list and the word "corruption". Replace with a one-line: "Listen to ZED. Look at the picture. Help ZED get it right."

### 8. Quietly fix the hydration warning

The runtime-errors snapshot shows a `0 → 1` text mismatch from `LevelCard` (completed-mission count). Wrap the `completedCount` read in a `useEffect`/client-only state or render `null` until mounted to keep SSR markup deterministic. Single targeted fix in `src/routes/play.tsx`.

## Files

**Edit**
- `src/components/FractionFactoryLevel2.tsx` — auto-speak wiring, swap `ExplainPanel` for `ConversationPanel`, briefing copy, drop scaffolded "detect/repair/explain" lingo.
- `src/components/level2/CaseFile.tsx` — remove warning pill + heading wording.
- `src/components/level2/ExplainPanel.tsx` — slimmed: title + `<ConversationPanel/>`, no `HintTray`.
- `src/components/level2/fractions/FractionVisual.tsx` — thicker dividers, add `pizza` kind.
- `src/lib/level2/types.ts` — `warning?`, `hints?` optional, `pizza` kind, optional `conceptKey` passthrough.
- `src/lib/level2/missions.ts` — soften `zedBriefing`, drop `warning` strings, switch opening cases to `pizza`.
- `src/lib/evaluate-core.ts` — Grade 2 voice, conceptKey-aware rubric, new `help` mode.
- `src/lib/evaluate-core.ts`-paired `EvaluateBodySchema` — add `conceptKey?`, expand `mode` enum to include `'help'`.
- `src/components/FractionFactoryLevel1.tsx` — replace `ExplainInput`+keyword-override teach flow with `ConversationPanel`.
- `src/routes/play.tsx` — fix SSR hydration mismatch for completed count.

**Create**
- `src/components/level2/ConversationPanel.tsx` — the chat surface (transcript, mic, send, autoplay, 3-strike helper, onComplete).

**Untouched**
- Workspace components (NumeratorScanner / DenominatorRepair / UnitFractionSorter / CollectionVault) — they remain the investigation/repair phase, which already requires the child to figure out the glitch with no hints.
- `mission-progress.ts`, route tree, Supabase wiring.

## Out of scope

- New mission content or new sectors.
- Visual redesign of the workspaces.
- Persisting conversation transcripts to the database.
