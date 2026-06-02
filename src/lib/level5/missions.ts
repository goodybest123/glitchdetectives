/**
 * Level 5 — Fraction Power Grid. 6 missions × 3 cases.
 */

import type { L5MissionDef } from "./types";

/* ─────────── M1 — Power Grid Synchronizer (add unlike) ─────────── */

const M1: L5MissionDef = {
  id: 1,
  name: "Power Grid Synchronizer",
  sector: "Sector 1 · Power Synchronization Rails",
  focus: "Adding fractions with different bottom numbers",
  cases: [
    {
      id: "l5-m1-c1",
      caseNumber: "CASE FILE #501",
      visual: { kind: "bar", total: 4, selected: [0, 1, 2] },
      zedClaim: { numerator: 2, denominator: 6 },
      truth: { numerator: 3, denominator: 4 },
      corruptedField: "operation",
      conceptKey: "add-like",
      explainPrompt:
        "Why must fractions use the same-sized parts before combining?",
      voiceInstructions:
        "Station A stores energy in halves. Station B stores it in quarters. Sync the rails so the parts match, then merge the power.",
      zedBriefing:
        "I combined one-half and one-quarter and got two-sixths… I just added the tops and the bottoms.",
      l5: {
        mission: 1,
        spec: {
          a: { n: 1, d: 2 },
          b: { n: 1, d: 4 },
          lcd: 4,
          truth: { n: 3, d: 4 },
          zedResult: { n: 2, d: 6 },
        },
      },
    },
    {
      id: "l5-m1-c2",
      caseNumber: "CASE FILE #505",
      visual: { kind: "bar", total: 6, selected: [0, 1] },
      zedClaim: { numerator: 2, denominator: 9 },
      truth: { numerator: 5, denominator: 6 },
      corruptedField: "operation",
      conceptKey: "add-like",
      explainPrompt:
        "Why can't we add the bottoms together when the units are different?",
      voiceInstructions:
        "The lighting grid needs one-third plus one-half. Expand the partition grids until the parts match, then combine.",
      zedBriefing:
        "One-third plus one-half… I added straight across and got two-fifths… wait, two-ninths?",
      l5: {
        mission: 1,
        spec: {
          a: { n: 1, d: 3 },
          b: { n: 1, d: 2 },
          lcd: 6,
          truth: { n: 5, d: 6 },
          zedResult: { n: 2, d: 9 },
        },
      },
    },
    {
      id: "l5-m1-c3",
      caseNumber: "CASE FILE #509",
      visual: { kind: "bar", total: 10, selected: [0, 1, 2, 3, 4] },
      zedClaim: { numerator: 3, denominator: 7 },
      truth: { numerator: 9, denominator: 10 },
      corruptedField: "operation",
      conceptKey: "add-like",
      explainPrompt:
        "What does it mean for two fractions to have the same-sized parts?",
      voiceInstructions:
        "Combine two-fifths and one-half. Convert both into the same unit before merging.",
      zedBriefing:
        "Two-fifths plus one-half… I just merged the numbers and got three-sevenths.",
      l5: {
        mission: 1,
        spec: {
          a: { n: 2, d: 5 },
          b: { n: 1, d: 2 },
          lcd: 10,
          truth: { n: 9, d: 10 },
          zedResult: { n: 3, d: 7 },
        },
      },
    },
  ],
};

/* ─────────── M2 — Resource Balance Core (subtract unlike) ─────────── */

