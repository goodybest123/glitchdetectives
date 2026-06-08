
## Goal
Build Case 01 of the Fraction Factory: an interactive "find-the-logic-glitch" puzzle on a new `/play/case-01` route, wired up from the dashboard's INVESTIGATE button. Calm, neuro-inclusive UI; no timers, no scores.

## Route & navigation
- New file: `src/routes/play.case-01.tsx` → URL `/play/case-01`.
- In `src/routes/play.tsx`, wrap the INVESTIGATE button in a `<Link to="/play/case-01">`.
- Back link on the case page returns to `/play`.

## Page layout
Two-column on desktop (stacks on mobile), white background, generous padding:
- **Header bar**: title "Case 01: Parts of a Whole", small back link.
- **Left / main (≈2fr)**: soft-shadowed rounded "Case File" card containing:
  - ZED-4 robot avatar + speech bubble (state-driven copy).
  - SVG pizza scene (see below).
  - Prompt / status text under the pizza.
  - Repair Tool (slider) — appears in state DETECT+.
  - Soft green "Logic Repaired" banner — appears when fully equalized.
- **Right (≈1fr)**: Socratic chat panel, sticky on desktop. Disabled/greyed until EXPLAIN state.

## Pizza SVG (single component, drives all states)
Vector circle ~320px, top-down view, light cream crust ring, warm sand fill, small pastel-red dot "toppings" sprinkled. Four dividing lines from center to edge at angles driven by an `equalized` value `t ∈ [0,1]`:
- At `t=0`: cuts at angles ~`[0°, 25°, 50°, 75°]` → one ~285° "huge" slice + three slivers.
- At `t=1`: cuts at `[0°, 90°, 180°, 270°]` → 4 equal quadrants.
- Interpolate linearly between the two angle sets as the slider moves.
- The "claimed 1/4" sliver (between angles[0] and angles[1]) is filled soft pastel yellow.
- In INVESTIGATE state, the unequal slice boundaries are clickable (invisible hit-areas on the dividing lines + slivers) to trigger DETECT.
- In DETECT state, run a one-shot pulse animation (scale 1 → 1.04 → 1, 600ms) on the whole pizza group.

## State machine
Single `useState<'investigate' | 'detect' | 'repair' | 'explain'>`. Plus `equalized: number` (0–1) for the slider.

- **investigate** (default): ZED-4 says *"Look! I served exactly 1/4 of the pizza!"*. Prompt: *"Scan ZED-4's logic. Click on the pizza where the logic breaks."* Slider hidden. Chat disabled.
- **detect** (on click of any unequal slice/line): ZED-4 says *"Glitch Detected! The pieces don't look fair."* Pulse plays. Slider revealed, starts at 0.
- **repair** (entered as soon as the user moves the slider): live-animate the cuts. When `equalized >= 0.995`, snap to 1, show soft green banner *"Logic Repaired: The parts are now equal."*, transition to **explain**.
- **explain**: chat panel becomes active; AI welcome message appears; user can submit reasoning.

## AI Socratic chat (right panel)
- AI SDK `useChat` + `DefaultChatTransport` pointing at `/api/chat/case-01`.
- Initial assistant message (seeded client-side, not from the model): *"Great detective work! You fixed ZED-4's glitch. Before we close the case, tell me: why was it wrong to call that first tiny slice 1/4?"*
- Composer: single textarea + "Submit Evidence" button. Disabled while `status` is `submitted` / `streaming`, and disabled entirely until state is `explain`.
- Render `message.parts` (text parts) with simple paragraph styling.

### Server route: `src/routes/api/chat/case-01.ts`
- `createFileRoute('/api/chat/case-01')` with a `POST` handler.
- Uses `createLovableAiGatewayProvider` (helper at `src/lib/ai-gateway.server.ts` — create if missing per `ai-sdk-lovable-gateway` knowledge) and model `google/gemini-3-flash-preview`.
- System prompt: warm K-12 Socratic tutor. Rules: never give the answer outright; ask one short guiding question at a time; affirm partial understanding; steer toward the key idea that "1/4 means one of **four equal** parts — equal size matters, not just four pieces". Keep replies ≤ 2 short sentences. No grading, no scores.
- Streams via `result.toUIMessageStreamResponse(...)` wrapped with `withLovableAiGatewayRunIdHeader`.
- Reads `LOVABLE_API_KEY` from `process.env` inside the handler.

## Design tokens
- Background: white. Card surface: white with `shadow-[0_10px_40px_-12px_rgba(15,23,42,0.15)]`, `rounded-3xl`.
- Accents (Tailwind arbitrary values, no theme changes): warm cream `#fff7e6`, pastel blue `#dbeafe`, soft yellow `#ffe8a3` (highlighted sliver), soft green banner `#dcfce7` with text `#166534`. No bright reds.
- All corners `rounded-2xl`/`rounded-3xl`; buttons `rounded-full` or `rounded-xl`.
- Subtle transitions only (`transition-all duration-300`), one celebratory pulse on detect.

## Files to add / change
- **add** `src/routes/play.case-01.tsx` — page, state machine, layout, chat UI.
- **add** `src/components/case01/PizzaSVG.tsx` — pure SVG component driven by `equalized` and `onGlitchClick` props.
- **add** `src/components/case01/ZedBubble.tsx` — small avatar + speech bubble.
- **add** `src/routes/api/chat/case-01.ts` — streaming chat server route.
- **add (if missing)** `src/lib/ai-gateway.server.ts` — Lovable AI Gateway helper per knowledge.
- **edit** `src/routes/play.tsx` — wrap INVESTIGATE button in `<Link to="/play/case-01">`.
- **install** `ai`, `@ai-sdk/react`, `@ai-sdk/openai-compatible`, `zod` (any not already present).
- Ensure `LOVABLE_API_KEY` is provisioned via `ai_gateway--create`.

## Out of scope
- Persisting progress / reasoning to a database.
- Cases 02–06.
- Voice / TTS.
- Auth.
