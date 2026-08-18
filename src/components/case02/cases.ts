/** Case 02 sub-case definitions. See `case01/cases.ts` for the shape. */
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
  /** When interactive, only this part counts as the glitch. */
  glitchTarget?: GlitchPart;
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
      investigate:
        "Observation log entry forty-seven. I scanned the bar and counted exactly 3 painted blocks on top, then exactly 2 blank blocks on the bottom — therefore the fraction is plainly 3 over 2. My report is filed and stamped. This case is solved.",
      detect: "Click on the glitch.",
      solved: "Logic repaired. The case is yours to close.",
    },
    captions: {
      investigate: "Scan ZED-4's logic. Click the wrong number in the fraction.",
      detect: "Click on the glitch.",
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
    successBanner: "Logic Repaired!",
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
      investigate:
        "Observation log entry forty-eight. The crate clearly has 4 total slots, so the big number 4 goes on top — the big proud number on top! The 1 battery underneath rides on the bottom like a passenger. My official reading: this crate is 4 over 1 full. I am certain.",
      detect: "Click on the glitch.",
      solved: "Logic repaired. The crate reads correctly now.",
    },
    captions: {
      investigate: "Look at the fraction. Click it if it seems upside down.",
      detect: "Click on the glitch.",
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
    successBanner: "Logic Repaired!",
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
      investigate:
        "Observation log entry forty-nine. I looked, I scanned, I counted the panels that were NOT glowing — exactly 2 dark ones — and wrote 2 on top. We are clearly generating 2 over 6 active power. Filed under: definitely correct.",
      detect: "Click on the glitch.",
      solved: "Logic repaired. The sign reads correctly.",
    },
    captions: {
      investigate: "Scan the sign. Click the wrong number.",
      detect: "Click on the glitch.",
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
    successBanner: "Logic Repaired!",
  },
};

export const SUB_CASE_ORDER: SubCaseId[] = ["bar", "crate", "panels"];
