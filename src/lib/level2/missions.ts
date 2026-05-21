import type { Mission2Def, SortCard } from "./types";

/* ------------------------------ Mission 1 -------------------------------- */
/* Numerator Control Room — top number. */

const M1: Mission2Def = {
  id: 1,
  name: "Numerator Control Room",
  sector: "Sector 1 · Selected-Part Analysis",
  focus: "Numerator = selected parts",
  cases: [
    {
      id: "m1-c1",
      caseNumber: "CASE FILE #201",
      visual: { kind: "pizza", total: 4, selected: [0, 1, 2] },
      zedClaim: { numerator: 1, denominator: 4 },
      truth: { numerator: 3, denominator: 4 },
      corruptedField: "numerator",
      conceptKey: "numerator",
      explainPrompt: "How did you know what the top number should be?",
      voiceInstructions: "Look at the pizza. How many slices have toppings?",
      zedBriefing: "Hmm… I think one slice has toppings? So it's one out of four?",
    },
    {
      id: "m1-c2",
      caseNumber: "CASE FILE #204",
      visual: { kind: "circle", total: 6, selected: [0, 1] },
      zedClaim: { numerator: 4, denominator: 6 },
      truth: { numerator: 2, denominator: 6 },
      corruptedField: "numerator",
      conceptKey: "numerator",
      explainPrompt: "Why is the top number NOT 4 here?",
      voiceInstructions: "Count the glowing slices.",
      zedBriefing: "Maybe four-sixths? I'm not sure, teacher.",
    },
    {
      id: "m1-c3",
      caseNumber: "CASE FILE #207",
      visual: { kind: "grid", total: 8, selected: [0, 1, 2, 3, 4], cols: 4 },
      zedClaim: { numerator: 3, denominator: 8 },
      truth: { numerator: 5, denominator: 8 },
      corruptedField: "numerator",
      conceptKey: "numerator",
      explainPrompt: "What does the top number tell us?",
      voiceInstructions: "Count the lit cells.",
      zedBriefing: "I read three-eighths… does that look right?",
    },
    {
      id: "m1-c4",
      caseNumber: "CASE FILE #212",
      visual: { kind: "bar", total: 5, selected: [0, 1, 2, 3] },
      zedClaim: { numerator: 5, denominator: 5 },
      truth: { numerator: 4, denominator: 5 },
      corruptedField: "numerator",
      conceptKey: "numerator",
      explainPrompt: "Why isn't this five-fifths?",
      voiceInstructions: "Look — is every part lit?",
      zedBriefing: "Five-fifths! All lit up… right?",
    },
  ],
};

/* ------------------------------ Mission 2 -------------------------------- */

const M2: Mission2Def = {
  id: 2,
  name: "Denominator Repair Station",
  sector: "Sector 2 · Whole-Structure Analysis",
  focus: "Denominator = total equal parts",
  cases: [
    {
      id: "m2-c1",
      caseNumber: "CASE FILE #221",
      visual: { kind: "pizza", total: 4, selected: [0, 1] },
      zedClaim: { numerator: 2, denominator: 3 },
      truth: { numerator: 2, denominator: 4 },
      corruptedField: "denominator",
      conceptKey: "denominator",
      explainPrompt: "How many equal slices is the whole pizza cut into?",
      voiceInstructions: "Count every slice — even the empty ones.",
      zedBriefing: "Two slices have toppings… so it's two-thirds?",
    },
    {
      id: "m2-c2",
      caseNumber: "CASE FILE #225",
      visual: { kind: "circle", total: 6, selected: [0, 1, 2] },
      zedClaim: { numerator: 3, denominator: 8 },
      truth: { numerator: 3, denominator: 6 },
      corruptedField: "denominator",
      conceptKey: "denominator",
      explainPrompt: "What does the bottom number tell us?",
      voiceInstructions: "Count every slice in the whole circle.",
      zedBriefing: "Three of… eight? Or more?",
    },
    {
      id: "m2-c3",
      caseNumber: "CASE FILE #229",
      visual: { kind: "grid", total: 6, selected: [0, 1], cols: 3 },
      zedClaim: { numerator: 2, denominator: 4 },
      truth: { numerator: 2, denominator: 6 },
      corruptedField: "denominator",
      conceptKey: "denominator",
      explainPrompt: "Why does the bottom number equal 6 here?",
      voiceInstructions: "Count every cell.",
      zedBriefing: "Two-fourths? I lost track of the squares.",
    },
    {
      id: "m2-c4",
      caseNumber: "CASE FILE #234",
      visual: { kind: "bar", total: 8, selected: [0, 1, 2] },
      zedClaim: { numerator: 3, denominator: 5 },
      truth: { numerator: 3, denominator: 8 },
      corruptedField: "denominator",
      conceptKey: "denominator",
      explainPrompt: "How is the bottom number different from the top?",
      voiceInstructions: "Count all the equal parts.",
      zedBriefing: "Three out of five… is that right?",
    },
  ],
};

