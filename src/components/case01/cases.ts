/**
 * Case 01 sub-case definitions (pizza, chocolate, canvas).
 *
 * `SUB_CASES` is the single source of truth for each sub-case: the SVG
 * `Visual` component, the ZED-4 bubble copy, the slider tool labels, the
 * `correctTarget` (0..1) that the slider must land on to solve, and the
 * chat endpoint that drives the "explain" step. `SUB_CASE_ORDER` fixes the
 * display order in the picker and controls "next case" navigation.
 *
 * Every case folder (`case02/cases.ts` … `case06/cases.ts`) exports the
 * same three symbols with the same shape — only the content differs.
 */
import type { ComponentType } from "react";
import { PizzaSVG } from "./PizzaSVG";
import { ChocolateSVG } from "./ChocolateSVG";
import { CanvasSVG } from "./CanvasSVG";

export type SubCaseId = "pizza" | "chocolate" | "canvas";

export type VisualProps = {
  equalized: number;
  onGlitchClick?: () => void;
  interactive?: boolean;
  pulseKey?: number;
};

export type SubCaseDef = {
  id: SubCaseId;
  title: string;
  shortTitle: string;
  subtitle: string;
  emoji: string;
  chatEndpoint: string;
  sliderLabel: string;
  toolTagline: string;
  toolMinLabel: string;
  toolMaxLabel: string;
  toolHint: string;
  welcomeText: string;
  /** Slider value (0-1) where the case is mathematically correct. Defaults to 1. */
  correctTarget: number;
  /** Tolerance around correctTarget. Defaults to 0.04. */
  targetTolerance: number;
  bubbles: {
    investigate: string;
    detect: string;
    solved: string;
  };
  captions: {
    investigate: string;
    detect: string;
    repair: string;
    explain: string;
    solved: string;
  };
  Visual: ComponentType<VisualProps>;
  conceptMastered: string;
  story: {
    eyebrow: string;
    intro: string;
    solution: string;
    confidence: string;
    mission: string;
    notice: string;
    participants: string[];
  };
  detectChoices: { label: string; correct: boolean }[];
  evidencePrompt: string;
  repairPrompt: string;
  explainChoices: string[];
  apply: { title: string; prompt: string; grab: string[] };
  skillSummary: string;
  evidenceSkills: string[];
};

