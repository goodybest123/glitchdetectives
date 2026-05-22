/**
 * Level 3 — Fraction Pathways & Equivalence City missions.
 * 4 missions x 3 cases each = 12 cases.
 *
 * Each case keeps the Level 2 `CaseDef` fields (so the ConversationPanel
 * and model-reasoning helpers Just Work) AND a `l3` payload that drives
 * the mission-specific workspace.
 */

import type { L3CaseDef, L3MissionDef } from "./types";

/* ─────────────────────────── Mission 1: Pathways ────────────────────── */
/* Fractions on number lines. ZED drops the cart at the wrong tick.       */

const M1: L3MissionDef = {
  id: 1,
  name: "Pathways District",
  sector: "Sector 1 · Pathway Navigation Grid",
  focus: "Fractions on a number line",
  cases: [
    {
      id: "l3-m1-c1",
      caseNumber: "CASE FILE #301",
      visual: { kind: "bar", total: 4, selected: [0, 1] },
      zedClaim: { numerator: 1, denominator: 2 },
      truth: { numerator: 1, denominator: 2 },
      corruptedField: "position",
      conceptKey: "number-line",
      explainPrompt: "How did you know where 1/2 belongs on the path?",
      voiceInstructions:
        "ZED parked the snack cart at the wrong stop. Drag the cart to where one-half really lives on the bridge.",
      zedBriefing:
        "I think one-half is way over here, near the end of the bridge… right, teacher?",
      l3: {
        mission: 1,
        spec: {
          min: 0,
          max: 1,
          ticks: 4,
          target: { n: 1, d: 2 },
          zedDropAt: 0.85,
          theme: "bridge",
          vehicle: "cart",
        },
      },
    },
    {
      id: "l3-m1-c2",
      caseNumber: "CASE FILE #305",
      visual: { kind: "bar", total: 3, selected: [0, 1] },
      zedClaim: { numerator: 2, denominator: 3 },
      truth: { numerator: 2, denominator: 3 },
      corruptedField: "position",
      conceptKey: "number-line",
      explainPrompt: "Why does 2/3 stop past the middle of the track?",
      voiceInstructions:
        "ZED placed the race car at the start. Drag it to where two-thirds belongs on the race track.",
      zedBriefing:
        "Two-thirds… maybe it's right at the start line? Numbers are tricky!",
      l3: {
        mission: 1,
        spec: {
          min: 0,
          max: 1,
          ticks: 3,
          target: { n: 2, d: 3 },
          zedDropAt: 0.1,
          theme: "track",
          vehicle: "racecar",
        },
      },
    },
    {
      id: "l3-m1-c3",
      caseNumber: "CASE FILE #309",
      visual: { kind: "bar", total: 8, selected: [0, 1, 2, 3, 4, 5] },
      zedClaim: { numerator: 3, denominator: 4 },
      truth: { numerator: 3, denominator: 4 },
      corruptedField: "position",
      conceptKey: "number-line",
      explainPrompt: "Where does 3/4 land between 0 and 1, and why?",
      voiceInstructions:
        "ZED dropped the treasure marker too early on the candy trail. Drag it to the right spot for three-fourths.",
      zedBriefing:
        "Three-fourths — that sounds small, so it probably goes near the beginning… right?",
      l3: {
        mission: 1,
        spec: {
          min: 0,
          max: 1,
          ticks: 4,
          target: { n: 3, d: 4 },
          zedDropAt: 0.18,
          theme: "trail",
          vehicle: "treasure",
        },
      },
    },
  ],
};

/* ──────────────────── Mission 2: Equivalence Reactor ────────────────── */

