# Rebuild Levels 2-6 as Glitch Detectives investigations

Level 1 stays exactly as it is and becomes the master template. Levels 2-6 are rebuilt on top of a shared investigation framework so every case feels like the same product, with four complete investigations per level (23 in total).

## The shared investigation framework

Level 1's three investigations were each hand-built end to end. Instead of hand-building 20 more, the same flow is extracted once:

CASE BRIEF -> INVESTIGATE -> DETECT -> REPAIR -> EXPLAIN -> optional REAL-WORLD CHALLENGE -> CASE CLOSED

The framework owns everything that must never vary: the step indicator, ZED-4's speech bubble and his completed claim, the evidence board, layered hints (observe -> direct -> scaffold), unlimited retries with no penalty, revision tracking, read-aloud on every text, sentence-building plus optional voice or writing, the CASE CLOSED panel with its Detective Skill, and the report hand-off.

Each case supplies only what makes it different: the story, ZED-4's claim (and whether that claim is right), the hands-on model the child drags/splits/places, the detect choices, the repair goal, and the explanation prompts. Level 1's three cases stay on their existing code, untouched.

## Level 2 first (this build)

Level 02 - Naming the Pieces. Four investigations, each with a different object and a different reasoning demand:

- 02.01 The Cookie Tray (discover) - ZED-4 reads 3/4 backwards; the child selects pieces on the tray and finds the two numbers have different jobs. Skill: "Give each number a job."
- 02.02 The Chocolate Squares (transfer) - 2/6, ZED-4 says the 6 means six pieces of chocolate. Skill: "Know what the numbers are telling you."
- 02.03 The Painted Wall (represent) - the child builds 2/5, 4/6, 3/8 on a sectioned wall after ZED-4 swaps top and bottom. Skill: "Connect symbols to what you see."
- 02.04 The Mystery Fraction (reason) - no finished picture: ZED-4 describes 2/5 but shades one of five. The child tests the description against the model. Skill: "Check the symbols against the model."

The vocabulary (numerator, denominator) is only named after the child has explained the meaning in their own words.

Then Levels 3, 4, 5 and 6 follow one at a time, each reviewed before the next, using the level content you specified.

## Report and progress

Every case records the same structured evidence (claim shown, what the child manipulated and compared, detection attempts and whether they changed their mind, repair actions, explanation method, hints used) and feeds the existing Detective's Report. No scores, no percentages. Reasoning evidence (NOTICE, CHECK, REPRESENT, REVISE, EXPLAIN) stays separate from the mathematical idea for each level.

Progression stays simple: finish a level's four cases to open the next level, stored so it can be loosened later. The play menu is relabelled as levels and cases, never "sub-cases", with a LEVEL CLOSED summary and links to the report.

No timers, lives, streaks, coins, badges or leaderboards. No gradients or glass cards - the existing dark blue / sky blue / white identity is kept.

## Technical notes

- New `src/components/investigation/` framework: stage machine, evidence board, hint ladder, explain panel, closed panel, and a `CaseDefinition` type carrying the case data model you specified (`zedClaim.isCorrect` supported from day one).
- Per-case models live in `src/components/level02/...` etc. as small interactive SVG components with pointer and keyboard control.
- `src/lib/reasoning/` gains the Level 2-6 catalogue entries and concept tracking; report generation logic is not duplicated per level.
- Each case keeps a ZED-4 chat endpoint under `src/routes/api/chat/`, reusing the existing prompt guardrails.
- Level 2 replaces the current generic `play/case-02` runner; Levels 3-6 routes are left in place until their turn.