/* ------------------------------ Mission 3 -------------------------------- */

const M3_CARDS: SortCard[] = [
  { id: "c1", numerator: 1, denominator: 2, zedBucket: "non-unit" },
  { id: "c2", numerator: 2, denominator: 3, zedBucket: "unit" },
  { id: "c3", numerator: 1, denominator: 8, zedBucket: "non-unit" },
  { id: "c4", numerator: 3, denominator: 4, zedBucket: "unit" },
  { id: "c5", numerator: 1, denominator: 5, zedBucket: "non-unit" },
  { id: "c6", numerator: 5, denominator: 6, zedBucket: "unit" },
];

const M3: Mission2Def = {
  id: 3,
  name: "Unit Fraction Scanner",
  sector: "Sector 3 · Classification Chamber",
  focus: "Unit vs non-unit fractions",
  cases: [
    {
      id: "m3-c1",
      caseNumber: "CASE FILE #301 — Sorting Run",
      visual: { kind: "bar", total: 6, selected: [0] },
      zedClaim: { numerator: 0, denominator: 0 },
      truth: { numerator: 0, denominator: 0 },
      corruptedField: "sort",
      conceptKey: "unit-fraction",
      explainPrompt: "What makes a fraction a unit fraction?",
      voiceInstructions: "Sort each fraction into the unit or non-unit chamber.",
      zedBriefing: "I sorted these — but I get confused when the top number changes.",
    },
  ],
};

/* ------------------------------ Mission 4 -------------------------------- */

const M4: Mission2Def = {
  id: 4,
  name: "Fraction Collection Vault",
  sector: "Sector 4 · Object Collection Bay",
  focus: "Fractions of a set",
  cases: [
    {
      id: "m4-c1",
      caseNumber: "CASE FILE #401",
      visual: { kind: "set", total: 8, selected: [0, 1, 2], setIcon: "crystal" },
      zedClaim: { numerator: 3, denominator: 5 },
      truth: { numerator: 3, denominator: 8 },
      corruptedField: "set",
      conceptKey: "fraction-of-set",
      explainPrompt: "Why does the bottom number match the total number of crystals?",
      voiceInstructions: "Count the glowing crystals and the total, then build the fraction.",
      zedBriefing: "Three glow… is it three-fifths?",
    },
    {
      id: "m4-c2",
      caseNumber: "CASE FILE #404",
      visual: { kind: "set", total: 6, selected: [0, 1, 2, 3], setIcon: "gear" },
      zedClaim: { numerator: 2, denominator: 6 },
      truth: { numerator: 4, denominator: 6 },
      corruptedField: "set",
      conceptKey: "fraction-of-set",
      explainPrompt: "How did you decide the top number?",
      voiceInstructions: "Count the glowing gears.",
      zedBriefing: "Two of six? That doesn't feel right…",
    },
    {
      id: "m4-c3",
      caseNumber: "CASE FILE #408",
      visual: {
        kind: "set",
        total: 10,
        selected: [0, 1, 2, 3, 4, 5, 6],
        setIcon: "battery",
      },
      zedClaim: { numerator: 7, denominator: 8 },
      truth: { numerator: 7, denominator: 10 },
      corruptedField: "set",
      conceptKey: "fraction-of-set",
      explainPrompt: "What did you check first — the total or the glowing ones?",
      voiceInstructions: "Count every battery, then count the charged ones.",
      zedBriefing: "Seven-eighths? My scanner skipped some…",
    },
    {
      id: "m4-c4",
      caseNumber: "CASE FILE #412",
      visual: {
        kind: "set",
        total: 9,
        selected: [0, 1, 2, 3, 4],
        setIcon: "capsule",
      },
      zedClaim: { numerator: 4, denominator: 9 },
      truth: { numerator: 5, denominator: 9 },
      corruptedField: "set",
      conceptKey: "fraction-of-set",
      explainPrompt: "How are fractions of a set like fractions of a shape?",
      voiceInstructions: "Build the fraction from the glowing capsules.",
      zedBriefing: "Four-ninths? Let me check again…",
    },
  ],
};

export const LEVEL_2_MISSIONS: Mission2Def[] = [M1, M2, M3, M4];

export const MISSION_3_CARDS = M3_CARDS;
