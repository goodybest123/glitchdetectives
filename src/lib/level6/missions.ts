/**
 * Level 6 — Fraction Nexus. 7 missions × 3 cases (M7 is boss-summary placeholder).
 */

import type { L6MissionDef } from "./types";

const baseCase = (
  id: string,
  num: string,
  total: number,
  selected: number[],
  zed: { numerator: number; denominator: number },
  truth: { numerator: number; denominator: number },
) => ({
  id,
  caseNumber: num,
  visual: { kind: "bar" as const, total, selected },
  zedClaim: zed,
  truth,
  corruptedField: "operation" as const,
  conceptKey: "mixed-ops" as const,
});

/* ─────────── M1 — Fraction Division Reactor ─────────── */

const M1: L6MissionDef = {
  id: 1,
  name: "Fraction Division Reactor",
  sector: "Sector 1 · Energy Reactor Core",
  focus: "Dividing fractions",
  cases: [
    {
      ...baseCase("l6-m1-c1", "CASE FILE #701", 2, [0], { numerator: 1, denominator: 8 }, { numerator: 2, denominator: 1 }),
      explainPrompt: "Why can dividing by a fraction sometimes create a larger answer?",
      voiceInstructions: "How many one-quarter packets fit inside one-half? Count them visually, then repair the reactor.",
      zedBriefing: "One-half divided by one-quarter… I divided across and got one-eighth.",
      l6: { mission: 1, spec: { a: { n: 1, d: 2 }, b: { n: 1, d: 4 }, truth: { n: 2, d: 1 }, zedResult: { n: 1, d: 8 } } },
    },
    {
      ...baseCase("l6-m1-c2", "CASE FILE #705", 4, [0, 1, 2], { numerator: 3, denominator: 32 }, { numerator: 6, denominator: 1 }),
      explainPrompt: "What does '÷ 1/8' really ask — and why does the answer grow?",
      voiceInstructions: "Count how many one-eighth packets fit inside three-quarters. Each small packet is one unit of energy.",
      zedBriefing: "Three-quarters divided by one-eighth… I multiplied straight across and got three-thirty-secondths.",
      l6: { mission: 1, spec: { a: { n: 3, d: 4 }, b: { n: 1, d: 8 }, truth: { n: 6, d: 1 }, zedResult: { n: 3, d: 32 } } },
    },
    {
      ...baseCase("l6-m1-c3", "CASE FILE #709", 3, [0, 1], { numerator: 2, denominator: 18 }, { numerator: 4, denominator: 1 }),
      explainPrompt: "How is dividing by 1/6 the same as asking 'how many sixths fit?'",
      voiceInstructions: "How many one-sixth packets fit inside two-thirds?",
      zedBriefing: "Two-thirds divided by one-sixth… I just multiplied everything and got two-eighteenths.",
      l6: { mission: 1, spec: { a: { n: 2, d: 3 }, b: { n: 1, d: 6 }, truth: { n: 4, d: 1 }, zedResult: { n: 2, d: 18 } } },
    },
  ],
};

/* ─────────── M2 — Mixed Number Mechanics ─────────── */

