/**
 * Deterministic evaluation of reasoning evidence.
 *
 * Rules, not judgement: each dimension is "supported" by a case only when
 * the recorded interaction demonstrates it. Levels come from configurable
 * thresholds, and a single supporting case can never reach "Consistent".
 */
import { getCaseMeta } from "./caseCatalog";
import { REASONING_DIMENSIONS, type CaseResult, type EvidenceLevel, type ReasoningDimension } from "./types";

/** Minimum number of supporting investigations required for each level. */
export const LEVEL_THRESHOLDS: { developing: number; consistent: number } = {
  developing: 2,
  consistent: 3,
};

export const DIMENSION_LABELS: Record<ReasoningDimension, string> = {
  notice: "NOTICE",
  check: "CHECK",
  represent: "REPRESENT",
  revise: "REVISE",
  explain: "EXPLAIN",
};

export const DIMENSION_MEANINGS: Record<ReasoningDimension, string> = {
  notice: "Spotting what is actually there before deciding.",
  check: "Testing an idea against evidence instead of accepting it.",
  represent: "Using the model — moving, cutting, arranging — to think.",
  revise: "Changing an answer when the evidence says something else.",
  explain: "Putting the reasoning into their own words.",
};

export const LEVEL_LABELS: Record<EvidenceLevel, string> = {
  insufficient: "Not enough evidence yet",
  emerging: "Emerging",
  developing: "Developing",
  consistent: "Consistent",
};

/** Does this case demonstrate this dimension? */
function supports(dimension: ReasoningDimension, r: CaseResult): boolean {
  switch (dimension) {
    case "notice":
      return r.investigation.interactedWithModel && r.detection.correctDetection;
    case "check":
      return r.investigation.comparedObjects && r.detection.identifiedRelevantEvidence;
    case "represent":
      return r.investigation.manipulatedObjects && r.repair.usedManipulation;
    case "revise":
      return r.support.changedAnswer || r.support.revisedAfterEvidence || r.detection.attempts > 1;
    case "explain":
      return r.explanation.demonstratedUnderstanding;
  }
}

/** One line of traceable evidence behind a dimension. */
function evidenceLine(dimension: ReasoningDimension, r: CaseResult): string {
  const meta = getCaseMeta(r.caseId);
  switch (dimension) {
    case "notice":
      return `In ${meta.title}, they identified the glitch in ZED-4's solution.`;
    case "check":
      return `In ${meta.title}, they compared the ${meta.model} before answering.`;
    case "represent":
      return `In ${meta.title}, they used the ${meta.model} to build a fair solution.`;
    case "revise":
      return `In ${meta.title}, they changed their thinking after looking again.`;
    case "explain":
      return `In ${meta.title}, they explained the idea in their own words.`;
  }
}

export type DimensionEvaluation = {
  dimension: ReasoningDimension;
  label: string;
  meaning: string;
  level: EvidenceLevel;
  supportingCases: number;
  totalCases: number;
  evidence: string[];
};

export function evaluateDimension(
  dimension: ReasoningDimension,
  results: CaseResult[],
): DimensionEvaluation {
  const supporting = results.filter((r) => supports(dimension, r));
  const count = supporting.length;
  let level: EvidenceLevel = "insufficient";
  if (count >= LEVEL_THRESHOLDS.consistent) level = "consistent";
  else if (count >= LEVEL_THRESHOLDS.developing) level = "developing";
  else if (count >= 1) level = "emerging";

  return {
    dimension,
    label: DIMENSION_LABELS[dimension],
    meaning: DIMENSION_MEANINGS[dimension],
    level,
    supportingCases: count,
    totalCases: results.length,
    evidence: supporting.map((r) => evidenceLine(dimension, r)),
  };
}

export function evaluateAll(results: CaseResult[]): DimensionEvaluation[] {
  return REASONING_DIMENSIONS.map((dimension) => evaluateDimension(dimension, results));
}
