import type { CaseDef, ConceptKey } from "@/lib/level2/types";
import type { BuilderConfig, BuilderChip } from "@/components/SentenceBuilder";

export type BuilderMode = "detect" | "explain";

/**
 * Concept-aware chip bank for the Sentence Builder used inside ConversationPanel
 * (Levels 2–6). Strong chips name the target mathematical concept; distractors
 * are plausible-but-wrong moves children commonly attempt.
 */
export function getBuilderConfig(caseDef: CaseDef, mode: BuilderMode): BuilderConfig {
  const t = caseDef.truth;
  const z = caseDef.zedClaim;
  const total = caseDef.visual.total;
  const lit = caseDef.visual.selected.length;
  const partNoun = nounFor(caseDef.visual.kind);

  const stem =
    mode === "detect"
      ? "The glitch is because"
      : "The answer is right because";

  const chips = bankFor(caseDef.conceptKey, mode, {
    t, z, total, lit, partNoun,
  });

  return { stem, chips };
}

function nounFor(kind: CaseDef["visual"]["kind"]): string {
  switch (kind) {
    case "pizza": return "slices";
    case "circle": return "slices";
    case "bar": return "parts";
    case "grid": return "cells";
    case "set": return "objects";
    default: return "parts";
  }
}

type Ctx = {
  t: { numerator: number; denominator: number };
  z: { numerator: number; denominator: number };
  total: number;
  lit: number;
  partNoun: string;
};

function chip(id: string, text: string, isStrong = false): BuilderChip {
  return { id, text, isStrong };
}

function bankFor(key: ConceptKey, mode: BuilderMode, c: Ctx): BuilderChip[] {
  const { t, z, total, lit, partNoun } = c;

  switch (key) {
    case "numerator":
      return [
        chip("s1", `the top number counts the ${partNoun} that are filled`, true),
        chip("s2", `${lit} ${partNoun} are filled, so the top is ${lit}`, true),
        chip("d1", `you should count every ${partNoun.slice(0, -1)} in the whole`),
        chip("d2", `the top number can be anything`),
        chip("d3", `${z.numerator} is the right top number`),
      ];

    case "denominator":
      return [
        chip("s1", `the bottom number names all the equal ${partNoun}`, true),
        chip("s2", `there are ${total} equal ${partNoun} in the whole`, true),
        chip("d1", `the bottom only counts the empty ${partNoun}`),
        chip("d2", `the bottom changes when we shade more`),
        chip("d3", `${z.denominator} is the right bottom number`),
      ];

    case "unit-fraction":
      return [
        chip("s1", `a unit fraction always has 1 on top`, true),
        chip("s2", `only one piece is taken`, true),
        chip("d1", `unit fractions have 1 on the bottom`),
        chip("d2", `any small fraction is a unit fraction`),
      ];

    case "fraction-of-set":
      return [
        chip("s1", `${lit} of the ${total} ${partNoun} are picked`, true),
        chip("s2", `the bottom names the whole group of ${total}`, true),
        chip("d1", `only the picked ${partNoun} count as the whole`),
        chip("d2", `we should only count empty ${partNoun}`),
      ];

    case "number-line":
      return [
        chip("s1", `the road from 0 to 1 is cut into ${t.denominator} equal steps`, true),
        chip("s2", `we stop after ${t.numerator} steps`, true),
        chip("d1", `we count every tick mark, even past 1`),
        chip("d2", `the steps don't have to be equal`),
      ];

    case "equivalence":
      return [
        chip("s1", `both fractions cover the same amount`, true),
        chip("s2", `same shaded space, just sliced differently`, true),
        chip("d1", `bigger bottom number always means bigger fraction`),
        chip("d2", `the numbers must match to be equal`),
      ];

    case "comparison":
      return [
        chip("s1", `the wholes are the same size`, true),
        chip("s2", `the one with more shaded is bigger`, true),
        chip("d1", `the bigger bottom number wins`),
        chip("d2", `the bigger top number always wins`),
      ];

    case "whole-as-fraction":
      return [
        chip("s1", `all ${total} ${partNoun} are filled`, true),
        chip("s2", `top equals bottom, so it's 1 whole`, true),
        chip("d1", `a full whole is written as 0`),
        chip("d2", `you can never write 1 as a fraction`),
      ];

    case "add-like":
      return [
        chip("s1", `the ${partNoun} are the same size`, true),
        chip("s2", `we add the top numbers only`, true),
        chip("s3", `the bottom stays ${t.denominator}`, true),
        chip("d1", `we add the bottoms too`),
        chip("d2", `the pieces get smaller when we add`),
      ];

    case "subtract-like":
      return [
        chip("s1", `the ${partNoun} are the same size`, true),
        chip("s2", `we subtract the top numbers only`, true),
        chip("s3", `the bottom stays ${t.denominator}`, true),
        chip("d1", `we subtract the bottoms too`),
        chip("d2", `the pieces change size when we take some away`),
      ];

    case "denominator-stability":
      return [
        chip("s1", `the whole is still cut into ${t.denominator} equal ${partNoun}`, true),
        chip("s2", `the bottom names the piece size — it can't change`, true),
        chip("d1", `taking pieces away makes the bottom smaller`),
        chip("d2", `adding pieces makes the bottom bigger`),
      ];

    case "equivalence-generation":
      return [
        chip("s1", `each piece is split into the same number of smaller pieces`, true),
        chip("s2", `top and bottom both grow by the same number`, true),
        chip("d1", `we only multiply the top`),
        chip("d2", `we add the same number to top and bottom`),
      ];

    case "simplification":
      return [
        chip("s1", `we group equal pieces into bigger equal chunks`, true),
        chip("s2", `same amount, just fewer ${partNoun}`, true),
        chip("d1", `we subtract the same number from top and bottom`),
        chip("d2", `simplifying changes the amount`),
      ];

    case "mixed-ops":
      return [
        chip("s1", `the ${partNoun} have to be the same size first`, true),
        chip("s2", `we fix one step at a time`, true),
        chip("s3", `the bottom stays the same when the pieces match`, true),
        chip("d1", `we can mix different-size ${partNoun} directly`),
        chip("d2", `the order of steps doesn't matter`),
        ...(mode === "explain"
          ? [chip("s4", `the repaired answer is ${t.numerator}/${t.denominator}`, true)]
          : []),
      ];

    default:
      return [
        chip("s1", `the ${partNoun} have to be the same size`, true),
        chip("s2", `the bottom names the piece size`, true),
        chip("d1", `the numbers can be anything`),
      ];
  }
}
