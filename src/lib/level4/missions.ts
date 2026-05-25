/**
 * Level 4 — Fraction Repair Systems. 6 missions × 3 cases = 18 cases.
 * Each case keeps the Level 2 `CaseDef` fields (so ConversationPanel,
 * model-reasoning helpers, and progress tracking all "just work") AND
 * an `l4` payload that drives the mission-specific repair workspace.
 */

import type { L4MissionDef } from "./types";

/* ────────────────── M1 — Fraction Supply Merge (add like) ───────────── */

const M1: L4MissionDef = {
  id: 1,
  name: "Fraction Supply Merge",
  sector: "Sector 1 · Supply Merge Station",
  focus: "Adding fractions with the same bottom number",
  cases: [
    {
      id: "l4-m1-c1",
      caseNumber: "CASE FILE #401",
      visual: { kind: "bar", total: 4, selected: [0, 1, 2] },
      zedClaim: { numerator: 3, denominator: 8 },
      truth: { numerator: 3, denominator: 4 },
      corruptedField: "operation",
      conceptKey: "add-like",
      explainPrompt:
        "Why does 1/4 + 2/4 stay in fourths instead of becoming eighths?",
      voiceInstructions:
        "ZED merged the snack supplies into the wrong size. Combine the two pizza boxes and repair the total.",
      zedBriefing:
        "I added one-fourth and two-fourths and got three-eighths… the bottom got bigger, right teacher?",
      l4: {
        mission: 1,
        spec: {
          a: { n: 1, d: 4 },
          b: { n: 2, d: 4 },
          truth: { n: 3, d: 4 },
          zedResult: { n: 3, d: 8 },
          theme: "pizza",
        },
      },
    },
    {
      id: "l4-m1-c2",
      caseNumber: "CASE FILE #405",
      visual: { kind: "bar", total: 6, selected: [0, 1, 2, 3] },
      zedClaim: { numerator: 6, denominator: 12 },
      truth: { numerator: 4, denominator: 6 },
      corruptedField: "operation",
      conceptKey: "add-like",
      explainPrompt: "Why do we just count the pieces and keep sixths?",
      voiceInstructions:
        "The candy supplies need to be merged. Combine one-sixth and three-sixths and repair the total.",
      zedBriefing:
        "One-sixth plus three-sixths… so I add top AND bottom and get four-twelfths? That feels right…",
      l4: {
        mission: 1,
        spec: {
          a: { n: 1, d: 6 },
          b: { n: 3, d: 6 },
          truth: { n: 4, d: 6 },
          zedResult: { n: 4, d: 12 },
          theme: "candy",
        },
      },
    },
    {
      id: "l4-m1-c3",
      caseNumber: "CASE FILE #409",
      visual: { kind: "bar", total: 8, selected: [0, 1, 2, 3, 4] },
      zedClaim: { numerator: 7, denominator: 8 },
      truth: { numerator: 5, denominator: 8 },
      corruptedField: "operation",
      conceptKey: "add-like",
      explainPrompt:
        "If both energy cells are in eighths, why does the answer stay in eighths?",
      voiceInstructions:
        "Two energy cells need to merge into one tank. Combine two-eighths and three-eighths and lock the correct total.",
      zedBriefing:
        "Two-eighths plus three-eighths… I think I'll count up the bottoms too — seven-eighths?",
      l4: {
        mission: 1,
        spec: {
          a: { n: 2, d: 8 },
          b: { n: 3, d: 8 },
          truth: { n: 5, d: 8 },
          zedResult: { n: 7, d: 8 },
          theme: "energy",
        },
      },
    },
  ],
};

/* ───────────────── M2 — Subtraction Leak Detector ───────────────────── */

