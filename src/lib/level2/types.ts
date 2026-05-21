/**
 * Level 2 — Fraction Discovery Zone shared types.
 * Data-driven so we can add cases without writing new components.
 */

export type VisualKind = "bar" | "circle" | "grid" | "set";

export type FractionVisualSpec = {
  kind: VisualKind;
  /** Total equal parts (or total objects for "set"). */
  total: number;
  /** Indices (0-based) of the parts/objects that are selected/highlighted. */
  selected: number[];
  /** Columns for grid layout (defaults: grid=4, set=auto). */
  cols?: number;
  /** Optional object icon name for "set" visual. */
  setIcon?: "crystal" | "gear" | "battery" | "capsule";
};

export type FractionPair = { numerator: number; denominator: number };

export type CorruptedField =
  | "numerator"     // M1: numerator is wrong
  | "denominator"  // M2: denominator is wrong
  | "sort"          // M3: sorting mistake (unit vs non-unit)
  | "set";          // M4: full fraction from set

export type ConceptKey =
  | "numerator"
  | "denominator"
  | "unit-fraction"
  | "fraction-of-set";

export type CaseDef = {
  id: string;                   // "m1-c2"
  caseNumber: string;           // "CASE FILE #204"
  visual: FractionVisualSpec;
  zedClaim: FractionPair;
  truth: FractionPair;
  corruptedField: CorruptedField;
  conceptKey: ConceptKey;
  explainPrompt: string;
  hints: [string, string, string];
  voiceInstructions: string;
  zedBriefing: string;
  warning: string;              // System warning text on left pane
};

export type Mission2Id = 1 | 2 | 3 | 4;

export type Mission2Def = {
  id: Mission2Id;
  name: string;
  sector: string;               // e.g. "Numerator Control Room"
  focus: string;
  cases: CaseDef[];
};

export type CasePhase =
  | "briefing"
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

/** M3 sorting card. */
export type SortCard = {
  id: string;
  numerator: number;
  denominator: number;
  /** Where ZED-4 pre-sorted it (the wrong half of the cards). */
  zedBucket: "unit" | "non-unit";
};
