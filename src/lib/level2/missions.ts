import type { Mission2Def, SortCard } from "./types";

/* ------------------------------ Mission 1 -------------------------------- */
/* Numerator Control Room — numerator is wrong, child repairs top number. */

const M1: Mission2Def = {
  id: 1,
  name: "Numerator Control Room",
  sector: "Sector 1 · Selected-Part Analysis",
  focus: "Numerator = selected parts",
  cases: [
    {
      id: "m1-c1",
      caseNumber: "CASE FILE #201",
      visual: { kind: "bar", total: 4, selected: [0, 1, 2] },
      zedClaim: { numerator: 1, denominator: 4 },
      truth: { numerator: 3, denominator: 4 },
      corruptedField: "numerator",
      conceptKey: "numerator",
      explainPrompt: "How did you know what the top number should be?",
      hints: [
        "Count only the parts that are LIT UP.",
        "The numerator is how many parts are selected — not the total.",
        "Three parts glow, so the top number is 3.",
      ],
      voiceInstructions:
        "Count how many parts are selected and repair the numerator.",
      zedBriefing: "I scanned this bar… I think it's one-fourth?",
      warning: "Numerator mismatch detected.",
    },
    {
      id: "m1-c2",
      caseNumber: "CASE FILE #204",
      visual: { kind: "circle", total: 6, selected: [0, 1] },
      zedClaim: { numerator: 4, denominator: 6 },
      truth: { numerator: 2, denominator: 6 },
      corruptedField: "numerator",
      conceptKey: "numerator",
      explainPrompt: "Why is the numerator NOT 4 here?",
      hints: [
        "Look at the GLOWING slices only.",
        "Only the highlighted slices count for the top number.",
        "Two slices glow, so the numerator is 2.",
      ],
      voiceInstructions: "Count the glowing slices and repair the top number.",
      zedBriefing: "Hmm… maybe four-sixths? I'm not sure.",
      warning: "Selected-part count mismatch.",
    },
    {
      id: "m1-c3",
      caseNumber: "CASE FILE #207",
      visual: { kind: "grid", total: 8, selected: [0, 1, 2, 3, 4], cols: 4 },
      zedClaim: { numerator: 3, denominator: 8 },
      truth: { numerator: 5, denominator: 8 },
      corruptedField: "numerator",
      conceptKey: "numerator",
      explainPrompt: "How is the top number related to the lit cells?",
      hints: [
        "Tap each lit cell and count.",
        "The numerator counts ONLY the lit cells.",
        "Five cells are lit, so the numerator is 5.",
      ],
      voiceInstructions: "Tap the lit cells, then repair the numerator.",
      zedBriefing: "I read three-eighths… does that look right, teacher?",
      warning: "Lit-cell count corruption.",
    },
    {
      id: "m1-c4",
      caseNumber: "CASE FILE #212",
      visual: { kind: "bar", total: 5, selected: [0, 1, 2, 3] },
      zedClaim: { numerator: 5, denominator: 5 },
      truth: { numerator: 4, denominator: 5 },
      corruptedField: "numerator",
      conceptKey: "numerator",
      explainPrompt: "Why isn't this five-fifths even though there are 5 parts?",
      hints: [
        "Five-fifths would mean ALL parts are lit. Are they?",
        "Count just the lit parts.",
        "Four parts are lit out of five.",
      ],
      voiceInstructions: "Count the lit parts and fix the numerator.",
      zedBriefing: "Five-fifths! All lit up… right?",
      warning: "Over-count detected.",
    },
  ],
};

/* ------------------------------ Mission 2 -------------------------------- */
/* Denominator Repair Station — denominator is wrong. */

