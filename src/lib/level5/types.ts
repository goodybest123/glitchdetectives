/**
 * Level 5 — Fraction Power Grid shared types.
 * Mirrors Level 4: builds on the Level 2 CaseDef so we reuse
 * InvestigationLayout, ExplainPanel, DialogueDock, TopBar.
 * Level 5 adds an `l5` payload per case driving the mission workspace.
 */

import type { CaseDef } from "@/lib/level2/types";

export type L5MissionId = 1 | 2 | 3 | 4 | 5 | 6;

export type Frac = { n: number; d: number };

/** M1 — Add unlike fractions. */
export type AddUnlikeSpec = {
  a: Frac;
  b: Frac;
  lcd: number; // least common denominator
  truth: Frac; // (a.n*lcd/a.d + b.n*lcd/b.d) / lcd
  zedResult: Frac; // wrong: e.g. (a.n+b.n)/(a.d+b.d)
};

/** M2 — Subtract unlike fractions. */
export type SubtractUnlikeSpec = {
  a: Frac; // minuend
  b: Frac; // subtrahend
  lcd: number;
  truth: Frac;
  zedResult: Frac;
};

/** M3 — Multiply fractions (part of a part). */
export type MultiplyFracSpec = {
  a: Frac; // rows
  b: Frac; // cols
  truth: Frac; // (a.n*b.n)/(a.d*b.d)
  zedResult: Frac;
};

/** M4 — Multiply fraction by whole. */
export type MultiplyWholeSpec = {
  whole: number;
  frac: Frac; // unit-ish, e.g. 1/4
  truth: Frac; // (whole*frac.n)/frac.d
  zedResult: Frac;
};

/** M5 — Divide a unit fraction by a whole, or whole by unit fraction. */
export type DivideSpec =
  | {
      kind: "unitByWhole"; // 1/d ÷ k = 1/(d*k)
      unit: Frac; // n must = 1
      divisor: number;
      truth: Frac;
      zedResult: Frac;
    }
  | {
      kind: "wholeByUnit"; // W ÷ 1/d = W*d
      whole: number;
      unit: Frac; // n must = 1
      truth: Frac; // whole result expressed as n/1
      zedResult: Frac;
    };

/** M6 — Fractions as division. a/b = a ÷ b */
export type FractionAsDivisionSpec = {
  frac: Frac; // e.g. 3/4
  /** Decoy fractions on the board the child must NOT match. */
  decoys: Frac[];
};

export type L5Payload =
  | { mission: 1; spec: AddUnlikeSpec }
  | { mission: 2; spec: SubtractUnlikeSpec }
  | { mission: 3; spec: MultiplyFracSpec }
  | { mission: 4; spec: MultiplyWholeSpec }
  | { mission: 5; spec: DivideSpec }
  | { mission: 6; spec: FractionAsDivisionSpec };

export type L5CaseDef = CaseDef & { l5: L5Payload };

export type L5MissionDef = {
  id: L5MissionId;
  name: string;
  sector: string;
  focus: string;
  cases: L5CaseDef[];
};

export type L5Phase =
  | "briefing"
  | "glitch-check"
  | "repair"
  | "explain"
  | "feedback"
  | "caseDone";
