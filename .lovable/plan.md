# Level 03 — The Shape Shifters

When different fractions mean the same amount.

Level 3 today is the old three-puzzle version (fuel tanks, garden beds, memory disks) where the child only picks a comparison symbol. This rebuilds it as four full investigations on the same engine Levels 1 and 2 use: CASE BRIEF → INVESTIGATE → DETECT → REPAIR → EXPLAIN → CASE CLOSED, with read-aloud on every line, evidence before feedback, gentle retries and no scores.

The old tanks/garden/disks puzzles are retired and replaced. Their progress is not carried over.

## The four cases

**03.01 The Shape Shifters (discover)** — Two identical chocolate bars: 1/2 and 2/4. ZED-4 says different numbers must mean different amounts. The child compares the shaded amounts, finds ZED-4 only compared numbers, then builds 2 of 4 to match one half. A short animation splits the one half into two smaller pieces so the child sees the amount stay put while the pieces change. Skill: compare the amount, not just the numbers.

**03.02 The Pizza Twins (transfer)** — Two identical pizzas: 1/2 and 3/6. ZED-4 says six pieces must be more pizza. The child lines the three sixths up against the half, then shades 3/6 themselves. Includes the "which is more pizza?" challenge, answer: they are the same amount. Skill: the same amount can have different names.

**03.03 The Fraction Factory (represent)** — Starts at 1/3, every third is split into two. ZED-4 thinks he now has 1/6. The child sees that the shaded third was split too, so it is 2/6. Then the child generates a new one: 2/3 becomes 4/6. Skill: track what changes and what stays the same.

**03.04 Fraction Forensics (reason)** — ZED-4 claims 3/6 is bigger than 2/4 because 3 is bigger than 2. The child compares both models and then places both fractions on a number line from 0 to 1, discovering they land on the same point. Repair: build an equivalent fraction with fourths. The explain step asks not just "why" but "how did you prove it", where models and number line are both valid evidence and "the numbers are different" is not. Skill: prove it with evidence.

No multiplying rule and no simplifying anywhere in Level 3 — the equal-amount idea is discovered visually. The level-closed screen shows the four skills and the "different names, same amount" summary, then points on to Level 4.

## Technical notes

- New `src/components/level03/cases.ts` holding four `CaseDefinition` objects; `src/routes/play.case-03.tsx` rewritten to the Level 2 route pattern (`LevelCasePicker` + `InvestigationCase` + level-closed panel).
- Engine additions in `src/components/investigation`, all optional so Levels 1–2 are untouched:
  - `compare` block on a case: two `PartsBoard` models side by side with an align/overlay toggle, shown during investigate and detect.
  - `SplitAnimation` — a small component that visually splits each part in two, used by 03.01 and 03.03.
  - `NumberLineBoard` — tap-to-place fraction markers on a 0–1 line, used as 03.04's second evidence view; keyboard and tap accessible, no drag required.
  - `explain.slots` already supports multiple choice questions; 03.04's "how did you prove it" uses a multi-select variant added to the evidence choices.
- Two new photographic assets (`pizza.jpg`, a plain rectangular panel for the factory) plus two new `ModelShape` values.
- Four chat endpoints under `src/routes/api/chat/case-03-*.ts` rewritten to the new stories (replacing tanks/garden/disks), each keeping the existing ZED-4 persona and answer-withholding rules.
- `src/lib/reasoning/caseCatalog.ts` gets the four case entries, level title and case order; `snapshots.ts` gets the level-03 concept statement and "can do" lines.
- Old `src/components/case03/*` files removed once nothing imports them.
- Verified end to end in a browser: all four cases close, Level Closed appears, and Level 3 entries show in the Detective's Report.
