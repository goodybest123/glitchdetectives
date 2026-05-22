/**
 * Level 2 — Fraction Discovery Zone shared types.
 */

export type VisualKind = "bar" | "circle" | "grid" | "set" | "pizza";

export type FractionVisualSpec = {
  kind: VisualKind;
  total: number;
  selected: number[];
  cols?: number;
  setIcon?: "crystal" | "gear" | "battery" | "capsule";
};

export type FractionPair = { numerator: number; denominator: number };

export type CorruptedField =
  | "numerator"
  | "denominator"
  | "sort"
  | "set"
  | "position"
  | "equivalence"
  | "comparison"
  | "whole";

export type ConceptKey =
  | "numerator"
  | "denominator"
  | "unit-fraction"
  | "fraction-of-set"
  | "number-line"
  | "equivalence"
  | "comparison"
  | "whole-as-fraction";

export type CaseDef = {
  id: string;
  caseNumber: string;
  visual: FractionVisualSpec;
  zedClaim: FractionPair;
  truth: FractionPair;
  corruptedField: CorruptedField;
  conceptKey: ConceptKey;
  explainPrompt: string;
  hints?: [string, string, string];
  voiceInstructions: string;
  zedBriefing: string;
  warning?: string;
};

export type Mission2Id = 1 | 2 | 3 | 4;

export type Mission2Def = {
  id: Mission2Id;
  name: string;
  sector: string;
  focus: string;
  cases: CaseDef[];
};

export type CasePhase =
  | "briefing"
  | "glitch-check"
  | "detect"
  | "repair"
  | "explain"
  | "feedback"
  | "caseDone";

export type RepairStats = {
  reasoningScore: number;
  repairAttempts: number;
  hintsUsed: number;
};

export type SortCard = {
  id: string;
  numerator: number;
  denominator: number;
  zedBucket: "unit" | "non-unit";
};