const M2: L5MissionDef = {
  id: 2,
  name: "Resource Balance Core",
  sector: "Sector 2 · Water Purification Core",
  focus: "Subtracting fractions with different bottom numbers",
  cases: [
    {
      id: "l5-m2-c1",
      caseNumber: "CASE FILE #521",
      visual: { kind: "bar", total: 4, selected: [0, 1, 2] },
      zedClaim: { numerator: 2, denominator: 2 },
      truth: { numerator: 1, denominator: 4 },
      corruptedField: "operation",
      conceptKey: "subtract-like",
      explainPrompt:
        "Why can't we subtract different-sized pieces directly?",
      voiceInstructions:
        "The tank holds three-quarters. Drain one-half. Match the units first, then remove the right amount.",
      zedBriefing:
        "Three-quarters minus one-half… I subtracted the tops and the bottoms and got two over two.",
      l5: {
        mission: 2,
        spec: {
          a: { n: 3, d: 4 },
          b: { n: 1, d: 2 },
          lcd: 4,
          truth: { n: 1, d: 4 },
          zedResult: { n: 2, d: 2 },
        },
      },
    },
    {
      id: "l5-m2-c2",
      caseNumber: "CASE FILE #525",
      visual: { kind: "bar", total: 6, selected: [0, 1, 2, 3, 4] },
      zedClaim: { numerator: 4, denominator: 3 },
      truth: { numerator: 1, denominator: 6 },
      corruptedField: "operation",
      conceptKey: "subtract-like",
      explainPrompt:
        "Why must the pieces be the same size before we take any away?",
      voiceInstructions:
        "The reservoir holds five-sixths. Drain two-thirds. Sync the tanks before subtracting.",
      zedBriefing:
        "Five-sixths minus two-thirds… I just subtracted the numbers and got four-thirds.",
      l5: {
        mission: 2,
        spec: {
          a: { n: 5, d: 6 },
          b: { n: 2, d: 3 },
          lcd: 6,
          truth: { n: 1, d: 6 },
          zedResult: { n: 4, d: 3 },
        },
      },
    },
    {
      id: "l5-m2-c3",
      caseNumber: "CASE FILE #529",
      visual: { kind: "bar", total: 8, selected: [0, 1, 2, 3, 4, 5, 6] },
      zedClaim: { numerator: 6, denominator: 4 },
      truth: { numerator: 3, denominator: 8 },
      corruptedField: "operation",
      conceptKey: "subtract-like",
      explainPrompt:
        "What goes wrong when the units don't line up before subtracting?",
      voiceInstructions:
        "The coolant tank holds seven-eighths. Drain one-half. Match the units, then drain.",
      zedBriefing:
        "Seven-eighths minus one-half… I lined them up wrong and got six-fourths.",
      l5: {
        mission: 2,
        spec: {
          a: { n: 7, d: 8 },
          b: { n: 1, d: 2 },
          lcd: 8,
          truth: { n: 3, d: 8 },
          zedResult: { n: 6, d: 4 },
        },
      },
    },
  ],
};

/* ─────────── M3 — Scaling Reactor (multiply fractions) ─────────── */

const M3: L5MissionDef = {
  id: 3,
  name: "Scaling Reactor",
  sector: "Sector 3 · Production Scaling Reactor",
  focus: "Multiplying fractions as 'a part of a part'",
  cases: [
    {
      id: "l5-m3-c1",
      caseNumber: "CASE FILE #541",
      visual: { kind: "grid", total: 6, selected: [0], cols: 3 },
      zedClaim: { numerator: 2, denominator: 5 },
      truth: { numerator: 1, denominator: 6 },
      corruptedField: "operation",
      conceptKey: "denominator-stability",
      explainPrompt: 'What does "one-third of one-half" actually mean?',
      voiceInstructions:
        "The reactor needs one-third of one-half. Stack the grids, shade the overlap, then read the part of the whole.",
      zedBriefing:
        "One-half times one-third… I added the tops and added the bottoms and got two-fifths.",
      l5: {
        mission: 3,
        spec: {
          a: { n: 1, d: 2 },
          b: { n: 1, d: 3 },
          truth: { n: 1, d: 6 },
          zedResult: { n: 2, d: 5 },
        },
      },
    },
    {
      id: "l5-m3-c2",
      caseNumber: "CASE FILE #545",
      visual: { kind: "grid", total: 12, selected: [0, 1], cols: 4 },
      zedClaim: { numerator: 4, denominator: 7 },
      truth: { numerator: 2, denominator: 12 },
      corruptedField: "operation",
      conceptKey: "denominator-stability",
      explainPrompt: 'Why does multiplying fractions make the result smaller?',
      voiceInstructions:
        "Make two-thirds of one-quarter. Build the grid, shade the overlap, then count the parts.",
      zedBriefing:
        "Two-thirds times one-quarter… I added everything and got four-sevenths somehow.",
      l5: {
        mission: 3,
        spec: {
          a: { n: 2, d: 3 },
          b: { n: 1, d: 4 },
          truth: { n: 2, d: 12 },
          zedResult: { n: 4, d: 7 },
        },
      },
    },
    {
      id: "l5-m3-c3",
      caseNumber: "CASE FILE #549",
      visual: { kind: "grid", total: 15, selected: [0, 1, 2, 3, 4, 5], cols: 5 },
      zedClaim: { numerator: 4, denominator: 8 },
      truth: { numerator: 6, denominator: 15 },
      corruptedField: "operation",
      conceptKey: "denominator-stability",
      explainPrompt:
        "When you take part of a part, why do both bottoms multiply?",
      voiceInstructions:
        "Build three-fifths of two-thirds. Overlay the grids and shade the overlap.",
      zedBriefing:
        "Three-fifths times two-thirds… I think I just added across — four-eighths?",
      l5: {
        mission: 3,
        spec: {
          a: { n: 3, d: 5 },
          b: { n: 2, d: 3 },
          truth: { n: 6, d: 15 },
          zedResult: { n: 4, d: 8 },
        },
      },
    },
  ],
};