const M2: L6MissionDef = {
  id: 2,
  name: "Mixed Number Mechanics",
  sector: "Sector 2 · Cargo Transport Bay",
  focus: "Operating on mixed numbers",
  cases: [
    {
      ...baseCase("l6-m2-c1", "CASE FILE #721", 4, [0, 1, 2], { numerator: 3, denominator: 4 }, { numerator: 17, denominator: 4 }),
      explainPrompt: "How are mixed numbers different from simple fractions?",
      voiceInstructions: "Combine one-and-one-half cargo crates with two-and-three-quarter crates. Match the fraction units, then regroup any extras into a full crate.",
      zedBriefing: "One-and-one-half plus two-and-three-quarters… I added the wholes and the fractions and got three-and-four-sixths.",
      l6: { mission: 2, spec: { op: "add", a: { whole: 1, n: 1, d: 2 }, b: { whole: 2, n: 3, d: 4 }, truth: { whole: 4, n: 1, d: 4 }, zedResult: { whole: 3, n: 4, d: 6 } } },
    },
    {
      ...baseCase("l6-m2-c2", "CASE FILE #725", 3, [0, 1], { numerator: 5, denominator: 5 }, { numerator: 17, denominator: 3 }),
      explainPrompt: "Why do we sometimes 'regroup' wholes when adding mixed numbers?",
      voiceInstructions: "Combine two-and-two-thirds and two-and-two-thirds. After matching units, regroup any complete wholes.",
      zedBriefing: "Two-and-two-thirds plus two-and-two-thirds… I just added everything and got four-and-four-thirds, but then I wrote five-fifths.",
      l6: { mission: 2, spec: { op: "add", a: { whole: 2, n: 2, d: 3 }, b: { whole: 2, n: 2, d: 3 }, truth: { whole: 5, n: 1, d: 3 }, zedResult: { whole: 5, n: 5, d: 5 } } },
    },
    {
      ...baseCase("l6-m2-c3", "CASE FILE #729", 4, [0, 1], { numerator: 1, denominator: 4 }, { numerator: 7, denominator: 4 }),
      explainPrompt: "When subtracting mixed numbers, why do we sometimes 'borrow' from a whole?",
      voiceInstructions: "From three-and-one-quarter crates, remove one-and-one-half. You may need to borrow a whole crate to subtract safely.",
      zedBriefing: "Three-and-one-quarter minus one-and-one-half… I subtracted everything separately and got one-and-one-quarter.",
      l6: { mission: 2, spec: { op: "subtract", a: { whole: 3, n: 1, d: 4 }, b: { whole: 1, n: 1, d: 2 }, truth: { whole: 1, n: 3, d: 4 }, zedResult: { whole: 1, n: 1, d: 4 } } },
    },
  ],
};

/* ─────────── M3 — Decimal Translator ─────────── */

const M3: L6MissionDef = {
  id: 3,
  name: "Decimal Translator",
  sector: "Sector 3 · Navigation Translation Bay",
  focus: "Converting fractions and decimals",
  cases: [
    {
      ...baseCase("l6-m3-c1", "CASE FILE #741", 2, [0], { numerator: 2, denominator: 10 }, { numerator: 1, denominator: 2 }),
      explainPrompt: "How can a fraction and decimal represent the same quantity?",
      voiceInstructions: "The navigation system says one-half equals zero-point-two. Shade the hundred grid to see the true decimal.",
      zedBriefing: "One-half equals zero-point-two… because there's a 2 on top, right?",
      l6: { mission: 3, spec: { frac: { n: 1, d: 2 }, truthDecimal: 0.5, zedDecimal: 0.2 } },
    },
    {
      ...baseCase("l6-m3-c2", "CASE FILE #745", 4, [0, 1, 2], { numerator: 34, denominator: 100 }, { numerator: 3, denominator: 4 }),
      explainPrompt: "When does dividing the numerator by the denominator give you the decimal?",
      voiceInstructions: "Convert three-quarters into a decimal by shading the hundred grid in groups of twenty-five.",
      zedBriefing: "Three-quarters equals zero-point-three-four… I just put both numbers together.",
      l6: { mission: 3, spec: { frac: { n: 3, d: 4 }, truthDecimal: 0.75, zedDecimal: 0.34 } },
    },
    {
      ...baseCase("l6-m3-c3", "CASE FILE #749", 5, [0], { numerator: 15, denominator: 100 }, { numerator: 1, denominator: 5 }),
      explainPrompt: "Why does 1/5 equal 0.2 and not 0.15?",
      voiceInstructions: "Translate one-fifth into a decimal. Split the hundred grid into five equal columns and shade one.",
      zedBriefing: "One-fifth must be zero-point-one-five… the digits are right there.",
      l6: { mission: 3, spec: { frac: { n: 1, d: 5 }, truthDecimal: 0.2, zedDecimal: 0.15 } },
    },
  ],
};

/* ─────────── M4 — Percentage Command Center ─────────── */

