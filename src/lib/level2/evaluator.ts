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
  "number-line": [
    "halfway", "middle", "between", "closer", "near", "before", "after",
    "left", "right", "1/2", "half", "quarter", "tick", "mark", "spot", "position", "checkpoint",
  ],
  equivalence: [
    "same", "equal", "match", "amount", "size", "half", "double", "same amount", "the same",
  ],
  comparison: [
    "bigger", "smaller", "more", "less", "larger", "fewer", "greater", "than", "shaded", "filled",
  ],
  "whole-as-fraction": [
    "whole", "all", "complete", "one whole", "full", "every part", "every piece", "all of it",
  ],
  "add-like": [
    "add", "added", "plus", "combine", "combined", "merge", "together", "total",
    "same size", "same bottom", "equal parts", "count", "more",
  ],
  "subtract-like": [
    "subtract", "minus", "remove", "take away", "took", "leak", "left", "leftover",
    "same bottom", "same size", "equal parts", "fewer", "less",
  ],
  "denominator-stability": [
    "same", "stays", "stay", "doesn't change", "did not change", "same bottom",
    "same size", "equal parts", "whole", "partition",
  ],
  "equivalence-generation": [
    "multiply", "times", "double", "triple", "split", "cut", "twice", "same amount",
    "equal", "equivalent", "both", "top and bottom",
  ],
  simplification: [
    "group", "groups", "combine", "divide", "divided", "factor", "common",
    "smaller", "simpler", "reduce", "simplest", "same amount", "fewer pieces",
  ],
  "mixed-ops": [
    "first", "then", "next", "after", "step", "combine", "simplify", "equivalent",
    "add", "subtract", "same", "result", "answer",
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
  "number-line":
    "On a number line, the fraction tells us where to stop between 0 and 1.",
  equivalence:
    "Equivalent fractions cover the same amount, even when the numbers look different.",
  comparison:
    "When the wholes are the same size, the fraction with more shaded parts is bigger.",
  "whole-as-fraction":
    "When every part is filled, the fraction equals one whole.",
  "add-like":
    "When the parts are the same size, we add the top numbers — the bottom number tells us the part size and stays the same.",
  "subtract-like":
    "Equal-size parts means we just take away the top numbers — the bottom number names the size and doesn't change.",
  "denominator-stability":
    "The whole was split into the same equal parts before and after, so the bottom number can't change.",
  "equivalence-generation":
    "If we split each piece into the same number of smaller pieces, the top and bottom both grow by that number — same amount, more pieces.",
  simplification:
    "We can group equal pieces into bigger equal chunks. Same amount of pizza, fewer parts named.",
  "mixed-ops":
    "Repair one step at a time: keep the bottom number when the parts are the same, then simplify at the end.",
};