/* ─────────── M4 — Energy Booster Network (fraction × whole) ─────────── */

const M4: L5MissionDef = {
  id: 4,
  name: "Energy Booster Network",
  sector: "Sector 4 · Train Booster Network",
  focus: "Multiplying a fraction by a whole number",
  cases: [
    {
      id: "l5-m4-c1",
      caseNumber: "CASE FILE #561",
      visual: { kind: "bar", total: 4, selected: [0] },
      zedClaim: { numerator: 3, denominator: 12 },
      truth: { numerator: 3, denominator: 4 },
      corruptedField: "operation",
      conceptKey: "equivalence-generation",
      explainPrompt:
        "Why does multiplying by a whole number create repeated groups?",
      voiceInstructions:
        "Each fuel packet is one-quarter. The train needs three packets. Connect three groups and fill the gauge.",
      zedBriefing:
        "Three times one-quarter… I multiplied the bottoms too and got three over twelve.",
      l5: {
        mission: 4,
        spec: {
          whole: 3,
          frac: { n: 1, d: 4 },
          truth: { n: 3, d: 4 },
          zedResult: { n: 3, d: 12 },
        },
      },
    },
    {
      id: "l5-m4-c2",
      caseNumber: "CASE FILE #565",
      visual: { kind: "bar", total: 5, selected: [0, 1] },
      zedClaim: { numerator: 8, denominator: 20 },
      truth: { numerator: 8, denominator: 5 },
      corruptedField: "operation",
      conceptKey: "equivalence-generation",
      explainPrompt: 'When you multiply 4 by 2/5, why does the bottom stay 5?',
      voiceInstructions:
        "Each fuel cell is two-fifths. Use four cells. Connect the groups and read the total.",
      zedBriefing:
        "Four times two-fifths… I multiplied four by both numbers and got eight over twenty.",
      l5: {
        mission: 4,
        spec: {
          whole: 4,
          frac: { n: 2, d: 5 },
          truth: { n: 8, d: 5 },
          zedResult: { n: 8, d: 20 },
        },
      },
    },
    {
      id: "l5-m4-c3",
      caseNumber: "CASE FILE #569",
      visual: { kind: "bar", total: 3, selected: [0] },
      zedClaim: { numerator: 5, denominator: 15 },
      truth: { numerator: 5, denominator: 3 },
      corruptedField: "operation",
      conceptKey: "equivalence-generation",
      explainPrompt: 'What does "5 × 1/3" mean in groups of repeated thirds?',
      voiceInstructions:
        "Each thruster needs one-third. Connect five of them and measure the total fuel.",
      zedBriefing:
        "Five times one-third… I multiplied everything and got five-fifteenths.",
      l5: {
        mission: 4,
        spec: {
          whole: 5,
          frac: { n: 1, d: 3 },
          truth: { n: 5, d: 3 },
          zedResult: { n: 5, d: 15 },
        },
      },
    },
  ],
};

/* ─────────── M5 — Distribution Tunnel (divide unit fractions) ─────────── */

