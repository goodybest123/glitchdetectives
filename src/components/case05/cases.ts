/** Case 05 sub-case definitions. See `case01/cases.ts` for the shape. */
import type { ComponentType } from "react";
import { ConveyorBeltSVG } from "./ConveyorBeltSVG";
import { CoolantDrainSVG } from "./CoolantDrainSVG";
import { AssemblyLineSVG } from "./AssemblyLineSVG";

export type SubCaseId = "conveyor" | "coolant" | "assembly";
export type Operator = "+" | "−";

export type Fraction = { n: number; d: number };

export type VisualProps = {
  /** True once the child has set the denominator to the correct value. */
  solved: boolean;
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
  left: Fraction;
  right: Fraction;
  operator: Operator;
  correctNumerator: number;
  wrongDenominator: number;
  correctDenominator: number;
  stepperMin: number;
  stepperMax: number;
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
  conveyor: {
    id: "conveyor",
    title: "The Conveyor Belt",
    shortTitle: "Conveyor Belt",
    subtitle: "1/5 + 2/5 — combining parts",
    emoji: "📦",
    chatEndpoint: "/api/chat/case-05-conveyor",
    left: { n: 1, d: 5 },
    right: { n: 2, d: 5 },
    operator: "+",
    correctNumerator: 3,
    wrongDenominator: 10,
    correctDenominator: 5,
    stepperMin: 5,
    stepperMax: 10,
    welcomeText:
      "Excellent fix! ZED-4 added the bottom numbers and accidentally built a mutant 10-slot crate. Explain to him why we never add the bottom numbers when combining pieces.",
    bubbles: {
      investigate:
        "Ding ding ding — easy points for ZED-4! I added the top parts together AND I added the bottom slots together. One plus two on the top is three, five plus five on the bottom is ten — boom, 3 out of 10! I'd like to thank the audience, this category is too easy!",
      detect:
        "Click on the glitch.",
      solved: "Logic repaired. The crate stays the same size!",
    },
    captions: {
      investigate: "Scan the equation. Click the number that looks wrong.",
      detect: "Click on the glitch.",
      repair: "Keep stepping until the bottom number matches the crate.",
      explain: "The chat panel is open. Tell ZED-4 why the bottom number stays the same.",
      solved: "Case closed. Read your diagnostic report below.",
    },
    Visual: ConveyorBeltSVG,
    conceptMastered: "Adding like denominators — the whole stays the same size",
    successBanner: "Logic Repaired!",
  },
  coolant: {
    id: "coolant",
    title: "The Coolant Drain",
    shortTitle: "Coolant Drain",
    subtitle: "5/8 − 2/8 — subtracting parts",
    emoji: "🧪",
    chatEndpoint: "/api/chat/case-05-coolant",
    left: { n: 5, d: 8 },
    right: { n: 2, d: 8 },
    operator: "−",
    correctNumerator: 3,
    wrongDenominator: 0,
    correctDenominator: 8,
    stepperMin: 0,
    stepperMax: 8,
    welcomeText:
      "Great save! ZED-4 subtracted the bottom numbers and made the whole tank vanish! What does the bottom number represent, and why doesn't it change when we drain coolant?",
    bubbles: {
      investigate:
        "Survey says — JACKPOT! I subtracted straight across! Top: five minus two equals three. Bottom: eight minus eight equals ZERO. So we have 3 out of 0 coolant left. The crowd goes wild, the buzzers light up — round complete!",
      detect:
        "Click on the glitch.",
      solved: "Logic repaired. The tank is still there!",
    },
    captions: {
      investigate: "Scan the equation. Click the number that looks wrong.",
      detect: "Click on the glitch.",
      repair: "Step the bottom number back up to match the tank sections.",
      explain: "The chat panel is open. Tell ZED-4 why the tank doesn't disappear.",
      solved: "Case closed. Read your diagnostic report below.",
    },
    Visual: CoolantDrainSVG,
    conceptMastered: "Subtracting like denominators — the container stays the same",
    successBanner: "Logic Repaired!",
  },
  assembly: {
    id: "assembly",
    title: "The Assembly Line",
    shortTitle: "Assembly Line",
    subtitle: "2/6 + 3/6 — chips on a board",
    emoji: "🔧",
    chatEndpoint: "/api/chat/case-05-assembly",
    left: { n: 2, d: 6 },
    right: { n: 3, d: 6 },
    operator: "+",
    correctNumerator: 5,
    wrongDenominator: 12,
    correctDenominator: 6,
    stepperMin: 6,
    stepperMax: 12,
    welcomeText:
      "Case closed! ZED-4 added the 6s together and built a mutant motherboard. Why must the denominator stay exactly the same when adding these chips?",
    bubbles: {
      investigate:
        "Bonus round bonus round! I added the top chips — 2 plus 3 is 5 — AND I added the bottom sides — 6 plus 6 is 12! So obviously the motherboard upgraded itself to a 12-sided super-board with 5 chips on it. The audience is on their feet — this is my finest work!",
      detect:
        "Click on the glitch.",
      solved: "Logic repaired. The board is the right size!",
    },
    captions: {
      investigate: "Scan the equation. Click the number that looks wrong.",
      detect: "Click on the glitch.",
      repair: "Step the board back down to its proper size.",
      explain: "The chat panel is open. Tell ZED-4 why the board size stays the same.",
      solved: "Case closed. Read your diagnostic report below.",
    },
    Visual: AssemblyLineSVG,
    conceptMastered: "The denominator names the whole — it never changes when combining",
    successBanner: "Logic Repaired!",
  },
};

export const SUB_CASE_ORDER: SubCaseId[] = ["conveyor", "coolant", "assembly"];
