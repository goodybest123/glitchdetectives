/**
 * Reasoning evidence model for the Detective's Report.
 *
 * Every completed investigation emits ONE `CaseResult`. It records only
 * *observable behaviour* — what the child actually did on screen — never a
 * score, a grade, or a judgement about the child. The report engine
 * (`snapshots.ts`) reads these records and produces the parent-facing
 * narrative with deterministic rules, so a parent can always trace an
 * observation back to a real interaction.
 *
 * This file is intentionally storage-agnostic: swapping localStorage for a
 * database later only touches `store.ts`.
 */

/** The five reasoning dimensions the whole product is built around. */
export type ReasoningDimension = "notice" | "check" | "represent" | "revise" | "explain";

export const REASONING_DIMENSIONS: ReasoningDimension[] = [
  "notice",
  "check",
  "represent",
  "revise",
  "explain",
];

/**
 * Evidence level for a dimension. "insufficient" means we have not seen
 * enough to say anything — the report says so plainly rather than guessing.
 */
export type EvidenceLevel = "insufficient" | "emerging" | "developing" | "consistent";

export type ExplanationMethod = "sentence" | "speak" | "write" | null;

/** Raw, internal evidence from one completed investigation. Never shown as-is. */
export type CaseResult = {
  caseId: string; // "case-01.01"
  levelId: string; // "level-01"
  concept: string; // "Parts of a Whole"
  completed: boolean;

  investigation: {
    interactedWithModel: boolean;
    manipulatedObjects: boolean;
    comparedObjects: boolean;
    exploredBeforeAnswering: boolean;
  };

  detection: {
    selectedClaim: string | null;
    correctDetection: boolean;
    attempts: number;
    identifiedRelevantEvidence: boolean;
    evidenceType: string; // e.g. "size comparison"
  };

  repair: {
    attempted: boolean;
    successful: boolean;
    attempts: number;
    usedManipulation: boolean;
    requiredHint: boolean;
  };

  explanation: {
    method: ExplanationMethod;
    response: string;
    demonstratedUnderstanding: boolean;
  };

  support: {
    hintsUsed: boolean;
    hintCount: number;
    retries: number;
    changedAnswer: boolean;
    revisedAfterEvidence: boolean;
  };

  interaction: {
    attemptCount: number;
    completedWithoutAnswerReveal: boolean;
  };

  timestamp: number;
};

/**
 * Aggregate profile. Kept as a derived value (built from the stored case
 * results) so there is a single source of truth and no drift.
 */
export type DetectiveProfile = {
  casesCompleted: CaseResult[];
  supportPatterns: { hintsUsed: number; retries: number; revisions: number };
};
