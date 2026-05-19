# Plan: Real-time ZED-4 dialogue, confident robot, real pizza

## 1. Real-time conversation loop (continuous mic → AI reply)

Goal: while the mic is open, every time the speech recognizer emits a final transcript chunk, automatically send it to ZED-4. ZED-4 thanks the child, reflects their words, and asks one tiny curious question — then keeps listening. No "Send" button press required.

**Changes**
- `src/lib/speech.ts` → add `useContinuousSpeech(onFinalChunk, enabled)`:
  - Uses `SpeechRecognition` with `continuous = true`, `interimResults = true`.
  - Buffers interim text for live display; on each `final` result, fires `onFinalChunk(text)` and keeps listening.
  - Auto-pauses while ZED-4 is speaking (check `window.speechSynthesis.speaking`) and resumes on `utterance.onend` so the robot doesn't hear itself.
  - Returns `{ listening, interim, start, stop, supported }`.
- `src/components/FractionFactoryLevel1.tsx` → rewrite `ReasoningBox`:
  - Replace the textarea + Send flow with a **"Talk to ZED-4" conversation panel**:
    - Big pulsing mic toggle (start/stop the live conversation).
    - Live interim transcript shown in gray as the child speaks.
    - Scrolling chat log of `[child message → ZED-4 reply]` turns.
    - Keep a typed fallback (small input + send) for when mic is unsupported or the child prefers typing.
  - State: `turns: { role: 'child'|'zed', text: string }[]`, `pending: boolean`.
  - On each final chunk:
    1. Append child turn.
    2. POST to `/api/evaluate` with `{ text, mode, shapeContext, history }`.
    3. Append ZED-4 turn; auto-speak via `speakText`.
    4. If `isCorrect` → wait for the reply to finish speaking, stop mic, call `onCorrect`.
- `src/routes/api/evaluate.ts`:
  - Add optional `history: { role, text }[]` (max ~12) to `BodySchema`.
  - Pass prior turns into the prompt so ZED-4 reflects the latest message in context.
  - Keep the "always thank + one tiny question" SYSTEM prompt; tighten it to **always end with exactly one short question** unless `isCorrect`.

## 2. Confident-wrong robot persona

Goal: during `briefing` and `investigate`, ZED-4 sounds proudly certain that the broken shape is correct (so the child has to push back). The current pizza line "Did I cut it right?" already hints — we make it unmistakably confident.

**Changes — `src/lib/glitches.tsx`** (rewrite briefing + investigate lines for all 3 Mission-1 shapes):
- Pizza: 
  - briefing: "Check it out! I sliced this pizza perfectly down the middle. Two equal halves — one for you, one for me. I nailed it!"
  - investigate: "I'm 100% sure I cut this pizza right. Two fair halves, see? Tell me — am I right?"
- Battery: "Easy! The line is in the middle. Top half charge, bottom half empty. I'm definitely right about this one."
- Fuel rod: "Look at my fuel rod — two perfect halves of energy. I'm sure I got this right!"

Update `robotExplainWrong` so when the child agrees, ZED-4 stays confident-but-curious: "See? I told you! …wait, you sure? Tell me what makes them halves."

## 3. Realistic pizza shape

Goal: the SVG should read as a pizza, not just a two-tone circle.

**Changes — `src/lib/glitches.tsx` `PizzaShape`**:
- Layered SVG:
  - Outer **crust ring** (warm tan, `#d9a36a`) with a darker stroke.
  - **Dough/sauce base** (tomato red `#c0392b`) inside the crust.
  - **Cheese layer** (cream `#f5d76e`) slightly inset, with irregular blobby edge (a few `<circle>`s on the rim for the melted look).
  - **Pepperoni**: ~7 small red-brown `<circle>`s scattered pseudo-randomly (fixed seed positions so it's stable).
  - **Cut lines** drawn on top: first cut fixed at 12-o'clock, second cut at the user-controlled angle. Lines as dark crust color, slightly thicker.
  - When `repaired` → add a subtle green glow ring + soft scale bounce (already animated by parent), keep pepperoni.
- Keep the existing geometry math (`vals[0]` → angle) so the repair slider still works unchanged.
- Other shapes (battery, fuel rod) untouched.

## Technical notes

- Auto-speak gating: `useContinuousSpeech` reads `speechSynthesis.speaking` each tick; we also call `recognition.stop()` right before `speakText` and `recognition.start()` on `utterance.onend` to be safe across browsers.
- History size capped to last 12 turns to keep prompt small.
- Voice commands (`useVoiceCommands`) and the live conversation use **separate** `SpeechRecognition` instances; we disable the global voice-command listener while the conversation mic is active to avoid two recognizers fighting (most browsers only allow one).
- No DB / schema changes. No new dependencies.

## Files touched
- `src/lib/speech.ts` — add `useContinuousSpeech`.
- `src/lib/glitches.tsx` — confident copy + new realistic `PizzaShape`.
- `src/components/FractionFactoryLevel1.tsx` — new conversational `ReasoningBox` + disable global voice commands while talking.
- `src/routes/api/evaluate.ts` — accept `history`, tighten prompt to always end with one question.

## Out of scope
- Persisting conversations across sessions.
- Server-side audio transcription fallback (browser STT only).
- Missions 2–4.
