/**
 * Deterministic report generators.
 *
 * These functions turn recorded evidence into the sentences a parent reads.
 * They are pure: same evidence in, same report out — no AI, no randomness,
 * no scores, no diagnosis. Language is deliberately cautious ("During these
 * investigations…", "Based on the evidence collected so far…").
 */
import { getCaseMeta, LEVEL_CASE_ORDER, LEVEL_TITLES } from "./caseCatalog";
import { evaluateAll, type DimensionEvaluation } from "./evaluate";
import type { CaseResult, ReasoningDimension } from "./types";

/* ---------------------------------------------------------------- child */

export type CaseReflection = {
  title: string;
  skill: string;
  observations: string[];
  closing: string;
};

/** Child-facing reflection shown at the end of one investigation. No score. */
export function generateCaseReflection(result: CaseResult): CaseReflection {
  const meta = getCaseMeta(result.caseId);
  const observations: string[] = [];
  if (result.investigation.comparedObjects) observations.push("You compared before you decided.");
  if (result.detection.correctDetection) observations.push("You found the glitch ZED-4 missed.");
  if (result.repair.successful) observations.push("You repaired the model so it was fair.");
  if (result.explanation.demonstratedUnderstanding)
    observations.push("You explained your thinking in your own words.");
  if (result.support.changedAnswer || result.support.revisedAfterEvidence)
    observations.push("You changed your mind when the evidence showed something else.");
  if (observations.length === 0) observations.push("You investigated ZED-4's solution.");

  return {
    title: `Case ${meta.number} — ${meta.title}`,
    skill: "Check before you trust.",
    observations,
    closing: "ZED-4 sounded confident. You checked anyway. That is detective work.",
  };
}

/* --------------------------------------------------------------- parent */

export type CaseEvidenceCard = {
  caseId: string;
  number: string;
  title: string;
  whatHappened: string;
  whatTheyDid: string[];
  support: string;
  date: string;
};

export type LevelSnapshot = {
  levelId: string;
  levelTitle: string;
  casesCompleted: number;
  casesInLevel: number;
  hasData: boolean;
  isComplete: boolean;
  headline: string;
  dimensions: DimensionEvaluation[];
  mathematics: { concept: string; statement: string; canDo: string[] };
  cases: CaseEvidenceCard[];
  supportSummary: string;
  mayIndicate: string[];
  nextStep: { focus: string; text: string; ask: string; avoid: string };
  tryAtHome: { title: string; steps: string[]; ask: string; watchFor: string };
};