const M2: L4MissionDef = {
  id: 2,
  name: "Subtraction Leak Detector",
  sector: "Sector 2 · Fuel Leak Diagnostics",
  focus: "Subtracting fractions with the same bottom number",
  cases: [
    {
      id: "l4-m2-c1",
      caseNumber: "CASE FILE #421",
      visual: { kind: "bar", total: 8, selected: [0, 1, 2] },
      zedClaim: { numerator: 3, denominator: 16 },
      truth: { numerator: 3, denominator: 8 },
      corruptedField: "operation",
      conceptKey: "subtract-like",
      explainPrompt: "Why does 5/8 − 2/8 stay in eighths?",
      voiceInstructions:
        "The fuel tank started at five-eighths. Drain two-eighths and repair the leak readout.",
      zedBriefing:
        "Five-eighths minus two-eighths… I subtracted top AND bottom and got three-sixteenths!",
      l4: {
        mission: 2,
        spec: {
          a: { n: 5, d: 8 },
          b: { n: 2, d: 8 },
          truth: { n: 3, d: 8 },
          zedResult: { n: 3, d: 16 },
          theme: "fuel",
        },
      },
    },
    {
      id: "l4-m2-c2",
      caseNumber: "CASE FILE #425",
      visual: { kind: "bar", total: 6, selected: [0, 1] },
      zedClaim: { numerator: 1, denominator: 0 },
      truth: { numerator: 2, denominator: 6 },
      corruptedField: "operation",
      conceptKey: "subtract-like",
      explainPrompt: "Why does the bottom number stay at 6?",
      voiceInstructions:
        "The robot battery had four-sixths charge. Drain two-sixths and lock the correct readout.",
      zedBriefing:
        "Four-sixths minus two-sixths… two minus two is zero, so it's one-zero? I'm so confused!",
      l4: {
        mission: 2,
        spec: {
          a: { n: 4, d: 6 },
          b: { n: 2, d: 6 },
          truth: { n: 2, d: 6 },
          zedResult: { n: 1, d: 0 },
          theme: "battery",
        },
      },
    },
    {
      id: "l4-m2-c3",
      caseNumber: "CASE FILE #429",
      visual: { kind: "bar", total: 10, selected: [0, 1, 2, 3, 4] },
      zedClaim: { numerator: 2, denominator: 20 },
      truth: { numerator: 4, denominator: 10 },
      corruptedField: "operation",
      conceptKey: "subtract-like",
      explainPrompt: "How do you know the leak only changes the top number?",
      voiceInstructions:
        "The juice container had seven-tenths. Pour out three-tenths and repair the readout.",
      zedBriefing:
        "Seven-tenths minus three-tenths… two-twentieths? The numbers are leaking everywhere!",
      l4: {
        mission: 2,
        spec: {
          a: { n: 7, d: 10 },
          b: { n: 3, d: 10 },
          truth: { n: 4, d: 10 },
          zedResult: { n: 2, d: 20 },
          theme: "juice",
        },
      },
    },
  ],
};

/* ─────────────── M3 — Denominator Stability Core ────────────────────── */

