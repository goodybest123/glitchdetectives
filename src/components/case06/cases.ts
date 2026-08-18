/** Case 06 sub-case definitions. See `case01/cases.ts` for the shape. */
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
      investigate:
        "Standard engineering procedure — I've run the simulation twice and the numbers line up. I added the tops, 1 plus 1 equals 2, then I added the bottoms, 2 plus 4 equals 6. Final answer: 2 over 6. Everything fits in the box. Filed under: completely solved.",
      detect: "Click on the glitch.",
      solved: "Logic repaired. All pieces are the same size now!",
    },
    captions: {
      investigate: "Scan the equation. Click the answer that looks wrong.",
      detect: "Click on the glitch.",
      repair: "Cut the big block until both pieces are the same size.",
      explain: "The chat is open. Tell ZED-4 why we had to slice first.",
      solved: "Case closed. Read your diagnostic report below.",
    },
    Visual: BlueprintSVG,
    conceptMastered: "Adding unlike denominators — pieces must be the same size first",
    successBanner: "Logic Repaired!",
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
      investigate:
        "Routine paint-mix protocol — I verified the math against my schematics. Top numbers: 1 plus 1 makes 2. Bottom numbers: 3 plus 6 makes 9. Therefore the combined vat reads 2 over 9. The blueprint is signed, sealed, and frankly elegant. I do not make mistakes.",
      detect: "Click on the glitch.",
      solved: "Logic repaired. The vats use the same grid now!",
    },
    captions: {
      investigate: "Scan the equation. Click the answer that looks wrong.",
      detect: "Click on the glitch.",
      repair: "Add a line so both vats measure the same way.",
      explain: "The chat is open. Tell ZED-4 why the vats need the same grid.",
      solved: "Case closed. Read your diagnostic report below.",
    },
    Visual: PaintVatsSVG,
    conceptMastered: "Adding unlike denominators — the vats need the same measuring grid",
    successBanner: "Logic Repaired!",
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
      investigate:
        "Performing power-cell subtraction by the book. Top: 1 minus 1 is 0. Bottom: 2 minus 8 — I'll round that to 6 for engineering safety. Final reading: 0 over 6 power remaining. Everything checks out. I have run the diagnostics twice, and frankly that should be enough.",
      detect: "Click on the glitch.",
      solved: "Logic repaired. Power is safe — 3/8 left!",
    },
    captions: {
      investigate: "Scan the equation. Click the answer that looks wrong.",
      detect: "Click on the glitch.",
      repair: "Cut the cell into eighths so the chip can pop out safely.",
      explain: "The chat is open. Tell ZED-4 why we had to slice first.",
      solved: "Case closed. Read your diagnostic report below.",
    },
    Visual: CircuitBoardSVG,
    conceptMastered: "Subtracting unlike denominators — same-size pieces before taking any away",
    successBanner: "Logic Repaired!",
  },
};

export const SUB_CASE_ORDER: SubCaseId[] = ["blueprint", "paint", "circuit"];
