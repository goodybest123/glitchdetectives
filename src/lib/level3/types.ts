/**
 * Level 3 — Fraction Pathways & Equivalence City shared types.
 * Builds on the Level 2 CaseDef so we can reuse InvestigationLayout,
 * the dialogue dock, ConversationPanel (Explain phase), TopBar, and
 * the speech queue. Level 3 adds a `l3` payload per case that carries
 * mission-specific spec data the workspace components need.
 */

import type { CaseDef } from "@/lib/level2/types";

export type L3MissionId = 1 | 2 | 3 | 4;

export type PathwayTheme = "bridge" | "track" | "trail";

export type NumberLineSpec = {
  /** Lower bound (always 0 in this level). */
  min: 0;
  /** Upper bound; 1 for most cases, 2 for "past one whole" cases. */
  max: 1 | 2;
  /** Denominator of the visible grid (e.g. 4 → ticks at 0, 1/4, 2/4, 3/4, 1). */
  ticks: number;
  /** The correct fraction (in numerator/denominator form). */
  target: { n: number; d: number };
  /** Where ZED dropped the cart (0..max, normalized). */
  zedDropAt: number;
  /** Visual theme for the rail. */
  theme: PathwayTheme;
  /** Cart label (snack cart, race car, delivery drone, etc.). */
  vehicle: "cart" | "drone" | "racecar" | "treasure";
};

export type EquivalenceVisualKind = "pizza" | "waffle" | "bar" | "battery";

export type EquivalenceSpec = {
  /** Fixed reference fraction shown in the left chamber. */
  left: { n: number; d: number; visual: EquivalenceVisualKind };
  /** Chamber the child fills — same visual kind, denominator only shown. */
  rightDenominator: number;
  rightVisual: EquivalenceVisualKind;
  /** Cards offered in the pool (numerator-only choices). */
  pool: number[];
  /** Correct numerator for the rightDenominator. */
  correctNumerator: number;
  /** What ZED guessed (wrong). */
  zedNumerator: number;
};

export type CompareObject =
  | "juice"
  | "battery"
  | "fueltank"
  | "candyjar"
  | "pizza";

export type CompareOp = "<" | "=" | ">";

export type ComparisonSpec = {
  a: { n: number; d: number };
  b: { n: number; d: number };
  /** ZED's wrong (or right) operator claim. */
  zedClaim: CompareOp;
  /** The true relationship. */
  truth: CompareOp;
  object: CompareObject;
};

export type WholeObject = "pizza" | "chest" | "snackpack" | "battery";

export type WholeSpec = {
  /** How many wholes the picture shows (1, 2, or 3). */
  whole: number;
  /** Equal pieces per whole when re-segmented. */
  piecesPerWhole: number;
  /** ZED's wrong fraction claim for the picture. */
  zedClaim: { n: number; d: number };
  /** Correct fraction representation of the whole(s). */
  truth: { n: number; d: number };
  object: WholeObject;
};

/** Concrete payload carried by every Level 3 case. */
export type L3Payload =
  | { mission: 1; spec: NumberLineSpec }
  | { mission: 2; spec: EquivalenceSpec }
  | { mission: 3; spec: ComparisonSpec }
  | { mission: 4; spec: WholeSpec };

/**
 * Level 3 case = Level 2 case shape + `l3` payload.
 * `zedClaim`, `truth`, `visual` on the base CaseDef are still set
 * (with sensible fraction stand-ins) so existing helpers — the
 * ConversationPanel context builder, the model-reasoning lookup —
 * keep working without further plumbing.
 */
export type L3CaseDef = CaseDef & { l3: L3Payload };

export type L3MissionDef = {
  id: L3MissionId;
  name: string;
  sector: string;
  focus: string;
  cases: L3CaseDef[];
};

export type L3Phase =
  | "briefing"
  | "glitch-check"
  | "repair"
  | "explain"
  | "feedback"
  | "caseDone";
