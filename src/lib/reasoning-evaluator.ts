/**
 * Local, deterministic pre-checks that run BEFORE we trust the LLM's
 * `isCorrect` verdict. Goal: stop vague one-word answers ("yeah",
 * "wrong", "idk") from auto-passing the reasoning gate.
 */

export const CONCEPT_KEYWORDS = [
  "equal", "equally", "same", "same size", "same-size",
  "match", "matching", "even", "evenly",
  "fair", "unfair", "not fair",
  "half", "halves", "halve",
  "quarter", "quarters", "fourth", "fourths",
  "third", "thirds",
  "bigger", "smaller", "larger",
  "split", "share", "shares", "shared",
  "part", "parts", "piece", "pieces",
] as const;

const VAGUE_PATTERNS = [
  /^(yes|yeah|yep|no|nope|ok|okay|sure|maybe|idk|dunno)\.?$/i,
  /^(right|wrong|correct|incorrect|true|false)\.?$/i,
  /^(it.?s? wrong|it.?s? right|it.?s? bad|it.?s? off)\.?$/i,
  /^i don.?t know\.?$/i,
];

export function hasConceptKeyword(text: string): boolean {
  const t = text.toLowerCase();
  return CONCEPT_KEYWORDS.some((kw) => t.includes(kw));
}

export function isVagueAnswer(text: string): boolean {
  const trimmed = text.trim();
  if (trimmed.split(/\s+/).length <= 1) return true;
  return VAGUE_PATTERNS.some((re) => re.test(trimmed));
}

/**
 * Should we override an LLM "correct" verdict back to "needs more"?
 * We override when the answer is vague AND lacks any concept keyword.
 */
export function shouldOverrideToFalse(text: string): boolean {
  return isVagueAnswer(text) && !hasConceptKeyword(text);
}

/** Progressive hint text per failed attempt count. */
export function hintForAttempt(
  attempt: number,
  mode: "detect" | "wrong" | "explain",
): string | null {
  if (attempt < 1) return null;
  const detect = [
    "Try using a size word: are the parts the same size, or is one bigger?",
    "Look closely at the cut. Tell ZED what's different about the two pieces.",
    "Use the word equal or fair in your answer — that's the big idea.",
  ];
  const teach = [
    "Try the word equal. What has to be true about the pieces?",
    "Tell ZED: each piece has to be the ___ size.",
    "The key idea is fair shares — all parts the same size.",
  ];
  const list = mode === "detect" || mode === "wrong" ? detect : teach;
  return list[Math.min(attempt - 1, list.length - 1)];
}
