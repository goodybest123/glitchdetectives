import type { ConceptKey } from "./types";
import { isVagueAnswer } from "@/lib/reasoning-evaluator";

/** Concept-specific keywords that must appear in a passing explanation. */
const KEYWORDS: Record<ConceptKey, string[]> = {
  numerator: [
    "top", "numerator", "selected", "shaded", "lit", "glow", "glowing",
    "highlighted", "active", "chosen", "filled",
  ],
  denominator: [
    "bottom", "denominator", "total", "all", "whole", "every", "equal parts",
    "parts in total", "in all",
  ],
  "unit-fraction": [
    "one", "1", "unit", "numerator is 1", "top is 1", "single",
  ],
  "fraction-of-set": [
    "total", "all", "objects", "group", "set", "out of", "selected",
    "glowing", "active", "every",
  ],
};

export function hasConceptKeywordL2(text: string, concept: ConceptKey): boolean {
  const t = text.toLowerCase();
  return KEYWORDS[concept].some((kw) => t.includes(kw));
}

/** Override LLM "correct" verdict when answer is vague AND lacks any concept keyword. */
export function shouldOverrideToFalseL2(text: string, concept: ConceptKey): boolean {
  return isVagueAnswer(text) && !hasConceptKeywordL2(text, concept);
}

/** Adaptive 3-step hint copy per concept and attempt. */
export function hintForL2(
  attempt: number,
  concept: ConceptKey,
  caseHints: [string, string, string],
): string | null {
  if (attempt < 1) return null;
  return caseHints[Math.min(attempt - 1, caseHints.length - 1)];
}

/** Model-reasoning examples shown in the 🧠 feedback line. */
export const MODEL_REASONING: Record<ConceptKey, string> = {
  numerator:
    "The numerator counts the parts that are selected — not the whole.",
  denominator:
    "The denominator counts every equal part of the whole, lit or not.",
  "unit-fraction":
    "A unit fraction has a 1 on top — one single equal part of the whole.",
  "fraction-of-set":
    "For a set, the bottom is the total objects and the top is the chosen ones.",
};