const M2: Mission2Def = {
  id: 2,
  name: "Denominator Repair Station",
  sector: "Sector 2 · Whole-Structure Analysis",
  focus: "Denominator = total equal parts",
  cases: [
    {
      id: "m2-c1",
      caseNumber: "CASE FILE #221",
      visual: { kind: "bar", total: 4, selected: [0, 1] },
      zedClaim: { numerator: 2, denominator: 3 },
      truth: { numerator: 2, denominator: 4 },
      corruptedField: "denominator",
      conceptKey: "denominator",
      explainPrompt: "Why count EVERY part, even the dark ones?",
      hints: [
        "Count ALL the equal parts in the whole shape.",
        "Dark parts still count for the denominator.",
        "The bar has 4 equal parts, so the bottom number is 4.",
      ],
      voiceInstructions:
        "Count every equal part and repair the denominator.",
      zedBriefing: "Two parts are lit… so it's two-thirds?",
      warning: "Denominator under-count.",
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
      hints: [
        "Count every slice in the whole circle.",
        "The denominator = total equal parts.",
        "Six slices total, so the bottom number is 6.",
      ],
      voiceInstructions:
        "Count all slices in the whole and repair the denominator.",
      zedBriefing: "I think three-eighths… or maybe more?",
      warning: "Whole-structure mismatch.",
    },
    {
      id: "m2-c3",
      caseNumber: "CASE FILE #229",
      visual: { kind: "grid", total: 6, selected: [0, 1], cols: 3 },
      zedClaim: { numerator: 2, denominator: 4 },
      truth: { numerator: 2, denominator: 6 },
      corruptedField: "denominator",
      conceptKey: "denominator",
      explainPrompt: "Why does the denominator equal 6 here?",
      hints: [
        "Count every cell in the grid, lit or not.",
        "All equal parts count for the bottom number.",
        "There are 6 cells total.",
      ],
      voiceInstructions: "Count every cell and fix the denominator.",
      zedBriefing: "Two-fourths? I lost track of the squares.",
      warning: "Cell total off.",
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
      hints: [
        "The bottom counts ALL parts. The top counts only lit parts.",
        "Count slowly. How many sections are in the whole bar?",
        "Eight equal parts total.",
      ],
      voiceInstructions: "Count all parts and repair the denominator.",
      zedBriefing: "Three out of five… is that right?",
      warning: "Total-parts corruption.",
    },
  ],
};

/* ------------------------------ Mission 3 -------------------------------- */
/* Unit Fraction Scanner — child sorts cards into UNIT vs NON-UNIT. */

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
      visual: { kind: "bar", total: 6, selected: [0] }, // representative
      zedClaim: { numerator: 0, denominator: 0 },
      truth: { numerator: 0, denominator: 0 },
      corruptedField: "sort",
      conceptKey: "unit-fraction",
      explainPrompt: "What makes a fraction a UNIT fraction?",
      hints: [
        "Look at the top number. Unit fractions have a 1 on top.",
        "If the numerator is 1, it goes in the UNIT chamber.",
        "Anything else (2/3, 3/4, 5/6) is NON-UNIT.",
      ],
      voiceInstructions:
        "Sort each fraction into the unit or non-unit chamber.",
      zedBriefing:
        "I sorted these — but I get confused when the top number changes.",
      warning: "Classification scanner mis-sorted 6 fractions.",
    },
  ],
};

/* ------------------------------ Mission 4 -------------------------------- */
/* Fraction Collection Vault — fractions of sets. */

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
      explainPrompt:
        "Why does the bottom number match the total number of crystals?",
      hints: [
        "Count ALL the crystals in the vault for the bottom number.",
        "Count only the glowing crystals for the top number.",
        "3 glow out of 8 total, so the fraction is 3/8.",
      ],
      voiceInstructions:
        "Count the glowing crystals and the total, then build the fraction.",
      zedBriefing: "Three glow… is it three-fifths?",
      warning: "Set-fraction misread.",
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
      hints: [
        "Tap each glowing gear to count it.",
        "Top number = active gears.",
        "Four gears glow, so the numerator is 4.",
      ],
      voiceInstructions: "Count active gears and build the fraction.",
      zedBriefing: "Two of six? That doesn't feel right…",
      warning: "Active-count misread.",
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
      explainPrompt: "What did you check first — the total or the selected?",
      hints: [
        "Recount EVERY battery in the vault.",
        "There are 10 batteries total.",
        "7 are charged out of 10, so the fraction is 7/10.",
      ],
      voiceInstructions: "Count every battery, then count the charged ones.",
      zedBriefing: "Seven-eighths? My scanner skipped some…",
      warning: "Vault total miscounted.",
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
      explainPrompt:
        "How are fractions of a SET like fractions of a shape?",
      hints: [
        "Each object is one equal part of the whole set.",
        "Count active capsules for the top number.",
        "Five capsules glow out of nine total.",
      ],
      voiceInstructions: "Build the fraction from the glowing capsules.",
      zedBriefing: "Four-ninths? Let me check again…",
      warning: "Active-capsule misread.",
    },
  ],
};

export const LEVEL_2_MISSIONS: Mission2Def[] = [M1, M2, M3, M4];

export const MISSION_3_CARDS = M3_CARDS;
