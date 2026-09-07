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
export type ModelShape = "tray" | "bar" | "wall" | "strip" | "pizza" | "panel";

/** Where a case sits in its level's four-case arc. */
export type ProgressionType = "discover" | "transfer" | "represent" | "reason";

/** A whole cut into equal parts, some of them being considered. */
export type PartsModelConfig = {
  shape: ModelShape;
  /**
   * How the whole is drawn. "photo" (default) tiles a photograph per part.
   * "model" uses the precise drawn `FractionModel` — required whenever two
   * wholes must be compared or overlaid (Level 03).
   */
  render?: "photo" | "model";
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
    /**
     * A short "how to fix it" line shown inside the repair workspace, naming
     * what the numerator and denominator are doing for THIS case. Optional;
     * Level 1 and Levels 3-6 leave it unset.
     */
    howTo?: string;
    /**
     * What the workspace looks like when the repair stage opens. Defaults to
     * ZED-4's own model. Use it when the child should build from a blank or
     * partly-built whole rather than being handed the finished answer.
     */
    startTotal?: number;
    startSelected?: number;
  };
};

export type EvidenceChoice = { label: string; correct: boolean };

/** Which of the two evidence areas a number belongs in. */
export type SortArea = "whole" | "part";

/**
 * The "give each number a job" board. The child drops each number of the
 * fraction into one of two evidence areas, which is the concrete version of
 * "what is this number counting?".
 */
export type EvidenceSortConfig = {
  title: string;
  text: string;
  /** Headings of the two evidence areas, in order: the whole, then the part. */
  wholeLabel: string;
  partLabel: string;
  /** The two numbers (as written on the fraction) the child must place. */
  items: { value: string; area: SortArea }[];
  retry: string;
  doneText: string;
};

/** One whole shown inside a side-by-side comparison. */
export type CompareModel = {
  /** Heading above the model, e.g. "Chocolate Bar A". */
  label: string;
  shape: ModelShape;
  /** Drawn model by default in comparisons; see `PartsModelConfig.render`. */
  render?: "photo" | "model";
  unitLabel: string;
  total: number;
  selected: number;
  /** The fraction written under the model, e.g. "1/2". */
  fraction: string;
  /**
   * Optional "split every piece" move. When present the child can press a
   * button that cuts each part into `into` smaller equal parts — the shaded
   * amount is split too, so the amount never changes, only the pieces.
   */
  split?: { into: number; label: string; resultFraction: string; caption: string };
};

/**
 * Two identical wholes shown beside each other so the child compares the
 * AMOUNT, not the numbers. "Line them up" stacks them for direct comparison.
 */
export type CompareConfig = {
  title: string;
  text: string;
  left: CompareModel;
  right: CompareModel;
  /** Message shown once the child has lined the two models up. */
  alignedText: string;
  /** Label of the overlay control. Defaults to "BRING THEM TOGETHER". */
  overlayLabel?: string;
  /** The quiet line revealed while the two models sit on top of each other. */
  overlayText?: string;
};

/** A fraction the child places on the 0-to-1 number line. */
export type NumberLineMark = {
  label: string; // "2/4"
  numerator: number;
  denominator: number;
};

/** A 0-to-1 number line used as a second kind of evidence. */
export type NumberLineConfig = {
  title: string;
  text: string;
  /** How many equal steps the line is ticked into (the common denominator). */
  steps: number;
  marks: NumberLineMark[];
  retry: string;
  doneText: string;
};

/** A second, follow-up multiple choice question. */
export type FollowUpQuestion = {
  question: string;
  choices: string[];
  correctIndex: number;
  retry: string;
  reply: string;
};

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
    /** Optional "give each number a job" evidence areas. */
    evidenceSort?: EvidenceSortConfig;
    /** Optional side-by-side comparison of two wholes (Level 03). */
    compare?: CompareConfig;
    /** Optional 0-to-1 number line the child places fractions on (Level 03). */
    numberLine?: NumberLineConfig;
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
    /** Optional second question asked once the evidence is confirmed. */
    followUp?: FollowUpQuestion;
  };

  repair: {
    title: string;
    text: string;
    successText: string;
    /** Shown instead of a "wrong" message while the build does not match. */
    checkText?: string;
    confirm: {
      question: string;
      yes: string;
      no: string;
      yesReply: string;
      noReply: string;
    };
    /** Optional reasoning question asked after the repair is confirmed. */
    followUp?: FollowUpQuestion;
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

  /** ZED-4's own admission, shown when the case closes. */
  zedResponse?: string;

  /** Report metadata. */
  reportModelLabel: string;
  whatHappened: string;
};
