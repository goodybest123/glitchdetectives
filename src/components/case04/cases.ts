import type { ComponentType, ReactNode } from "react";
import { BalanceScaleSVG } from "./BalanceScaleSVG";
import { CoolantTubesSVG } from "./CoolantTubesSVG";
import { MetalBeamsSVG } from "./MetalBeamsSVG";

export type SubCaseId = "cargo" | "coolant" | "beams";
export type Operator = "<" | "=" | ">";

export type VisualProps = {
  /** True once the child has selected the correct operator. */
  solved: boolean;
  /** Bump to replay a "solved" animation (pulse / grid fade). */
  pulseKey?: number;
  /** Rendered alongside the visual (typically the comparator + fraction display). */
  middleSlot?: ReactNode;
};

export type Fraction = { n: number; d: number };

export type SubCaseDef = {
  id: SubCaseId;
  title: string;
  shortTitle: string;
  subtitle: string;
  emoji: string;
  chatEndpoint: string;
  left: Fraction;
  right: Fraction;
  wrongOperator: Operator;
  correctOperator: Operator;
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
  cargo: {
    id: "cargo",
    title: "The Cargo Blocks",
    shortTitle: "Cargo Blocks",
    subtitle: "Which block is heavier?",
    emoji: "📦",
    chatEndpoint: "/api/chat/case-04-cargo",
    left: { n: 1, d: 8 },
    right: { n: 1, d: 4 },
    wrongOperator: ">",
    correctOperator: "<",
    welcomeText:
      "Brilliant! ZED-4 thought 1/8 was heavier because 8 is a big number. Explain to him why an 8 on the bottom actually makes the block smaller.",
    bubbles: {
      investigate:
        "AND folks, the winner of the heavyweight bout is — 1 OVER 8! Look at that gigantic number 8 on the bottom — eight is huge, four is puny, the call on the floor stands! 1/8 brings the BIG number, so 1/8 brings the BIG weight! I'd bet my circuits on it!",
      detect:
        "Detective — the symbol on the display looks wrong. Click it!",
      solved: "Logic repaired. The 1/4 block is heavier!",
    },
    captions: {
      investigate: "Scan the symbol on the display. Click it if it looks wrong.",
      detect: "Now choose the right symbol below.",
      repair: "Pick the symbol that matches the real block sizes.",
      explain: "The chat panel is open. Tell ZED-4 why 1/4 is heavier.",
      solved: "Case closed. Read your diagnostic report below.",
    },
    Visual: BalanceScaleSVG,
    conceptMastered: "Bigger bottom number means smaller pieces",
    successBanner: "Logic Repaired!",
  },
  coolant: {
    id: "coolant",
    title: "The Liquid Coolant",
    shortTitle: "Liquid Coolant",
    subtitle: "Same top, different bottoms",
    emoji: "🧪",
    chatEndpoint: "/api/chat/case-04-coolant",
    left: { n: 2, d: 3 },
    right: { n: 2, d: 5 },
    wrongOperator: "<",
    correctOperator: ">",
    welcomeText:
      "Great fix! ZED-4 has 2 pieces of coolant in both tubes. Why do 2 'thirds' take up more space than 2 'fifths'?",
    bubbles: {
      investigate:
        "And down the home stretch — Tube B is roaring ahead with 2 over 5 because, ladies and gents, 5 is bigger than 3, and bigger numbers always mean MORE coolant! It's a landslide victory for Tube B! I've called a thousand races and this one isn't even close!",
      detect:
        "Detective — the symbol looks wrong. Click the display!",
      solved: "Logic repaired. Thirds are larger than fifths!",
    },
    captions: {
      investigate: "Scan the symbol on the display. Click it if it looks wrong.",
      detect: "Now choose the right symbol below.",
      repair: "Pick the symbol that matches the fluid you see.",
      explain: "The chat panel is open. Tell ZED-4 why 2/3 is more.",
      solved: "Case closed. Read your diagnostic report below.",
    },
    Visual: CoolantTubesSVG,
    conceptMastered: "Same top number — smaller bottom means bigger pieces",
    successBanner: "Logic Repaired!",
  },
  beams: {
    id: "beams",
    title: "The Metal Beams",
    shortTitle: "Metal Beams",
    subtitle: "Length tells the truth",
    emoji: "🔩",
    chatEndpoint: "/api/chat/case-04-beams",
    left: { n: 3, d: 4 },
    right: { n: 3, d: 8 },
    wrongOperator: "<",
    correctOperator: ">",
    welcomeText:
      "Case closed! ZED-4 keeps getting tricked by the bottom numbers. What happens to the size of our pieces the larger the bottom number gets?",
    bubbles: {
      investigate:
        "Coming in HOT to the construction site — Beam B is the obvious winner, towering over Beam A! Why? Because 8 is greater than 4 — that's championship-level math! Bigger bottom number, bigger beam, every single time! Take it from your favorite sports robot — this one's a done deal!",
      detect:
        "Detective — the symbol on the display doesn't match! Click it!",
      solved: "Logic repaired. The 3/4 beam is longer!",
    },
    captions: {
      investigate: "Scan the symbol on the display. Click it if it looks wrong.",
      detect: "Now choose the right symbol below.",
      repair: "Pick the symbol that matches the real beam lengths.",
      explain: "The chat panel is open. Tell ZED-4 why 3/4 is longer.",
      solved: "Case closed. Read your diagnostic report below.",
    },
    Visual: MetalBeamsSVG,
    conceptMastered: "Bigger bottom number = smaller pieces, every time",
    successBanner: "Logic Repaired!",
  },
};

export const SUB_CASE_ORDER: SubCaseId[] = ["cargo", "coolant", "beams"];