const M2: L3MissionDef = {
  id: 2,
  name: "Equivalence Energy Station",
  sector: "Sector 2 · Synchronization Chambers",
  focus: "Equivalent fractions",
  cases: [
    {
      id: "l3-m2-c1",
      caseNumber: "CASE FILE #321",
      visual: { kind: "pizza", total: 2, selected: [0] },
      zedClaim: { numerator: 1, denominator: 4 },
      truth: { numerator: 2, denominator: 4 },
      corruptedField: "equivalence",
      conceptKey: "equivalence",
      explainPrompt:
        "How can 1/2 and 2/4 cover the same amount when the numbers are different?",
      voiceInstructions:
        "Left reactor shows one-half of the pizza. Drag the matching card into the right reactor so the energy beam lights up.",
      zedBriefing:
        "These fractions look totally different to me… one-half and… something-fourths can't be the same, right?",
      l3: {
        mission: 2,
        spec: {
          left: { n: 1, d: 2, visual: "pizza" },
          rightDenominator: 4,
          rightVisual: "pizza",
          pool: [1, 2, 3],
          correctNumerator: 2,
          zedNumerator: 1,
        },
      },
    },
    {
      id: "l3-m2-c2",
      caseNumber: "CASE FILE #325",
      visual: { kind: "grid", total: 3, selected: [0], cols: 3 },
      zedClaim: { numerator: 3, denominator: 6 },
      truth: { numerator: 2, denominator: 6 },
      corruptedField: "equivalence",
      conceptKey: "equivalence",
      explainPrompt: "Why is 1/3 equal to 2/6 — what's the same?",
      voiceInstructions:
        "Left chamber shows one-third of the chocolate bar. Drag the card that fills the right chamber to the same amount in sixths.",
      zedBriefing:
        "If I cut the bar into more pieces, I take more pieces, right? So one-third = three-sixths?",
      l3: {
        mission: 2,
        spec: {
          left: { n: 1, d: 3, visual: "bar" },
          rightDenominator: 6,
          rightVisual: "bar",
          pool: [1, 2, 3, 4],
          correctNumerator: 2,
          zedNumerator: 3,
        },
      },
    },
    {
      id: "l3-m2-c3",
      caseNumber: "CASE FILE #329",
      visual: { kind: "grid", total: 4, selected: [0, 1, 2], cols: 2 },
      zedClaim: { numerator: 4, denominator: 8 },
      truth: { numerator: 6, denominator: 8 },
      corruptedField: "equivalence",
      conceptKey: "equivalence",
      explainPrompt: "How is 3/4 the same amount as 6/8?",
      voiceInstructions:
        "Left waffle shows three-fourths. Drag the card that makes the right waffle show the same shaded amount in eighths.",
      zedBriefing:
        "Three-fourths… so for eighths I just keep the top number, right? Four-eighths?",
      l3: {
        mission: 2,
        spec: {
          left: { n: 3, d: 4, visual: "waffle" },
          rightDenominator: 8,
          rightVisual: "waffle",
          pool: [3, 4, 5, 6, 7],
          correctNumerator: 6,
          zedNumerator: 4,
        },
      },
    },
  ],
};

/* ────────────────── Mission 3: Comparison Observatory ──────────────── */

const M3: L3MissionDef = {
  id: 3,
  name: "Comparison Observatory",
  sector: "Sector 3 · Magnitude Scanner",
  focus: "Comparing fractions",
  cases: [
    {
      id: "l3-m3-c1",
      caseNumber: "CASE FILE #341",
      visual: { kind: "bar", total: 4, selected: [0] },
      zedClaim: { numerator: 1, denominator: 4 },
      truth: { numerator: 1, denominator: 2 },
      corruptedField: "comparison",
      conceptKey: "comparison",
      explainPrompt: "Why is 1/2 bigger than 1/4 if 4 is bigger than 2?",
      voiceInstructions:
        "Compare the two juice bottles. Drag the right symbol — less than, equals, or greater than — between them.",
      zedBriefing:
        "One-fourth is bigger than one-half because four is bigger than two… right, teacher?",
      l3: {
        mission: 3,
        spec: {
          a: { n: 1, d: 4 },
          b: { n: 1, d: 2 },
          zedClaim: ">",
          truth: "<",
          object: "juice",
        },
      },
    },
    {
      id: "l3-m3-c2",
      caseNumber: "CASE FILE #345",
      visual: { kind: "bar", total: 6, selected: [0, 1] },
      zedClaim: { numerator: 2, denominator: 6 },
      truth: { numerator: 3, denominator: 6 },
      corruptedField: "comparison",
      conceptKey: "comparison",
      explainPrompt: "When the bottoms match, how do you spot the bigger one?",
      voiceInstructions:
        "Two robot batteries. Drag the correct symbol — less than, equals, or greater than — between them.",
      zedBriefing:
        "Two-sixths and three-sixths… same bottom number means they're equal, right?",
      l3: {
        mission: 3,
        spec: {
          a: { n: 2, d: 6 },
          b: { n: 3, d: 6 },
          zedClaim: "=",
          truth: "<",
          object: "battery",
        },
      },
    },
    {
      id: "l3-m3-c3",
      caseNumber: "CASE FILE #349",
      visual: { kind: "pizza", total: 3, selected: [0, 1] },
      zedClaim: { numerator: 2, denominator: 3 },
      truth: { numerator: 2, denominator: 3 },
      corruptedField: "comparison",
      conceptKey: "comparison",
      explainPrompt: "Two pizzas, same size. How do you tell which has more left?",
      voiceInstructions:
        "Two pizzas of the same size. Drag the correct symbol between them to compare.",
      zedBriefing:
        "Two-thirds and three-fourths… more pieces means more pizza, so three-fourths is bigger?",
      l3: {
        mission: 3,
        spec: {
          a: { n: 2, d: 3 },
          b: { n: 3, d: 4 },
          zedClaim: ">",
          truth: "<",
          object: "pizza",
        },
      },
    },
  ],
};

