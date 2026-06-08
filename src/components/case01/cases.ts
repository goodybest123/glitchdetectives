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
      investigate: "Look! I served exactly four pieces of pizza!",
      detect: "Glitch Detected! The pieces don't look fair.",
      solved: "Logic repaired. The case is yours to close.",
    },
    captions: {
      investigate:
        "Scan ZED-4's logic. Click on the pizza where the sharing is not fair.",
      detect: "Now drag the Equalizer Tool to make the pieces the same size.",
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
      investigate: "I broke it into thirds! We each get one piece!",
      detect: "Glitch Detected! Those shares are not fair.",
      solved: "Logic repaired. Thanks, Detective.",
    },
    captions: {
      investigate:
        "Click the chocolate bar where the pieces are split unfairly.",
      detect: "Drag the Equalizer Tool to make all three pieces the same.",
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
      investigate: "I just painted exactly half of the canvas!",
      detect: "Glitch Detected! The sides do not match.",
      solved: "Logic repaired. The canvas is balanced.",
    },
    captions: {
      investigate:
        "Click the line that's splitting the canvas unfairly.",
      detect: "Drag the Centering Tool to move the line to the middle.",
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
