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
      investigate: "Tank B has way more fuel because 4 is bigger than 2!",
      detect: "Glitch Detected! Wait, look at the fuel levels...",
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
    successBanner: "Logic Repaired: The amounts are exactly the same.",
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
      investigate: "Bed B is growing way more plants because 6 is bigger than 3!",
      detect: "Glitch Detected! Wait, look at the size of the green space...",
      solved: "Logic repaired. Both beds grow the same plants!",
    },
    captions: {
      investigate: "Scan the symbol between the beds. Click it if it looks wrong.",
      detect: "Now choose the right symbol below.",
      repair: "Pick the symbol that matches the green area.",
      explain: "The chat panel is open. Tell ZED-4 why the beds are equal.",
      solved: "Case closed. Read your diagnostic report below.",
    },
    Visual: GardenBedsSVG,
    conceptMastered: "Equivalent fractions — same area, just more cuts",
    successBanner: "Logic Repaired: The total planted area is identical.",
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
      investigate: "Disk B holds more data! 6 slices of data is way more than 3!",
      detect: "Glitch Detected! Let me look at the empty space left on both disks...",
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
    successBanner: "Logic Repaired: The data takes up the same amount of space.",
  },
};

export const SUB_CASE_ORDER: SubCaseId[] = ["tanks", "garden", "disks"];
