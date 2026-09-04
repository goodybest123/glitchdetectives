/**
 * The shared Glitch Detectives case model.
 *
 * Level 01 (Pizza / Chocolate Bar / Painted Canvas) was hand-built end to
 * end. Everything those three cases have in common — the flow
 * CASE BRIEF → INVESTIGATE → DETECT → REPAIR → EXPLAIN → CASE CLOSED, the
 * hint ladder, evidence-before-feedback, revision tracking and the report
 * hand-off — lives in `InvestigationCase.tsx`.
 *
 * A `CaseDefinition` supplies only what makes one investigation different
 * from another: the story, ZED-4's completed claim, the hands-on model, the
 * detect choices, the repair goal and the explanation prompts.
 *
 * `zedClaim.isCorrect` is part of the model from day one: later cases will
 * have ZED-4 be right, and the child must still investigate before deciding.
 */

/** Which everyday object the parts model is drawn as. */
export type ModelShape = "tray" | "bar" | "wall" | "strip";

/** Where a case sits in its level's four-case arc. */
export type ProgressionType = "discover" | "transfer" | "represent" | "reason";

/** A whole cut into equal parts, some of them being considered. */
export type PartsModelConfig = {
  shape: ModelShape;
  /** Singular name of one equal part, e.g. "cookie". */
  unitLabel: string;
  /** How many equal parts ZED-4's whole is cut into. */
  totalParts: number;
  /** How many of those parts ZED-4 highlighted. */
  selectedParts: number;
  repair: {
    /** When present, the child can change how many equal parts the whole has. */
    adjustableTotal?: { min: number; max: number };
    targetTotal: number;
    targetSelected: number;
    instruction: string;
  };
};

export type EvidenceChoice = { label: string; correct: boolean };

export type CaseDefinition = {
  caseId: string; // "case-02.01"
  levelId: string; // "level-02"
  number: string; // "02.01"
  levelTitle: string;
  title: string;
  shortTitle: string;
  subtitle: string;
  missionTitle: string;
  concept: string;
  progression: ProgressionType;
  emoji: string;
  story: string;
  chatEndpoint: string;
  chatId: string;
  welcomeText: string;

  zedClaim: {
    heading: string;
    lines: string[];
    isCorrect: boolean;
    errorType: string;
  };

  model: PartsModelConfig;

  investigate: {
    title: string;
    text: string;
    boardTitle: string;
    boardText: string;
    observations: string[];
  };

  /** Three layered clues: observe → direct → scaffold. Never the answer. */
  hints: [string, string, string];

  detect: {
    question: string;
    choices: string[];
    correctIndex: number;
    nudge: string;
    evidence: {
      prompt: string;
      actionLabel: string;
      doneLabel: string;
      question: string;
      choices: EvidenceChoice[];
      retry: string;
      /** Short label used in the parent report, e.g. "part count". */
      type: string;
    };
  };

  repair: {
    title: string;
    text: string;
    successText: string;
    confirm: {
      question: string;
      yes: string;
      no: string;
      yesReply: string;
      noReply: string;
    };
  };

  /** Formal words are only named after the child has explained the meaning. */
  vocabulary?: { title: string; lines: string[] };

  explain: {
    title: string;
    text: string;
    slots: { prompt: string; options: string[] }[];
    sentence: (answers: string[]) => string;
  };

  detectiveSkill: string;
  apply: string;

  /** Report metadata. */
  reportModelLabel: string;
  whatHappened: string;
};
