import { CONCEPT_KEYWORDS } from "./reasoning-evaluator";

export type ScoreCategory =
  | "investigation"
  | "errorDetection"
  | "repairAccuracy"
  | "explanationQuality"
  | "vocabulary"
  | "criticalThinking";

export const CATEGORY_LABELS: Record<ScoreCategory, string> = {
  investigation: "Investigation",
  errorDetection: "Error Detection",
  repairAccuracy: "Repair Accuracy",
  explanationQuality: "Explanation Quality",
  vocabulary: "Mathematical Vocabulary",
  criticalThinking: "Critical Thinking",
};

export type ExplainAttempt = {
  text: string;
  /** 1–3 from LLM evaluator. */
  reasoningScore: number;
  modality: "voice" | "type" | "build";
};

export type MissionTelemetry = {
  /** Did the child detect the glitch on the first try? */
  detectedFirstTry: boolean;
  repairAttempts: number;
  /** Target attempts: usually 1 for a clean repair. */
  idealRepairAttempts: number;
  hintsUsed: number;
  explainAttempts: ExplainAttempt[];
  teachAttempts: ExplainAttempt[];
};

export type ScoreBreakdown = Record<ScoreCategory, number>;

export type ReasoningReport = {
  overall: number;
  breakdown: ScoreBreakdown;
  strengths: string[];
  growthAreas: string[];
};

function clamp(n: number, lo = 0, hi = 100) {
  return Math.max(lo, Math.min(hi, Math.round(n)));
}

function countConceptKeywords(text: string): number {
  const t = text.toLowerCase();
  let n = 0;
  for (const kw of CONCEPT_KEYWORDS) if (t.includes(kw)) n++;
  return n;
}

function avg(nums: number[], fallback = 0) {
  if (nums.length === 0) return fallback;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

export function computeReasoningReport(t: MissionTelemetry): ReasoningReport {
  // Investigation: rewarded for engaging without leaning on hints early
  const investigation = clamp(95 - t.hintsUsed * 12);

  // Error Detection: first-try detection is the gold standard
  const errorDetection = clamp(t.detectedFirstTry ? 95 : 70 - t.hintsUsed * 5);

  // Repair Accuracy: close to ideal attempts = high
  const overshoot = Math.max(0, t.repairAttempts - t.idealRepairAttempts);
  const repairAccuracy = clamp(95 - overshoot * 15);

  // Explanation Quality: LLM 1–3 scores from teach + explain attempts, mapped to 0-100
  const allExplains = [...t.explainAttempts, ...t.teachAttempts];
  const llmAvg = avg(allExplains.map((a) => a.reasoningScore), 2);
  const explanationQuality = clamp(((llmAvg - 1) / 2) * 80 + 20);

  // Vocabulary: concept keywords across all explanations
  const totalKw = allExplains.reduce((sum, a) => sum + countConceptKeywords(a.text), 0);
  const vocabulary = clamp(Math.min(100, 40 + totalKw * 15));

  // Critical Thinking: blend of explanation depth (length + LLM score) minus hints
  const avgLen = avg(allExplains.map((a) => a.text.split(/\s+/).length), 0);
  const criticalThinking = clamp(
    ((llmAvg - 1) / 2) * 60 + Math.min(30, avgLen * 2) - t.hintsUsed * 8 + 15,
  );

  const breakdown: ScoreBreakdown = {
    investigation,
    errorDetection,
    repairAccuracy,
    explanationQuality,
    vocabulary,
    criticalThinking,
  };

  const overall = clamp(
    (investigation +
      errorDetection +
      repairAccuracy +
      explanationQuality * 1.5 +
      vocabulary +
      criticalThinking * 1.5) /
      7,
  );

  // Narrative
  const strengths: string[] = [];
  const growthAreas: string[] = [];
  const entries = Object.entries(breakdown) as [ScoreCategory, number][];
  const sorted = [...entries].sort((a, b) => b[1] - a[1]);
  for (const [cat, val] of sorted.slice(0, 3)) {
    if (val >= 80) strengths.push(strengthCopy(cat));
  }
  for (const [cat, val] of sorted.reverse().slice(0, 2)) {
    if (val < 75) growthAreas.push(growthCopy(cat));
  }
  if (strengths.length === 0) strengths.push("Stuck with the case to the end.");

  return { overall, breakdown, strengths, growthAreas };
}

function strengthCopy(cat: ScoreCategory): string {
  switch (cat) {
    case "investigation": return "Spotted the glitch without leaning on hints.";
    case "errorDetection": return "Caught the mistake on the first look.";
    case "repairAccuracy": return "Repaired the shape with precision.";
    case "explanationQuality": return "Explained the reasoning clearly.";
    case "vocabulary": return "Used strong mathematical vocabulary.";
    case "criticalThinking": return "Connected ideas with deeper reasoning.";
  }
}

function growthCopy(cat: ScoreCategory): string {
  switch (cat) {
    case "investigation": return "Try investigating before asking for a hint.";
    case "errorDetection": return "Look carefully at the model before deciding.";
    case "repairAccuracy": return "Aim for a clean first repair next time.";
    case "explanationQuality": return "Add one more sentence to explain why.";
    case "vocabulary": return "Use math words like equal, fair, or share.";
    case "criticalThinking": return "Back up your answer with evidence from the model.";
  }
}
