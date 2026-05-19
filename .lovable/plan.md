## Goal
ZED should advance as soon as it understands the child. Only ask a follow-up question when genuinely confused.

## Problem
Today the system + user prompt in `src/lib/evaluate-core.ts` instruct ZED to "ask exactly ONE tiny curious question" on every reply unless the child perfectly explained equal parts. Result: ZED keeps probing even when the child's meaning is clear, and `strictTeach` in explain mode further blocks advancement until reasoningScore ≥ 2.

## Change (single file: `src/lib/evaluate-core.ts`)

1. Loosen the "isCorrect" bar in the SYSTEM prompt:
   - Mark `isCorrect = true` whenever the child's meaning clearly conveys that parts must be equal / same / fair / even / same-size — even with simple kid words ("same", "even", "not fair", "bigger", "one is smaller").
   - Only mark `isCorrect = false` when the child is off-topic, vague ("it's wrong", "I dunno"), garbled, or contradicts the equal-parts idea.

2. Change reply rules in SYSTEM:
   - When `isCorrect = true`: celebrate warmly, do NOT ask a question, end the turn so the game advances.
   - When `isCorrect = false`: thank + reflect one word + ask ONE tiny question (current behavior).

3. Update the user-prompt template at the bottom of `runEvaluate` so it no longer forces a question on every reply. Instead: "If you understand the teacher (isCorrect=true), celebrate and do not ask a question. Only ask one tiny question if you are still confused."

4. Drop the `strictTeach` upgrade gate (or relax to `reasoningScore >= 1`) so the explain phase advances as soon as ZED understands, matching the new behavior. Keep the `opts` argument for backwards compatibility but make it a no-op.

## Files
- `src/lib/evaluate-core.ts` — prompt + strictTeach tweak only.

No UI, route, or component changes. The three `/api/evaluate-*` endpoints automatically inherit the new behavior.
