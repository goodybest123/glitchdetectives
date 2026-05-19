## Root cause

The `/api/evaluate` server route is silently failing on every request, so ZED-4 always returns the catch-block fallback ("My audio sensors got a little fuzzy…"). The dev-server log shows the real error:

```
AI SDK Warning (lovable-ai-gateway.chat / google/gemini-2.5-flash):
  The feature "responseFormat" is not supported.
  JSON response format schema is only supported with structuredOutputs
evaluate error NoObjectGeneratedError: No object generated: response did not match schema.
```

`generateObject({ model, schema })` on the OpenAI-compatible Lovable AI Gateway provider sends a `response_format: json_schema` request that the upstream Gemini route rejects, so no object is produced and we fall into the `catch` branch — which returns the fuzzy-sensor message.

It's also creating a feedback loop: the mic keeps re-transcribing ZED-4's own "audio sensors got fuzzy" reply and resending it as the child's next turn.

## Fix

### 1. `src/routes/api/evaluate.ts` — stop using `generateObject`

Switch to `generateText` + the AI SDK `Output.object` API (the documented Lovable AI Gateway pattern for structured output). This sends the schema as a tool/output instruction the gateway actually supports, so Gemini returns the JSON we expect.

```ts
import { generateText, Output } from "ai";

const { experimental_output: object } = await generateText({
  model,
  system: SYSTEM,
  prompt: `…`,
  experimental_output: Output.object({ schema: ResultSchema }),
});

return Response.json(object);
```

Keep `google/gemini-2.5-flash`, the prompt, and `ResultSchema` as-is. Keep the existing `try/catch` fallback as a true last-resort.

### 2. `src/components/FractionFactoryLevel1.tsx` — break the echo loop

When `sendToZed` runs, immediately call `stop()` on the continuous mic before awaiting the fetch and call `start()` again after ZED-4 finishes speaking (using `speakText`'s `onEnd` callback). This guarantees the recognizer is paused while TTS plays and avoids the case where the 300 ms polling pause in `useContinuousSpeech` misses the start of the utterance.

Concretely, plumb `stop`/`start` into `sendToZed` and:
- call `stop()` right when a child turn is committed,
- in the existing `speakText(data.feedbackText, …)` callback, call `start()` again (if `autoStart` was on and not yet `correctRef.current`).

Also guard `handleFinal` so it ignores any final transcript whose text closely matches the last `zed` turn (cheap defensive check: same first 30 chars, case-insensitive) — prevents residual echo from being treated as the child's reply.

## Files touched

- `src/routes/api/evaluate.ts` — swap `generateObject` for `generateText` + `Output.object`.
- `src/components/FractionFactoryLevel1.tsx` — pause mic during round-trip + TTS, resume after; ignore transcripts that echo the last ZED line.

## Verification

- Hit `/api/evaluate` with curl after the change and confirm a real ZED reply (not the fuzzy fallback) comes back.
- In the preview, say "the pieces are not equal" during the pizza investigate phase and confirm ZED-4 thanks, reflects, and asks one curious question — and that the mic does not immediately re-send ZED's own words.

## Out of scope

- Persona / prompt changes.
- Missions 2–4.
- Voice command list.
