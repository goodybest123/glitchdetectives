import type { ComponentType } from "react";
import { BlueprintSVG } from "./BlueprintSVG";
import { PaintVatsSVG } from "./PaintVatsSVG";
import { CircuitBoardSVG } from "./CircuitBoardSVG";

export type SubCaseId = "blueprint" | "paint" | "circuit";
export type Operator = "+" | "−";

export type Fraction = { n: number; d: number };

export type VisualProps = {
  /** True once the child has used the repair tool to convert the left fraction. */
  repaired: boolean;
  /** Bump to replay a "solved" animation. */
  pulseKey?: number;
};

export type SubCaseDef = {
  id: SubCaseId;
  title: string;
  shortTitle: string;
  subtitle: string;
  emoji: string;
  chatEndpoint: string;
  // Original (mismatched) fractions
  left: Fraction;
  right: Fraction;
  operator: Operator;
  wrongResult: Fraction;
  // Repaired (common-denominator) state
  repairedLeft: Fraction;
  repairedResult: Fraction;
  toolLabel: string;
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
  successBanner: string;
};

export const SUB_CASES: Record<SubCaseId, SubCaseDef> = {
  blueprint: {
    id: "blueprint",
    title: "The Blueprint",
    shortTitle: "Blueprint",
    subtitle: "1/2 + 1/4 — pieces of different sizes",
    emoji: "🧱",
    chatEndpoint: "/api/chat/case-06-blueprint",
    left: { n: 1, d: 2 },
    right: { n: 1, d: 4 },
    operator: "+",
    wrongResult: { n: 2, d: 6 },
    repairedLeft: { n: 2, d: 4 },
    repairedResult: { n: 3, d: 4 },
    toolLabel: "Laser Slicer",
    toolHint: "Slice the big 1/2 block into fourths.",
    welcomeText:
      "Incredible detective work! ZED-4 tried to jam a giant 1/2 piece and a small 1/4 piece into the same box. Explain to him why we had to slice the big piece into fourths before we could add them together.",
    bubbles: {
      investigate: "I added 1 big piece and 1 small piece! We have 2/6!",
      detect: "Glitch Detected! The big piece doesn't fit in the new box!",
      solved: "Logic repaired. All pieces are the same size now!",
    },
    captions: {
      investigate: "Scan the equation. Click the answer that looks wrong.",
      detect: "Use the Laser Slicer to make the pieces match.",
      repair: "Cut the big block until both pieces are the same size.",
      explain: "The chat is open. Tell ZED-4 why we had to slice first.",
      solved: "Case closed. Read your diagnostic report below.",
    },
    Visual: BlueprintSVG,
    conceptMastered:
      "Adding unlike denominators — pieces must be the same size first",
    successBanner: "Logic Repaired: All pieces must be the same size before building.",
  },
  paint: {
    id: "paint",
    title: "The Paint Vats",
    shortTitle: "Paint Vats",
    subtitle: "1/3 + 1/6 — different grids",
    emoji: "🎨",
    chatEndpoint: "/api/chat/case-06-paint",
    left: { n: 1, d: 3 },
    right: { n: 1, d: 6 },
    operator: "+",
    wrongResult: { n: 2, d: 9 },
    repairedLeft: { n: 2, d: 6 },
    repairedResult: { n: 3, d: 6 },
    toolLabel: "Grid Calibrator",
    toolHint: "Add a line so the 1/3 vat matches the 1/6 vat.",
    welcomeText:
      "Great fix! ZED-4 ended up with almost no paint when he added 3 and 6 to make 9. Why did we have to change the 1/3 vat to match the 1/6 vat before mixing?",
    bubbles: {
      investigate: "1 top plus 1 top is 2! 3 bottom plus 6 bottom is 9!",
      detect: "Glitch Detected! Did we lose some paint?",
      solved: "Logic repaired. The vats use the same grid now!",
    },
    captions: {
      investigate: "Scan the equation. Click the answer that looks wrong.",
      detect: "Use the Grid Calibrator to match the vats.",
      repair: "Add a line so both vats measure the same way.",
      explain: "The chat is open. Tell ZED-4 why the vats need the same grid.",
      solved: "Case closed. Read your diagnostic report below.",
    },
    Visual: PaintVatsSVG,
    conceptMastered:
      "Adding unlike denominators — the vats need the same measuring grid",
    successBanner: "Logic Repaired: The vats must use the same measurement grid.",
  },
  circuit: {
    id: "circuit",
    title: "The Circuit Board",
    shortTitle: "Circuit Board",
    subtitle: "1/2 − 1/8 — subtracting different sizes",
    emoji: "🔋",
    chatEndpoint: "/api/chat/case-06-circuit",
    left: { n: 1, d: 2 },
    right: { n: 1, d: 8 },
    operator: "−",
    wrongResult: { n: 0, d: 6 },
    repairedLeft: { n: 4, d: 8 },
    repairedResult: { n: 3, d: 8 },
    toolLabel: "Segmenter Tool",
    toolHint: "Cut the big 1/2 power cell into eighths.",
    welcomeText:
      "Case closed! ZED-4 almost deleted all our power! Why did we have to slice the big 1/2 power cell into smaller eighths before we could take 1/8 away?",
    bubbles: {
      investigate: "1 minus 1 is 0! We have no power left!",
      detect: "Glitch Detected! A tiny chip shouldn't destroy the whole cell!",
      solved: "Logic repaired. Power is safe — 3/8 left!",
    },
    captions: {
      investigate: "Scan the equation. Click the answer that looks wrong.",
      detect: "Use the Segmenter Tool to slice the power cell.",
      repair: "Cut the cell into eighths so the chip can pop out safely.",
      explain: "The chat is open. Tell ZED-4 why we had to slice first.",
      solved: "Case closed. Read your diagnostic report below.",
    },
    Visual: CircuitBoardSVG,
    conceptMastered:
      "Subtracting unlike denominators — same-size pieces before taking any away",
    successBanner: "Logic Repaired: You must measure in the same size to remove pieces safely.",
  },
};

export const SUB_CASE_ORDER: SubCaseId[] = ["blueprint", "paint", "circuit"];