const M4: L6MissionDef = {
  id: 4,
  name: "Percentage Command Center",
  sector: "Sector 4 · City Reporting Tower",
  focus: "Converting fractions and percentages",
  cases: [
    {
      ...baseCase("l6-m4-c1", "CASE FILE #761", 4, [0], { numerator: 4, denominator: 100 }, { numerator: 25, denominator: 100 }),
      explainPrompt: "What does 'percent' actually mean?",
      voiceInstructions: "One-quarter as a percentage — slide the gauge until both visuals match. Percent means 'per hundred'.",
      zedBriefing: "One-quarter equals four percent… I used the 4 from the bottom.",
      l6: { mission: 4, spec: { frac: { n: 1, d: 4 }, truthPercent: 25, zedPercent: 4 } },
    },
    {
      ...baseCase("l6-m4-c2", "CASE FILE #765", 5, [0, 1, 2], { numerator: 35, denominator: 100 }, { numerator: 60, denominator: 100 }),
      explainPrompt: "Why does 3/5 equal 60% and not 35%?",
      voiceInstructions: "Three-fifths as a percent. Imagine the bar as 100 — how many shaded?",
      zedBriefing: "Three-fifths equals thirty-five percent… I put the digits together.",
      l6: { mission: 4, spec: { frac: { n: 3, d: 5 }, truthPercent: 60, zedPercent: 35 } },
    },
    {
      ...baseCase("l6-m4-c3", "CASE FILE #769", 10, [0, 1, 2, 3, 4, 5, 6], { numerator: 7, denominator: 100 }, { numerator: 70, denominator: 100 }),
      explainPrompt: "How is 7/10 the same as 70%?",
      voiceInstructions: "Seven-tenths as a percent. Shade seven of ten columns of ten in the hundred grid.",
      zedBriefing: "Seven-tenths is seven percent… same number, right?",
      l6: { mission: 4, spec: { frac: { n: 7, d: 10 }, truthPercent: 70, zedPercent: 7 } },
    },
  ],
};

/* ─────────── M5 — Nexus Translator (triple match) ─────────── */

const M5: L6MissionDef = {
  id: 5,
  name: "Nexus Translator",
  sector: "Sector 5 · Translation Portal Hub",
  focus: "Linking fractions, decimals, and percentages",
  cases: [
    {
      ...baseCase("l6-m5-c1", "CASE FILE #781", 2, [0], { numerator: 1, denominator: 2 }, { numerator: 1, denominator: 2 }),
      explainPrompt: "Why are these different representations describing the same amount?",
      voiceInstructions: "Connect the three portals: 1/2, 0.5, and 50%. Avoid the decoy portals that don't match.",
      zedBriefing: "1/2, 0.5, and 50%… these look totally different to me!",
      l6: {
        mission: 5,
        spec: {
          truth: { frac: { n: 1, d: 2 }, decimal: 0.5, percent: 50 },
          decoys: [
            { frac: { n: 1, d: 5 }, decimal: 0.2, percent: 20 },
            { frac: { n: 1, d: 4 }, decimal: 0.25, percent: 25 },
          ],
        },
      },
    },
    {
      ...baseCase("l6-m5-c2", "CASE FILE #785", 4, [0], { numerator: 1, denominator: 4 }, { numerator: 1, denominator: 4 }),
      explainPrompt: "Why is 1/4 the same quantity as 0.25 and 25%?",
      voiceInstructions: "Link the three portals that all describe one-quarter.",
      zedBriefing: "1/4 and 0.25 and 25%… they share zero digits, how can they match?",
      l6: {
        mission: 5,
        spec: {
          truth: { frac: { n: 1, d: 4 }, decimal: 0.25, percent: 25 },
          decoys: [
            { frac: { n: 1, d: 2 }, decimal: 0.5, percent: 50 },
            { frac: { n: 3, d: 4 }, decimal: 0.75, percent: 75 },
          ],
        },
      },
    },
    {
      ...baseCase("l6-m5-c3", "CASE FILE #789", 5, [0, 1, 2, 3], { numerator: 4, denominator: 5 }, { numerator: 4, denominator: 5 }),
      explainPrompt: "When might decimals or percentages be easier to compare than fractions?",
      voiceInstructions: "Link the three portals that all describe four-fifths.",
      zedBriefing: "4/5, 0.8, and 80%… surely the digits should match somewhere.",
      l6: {
        mission: 5,
        spec: {
          truth: { frac: { n: 4, d: 5 }, decimal: 0.8, percent: 80 },
          decoys: [
            { frac: { n: 4, d: 10 }, decimal: 0.4, percent: 40 },
            { frac: { n: 8, d: 100 }, decimal: 0.08, percent: 8 },
          ],
        },
      },
    },
  ],
};

