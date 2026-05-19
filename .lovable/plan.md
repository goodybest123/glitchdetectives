## Goal

Rewrite Level 2's hub card so it reads:

- **Level 2 • Grade 2**
- **Title:** Fraction Discovery Zone
- **Description:** Children begin understanding how fractions are written and interpreted.
- **Focus Areas:** Numerators, denominators, unit fractions
- **Missions:** 0 / 15 completed
- Still **locked** on the hub (Level 1 remains the only unlocked level).

## Scope of this change

Metadata-only edit to the Level 2 entry on the `/play` hub. No gameplay, routing, or component wiring is added in this turn — Level 2 stays locked, so no missions need to exist yet.

## Files touched

- `src/routes/play.tsx` — update the `LEVELS[1]` object:
  - `title: "Fraction Discovery Zone"`
  - `desc: "Children begin understanding how fractions are written and interpreted."`
  - `focus: "Numerators, denominators, unit fractions"`
  - `missions: 15`, `done: 0`, `unlocked: false`
  - Keep `Icon: Scissors` (or swap to a more "discovery" icon — happy to change if you have a preference).

## Out of scope (flag for a follow-up)

Actually building the 15 Level 2 missions (mission map, glitch content, repair widgets for unit fractions, AI prompts, etc.) is a much larger piece of work. Once you confirm the card copy, the next step would be to design the 15-mission breakdown — typically 3 stages of 5 missions (e.g. **Read the Fraction** → **Numerator vs Denominator** → **Unit Fractions in Action**). Let me know if you want me to draft that breakdown next.