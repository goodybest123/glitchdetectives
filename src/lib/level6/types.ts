/**
 * Level 6 — Fraction Nexus shared types.
 * Mirrors Level 5: extends Level 2 CaseDef with an `l6` payload
 * driving the mission-specific Nexus workspaces.
 */

import type { CaseDef } from "@/lib/level2/types";

export type L6MissionId = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type Frac = { n: number; d: number };
export type Mixed = { whole: number; n: number; d: number };

/** M1 — Divide fractions. (a/b ÷ c/d) */
export type DivideFracSpec = {
  a: Frac;
  b: Frac;
  truth: Frac; // (a.n*b.d) / (a.d*b.n)
  zedResult: Frac;
};

/** M2 — Add/subtract mixed numbers. */
export type MixedOpSpec = {
  op: "add" | "subtract";
  a: Mixed;
  b: Mixed;
  truth: Mixed;
  zedResult: Mixed;
};

/** M3 — Fraction ↔ Decimal. */
export type FracDecimalSpec = {
  frac: Frac; // canonical fraction (e.g. 1/2)
  truthDecimal: number; // 0.5
  zedDecimal: number; // 0.2
};

/** M4 — Fraction ↔ Percent. */
export type FracPercentSpec = {
  frac: Frac; // canonical fraction (e.g. 1/4)
  truthPercent: number; // 25
  zedPercent: number; // 4
};

/** M5 — Triple match: fraction / decimal / percent. */
export type TripleMatchSpec = {
  truth: { frac: Frac; decimal: number; percent: number };
  decoys: { frac: Frac; decimal: number; percent: number }[];
};

/** M6 — Multi-step pipeline. */
export type MultiStepSpec = {
  step1: { kind: "add"; a: Frac; b: Frac; truth: Frac };
  step2: { kind: "toDecimal"; truthDecimal: number };
  step3: { kind: "toPercent"; truthPercent: number };
};

export type L6Payload =
  | { mission: 1; spec: DivideFracSpec }
  | { mission: 2; spec: MixedOpSpec }
  | { mission: 3; spec: FracDecimalSpec }
  | { mission: 4; spec: FracPercentSpec }
  | { mission: 5; spec: TripleMatchSpec }
  | { mission: 6; spec: MultiStepSpec }
  | { mission: 7; spec: { ref: string } };

export type L6CaseDef = CaseDef & { l6: L6Payload };

export type L6MissionDef = {
  id: L6MissionId;
  name: string;
  sector: string;
  focus: string;
  cases: L6CaseDef[];
};

export type L6Phase =
  | "briefing"
  | "glitch-check"
  | "repair"
  | "explain"
  | "feedback"
  | "caseDone";