const M3: L4MissionDef = {
  id: 3,
  name: "Denominator Stability Core",
  sector: "Sector 3 · Partition Reactor",
  focus: "Why the bottom number stays the same",
  cases: [
    {
      id: "l4-m3-c1",
      caseNumber: "CASE FILE #441",
      visual: { kind: "bar", total: 4, selected: [0, 1] },
      zedClaim: { numerator: 3, denominator: 8 },
      truth: { numerator: 3, denominator: 4 },
      corruptedField: "operation",
      conceptKey: "denominator-stability",
      explainPrompt:
        "Why is the bottom number still 4 after we added two fractions in fourths?",
      voiceInstructions:
        "ZED keeps changing the bottom number to 8. Lock the partition dial back to 4 and stabilise the core.",
      zedBriefing:
        "When I add fractions, the bottom number should grow too… right? Four plus four is eight!",
      l4: {
        mission: 3,
        spec: {
          a: { n: 1, d: 4 },
          b: { n: 2, d: 4 },
          op: "+",
          truth: { n: 3, d: 4 },
          trueDenominator: 4,
          zedDenominator: 8,
          options: [2, 4, 8, 16],
          theme: "chocolate",
        },
      },
    },
    {
      id: "l4-m3-c2",
      caseNumber: "CASE FILE #445",
      visual: { kind: "bar", total: 5, selected: [0, 1] },
      zedClaim: { numerator: 2, denominator: 25 },
      truth: { numerator: 2, denominator: 5 },
      corruptedField: "operation",
      conceptKey: "denominator-stability",
      explainPrompt: "Why is the bottom still 5 — what did 5 actually mean?",
      voiceInstructions:
        "ZED wants to multiply the bottom numbers. Set the partition dial to the right value and stabilise the reactor.",
      zedBriefing:
        "Three-fifths minus one-fifth… and the bottom becomes twenty-five because five times five?",
      l4: {
        mission: 3,
        spec: {
          a: { n: 3, d: 5 },
          b: { n: 1, d: 5 },
          op: "-",
          truth: { n: 2, d: 5 },
          trueDenominator: 5,
          zedDenominator: 25,
          options: [5, 10, 15, 25],
          theme: "snack",
        },
      },
    },
    {
      id: "l4-m3-c3",
      caseNumber: "CASE FILE #449",
      visual: { kind: "bar", total: 6, selected: [0, 1, 2, 3, 4] },
      zedClaim: { numerator: 5, denominator: 12 },
      truth: { numerator: 5, denominator: 6 },
      corruptedField: "operation",
      conceptKey: "denominator-stability",
      explainPrompt: "Why didn't the part size change when we combined them?",
      voiceInstructions:
        "Two-sixths plus three-sixths. Choose the bottom that keeps the partition stable.",
      zedBriefing:
        "Two-sixths plus three-sixths… I added the sixes too, so it's five-twelfths?",
      l4: {
        mission: 3,
        spec: {
          a: { n: 2, d: 6 },
          b: { n: 3, d: 6 },
          op: "+",
          truth: { n: 5, d: 6 },
          trueDenominator: 6,
          zedDenominator: 12,
          options: [3, 6, 12, 36],
          theme: "treasure",
        },
      },
    },
  ],
};

/* ──────────────────── M4 — Equivalence Booster ───────────────────────── */

const M4: L4MissionDef = {
  id: 4,
  name: "Equivalence Booster",
  sector: "Sector 4 · Transformation Reactor",
  focus: "Generating equivalent fractions",
  cases: [
    {
      id: "l4-m4-c1",
      caseNumber: "CASE FILE #461",
      visual: { kind: "bar", total: 4, selected: [0, 1] },
      zedClaim: { numerator: 1, denominator: 4 },
      truth: { numerator: 2, denominator: 4 },
      corruptedField: "equivalence",
      conceptKey: "equivalence-generation",
      explainPrompt:
        "Why does splitting each piece in half turn 1/2 into 2/4 — same amount?",
      voiceInstructions:
        "The booster needs one-half rewritten as fourths. Pick the matching numerator chip and fire the booster.",
      zedBriefing:
        "If I just want fourths, I keep the top the same — one-fourth, right teacher?",
      l4: {
        mission: 4,
        spec: {
          source: { n: 1, d: 2 },
          targetDenominator: 4,
          multiplier: 2,
          correctNumerator: 2,
          zedNumerator: 1,
          pool: [1, 2, 3, 4],
          theme: "pizza",
        },
      },
    },
    {
      id: "l4-m4-c2",
      caseNumber: "CASE FILE #465",
      visual: { kind: "bar", total: 6, selected: [0, 1] },
      zedClaim: { numerator: 1, denominator: 6 },
      truth: { numerator: 2, denominator: 6 },
      corruptedField: "equivalence",
      conceptKey: "equivalence-generation",
      explainPrompt: "Why does 1/3 = 2/6 — what got doubled?",
      voiceInstructions:
        "The booster needs one-third rewritten as sixths. Pick the right numerator chip.",
      zedBriefing:
        "One-third in sixths… so I just put one-sixth? Or… three-sixths?",
      l4: {
        mission: 4,
        spec: {
          source: { n: 1, d: 3 },
          targetDenominator: 6,
          multiplier: 2,
          correctNumerator: 2,
          zedNumerator: 1,
          pool: [1, 2, 3, 4],
          theme: "chocolate",
        },
      },
    },
    {
      id: "l4-m4-c3",
      caseNumber: "CASE FILE #469",
      visual: { kind: "bar", total: 8, selected: [0, 1, 2] },
      zedClaim: { numerator: 4, denominator: 8 },
      truth: { numerator: 6, denominator: 8 },
      corruptedField: "equivalence",
      conceptKey: "equivalence-generation",
      explainPrompt: "How does splitting each fourth into halves turn 3/4 into 6/8?",
      voiceInstructions:
        "Three-fourths needs to become eighths to power the booster. Pick the correct numerator.",
      zedBriefing:
        "Three-fourths in eighths… I'll keep the three, so four-eighths? I think?",
      l4: {
        mission: 4,
        spec: {
          source: { n: 3, d: 4 },
          targetDenominator: 8,
          multiplier: 2,
          correctNumerator: 6,
          zedNumerator: 4,
          pool: [3, 4, 5, 6, 7],
          theme: "snack",
        },
      },
    },
  ],
};

