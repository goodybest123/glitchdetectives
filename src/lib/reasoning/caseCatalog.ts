/**
 * Static, human-readable metadata for each investigation.
 *
 * The report engine never hard-codes per-case *conclusions* — it only uses
 * this catalogue for titles and the neutral "what happened" narration of
 * ZED-4's glitch. Everything the child did comes from the recorded
 * `CaseResult`.
 */

export type CaseMeta = {
  caseId: string;
  levelId: string;
  number: string;
  title: string;
  levelTitle: string;
  concept: string;
  /** Neutral description of the glitch ZED-4 presented. */
  whatHappened: string;
  /** Short label of the object the child manipulated. */
  model: string;
};

export const LEVEL_TITLES: Record<string, string> = {
  "level-01": "Parts of a Whole",
  "level-02": "Naming the Pieces",
};


export const CASE_CATALOG: Record<string, CaseMeta> = {
  "case-01.01": {
    caseId: "case-01.01",
    levelId: "level-01",
    number: "01.01",
    title: "The Pizza",
    levelTitle: "Parts of a Whole",
    concept: "Parts of a Whole",
    whatHappened: "ZED-4 cut four unequal pieces and claimed the sharing was fair.",
    model: "pizza pieces",
  },
  "case-01.02": {
    caseId: "case-01.02",
    levelId: "level-01",
    number: "01.02",
    title: "The Chocolate Bar",
    levelTitle: "Parts of a Whole",
    concept: "Parts of a Whole",
    whatHappened:
      "ZED-4 broke a chocolate bar into three different-sized pieces and said one piece each was fair.",
    model: "chocolate pieces",
  },
  "case-01.03": {
    caseId: "case-01.03",
    levelId: "level-01",
    number: "01.03",
    title: "The Painted Canvas",
    levelTitle: "Parts of a Whole",
    concept: "Parts of a Whole",
    whatHappened:
      "ZED-4 painted one side of a canvas and claimed that one painted side and one plain side meant half.",
    model: "canvas halves",
  },
  "case-02.01": {
    caseId: "case-02.01",
    levelId: "level-02",
    number: "02.01",
    title: "The Cookie Tray",
    levelTitle: "Naming the Pieces",
    concept: "Naming the Pieces",
    whatHappened:
      "ZED-4 read 3/4 on a tray of 4 equal pieces and switched what the two numbers count.",
    model: "cookie tray pieces",
  },
  "case-02.02": {
    caseId: "case-02.02",
    levelId: "level-02",
    number: "02.02",
    title: "The Chocolate Squares",
    levelTitle: "Naming the Pieces",
    concept: "Naming the Pieces",
    whatHappened: "ZED-4 said the 6 in 2/6 was the amount of chocolate Maya received.",
    model: "chocolate squares",
  },
  "case-02.03": {
    caseId: "case-02.03",
    levelId: "level-02",
    number: "02.03",
    title: "The Painted Wall",
    levelTitle: "Naming the Pieces",
    concept: "Naming the Pieces",
    whatHappened: "ZED-4 built a 4-section wall for 4/5 and painted all of it.",
    model: "wall sections",
  },
  "case-02.04": {
    caseId: "case-02.04",
    levelId: "level-02",
    number: "02.04",
    title: "The Mystery Fraction",
    levelTitle: "Naming the Pieces",
    concept: "Naming the Pieces",
    whatHappened:
      "ZED-4 said a picture with 2 of 5 parts highlighted matched a card reading 3/5.",
    model: "fraction strip sections",
  },
};

/** Ordered case ids for a level — used for the evidence timeline. */
export const LEVEL_CASE_ORDER: Record<string, string[]> = {
  "level-01": ["case-01.01", "case-01.02", "case-01.03"],
  "level-02": ["case-02.01", "case-02.02", "case-02.03", "case-02.04"],
};


export function getCaseMeta(caseId: string): CaseMeta {
  return (
    CASE_CATALOG[caseId] ?? {
      caseId,
      levelId: "level-01",
      number: caseId,
      title: caseId,
      levelTitle: "Investigations",
      concept: "Mathematical reasoning",
      whatHappened: "ZED-4 presented a confident solution.",
      model: "the model",
    }
  );
}