const M5: L5MissionDef = {
  id: 5,
  name: "Distribution Tunnel",
  sector: "Sector 5 · Resource Distribution Tunnel",
  focus: "Dividing unit fractions and whole numbers",
  cases: [
    {
      id: "l5-m5-c1",
      caseNumber: "CASE FILE #581",
      visual: { kind: "bar", total: 2, selected: [0] },
      zedClaim: { numerator: 1, denominator: 1 },
      truth: { numerator: 1, denominator: 4 },
      corruptedField: "operation",
      conceptKey: "equivalence-generation",
      explainPrompt: "Why does dividing a fraction by a whole number make it smaller?",
      voiceInstructions:
        "Take one-half of the supplies and split them between 2 robots. How much does each robot get?",
      zedBriefing:
        "One-half divided by two… I think each robot gets a whole one.",
      l5: {
        mission: 5,
        spec: {
          kind: "unitByWhole",
          unit: { n: 1, d: 2 },
          divisor: 2,
          truth: { n: 1, d: 4 },
          zedResult: { n: 1, d: 1 },
        },
      },
    },
    {
      id: "l5-m5-c2",
      caseNumber: "CASE FILE #585",
      visual: { kind: "bar", total: 3, selected: [0] },
      zedClaim: { numerator: 1, denominator: 1 },
      truth: { numerator: 1, denominator: 9 },
      corruptedField: "operation",
      conceptKey: "equivalence-generation",
      explainPrompt: "Why does splitting a small piece create even smaller pieces?",
      voiceInstructions:
        "One-third of the supplies must be split between 3 stations. How much per station?",
      zedBriefing:
        "One-third divided by three… every station gets a whole one, right?",
      l5: {
        mission: 5,
        spec: {
          kind: "unitByWhole",
          unit: { n: 1, d: 3 },
          divisor: 3,
          truth: { n: 1, d: 9 },
          zedResult: { n: 1, d: 1 },
        },
      },
    },
    {
      id: "l5-m5-c3",
      caseNumber: "CASE FILE #589",
      visual: { kind: "bar", total: 4, selected: [0] },
      zedClaim: { numerator: 1, denominator: 4 },
      truth: { numerator: 8, denominator: 1 },
      corruptedField: "operation",
      conceptKey: "equivalence-generation",
      explainPrompt: "How many quarter-packets fit inside two full packets?",
      voiceInstructions:
        "Two full supply packets are being sliced into quarter-packets. How many quarter-packets are there in total?",
      zedBriefing:
        "Two divided by one-quarter… I think the answer is one-quarter.",
      l5: {
        mission: 5,
        spec: {
          kind: "wholeByUnit",
          whole: 2,
          unit: { n: 1, d: 4 },
          truth: { n: 8, d: 1 },
          zedResult: { n: 1, d: 4 },
        },
      },
    },
  ],
};

/* ─────────── M6 — Central Command Grid (fractions as division) ─────────── */

const M6: L5MissionDef = {
  id: 6,
  name: "Central Command Grid",
  sector: "Sector 6 · Central Command Tower",
  focus: "Understanding every fraction as a hidden division",
  cases: [
    {
      id: "l5-m6-c1",
      caseNumber: "CASE FILE #601",
      visual: { kind: "bar", total: 4, selected: [0, 1, 2] },
      zedClaim: { numerator: 3, denominator: 4 },
      truth: { numerator: 3, denominator: 4 },
      corruptedField: "equivalence",
      conceptKey: "equivalence",
      explainPrompt:
        "Why is 3/4 the same as 3 ÷ 4 — what operation is hidden inside every fraction?",
      voiceInstructions:
        "Three power crystals must be shared equally between four reactors. Match 3/4 to its hidden division.",
      zedBriefing:
        "Three-fourths and three divided by four are TOTALLY different things… right, teacher?",
      l5: {
        mission: 6,
        spec: {
          frac: { n: 3, d: 4 },
          decoys: [
            { n: 4, d: 3 },
            { n: 3, d: 7 },
            { n: 1, d: 4 },
          ],
        },
      },
    },
    {
      id: "l5-m6-c2",
      caseNumber: "CASE FILE #605",
      visual: { kind: "bar", total: 5, selected: [0, 1] },
      zedClaim: { numerator: 2, denominator: 5 },
      truth: { numerator: 2, denominator: 5 },
      corruptedField: "equivalence",
      conceptKey: "equivalence",
      explainPrompt:
        "If 2 pizzas are shared among 5 robots, why is each share 2/5 of a pizza?",
      voiceInstructions:
        "Connect 2/5 to the division pathway and to the shared-pizza visual.",
      zedBriefing:
        "Two-fifths is a fraction. Two divided by five is a math problem. They can't be the same!",
      l5: {
        mission: 6,
        spec: {
          frac: { n: 2, d: 5 },
          decoys: [
            { n: 5, d: 2 },
            { n: 2, d: 7 },
            { n: 1, d: 5 },
          ],
        },
      },
    },
    {
      id: "l5-m6-c3",
      caseNumber: "CASE FILE #609",
      visual: { kind: "bar", total: 8, selected: [0, 1, 2, 3, 4] },
      zedClaim: { numerator: 5, denominator: 8 },
      truth: { numerator: 5, denominator: 8 },
      corruptedField: "equivalence",
      conceptKey: "equivalence",
      explainPrompt:
        "Why does writing a/b automatically mean dividing a by b?",
      voiceInstructions:
        "5 energy units shared between 8 cells = ? Match the fraction, division, and visual.",
      zedBriefing:
        "Fractions can't BE division. They're just numbers stacked on numbers!",
      l5: {
        mission: 6,
        spec: {
          frac: { n: 5, d: 8 },
          decoys: [
            { n: 8, d: 5 },
            { n: 5, d: 13 },
            { n: 3, d: 8 },
          ],
        },
      },
    },
  ],
};

export const LEVEL_5_MISSIONS: L5MissionDef[] = [M1, M2, M3, M4, M5, M6];