/* ─────────── M6 — Multi-System Operations Lab ─────────── */

const M6: L6MissionDef = {
  id: 6,
  name: "Multi-System Operations Lab",
  sector: "Sector 6 · Integrated Systems Lab",
  focus: "Multi-step reasoning across representations",
  cases: [
    {
      ...baseCase("l6-m6-c1", "CASE FILE #801", 4, [0, 1, 2], { numerator: 2, denominator: 4 }, { numerator: 75, denominator: 100 }),
      explainPrompt: "Which representation was most useful at each step — and why?",
      voiceInstructions: "Add one-quarter and one-half. Convert the sum to a decimal. Then to a percent. Three connected systems, one quantity.",
      zedBriefing: "I added the tops and bottoms and got two-quarters… then I just left it.",
      l6: {
        mission: 6,
        spec: {
          step1: { kind: "add", a: { n: 1, d: 4 }, b: { n: 1, d: 2 }, truth: { n: 3, d: 4 } },
          step2: { kind: "toDecimal", truthDecimal: 0.75 },
          step3: { kind: "toPercent", truthPercent: 75 },
        },
      },
    },
    {
      ...baseCase("l6-m6-c2", "CASE FILE #805", 10, [0, 1, 2, 3, 4, 5], { numerator: 60, denominator: 100 }, { numerator: 60, denominator: 100 }),
      explainPrompt: "Why does the same quantity show up in every representation?",
      voiceInstructions: "Add two-fifths and one-fifth. Then translate to a decimal. Then to a percent. Each form helps a different system.",
      zedBriefing: "Two-fifths plus one-fifth… maybe just three-tenths? I'm not sure anymore.",
      l6: {
        mission: 6,
        spec: {
          step1: { kind: "add", a: { n: 2, d: 5 }, b: { n: 1, d: 5 }, truth: { n: 3, d: 5 } },
          step2: { kind: "toDecimal", truthDecimal: 0.6 },
          step3: { kind: "toPercent", truthPercent: 60 },
        },
      },
    },
    {
      ...baseCase("l6-m6-c3", "CASE FILE #809", 10, [0, 1, 2, 3, 4, 5, 6, 7, 8], { numerator: 90, denominator: 100 }, { numerator: 90, denominator: 100 }),
      explainPrompt: "When percentages are clearest, when are fractions clearer, and why?",
      voiceInstructions: "Combine seven-tenths and one-fifth. Convert to a decimal. Convert to a percent. Confirm the city dashboard reads correctly.",
      zedBriefing: "Seven-tenths plus one-fifth… I'm worried I'll mess this up.",
      l6: {
        mission: 6,
        spec: {
          step1: { kind: "add", a: { n: 7, d: 10 }, b: { n: 1, d: 5 }, truth: { n: 9, d: 10 } },
          step2: { kind: "toDecimal", truthDecimal: 0.9 },
          step3: { kind: "toPercent", truthPercent: 90 },
        },
      },
    },
  ],
};

/* ─────────── M7 — The Nexus Core (boss) ─────────── */

const M7: L6MissionDef = {
  id: 7,
  name: "The Nexus Core",
  sector: "Sector 7 · Nexus Core",
  focus: "Final integration of every mathematical language",
  cases: [
    {
      ...baseCase("l6-m7-c1", "CASE FILE #901", 1, [], { numerator: 0, denominator: 0 }, { numerator: 0, denominator: 0 }),
      explainPrompt: "Why do fractions, decimals, and percentages all exist together?",
      voiceInstructions: "The Nexus Core is failing. Chain repairs from every system to bring the city back online.",
      zedBriefing: "Every translation portal is dark. I don't know which language to speak first.",
      l6: { mission: 7, spec: { ref: "boss" } },
    },
  ],
};

export const LEVEL_6_MISSIONS: L6MissionDef[] = [M1, M2, M3, M4, M5, M6, M7];
