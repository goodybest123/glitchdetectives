# Restore ZED-4 chat

## Goal
Make the ZED-4 explanation chat work again across all six Detective Worlds, while preserving streaming responses, the child-safe prompts, and the existing solved-case token flow.

## Confirmed current state
- The shared `validateChatMessages` function requires each incoming message to contain a legacy string `content` field.
- The world pages use AI SDK v6 `useChat` with `DefaultChatTransport`, and the server routes pass those messages through `convertToModelMessages`.
- All case chat endpoints share the same validator and gateway pattern, so one shared validation fix can restore the complete chat surface instead of patching one world only.

## Implementation steps
1. Update the shared chat validation to accept the current AI SDK UI message shape (`role` plus text parts), safely extract text for length checks, reject unsupported or malformed parts, and keep the existing message-count and size limits.
2. Preserve the original validated UI messages for `toUIMessageStreamResponse`, then verify `convertToModelMessages` receives the supported shape on every endpoint.
3. Add clear server-side handling for malformed JSON and upstream AI failures so the client receives an actionable error instead of a silent or blank chat state. Do not retry terminal gateway failures; keep bounded retry behavior limited to retryable gateway statuses if the gateway exposes them.
4. Check all eighteen case endpoints use the shared path consistently and make only the smallest route changes required by the shared contract.
5. Verify with a real request through at least one Case 01 endpoint and a second case endpoint, then test the browser flow: repair a case, open AI Guide, submit evidence, observe the streamed ZED-4 response, and confirm the existing `[[CASE_SOLVED]]` transition still works.
6. Confirm there are no new browser console errors, failed chat requests, or regressions in the locked-before-repair state.

## Technical details
- Keep TanStack file routes and the existing Lovable AI Gateway provider; do not expose the API key to the browser.
- Keep the current child-focused prompts, message limits, and per-world endpoints.
- Use the existing semantic UI and chat components; no unrelated navigation or visual changes.
