# Make cases device-friendly + fix repair/chat/mic UX

Apply across all 6 cases (`play.case-01.tsx` → `play.case-06.tsx`) plus shared components.

## 1. Repair tool appears beside the glitched object

Today the repair frame renders **below** the visual (case 01–05) or **replaces** it (case 06), so on smaller screens the child taps the glitch and the tool is off-screen.

Change inside `SubCaseRunner` of each case:
- When `stage === "repair" | "explain" | "solved"`, render the visual and the repair tool inside a 2-column grid (`grid sm:grid-cols-2 gap-4 items-start`) so they sit side-by-side on tablet/Chromebook and stack on phones — both visible together without scrolling.
- Case 06 keeps a single column only while the BlueprintSlicer/PaintCalibrator/CircuitSegmenter is mounted; switch to the same side-by-side grid by rendering the small `Visual` next to the repair widget (instead of hiding it).
- Auto-scroll the visual+repair pair into view (`scrollIntoView({block:"center"})`) right when the child clicks the glitched part — so the tool reveals itself smoothly alongside the object.

## 2. Equalizer / calibrator: math-correct targets per case

Replace the hard-coded `equalized >= 0.995` / `>= 0.97` thresholds with a per-sub-case `correctTarget` value read from `SUB_CASES[caseId]`:

- Add `correctTarget: number` (0–1) and `targetTolerance: number` (default 0.03) to each sub-case definition in `src/components/case01/cases.ts` through `case05/cases.ts`.
- Set the target to match the actual fraction being repaired (e.g. pizza fair-share = 0.5, three-fourths = 0.75, etc.). Several cases will land mid-slider instead of always at 100%.
- Submit becomes ready when `Math.abs(equalized - correctTarget) <= tolerance`. Progress chip reads `✓ BALANCED` only inside tolerance; otherwise show distance hint ("a little less", "a little more").
- For Case 06's PaintCalibrator and similar, no slider change is needed — the underlying math is already correct; just verify the completion gates.

## 3. Tablet / Chromebook / mobile no-scroll layout

In every `SubCaseRunner`:
- Drop the fixed `min-h-[600px]` aside.
- Replace the right-column `<aside>` with a responsive component:
  - **lg (≥1024px)**: today's right sidebar.
  - **<lg (tablet / Chromebook / mobile)**: a slide-up bottom drawer ("AI Guide" pill button at the bottom edge → opens drawer covering ~80vh). Drawer is dismissible; auto-opens once when `stage` becomes `explain` so the child sees the prompt without scrolling.
- Tighten the main card on small screens: `p-4 sm:p-6 lg:p-10`, smaller stepper, reduce ZedBubble vertical padding so the play surface fits inside one viewport at 1366×768 (Chromebook) and 1024×768 (iPad).

A new `ChatDrawer` wrapper component will host the existing chat panel JSX; the lg sidebar keeps the same JSX via a shared `<ChatPanel/>` extracted from each case file.

## 4. Show ZED's prompt first after repair submission

Inside `ChatPanel`:
- When `stage` transitions to `explain`, scroll the messages container to the **top** (welcome message) instead of the input. The welcome bubble is ZED-4's "Explain your reasoning…" prompt, so it must be the first thing visible.
- Move the header "Explain your reasoning — type or speak." closer to the chat list (reduce `py-4` → `py-2`, drop the divider gap) so the prompt sits just above the first message.
- Auto-focus the textarea only after a 600 ms delay so the scroll lands on the prompt, not the input.

## 5. Chat input flows with messages (no pinned bar)

In `ChatPanel`:
- Remove the `flex-1 overflow-y-auto` + bottom-pinned `<form>` pattern.
- Replace with a single scroll container that contains: header → messages → composer (textarea + mic + submit) as the **last item in the message flow**.
- When a new message arrives, auto-scroll to keep the composer in view directly under the latest bubble. This way the input visibly "moves down" with the conversation instead of sticking to the panel bottom.

## 6. Microphone gives the child time to finish

In `src/components/case01/MicButton.tsx`:
- Switch to `rec.continuous = true` and keep `interimResults = true` so a pause does not end recognition.
- Add a 4 s "silence grace" timer: reset on every `onresult` event; only call `stop()` if the user taps the mic again or 4 s of silence passes after a final result.
- Suppress the automatic `onend` → mic-off; restart recognition transparently if it ends while the user hasn't tapped stop and the grace timer hasn't fired.
- Visual: show the red pulsing mic until the child taps stop OR the grace timer fires, with a tiny "Listening… tap to stop" hint.

## Files touched

- `src/routes/play.case-01.tsx` … `play.case-06.tsx` — layout grid, scroll-on-click, extract `ChatPanel`, mount `ChatDrawer` below lg.
- `src/components/shared/ChatPanel.tsx` *(new)* — extracted chat UI, inline composer.
- `src/components/shared/ChatDrawer.tsx` *(new)* — bottom drawer for <lg.
- `src/components/case01/MicButton.tsx` — continuous recognition + 4 s grace.
- `src/components/case0{1..5}/cases.ts` — add `correctTarget` + `targetTolerance` per sub-case.
- `src/components/shared/WorkbookActivity.tsx` — minor: progress chip accepts tolerance-aware label.
- `src/components/case06/PaintCalibrator.tsx` — render at smaller width so it fits beside the SVG visual in the new side-by-side grid (viewBox stays, container max-width reduced).

## Verification

- Open `/play/case-01` on viewport 1366×768 and 1024×768: investigate → detect → repair flow stays inside one viewport; clicking the glitched slice reveals the slider next to the pizza.
- Slider for the half-share case lands at 50% (not 100%) to submit.
- On <lg, the chat opens as a bottom drawer auto-popped after submit, with ZED's prompt as the first visible bubble.
- Hold the mic and pause 2 s while speaking — recognition keeps going until tap-to-stop or 4 s silence.