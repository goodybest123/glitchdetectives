import type { ComponentType, ReactNode } from "react";
import { FuelTanksSVG } from "./FuelTanksSVG";
import { GardenBedsSVG } from "./GardenBedsSVG";
import { MemoryDisksSVG } from "./MemoryDisksSVG";

export type SubCaseId = "tanks" | "garden" | "disks";
export type Operator = "<" | "=" | ">";

export type VisualProps = {
  /** When false, internal divider lines fade away to reveal equal totals. */
  dividersVisible: boolean;
  /** Bump to replay any "solved" animation. */
  spinKey?: number;
  /** Rendered between the two shapes (typically the comparator). */
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
  /** ZED-4's wrong choice. The target is always "=" in Case 03. */
  wrongOperator: Operator;
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
  tanks: {
    id: "tanks",
    title: "The Fuel Tanks",
    shortTitle: "Fuel Tanks",
    subtitle: "Same fuel, different cuts",
    emoji: "⛽",
    chatEndpoint: "/api/chat/case-03-tanks",
    left: { n: 1, d: 2 },
    right: { n: 2, d: 4 },
    wrongOperator: ">",
    welcomeText:
      "Excellent fix! ZED-4 thought Tank B had more fuel because 4 is bigger than 2. Why does cutting the tank into more pieces NOT give you more fuel?",
    bubbles: {
      investigate:
        "Trivial! By the universally accepted Law of Bigger Bottom Numbers, 4 is mathematically superior to 2, which means Tank B is mathematically more full. The numbers don't lie — the bigger the bottom, the bigger the fuel. I'd publish this in a textbook.",
      detect:
        "Detective — something doesn't match. Click the symbol between the tanks if it looks wrong.",
      solved: "Logic repaired. Both tanks hold the same fuel!",
    },
    captions: {
      investigate: "Scan the symbol between the tanks. Click it if it looks wrong.",
      detect: "Now choose the right symbol below.",
      repair: "Pick the symbol that matches what you see.",
      explain: "The chat panel is open. Tell ZED-4 why the tanks are equal.",
      solved: "Case closed. Read your diagnostic report below.",
    },
    Visual: FuelTanksSVG,
    conceptMastered: "Equivalent fractions — more pieces means smaller pieces",
    successBanner: "Logic Repaired!",
  },
  garden: {
    id: "garden",
    title: "The Garden Beds",
    shortTitle: "Garden Beds",
    subtitle: "Same area, more rows",
    emoji: "🌱",
    chatEndpoint: "/api/chat/case-03-garden",
    left: { n: 1, d: 3 },
    right: { n: 2, d: 6 },
    wrongOperator: "<",
    welcomeText:
      "Great fix! ZED-4 looked at the number 6 and assumed it was bigger. Explain to him why having 6 rows doesn't mean you have more plants if the garden bed is the exact same size.",
    bubbles: {
      investigate:
        "Elementary horticulture, really. By my exclusive theorem — the More-Rows-More-Plants Principle — a bed cut into 6 rows must therefore grow strictly more plants than a bed cut into only 3. The number 6 is BIGGER than 3, and bigger numbers mean bigger gardens. Quod erat demonstrandum.",
      detect:
        "Detective — something looks fishy. Click the symbol between the beds if it looks wrong.",
      solved: "Logic repaired. Both beds grow the same plants!",
    },
    captions: {
      investigate: "Scan the symbol between the beds. Click it if it looks wrong.",
      detect: "Now choose the right symbol below.",
      repair: "Pick the symbol that matches the green area.",
      explain: "The chat panel is open. Tell ZED-4 why the beds are equal.",
      solved: "Logic repaired. Both beds grow the same plants!",
    },
    Visual: GardenBedsSVG,
    conceptMastered: "Equivalent fractions — same area, just more cuts",
    successBanner: "Logic Repaired!",
  },
  disks: {
    id: "disks",
    title: "The Memory Disks",
    shortTitle: "Memory Disks",
    subtitle: "Same data, smaller slices",
    emoji: "💿",
    chatEndpoint: "/api/chat/case-03-disks",
    left: { n: 3, d: 4 },
    right: { n: 6, d: 8 },
    wrongOperator: "<",
    welcomeText:
      "Case closed! ZED-4 got tricked because the number 6 is bigger than 3. How can 6 slices be the exact same amount of data as 3 slices?",
    bubbles: {
      investigate:
        "A clear application of my patented Bigger-Slice-Count Conjecture: Disk B has SIX slices of data, and six is famously larger than three. Therefore Disk B is storing strictly more data. The math is bulletproof. I have circuits for this kind of thing.",
      detect:
        "Detective — the symbol doesn't match. Click it if it looks wrong.",
      solved: "Logic repaired. Both disks store the same data!",
    },
    captions: {
      investigate: "Scan the symbol between the disks. Click it if it looks wrong.",
      detect: "Now choose the right symbol below.",
      repair: "Pick the symbol that matches the purple area.",
      explain: "The chat panel is open. Tell ZED-4 why the disks are equal.",
      solved: "Case closed. Read your diagnostic report below.",
    },
    Visual: MemoryDisksSVG,
    conceptMastered: "Equivalent fractions — 6 small slices can equal 3 big ones",
    successBanner: "Logic Repaired!",
  },
};

export const SUB_CASE_ORDER: SubCaseId[] = ["tanks", "garden", "disks"];