/* ────────────── M5 — Fraction Simplification Engine ─────────────────── */

const M5: L4MissionDef = {
  id: 5,
  name: "Fraction Simplification Engine",
  sector: "Sector 5 · Reduction Bay",
  focus: "Simplifying fractions to their simplest form",
  cases: [
    {
      id: "l4-m5-c1",
      caseNumber: "CASE FILE #481",
      visual: { kind: "bar", total: 8, selected: [0, 1, 2, 3, 4, 5] },
      zedClaim: { numerator: 2, denominator: 4 },
      truth: { numerator: 3, denominator: 4 },
      corruptedField: "operation",
      conceptKey: "simplification",
      explainPrompt: "How is 6/8 the same amount as 3/4?",
      voiceInstructions:
        "Six-eighths is too bulky for the engine. Choose the divisor that simplifies it to its smallest form.",
      zedBriefing:
        "Six-eighths… I'll just chop off a piece and call it two-fourths?",
      l4: {
        mission: 5,
        spec: {
          start: { n: 6, d: 8 },
          simplest: { n: 3, d: 4 },
          zedResult: { n: 2, d: 4 },
          divisors: [2, 3, 4],
          theme: "chocolate",
        },
      },
    },
    {
      id: "l4-m5-c2",
      caseNumber: "CASE FILE #485",
      visual: { kind: "bar", total: 10, selected: [0, 1, 2, 3] },
      zedClaim: { numerator: 2, denominator: 6 },
      truth: { numerator: 2, denominator: 5 },
      corruptedField: "operation",
      conceptKey: "simplification",
      explainPrompt: "What does it mean to group pieces into bigger equal chunks?",
      voiceInstructions:
        "Four-tenths is overloading the simplification engine. Pick the divisor that fully reduces it.",
      zedBriefing:
        "Four-tenths — I'll just subtract one from each number and get two-sixths?",
      l4: {
        mission: 5,
        spec: {
          start: { n: 4, d: 10 },
          simplest: { n: 2, d: 5 },
          zedResult: { n: 2, d: 6 },
          divisors: [2, 3, 5],
          theme: "candy",
        },
      },
    },
    {
      id: "l4-m5-c3",
      caseNumber: "CASE FILE #489",
      visual: { kind: "bar", total: 12, selected: [0, 1, 2, 3, 4, 5, 6, 7, 8] },
      zedClaim: { numerator: 3, denominator: 6 },
      truth: { numerator: 3, denominator: 4 },
      corruptedField: "operation",
      conceptKey: "simplification",
      explainPrompt: "Why does dividing both numbers by the same amount keep the value equal?",
      voiceInstructions:
        "Nine-twelfths is jamming the engine. Pick the divisor that simplifies it to the smallest form.",
      zedBriefing:
        "Nine-twelfths… I'll divide just the top by three and get three-twelfths?",
      l4: {
        mission: 5,
        spec: {
          start: { n: 9, d: 12 },
          simplest: { n: 3, d: 4 },
          zedResult: { n: 3, d: 6 },
          divisors: [2, 3, 4],
          theme: "pizza",
        },
      },
    },
  ],
};

/* ───────────────── M6 — Master Repair Station (mixed) ───────────────── */

