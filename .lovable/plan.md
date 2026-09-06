# Rebuild Level 02 — Naming the Pieces

Rebuild all four Level 2 investigations to match the new script exactly, keeping the Level 1 flow (CASE BRIEF → INVESTIGATE → DETECT → REPAIR → EXPLAIN → CASE CLOSED), the photographic models, read-aloud on every text, and the no-score reasoning report.

## What changes in each case

**02.01 The Cookie Tray — discover**
Tray of 4 equal cookies, 3 stamped, fraction 3/4 shown. ZED-4 claims the 3 counts the pieces in the whole and the 4 counts what we're looking at. Child taps and counts, then sorts each number into two evidence areas: "the whole" and "the part we're looking at". Detect: he switched what the two numbers are telling us. Repair: build 3/4 on a blank tray (cut into 4, choose 3), with a gentle "check the two numbers again" retry instead of "wrong". Vocabulary named after the repair. Skill: give each number a job.

**02.02 The Chocolate Squares — transfer**
Bar of 6 equal squares, 2 highlighted, 2/6. ZED-4 claims the 6 means Maya got 6 pieces. Two detect questions in sequence: what the 6 counts, then what the 2 counts. Repair: his picture highlights 3 — the child changes it to 2, then answers the follow-up "did we change the whole?" (no — still 6 equal parts). Explain focuses on why 6 isn't Maya's share. Skill: ask what the number is counting.

**02.03 The Painted Wall — represent**
Fraction 4/5 given first, wall built from the symbols. ZED-4's wall has 4 sections, all 4 painted. Investigate uses a two-point evidence checklist: does the whole have 5 equal parts, are 4 of them painted. Repair: partition into 5, paint 4. Skill: connect symbols to what you see.

**02.04 The Mystery Fraction — reason**
Card says 3/5; the model shows 5 equal sections with 2 highlighted. Evidence board matches each number to what it counts, then compares with the picture. Detect: "No, because only 2 of the 5 parts are highlighted", followed by "what fraction does the picture actually show?" (2/5). Repair: highlight one more section to reach 3/5. Explain: "I know it is 3/5 because…". Skill: check the symbols against the model.

**Level closed panel**
Rewritten to the new wording: TWO NUMBERS. TWO JOBS. — denominator counts the equal parts in the whole, numerator counts the parts we're considering — plus the reminder not to just memorise the names, and the four detective skills listed.

## Technical notes

- `src/components/investigation/types.ts`: add optional `evidenceSort` (two labelled areas the child drops the two numbers into), an optional second detect question (`followUp`), an optional repair follow-up question, and a `zedResponse` line shown at case close. All optional, so Level 1 and Levels 3–6 are untouched.
- `src/components/investigation/InvestigationCase.tsx`: render the new optional blocks in the investigate, detect, repair and solved stages; record the extra checks as evidence.
- New small component for the number-sorting evidence board, styled with existing tokens and tap-friendly targets, read-aloud enabled.
- `src/components/level02/cases.ts`: rewrite all four definitions with the new stories, claims, choices, repairs, vocabulary and skills.
- `src/routes/api/chat/case-02-tray|squares|wall|mystery.ts`: update each ZED-4 prompt to the new story and the new closing admission; question-only guidance and `[[CASE_SOLVED]]` behaviour stay.
- `src/lib/reasoning/caseCatalog.ts`: update the four "what happened" narrations; `snapshots.ts` gains evidence for checking both numbers against the model (feeds CHECK and REPRESENT).
- `src/routes/play.case-02.tsx`: new Level Closed content.
- Verify with an end-to-end run through all four cases to Level Closed, then the report.