function formatDate(ts: number): string {
  try {
    return new Date(ts).toLocaleDateString(undefined, {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

function evidenceCard(result: CaseResult): CaseEvidenceCard {
  const meta = getCaseMeta(result.caseId);
  const did: string[] = [];
  if (result.investigation.manipulatedObjects)
    did.push(`Moved and compared the ${meta.model} before answering.`);
  else if (result.investigation.interactedWithModel) did.push("Examined ZED-4's solution.");
  if (result.detection.correctDetection)
    did.push(
      result.detection.attempts > 1
        ? "Identified the glitch after trying another idea first."
        : "Identified the glitch on the first response.",
    );
  if (result.detection.identifiedRelevantEvidence)
    did.push(`Showed evidence using a ${result.detection.evidenceType}.`);
  if (result.repair.successful) did.push("Repaired the model so every share matched.");
  if (result.explanation.demonstratedUnderstanding)
    did.push(
      result.explanation.method === "speak"
        ? "Explained the idea out loud."
        : result.explanation.method === "write"
          ? "Explained the idea in writing."
          : "Built an explanation in their own words.",
    );

  const supportBits: string[] = [];
  supportBits.push(
    result.support.hintCount === 0
      ? "No clues used"
      : `${result.support.hintCount} clue${result.support.hintCount === 1 ? "" : "s"} used`,
  );
  if (result.support.retries > 0)
    supportBits.push(`${result.support.retries} retr${result.support.retries === 1 ? "y" : "ies"}`);
  if (result.support.changedAnswer || result.support.revisedAfterEvidence)
    supportBits.push("revised after evidence");

  return {
    caseId: result.caseId,
    number: meta.number,
    title: meta.title,
    whatHappened: meta.whatHappened,
    whatTheyDid: did.length ? did : ["Completed the investigation."],
    support: supportBits.join(" · "),
    date: formatDate(result.timestamp),
  };
}

const NEXT_STEPS: Record<
  ReasoningDimension,
  { focus: string; text: string; ask: string; avoid: string }
> = {
  notice: {
    focus: "Noticing before deciding",
    text: "Give them a few seconds to describe what they see before any question is asked.",
    ask: "“What do you notice here?”",
    avoid: "Avoid pointing at the difference yourself — the noticing is the skill.",
  },
  check: {
    focus: "Checking a confident answer",
    text: "When an answer arrives quickly, invite a check rather than a correction.",
    ask: "“How could we find out if that's true?”",
    avoid: "Avoid saying right or wrong before they have checked.",
  },
  represent: {
    focus: "Using objects to think",
    text: "Offer something physical — paper, blocks, food — before pencil and paper.",
    ask: "“Can you show me with these?”",
    avoid: "Avoid moving to written work while the idea is still forming.",
  },
  revise: {
    focus: "Changing an answer safely",
    text: "Treat a changed answer as a success out loud, so revising never feels like failing.",
    ask: "“What made you change your mind?”",
    avoid: "Avoid reacting to the first answer as if it is final.",
  },
  explain: {
    focus: "Explaining reasoning",
    text: "Ask for the thinking, not the answer, and accept incomplete sentences.",
    ask: "“How do you know?”",
    avoid: "Avoid finishing the sentence for them.",
  },
};

const TRY_AT_HOME: Record<
  ReasoningDimension,
  { title: string; steps: string[]; ask: string; watchFor: string }
> = {
  notice: {
    title: "The uneven snack",
    steps: [
      "Break a biscuit or slice of bread into clearly uneven pieces.",
      "Hand them out without saying anything about size.",
      "Wait and see whether your child notices.",
    ],
    ask: "“What do you notice about these pieces?”",
    watchFor: "Watch for them comparing the pieces rather than counting them.",
  },
  check: {
    title: "Is that true?",
    steps: [
      "Say something confidently wrong: “These two cups hold the same.”",
      "Let them decide how to test it.",
      "Pour the water together and compare.",
    ],
    ask: "“How can we check?”",
    watchFor: "Watch for them testing rather than agreeing.",
  },
  represent: {
    title: "Fold to share",
    steps: [
      "Take a sheet of paper and decide how many people share it.",
      "Let them fold it into matching parts.",
      "Cut along the folds and lay the parts on top of each other.",
    ],
    ask: "“How do we know the parts match?”",
    watchFor: "Watch for them lining pieces up to compare.",
  },
  revise: {
    title: "Second look",
    steps: [
      "Ask a quick sharing question and accept the first answer calmly.",
      "Then bring out the real objects and share them together.",
      "Ask the question again.",
    ],
    ask: "“Do you still think the same? What changed?”",
    watchFor: "Watch for a comfortable change of mind.",
  },
  explain: {
    title: "Teach it back",
    steps: [
      "Ask your child to share something fairly between family members.",
      "Then ask them to teach a younger sibling or a toy how they did it.",
      "Let them use the objects while they explain.",
    ],
    ask: "“How would you teach someone else to share fairly?”",
    watchFor: "Watch for words like same, equal, matching.",
  },
};

const LEVEL_RANK = { insufficient: 0, emerging: 1, developing: 2, consistent: 3 } as const;

/**
 * Per-level concept wording. `canDo[0]` is unlocked by a correct detection,
 * `canDo[1]` by a successful repair, `canDo[2]` by an explanation — so each
 * sentence traces back to something the child actually did.
 */
const LEVEL_CONCEPTS: Record<
  string,
  { concept: string; statement: string; headline: string; canDo: [string, string, string] }
> = {
  "level-01": {
    concept: "Parts of a Whole — fair sharing and equal parts",
    statement:
      "Based on the evidence collected so far, your child worked with the idea that a whole can be divided into equal parts.",
    headline: "worked with equal parts of one whole",
    canDo: [
      "Recognises when parts of a whole are not equal.",
      "Can make equal parts from a whole using objects.",
      "Can say that fair sharing means everyone gets the same amount.",
    ],
  },
  "level-02": {
    concept: "Naming the Pieces — what the top and bottom numbers count",
    statement:
      "Based on the evidence collected so far, your child worked with the idea that the bottom number names how many equal parts make the whole, and the top number counts the parts being considered.",
    headline: "worked with what each number in a fraction counts",
    canDo: [
      "Notices when a fraction's numbers do not match the picture.",
      "Can build a model that matches a given fraction.",
      "Can describe, in their own words, what the top and bottom numbers do.",
    ],
  },
};


export function generateLevelSnapshot(levelId: string, allResults: CaseResult[]): LevelSnapshot {
  const order = LEVEL_CASE_ORDER[levelId] ?? [];
  const results = allResults
    .filter((r) => r.levelId === levelId)
    .sort((a, b) => order.indexOf(a.caseId) - order.indexOf(b.caseId));
  const dimensions = evaluateAll(results);
  const hasData = results.length > 0;

  // Deterministic focus: the weakest dimension, ties broken by fixed order.
  const focus = [...dimensions].sort(
    (a, b) => LEVEL_RANK[a.level] - LEVEL_RANK[b.level] || a.supportingCases - b.supportingCases,
  )[0]?.dimension;
  const focusDimension: ReasoningDimension = focus ?? "check";

  // Per-level wording for the concept section. Every phrase is tied to an
  // observed behaviour below, so nothing is claimed without evidence.
  const concepts = LEVEL_CONCEPTS[levelId] ?? LEVEL_CONCEPTS["level-01"]!;

  const canDo: string[] = [];
  if (results.some((r) => r.detection.correctDetection)) canDo.push(concepts.canDo[0]!);
  if (results.some((r) => r.repair.successful)) canDo.push(concepts.canDo[1]!);
  if (results.some((r) => r.explanation.demonstratedUnderstanding)) canDo.push(concepts.canDo[2]!);



  const hintTotal = results.reduce((sum, r) => sum + r.support.hintCount, 0);
  const retryTotal = results.reduce((sum, r) => sum + r.support.retries, 0);
  const revisionTotal = results.filter(
    (r) => r.support.changedAnswer || r.support.revisedAfterEvidence,
  ).length;

  const supportSummary = hasData
    ? `Across ${results.length} investigation${results.length === 1 ? "" : "s"}: ${hintTotal} clue${hintTotal === 1 ? "" : "s"} used, ${retryTotal} retr${retryTotal === 1 ? "y" : "ies"}, ${revisionTotal} change${revisionTotal === 1 ? "" : "s"} of mind after evidence.`
    : "No support data collected yet.";

  const mayIndicate: string[] = [];
  if (hintTotal === 0 && results.length >= 2)
    mayIndicate.push("Worked independently in these investigations.");
  if (revisionTotal > 0)
    mayIndicate.push("Comfortable changing an answer when evidence points elsewhere.");
  if (retryTotal >= 3)
    mayIndicate.push("May benefit from more time with objects before choosing an answer.");

  return {
    levelId,
    levelTitle: LEVEL_TITLES[levelId] ?? "Investigations",
    casesCompleted: results.length,
    casesInLevel: order.length,
    hasData,
    isComplete: order.length > 0 && results.length >= order.length,
    headline: hasData
      ? `During these investigations, your child ${concepts.headline} across ${results.length} case${results.length === 1 ? "" : "s"}.`
      : "No investigations completed yet on this device.",
    dimensions,
    mathematics: {
      concept: concepts.concept,
      statement: hasData
        ? concepts.statement
        : "Complete an investigation to collect evidence about this concept.",
      canDo,
    },

    cases: results.map(evidenceCard),
    supportSummary,
    mayIndicate,
    nextStep: NEXT_STEPS[focusDimension],
    tryAtHome: TRY_AT_HOME[focusDimension],
  };
}

/**
 * Cumulative view across levels. Level 3 of the roadmap will grow this into
 * a longitudinal picture; today it summarises every level with data.
 */
export function generateCumulativeSnapshot(allResults: CaseResult[]): LevelSnapshot[] {
  const levelIds = Object.keys(LEVEL_CASE_ORDER);
  return levelIds.map((levelId) => generateLevelSnapshot(levelId, allResults));
}