export const SUB_CASES: Record<SubCaseId, SubCaseDef> = {
  pizza: {
    id: "pizza",
    title: "The Pizza",
    shortTitle: "Pizza",
    subtitle: "Sharing equally with four",
    emoji: "🍕",
    chatEndpoint: "/api/chat/case-01",
    sliderLabel: "EQUALIZER TOOL",
    toolTagline: "Drag to slice the pizza into four equal pieces.",
    toolMinLabel: "Lopsided",
    toolMaxLabel: "Fair slices",
    toolHint: "Almost there — keep equalizing until all four slices match.",
    correctTarget: 1,
    targetTolerance: 0.04,
    welcomeText:
      "Great detective work! You fixed my pizza. Can you tell me — why was my first try not fair?",
    bubbles: {
      investigate:
        "Whoa look look look! I served exactly four whole pieces of pizza, one for every robot! Counting all the way to four is a HUGE deal — I am totally, completely sure this is fair sharing!",
      detect: "Click on the glitch.",
      solved: "Logic repaired. The case is yours to close.",
    },
    captions: {
      investigate: "Scan ZED-4's logic. Click on the pizza where the sharing is not fair.",
      detect: "Click on the glitch.",
      repair: "Keep going — make all four parts the same size.",
      explain: "The chat panel is now open. Tell ZED-4 why it wasn't fair.",
      solved: "Case closed. Read your diagnostic report below.",
    },
    Visual: PizzaSVG,
    conceptMastered: "Fair Sharing — four equal parts of one whole",
    story: {
      eyebrow: "CASE 01.01 · THE PIZZA",
      intro:
        "ZED-4 was helping four detectives share one pizza. He says everyone got a fair share.",
      solution: "I cut the pizza into four pieces. One piece each means fair sharing!",
      confidence: "“Case closed!” But did he check the size of each piece?",
      mission: "Investigate ZED-4’s solution and prove what is fair.",
      notice: "Move pieces beside each other. No timer. Take your time.",
      participants: ["Maya", "Leo", "Sam", "ZED-4"],
    },
    detectChoices: [
      { label: "The pieces are different sizes, so the shares are not equal.", correct: true },
      { label: "Four pieces are always fair, whatever their sizes.", correct: false },
      { label: "Everyone needs two pieces.", correct: false },
      { label: "Pizza cannot be shared fairly.", correct: false },
    ],
    evidencePrompt: "Show your evidence: put the slices beside each other and compare them.",
    repairPrompt: "Can you make four matching shares, then give one to each detective?",
    explainChoices: [
      "The pizza was not fair because the pieces were different sizes.",
      "A fair share means everyone gets the same amount.",
      "Four pieces need to be equal, not just four pieces.",
    ],
    apply: {
      title: "Your turn: share something fairly",
      prompt:
        "Use four small objects and one piece of paper. Show how four people could get the same amount.",
      grab: ["paper", "4 small objects", "a pencil"],
    },
    skillSummary:
      "You compared quantities, tested the picture, repaired the shares, and explained why equal pieces matter.",
    evidenceSkills: ["Compared the pieces", "Tested an idea", "Explained the evidence"],
  },
  chocolate: {
    id: "chocolate",
    title: "The Chocolate Bar",
    shortTitle: "Chocolate",
    subtitle: "The missing fair-share glitch",
    emoji: "🍫",
    chatEndpoint: "/api/chat/case-01-chocolate",
    sliderLabel: "EQUALIZER TOOL",
    toolTagline: "Drag two dividers to make three matching shares.",
    toolMinLabel: "Uneven",
    toolMaxLabel: "Equal shares",
    toolHint: "Move each divider near an equal share position.",
    correctTarget: 1,
    targetTolerance: 0.04,
    welcomeText: "You repaired my chocolate share. Why was my first try not fair?",
    bubbles: {
      investigate:
        "I made 3 pieces. There are 3 people. Everyone gets 1 piece! So it is fair! Case closed!",
      detect: "What evidence can you find?",
      solved: "Logic repaired. You caught my chocolate glitch, Detective.",
    },
    captions: {
      investigate: "Move the chocolate pieces around. Compare them. What do you notice?",
      detect: "Show evidence that supports your idea.",
      repair: "Drag both dividers until the three sections match.",
      explain: "Tell ZED-4 why one piece each was not enough.",
      solved: "Case closed. Read your diagnostic report below.",
    },
    Visual: ChocolateSVG,
    conceptMastered: "Fair Sharing — three equal parts",
    story: {
      eyebrow: "CASE 01.02 · THE CHOCOLATE BAR",
      intro:
        "ZED-4 is sharing a chocolate bar with three detectives. He says everyone got a fair share.",
      solution: "I made 3 pieces. There are 3 people. Everyone gets 1 piece! So it is fair!",
      confidence: "“Case closed!” But did he compare the amounts?",
      mission: "Investigate ZED-4’s solution and prove what fair sharing needs.",
      notice: "Move the pieces beside each other. No timer. Take your time.",
      participants: ["Maya", "Leo", "Sam"],
    },
    detectChoices: [
      { label: "The pieces are different sizes.", correct: true },
      { label: "Everyone got a different number of pieces.", correct: false },
      { label: "There are too many people.", correct: false },
    ],
    evidencePrompt: "Put two pieces beside each other and compare their sizes.",
    repairPrompt: "Make three matching shares, then give one to each detective.",
    explainChoices: [
      "The pieces were different sizes, so the share was not fair.",
      "A fair share means everyone gets the same amount.",
      "Three pieces are not enough; the amounts must match.",
    ],
    apply: {
      title: "Your turn: find another fair share",
      prompt:
        "Take a piece of paper and imagine it is a chocolate bar. Divide it fairly between 3 people. Fold it, draw lines, cut it, or use playdough. How did you check that the shares were fair?",
      grab: ["paper", "a pencil", "safe scissors or playdough"],
    },
    skillSummary:
      "You looked past the number three and checked whether each person received the same amount.",
    evidenceSkills: ["Compared pieces", "Used evidence", "Repaired the share"],
  },
  canvas: {
    id: "canvas",
    title: "The Painted Canvas",
    shortTitle: "Canvas",
    subtitle: "Splitting a shape into halves",
    emoji: "🎨",
    chatEndpoint: "/api/chat/case-01-canvas",
    sliderLabel: "CENTERING TOOL",
    toolTagline: "Drag the line until it sits in the middle.",
    toolMinLabel: "Off-center left",
    toolMaxLabel: "Off-center right",
    toolHint: "Slide toward the middle until both halves are exactly the same.",
    correctTarget: 0.5,
    targetTolerance: 0.04,
    welcomeText: "Thanks for centering my canvas! Can you tell me — why was my first try not half?",
    bubbles: {
      investigate:
        "Yes yes yes! I painted ONE side and left ONE side, so that is obviously HALF! One and one — that is the official rule for halves! I am so proud of this — beep boop, perfect work!",
      detect: "Click on the glitch.",
      solved: "Logic repaired. The canvas is balanced.",
    },
    captions: {
      investigate: "Click the line that's splitting the canvas unfairly.",
      detect: "Click on the glitch.",
      repair: "Keep going — make both sides match.",
      explain: "The chat panel is open. Tell ZED-4 what 'half' really means.",
      solved: "Case closed. Read your diagnostic report below.",
    },
    Visual: CanvasSVG,
    conceptMastered: "Fair Sharing — halves are two matching parts",
    story: {
      eyebrow: "CASE 01.03 · THE PAINTED CANVAS",
      intro:
        "ZED-4 painted one side of a canvas and called it half. He says one painted side and one unpainted side must match.",
      solution: "I made two sides. One and one means half!",
      confidence: "“Perfect work!” But are the two sides the same size?",
      mission: "Move the line, compare both sides, and decide what half means.",
      notice: "Drag slowly. You can change your mind while you investigate.",
      participants: ["Nia", "ZED-4"],
    },
    detectChoices: [
      { label: "The line is off-center, so the two parts are not equal.", correct: true },
      { label: "Any line makes two equal halves.", correct: false },
      { label: "One painted side is always half.", correct: false },
      { label: "The wider side is smaller because it is unpainted.", correct: false },
    ],
    evidencePrompt: "Show your evidence: move the line and compare the two regions.",
    repairPrompt: "Can you move the line until both sides match?",
    explainChoices: [
      "The canvas was not half because one side was bigger.",
      "Half means two parts that are the same size.",
      "A line alone is not enough; both sides must match.",
    ],
    apply: {
      title: "Your turn: find two equal parts",
      prompt: "Fold or draw a line on paper. Can you show two parts that match in size?",
      grab: ["paper", "a pencil", "a flat table"],
    },
    skillSummary:
      "You used the model to check that half means two matching parts, not just two spaces.",
    evidenceSkills: ["Compared both sides", "Moved the divider", "Explained what half means"],
  },
};

export const SUB_CASE_ORDER: SubCaseId[] = ["pizza", "chocolate", "canvas"];