const M6: L4MissionDef = {
  id: 6,
  name: "Master Repair Station",
  sector: "Sector 6 · Core Engine Repair",
  focus: "Add, subtract, and simplify together",
  cases: [
    {
      id: "l4-m6-c1",
      caseNumber: "CASE FILE #501",
      visual: { kind: "bar", total: 8, selected: [0, 1, 2, 3] },
      zedClaim: { numerator: 6, denominator: 16 },
      truth: { numerator: 3, denominator: 4 },
      corruptedField: "operation",
      conceptKey: "mixed-ops",
      explainPrompt:
        "How did you repair this in steps — what stayed the same, and what shrank?",
      voiceInstructions:
        "The main engine combined two-eighths and four-eighths but ended up with six-sixteenths. Repair each step.",
      zedBriefing:
        "Two-eighths plus four-eighths… six-sixteenths, then I left it. Is that wrong, teacher?",
      l4: {
        mission: 6,
        spec: {
          steps: [
            {
              op: "+",
              a: { n: 2, d: 8 },
              b: { n: 4, d: 8 },
              truth: { n: 6, d: 8 },
              zedResult: { n: 6, d: 16 },
            },
            {
              op: "simplify",
              a: { n: 6, d: 8 },
              truth: { n: 3, d: 4 },
              zedResult: { n: 6, d: 8 },
            },
          ],
          finalTruth: { n: 3, d: 4 },
          theme: "energy",
          description:
            "Step 1: 2/8 + 4/8. Step 2: simplify the result.",
        },
      },
    },
    {
      id: "l4-m6-c2",
      caseNumber: "CASE FILE #505",
      visual: { kind: "bar", total: 6, selected: [0, 1, 2] },
      zedClaim: { numerator: 3, denominator: 12 },
      truth: { numerator: 1, denominator: 2 },
      corruptedField: "operation",
      conceptKey: "mixed-ops",
      explainPrompt: "Which step did ZED break, and how did you fix it?",
      voiceInstructions:
        "The fuel relay subtracted, then mis-simplified. Repair the subtraction and the simplification.",
      zedBriefing:
        "Five-sixths minus two-sixths… three-twelfths? And then… I can't simplify that, can I?",
      l4: {
        mission: 6,
        spec: {
          steps: [
            {
              op: "-",
              a: { n: 5, d: 6 },
              b: { n: 2, d: 6 },
              truth: { n: 3, d: 6 },
              zedResult: { n: 3, d: 12 },
            },
            {
              op: "simplify",
              a: { n: 3, d: 6 },
              truth: { n: 1, d: 2 },
              zedResult: { n: 3, d: 6 },
            },
          ],
          finalTruth: { n: 1, d: 2 },
          theme: "fuel",
          description:
            "Step 1: 5/6 − 2/6. Step 2: simplify the result.",
        },
      },
    },
    {
      id: "l4-m6-c3",
      caseNumber: "CASE FILE #509",
      visual: { kind: "bar", total: 10, selected: [0, 1, 2, 3, 4, 5, 6, 7] },
      zedClaim: { numerator: 8, denominator: 20 },
      truth: { numerator: 4, denominator: 5 },
      corruptedField: "operation",
      conceptKey: "mixed-ops",
      explainPrompt:
        "Walk ZED through the repair: combine, keep the bottom, then simplify. Why?",
      voiceInstructions:
        "The core engine has a chained glitch. Combine three-tenths and five-tenths, then simplify.",
      zedBriefing:
        "Three-tenths plus five-tenths… eight-twentieths? And it's already as small as it gets?",
      l4: {
        mission: 6,
        spec: {
          steps: [
            {
              op: "+",
              a: { n: 3, d: 10 },
              b: { n: 5, d: 10 },
              truth: { n: 8, d: 10 },
              zedResult: { n: 8, d: 20 },
            },
            {
              op: "simplify",
              a: { n: 8, d: 10 },
              truth: { n: 4, d: 5 },
              zedResult: { n: 8, d: 10 },
            },
          ],
          finalTruth: { n: 4, d: 5 },
          theme: "juice",
          description:
            "Step 1: 3/10 + 5/10. Step 2: simplify the result.",
        },
      },
    },
  ],
};

export const LEVEL_4_MISSIONS: L4MissionDef[] = [M1, M2, M3, M4, M5, M6];
