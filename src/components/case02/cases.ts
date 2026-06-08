import type { ComponentType } from "react";
import { FractionBarSVG } from "./FractionBarSVG";
import { EnergyCrateSVG } from "./EnergyCrateSVG";
import { SolarPanelsSVG } from "./SolarPanelsSVG";

export type SubCaseId = "bar" | "crate" | "panels";

export type GlitchPart = "numerator" | "denominator" | "fraction";

export type VisualProps = {
  numerator: number;
  denominator: number;
  highlight: "none" | GlitchPart;
  onClickPart?: (part: GlitchPart) => void;
  interactive?: boolean;
  pulseKey?: number;
};

export type RepairKind = "stepper-denominator" | "stepper-numerator" | "swap";

export type SubCaseDef = {
  id: SubCaseId;
  title: string;
  shortTitle: string;
  subtitle: string;
  emoji: string;
  chatEndpoint: string;
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
  initial: { numerator: number; denominator: number };
  target: { numerator: number; denominator: number };
  glitchTarget: GlitchPart;
  repair: RepairKind;
  /** Stepper bounds when repair is a stepper */
  stepperRange?: { min: number; max: number };
  /** Minimum interactions to reach target (for marks rubric) */
  minSteps: number;
  successBanner: string;
};

export const SUB_CASES: Record<SubCaseId, SubCaseDef> = {
  bar: {
    id: "bar",
    title: "The Fraction Bar",
    shortTitle: "Fraction Bar",
    subtitle: "Counting all the pieces",
    emoji: "🟩",
    chatEndpoint: "/api/chat/case-02-bar",
    welcomeText:
      "Great detective work! ZED-4 thought the bottom number was just the blank pieces. What does the bottom number actually count?",
    bubbles: {
      investigate: "I counted 3 painted blocks and 2 blank blocks. The fraction is 3/2!",
      detect: "Glitch Detected! Did I count the bottom number wrong?",
      solved: "Logic repaired. The case is yours to close.",
    },
    captions: {
      investigate: "Scan ZED-4's logic. Click the wrong number in the fraction.",
      detect: "Now use the − and + buttons to fix the bottom number.",
      repair: "Keep going — the bottom number should count every block.",
      explain: "The chat panel is open. Tell ZED-4 what the bottom number means.",
      solved: "Case closed. Read your diagnostic report below.",
    },
    Visual: FractionBarSVG,
    conceptMastered: "Denominator — the bottom number counts ALL the pieces",
    initial: { numerator: 3, denominator: 2 },
    target: { numerator: 3, denominator: 5 },
    glitchTarget: "denominator",
    repair: "stepper-denominator",
    stepperRange: { min: 1, max: 9 },
    minSteps: 3,
    successBanner: "Logic Repaired: The bottom number counts ALL the pieces.",
  },
  crate: {
    id: "crate",
    title: "The Energy Crate",
    shortTitle: "Energy Crate",
    subtitle: "Top vs. bottom number",
    emoji: "🔋",
    chatEndpoint: "/api/chat/case-02-crate",
    welcomeText:
      "Great fix! ZED-4 put the total number of battery slots on the top. Why does the 4 belong on the bottom and the 1 on the top?",
    bubbles: {
      investigate: "My battery crate is 4/1 full!",
      detect: "Glitch Detected! Are those numbers in the wrong place?",
      solved: "Logic repaired. The crate reads correctly now.",
    },
    captions: {
      investigate: "Look at the fraction. Click it if it seems upside down.",
      detect: "Tap the Swap button to flip the numbers.",
      repair: "Swap them so the total sits on the bottom.",
      explain: "The chat panel is open. Tell ZED-4 why the total goes on the bottom.",
      solved: "Case closed. Read your diagnostic report below.",
    },
    Visual: EnergyCrateSVG,
    conceptMastered: "Top vs. bottom — the total goes on the bottom",
    initial: { numerator: 4, denominator: 1 },
    target: { numerator: 1, denominator: 4 },
    glitchTarget: "fraction",
    repair: "swap",
    minSteps: 1,
    successBanner: "Logic Repaired: The total always goes on the bottom.",
  },
  panels: {
    id: "panels",
    title: "The Solar Panels",
    shortTitle: "Solar Panels",
    subtitle: "Counting the right pieces",
    emoji: "🔆",
    chatEndpoint: "/api/chat/case-02-panels",
    welcomeText:
      "Case closed! The sign asked for the 'active' power, but ZED-4 typed a 2. What mistake did he make when looking at the panels?",
    bubbles: {
      investigate: "We are generating 2/6 active power!",
      detect: "Glitch Detected! Did I count the wrong panels?",
      solved: "Logic repaired. The sign reads correctly.",
    },
    captions: {
      investigate: "Scan the sign. Click the wrong number.",
      detect: "Use − and + to count the glowing panels.",
      repair: "Keep going — count only the active panels.",
      explain: "The chat panel is open. Tell ZED-4 which panels to count.",
      solved: "Case closed. Read your diagnostic report below.",
    },
    Visual: SolarPanelsSVG,
    conceptMastered: "Numerator — the top number counts the ACTIVE pieces",
    initial: { numerator: 2, denominator: 6 },
    target: { numerator: 4, denominator: 6 },
    glitchTarget: "numerator",
    repair: "stepper-numerator",
    stepperRange: { min: 0, max: 6 },
    minSteps: 2,
    successBanner: "Logic Repaired: The top number counts the active pieces.",
  },
};

export const SUB_CASE_ORDER: SubCaseId[] = ["bar", "crate", "panels"];
