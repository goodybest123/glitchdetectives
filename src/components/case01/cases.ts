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
    welcomeText:
      "Great detective work! You fixed my pizza. Can you tell me — why was my first try not fair?",
    bubbles: {
      investigate:
        "Whoa look look look! I served exactly four whole pieces of pizza, one for every robot! Counting all the way to four is a HUGE deal — I am totally, completely sure this is fair sharing!",
      detect:
        "Click on the glitch.",
      solved: "Logic repaired. The case is yours to close.",
    },
    captions: {
      investigate:
        "Scan ZED-4's logic. Click on the pizza where the sharing is not fair.",
      detect: "Click on the glitch.",
      repair: "Keep going — make all four parts the same size.",
      explain: "The chat panel is now open. Tell ZED-4 why it wasn't fair.",
      solved: "Case closed. Read your diagnostic report below.",
    },
    Visual: PizzaSVG,
    conceptMastered: "Fair Sharing — four equal parts of one whole",
  },
  chocolate: {
    id: "chocolate",
    title: "The Chocolate Bar",
    shortTitle: "Chocolate",
    subtitle: "Sharing equally with three",
    emoji: "🍫",
    chatEndpoint: "/api/chat/case-01-chocolate",
    sliderLabel: "EQUALIZER TOOL",
    welcomeText:
      "Thanks, Detective! You evened out my chocolate. Why was my first try not fair?",
    bubbles: {
      investigate:
        "Easy peasy! I snapped this chocolate bar into THREE whole pieces, and three is the magic number for thirds! Three friends, three pieces — case closed! I am one hundred percent positively sure this is perfect sharing!",
      detect:
        "Click on the glitch.",
      solved: "Logic repaired. Thanks, Detective.",
    },
    captions: {
      investigate:
        "Click the chocolate bar where the pieces are split unfairly.",
      detect: "Click on the glitch.",
      repair: "Keep going — three pieces, all the same size.",
      explain:
        "The chat panel is open. Tell ZED-4 why those pieces weren't real thirds.",
      solved: "Case closed. Read your diagnostic report below.",
    },
    Visual: ChocolateSVG,
    conceptMastered: "Fair Sharing — three equal parts make thirds",
  },
  canvas: {
    id: "canvas",
    title: "The Painted Canvas",
    shortTitle: "Canvas",
    subtitle: "Splitting a shape into halves",
    emoji: "🎨",
    chatEndpoint: "/api/chat/case-01-canvas",
    sliderLabel: "CENTERING TOOL",
    welcomeText:
      "Thanks for centering my canvas! Can you tell me — why was my first try not half?",
    bubbles: {
      investigate:
        "Yes yes yes! I painted ONE side and left ONE side, so that is obviously HALF! One and one — that is the official rule for halves! I am so proud of this — beep boop, perfect work!",
      detect:
        "Click on the glitch.",
      solved: "Logic repaired. The canvas is balanced.",
    },
    captions: {
      investigate:
        "Click the line that's splitting the canvas unfairly.",
      detect: "Click on the glitch.",
      repair: "Keep going — make both sides match.",
      explain:
        "The chat panel is open. Tell ZED-4 what 'half' really means.",
      solved: "Case closed. Read your diagnostic report below.",
    },
    Visual: CanvasSVG,
    conceptMastered: "Fair Sharing — halves are two matching parts",
  },
};

export const SUB_CASE_ORDER: SubCaseId[] = ["pizza", "chocolate", "canvas"];
