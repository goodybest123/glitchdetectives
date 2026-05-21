## Goal

Fix the Level 1 robot conversation so ZED-4 behaves as a gentle, patient learner: slower voice, listens fully, and on a correct explanation gives a clear, warm appreciation **before** advancing to the next stage.

## What's wrong today

1. **Voice is too fast.** Default rate is `0.95` in `voice-settings.ts` — fine for an adult, too fast for a Grade 1–2 child.
2. **ZED forces the child forward.** In `ReasoningBox` (Level 1, `FractionFactoryLevel1.tsx`), after just **2 child turns** in the investigate ("wrong") phase, `forceAdvance` flips ZED into "Okay teacher, I think I see it now…" and skips the rest of the conversation. That's why it feels unwilling to listen.
3. **Celebration feels rushed.** When `isCorrect=true`, ZED's reply is whatever the LLM returned (often a single short sentence), then we wait only `600ms` after TTS ends before calling `onCorrect()` and advancing. There's no consistent "appreciate first, then move on" beat.
4. **Echo guard can swallow real child speech.** The current rule (first 24 chars of last ZED line vs child transcript) sometimes drops valid answers when the child repeats a word ZED said.
5. **System prompt** is good but doesn't emphasize *patience* (waiting for the child) or a clear *appreciation* pattern when correct.

## Changes

### 1. Slow the default voice (`src/lib/voice-settings.ts`)
- Lower default `rate` from `0.95` → `0.78`.
- Lower default `pitch` from `1.1` → `1.05` (warmer, less chirpy).
- These are defaults only; the Voice Settings popover still lets the user override.

### 2. Make ZED genuinely patient in Level 1 (`src/components/FractionFactoryLevel1.tsx`, `ReasoningBox`)
- **Remove `forceAdvance` after 2 turns** in `mode === "wrong"`. Let the child explain as many times as they want; only advance when the LLM marks `isCorrect=true`.
- **Soften the echo guard**: only drop a transcript if it is ≥ 90% identical to the last ZED line (not just shares a 24-char prefix). Children often re-use ZED's words; we should still hear them.
- **Lengthen the post-celebration pause** from `600ms` → `1200ms` so the child hears the full appreciation before the screen changes.
- Disable the auto-advance "concede" branch in the `catch` block as well — on network failure, just ask the child to try again instead of skipping ahead.

### 3. Appreciate-then-advance pattern (server side, `src/lib/evaluate-core.ts`)
Update the `SYSTEM` prompt and the JSON-shape instruction so that **when `isCorrect=true`**, ZED's `feedbackText` must:
- start with a warm, specific appreciation ("Wow, teacher — you really helped me see it!"),
- reflect back ONE thing the child said,
- end with a tiny send-off ("Let's keep going!" / "I'm ready for the next one!"),
- be 2–3 short sentences (not 1), so the celebration is clearly heard.

Also add patience rules to the prompt:
- Never rush the child. Never say "let's move on" while `isCorrect=false`.
- If the child's answer is partially right, ask ONE tiny follow-up — don't grade them correct yet, but don't sound disappointed.
- Keep the 1st–2nd-grade reading level rule already in place.

No schema/API changes — `EvaluateBodySchema` / `EvaluateResultSchema` stay the same.

### 4. (No UI redesign) 
Keep the existing chat layout, mic button, and hint panel as-is. This is a behavior/tone fix, not a visual one.

## Files touched

- `src/lib/voice-settings.ts` — slower default rate & pitch.
- `src/components/FractionFactoryLevel1.tsx` — remove `forceAdvance`, soften echo guard, longer celebration pause.
- `src/lib/evaluate-core.ts` — patience + appreciate-then-advance prompt rules.

## Out of scope

- Level 2 conversation (already uses `ConversationPanel` with the same evaluator; the prompt change in `evaluate-core.ts` benefits it too, but no Level-2 component edits).
- Voice Settings panel UI — already shipped last turn.
- Any new API routes, DB changes, or auth work.

## Verification

1. Open Level 1 → Mission 1 → first glitch.
2. Confirm ZED's voice is noticeably slower out of the box.
3. Tap "There is a glitch" → give a vague answer twice → confirm ZED keeps gently asking instead of forcing you into the repair room.
4. Give a clear answer ("the parts are not equal") → confirm ZED says a 2–3-sentence appreciation, the child hears it fully, then the screen advances.
5. Open Voice Settings → confirm sliders still override the new defaults.
