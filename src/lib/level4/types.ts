/**
 * Level 4 — Fraction Repair Systems shared types.
 * Builds on the Level 2 CaseDef so we can reuse InvestigationLayout,
 * the dialogue dock, ConversationPanel (Explain phase), TopBar, and
 * the speech queue. Level 4 adds an `l4` payload per case that drives
 * the mission-specific repair workspace.
 */

import type { CaseDef } from "@/lib/level2/types";

export type L4MissionId = 1 | 2 | 3 | 4 | 5 | 6;

export type L4Theme =
  | "pizza"
  | "fuel"
  | "candy"
  | "juice"
  | "battery"
  | "chocolate"
  | "snack"
  | "energy"
  | "treasure";

export type Frac = { n: number; d: number };

/** M1 — Add like fractions. */
export type AddLikeSpec = {
  a: Frac;
  b: Frac; // d must equal a.d
  truth: Frac; // (a.n + b.n) / a.d
  zedResult: Frac; // wrong answer ZED proposes
  theme: L4Theme;
};

/** M2 — Subtract like fractions. */
export type SubtractLikeSpec = {
  a: Frac; // minuend
  b: Frac; // subtrahend; d must equal a.d
  truth: Frac; // (a.n - b.n) / a.d
  zedResult: Frac;
  theme: L4Theme;
};

/** M3 — Denominator stability. */
export type StabilitySpec = {
  a: Frac;
  b: Frac;
  op: "+" | "-";
  truth: Frac; // true result
  trueDenominator: number; // = a.d
  /** Wrong denominator ZED tries to change to (e.g. 2*d, d^2). */
  zedDenominator: number;
  /** Options for the denominator dial. Must include trueDenominator. */
  options: number[];
  theme: L4Theme;
};

/** M4 — Equivalence generation. */
export type EquivSpec = {
  source: Frac; // e.g. 1/2
  targetDenominator: number; // e.g. 4
  multiplier: number; // = targetDenominator / source.d
  correctNumerator: number; // = source.n * multiplier
  zedNumerator: number; // wrong
  /** Numerator chips offered. */
  pool: number[];
  theme: L4Theme;
};

/** M5 — Simplification. */
export type SimplifySpec = {
  start: Frac; // e.g. 6/8
  simplest: Frac; // e.g. 3/4
  zedResult: Frac; // wrong reduction
  /** Divisors offered (must include gcd(start.n, start.d)). */
  divisors: number[];
  theme: L4Theme;
};

/** M6 — Mixed multi-step. */
export type MixedStep = {
  op: "+" | "-" | "simplify";
  a: Frac;
  b?: Frac; // omitted for simplify
  truth: Frac;
  /** ZED's wrong result for this step (used to highlight which step broke). */
  zedResult: Frac;
};

export type MixedSpec = {
  steps: MixedStep[];
  /** Pre-computed final answer (= last step's truth). */
  finalTruth: Frac;
  theme: L4Theme;
  description: string;
};

export type L4Payload =
  | { mission: 1; spec: AddLikeSpec }
  | { mission: 2; spec: SubtractLikeSpec }
  | { mission: 3; spec: StabilitySpec }
  | { mission: 4; spec: EquivSpec }
  | { mission: 5; spec: SimplifySpec }
  | { mission: 6; spec: MixedSpec };

export type L4CaseDef = CaseDef & { l4: L4Payload };

export type L4MissionDef = {
  id: L4MissionId;
  name: string;
  sector: string;
  focus: string;
  cases: L4CaseDef[];
};

export type L4Phase =
  | "briefing"
  | "glitch-check"
  | "repair"
  | "explain"
  | "feedback"
  | "caseDone";