/* ─────────────────── Mission 4: Transformation Vault ────────────────── */

const M4: L3MissionDef = {
  id: 4,
  name: "Identity Vault",
  sector: "Sector 4 · Whole-Number Conversion",
  focus: "Whole numbers as fractions",
  cases: [
    {
      id: "l3-m4-c1",
      caseNumber: "CASE FILE #361",
      visual: { kind: "pizza", total: 4, selected: [0, 1, 2, 3] },
      zedClaim: { numerator: 1, denominator: 4 },
      truth: { numerator: 4, denominator: 4 },
      corruptedField: "whole",
      conceptKey: "whole-as-fraction",
      explainPrompt: "How can 4/4 mean the same as 1 whole pizza?",
      voiceInstructions:
        "One whole pizza is glowing in the vault. Drag the fraction card that shows the same amount.",
      zedBriefing:
        "A whole pizza can't be a fraction, can it? Fractions are only pieces… right?",
      l3: {
        mission: 4,
        spec: {
          whole: 1,
          piecesPerWhole: 4,
          zedClaim: { n: 1, d: 4 },
          truth: { n: 4, d: 4 },
          object: "pizza",
        },
      },
    },
    {
      id: "l3-m4-c2",
      caseNumber: "CASE FILE #365",
      visual: { kind: "set", total: 3, selected: [0, 1, 2], setIcon: "battery" },
      zedClaim: { numerator: 1, denominator: 3 },
      truth: { numerator: 3, denominator: 1 },
      corruptedField: "whole",
      conceptKey: "whole-as-fraction",
      explainPrompt: "How is 3/1 the same as 3 whole batteries?",
      voiceInstructions:
        "Three batteries are fully charged in the vault. Drag the fraction card that represents three whole batteries.",
      zedBriefing:
        "Three batteries… one-third? I always pick the smaller number for the bottom.",
      l3: {
        mission: 4,
        spec: {
          whole: 3,
          piecesPerWhole: 1,
          zedClaim: { n: 1, d: 3 },
          truth: { n: 3, d: 1 },
          object: "battery",
        },
      },
    },
    {
      id: "l3-m4-c3",
      caseNumber: "CASE FILE #369",
      visual: { kind: "set", total: 2, selected: [0, 1], setIcon: "gear" },
      zedClaim: { numerator: 2, denominator: 12 },
      truth: { numerator: 12, denominator: 6 },
      corruptedField: "whole",
      conceptKey: "whole-as-fraction",
      explainPrompt: "Two full snack packs of 6 — how is that 12/6?",
      voiceInstructions:
        "Two complete snack packs. Drag the fraction card that shows them as one fraction.",
      zedBriefing:
        "Two snack packs of six… so it's two-twelfths? Numbers are confusing!",
      l3: {
        mission: 4,
        spec: {
          whole: 2,
          piecesPerWhole: 6,
          zedClaim: { n: 2, d: 12 },
          truth: { n: 12, d: 6 },
          object: "snackpack",
        },
      },
    },
  ],
};

export const LEVEL_3_MISSIONS: L3MissionDef[] = [M1, M2, M3, M4];
