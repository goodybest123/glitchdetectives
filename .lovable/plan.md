## Problem

On Level 1, "Talk to ZED-4" listens (interim transcripts appear) but the final transcript never reaches the server, so the conversation can't advance to the Repair phase. The server endpoint itself works (network logs show `/api/evaluate-detect-reasoning` returning `isCorrect: true` when a message does reach it).

## Root cause

Two guards in `src/lib/speech.ts → useContinuousSpeech` silently drop the child's transcript when TTS happens to overlap with the quiet-window flush:

1. **`scheduleFlush` discards the buffer** if `isSpeaking()` is true the moment the 1.4 s timer fires. If ZED's seed line is still trailing off, or any other utterance is queued, the child's words are thrown away with no retry.
2. **The "pause-mic-while-TTS-speaks" interval (every 300 ms) wipes `bufferRef`** whenever it stops the mic. So if ZED starts speaking right after the child finishes (e.g. an auto-spoken phase hint), the buffered "the parts are not equal" is erased before it can flush.

Result: the mic shows "Listening…", the child speaks, interim text appears, then nothing is ever sent to `/api/evaluate-detect-reasoning` and the phase never advances.

## Fix

Edit `src/lib/speech.ts → useContinuousSpeech` only (no UI changes, no API changes):

1. In `scheduleFlush`, drop the `if (isSpeaking()) return;` early-return. If TTS is currently speaking, defer instead of discard — re-arm the timer for another ~600 ms so the text is flushed as soon as ZED stops, rather than thrown away.
2. In the pause-while-TTS interval, stop the mic when ZED starts speaking but **do not clear `bufferRef` or `interim`**. The buffered transcript should survive a TTS interruption and be flushed once ZED is quiet.
3. Keep the existing de-dup guard (`lastSentRef`) and the `handleFinal` "near-identical to ZED's last line" filter — those are sufficient to prevent the mic from echoing ZED back.

No changes to `ConversationPanel.tsx`, `FractionFactoryLevel1.tsx`, or the evaluate endpoints. The same hook is reused across all levels, so this also stabilizes voice on L2–L6.

## Verification

- Reload `/play` → Level 1 → first mission. Tap **Talk to ZED-4**, say "the parts are not equal".
- Expect: ZED's success reply plays, then **Enter the Repair Room** button appears (`phase === "repairPrompt"`).
- Confirm a `POST /api/evaluate-detect-reasoning` request fires every time a final transcript is captured, even if it lands while ZED is mid-sentence.

## Out of scope

- No changes to the Sentence Builder, scoring, or repair UI.
- No changes to evaluator prompts or models.
