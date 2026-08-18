/**
 * gradeExplanation — server function that turns a child's free-text
 * explanation into a Cognitive Insights diagnostic for parents and educators.
 *
 * Input  (Zod-validated): caseTitle, subTitle, glitchSummary,
 *                         conceptMastered, childExplanation.
 * Output (GradeResult):   verdict, understandingLevel (1–5), strengths[],
 *                         gaps[], nextStep, note, rubric[3–4], insights[4].
 *
 * Failure modes:
 *   1. Structured output call fails → retry with plain-JSON prompt + regex parse.
 *   2. Both AI calls fail          → return safe defaults with a friendly note.
 *   3. Missing LOVABLE_API_KEY     → throws (surfaced by the caller as a retry note).
 *
 * Runs inside a Cloudflare Worker; env vars are read at handler time.
 */
import { createServerFn } from "@tanstack/react-start";
import { generateText, Output } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "./ai-gateway";

const Input = z.object({
  caseTitle: z.string(),
  subTitle: z.string(),
  glitchSummary: z.string(),
  conceptMastered: z.string(),
  childExplanation: z.string().min(1),
});

const RubricItem = z.object({
  criterion: z.string(),
  score: z.enum(["met", "partial", "missing"]),
  evidence: z.string(),
});

const DIMENSIONS = [
  "Conceptual Understanding",
  "Reasoning & Justification",
  "Vocabulary & Precision",
  "Problem Decomposition",
] as const;

const InsightItem = z.object({
  dimension: z.enum(DIMENSIONS),
  level: z.enum(["Emerging", "Developing", "Secure"]),
  evidence: z.string(),
});

const Schema = z.object({
  verdict: z.enum(["correct", "partial", "review"]),
  understandingLevel: z.number().min(1).max(5),
  strengths: z.array(z.string()).max(2),
  gaps: z.array(z.string()).max(2),
  nextStep: z.string(),
  note: z.string(),
  rubric: z.array(RubricItem).min(3).max(4),
  insights: z.array(InsightItem).length(4),
});

export type GradeResult = z.infer<typeof Schema>;

function clampNote(s: unknown, max = 160) {
  return String(s ?? "").slice(0, max);
}

function normalizeVerdict(v: unknown): "correct" | "partial" | "review" {
  if (v === "correct") return "correct";
  if (v === "partial") return "partial";
  return "review";
}

function normalizeScore(s: unknown): "met" | "partial" | "missing" {
  if (s === "met") return "met";
  if (s === "partial") return "partial";
  return "missing";
}

function normalizeLevel(l: unknown): "Emerging" | "Developing" | "Secure" {
  if (l === "Secure") return "Secure";
  if (l === "Developing") return "Developing";
  return "Emerging";
}

function normalizeRubric(r: unknown): GradeResult["rubric"] {
  if (!Array.isArray(r)) return [];
  return r
    .slice(0, 4)
    .map((item: any) => ({
      criterion: clampNote(item?.criterion, 80),
      score: normalizeScore(item?.score),
      evidence: clampNote(item?.evidence, 140),
    }))
    .filter((x) => x.criterion);
}

function normalizeInsights(r: unknown): GradeResult["insights"] {
  const arr = Array.isArray(r) ? r : [];
  const byDim = new Map<string, any>();
  for (const item of arr) {
    if (item && typeof item.dimension === "string") byDim.set(item.dimension, item);
  }
  return DIMENSIONS.map((dim) => {
    const raw = byDim.get(dim);
    return {
      dimension: dim,
      level: normalizeLevel(raw?.level),
      evidence: clampNote(raw?.evidence, 160) || "Not mentioned in explanation.",
    };
  });
}

function normalize(raw: any): GradeResult {
  const lvl = Number(raw?.understandingLevel);
  return {
    verdict: normalizeVerdict(raw?.verdict),
    understandingLevel: Number.isFinite(lvl) ? Math.max(1, Math.min(5, Math.round(lvl))) : 3,
    strengths: Array.isArray(raw?.strengths)
      ? raw.strengths.slice(0, 2).map((x: unknown) => clampNote(x, 120))
      : [],
    gaps: Array.isArray(raw?.gaps)
      ? raw.gaps.slice(0, 2).map((x: unknown) => clampNote(x, 120))
      : [],
    nextStep: clampNote(raw?.nextStep, 160),
    note: clampNote(raw?.note, 160),
    rubric: normalizeRubric(raw?.rubric),
    insights: normalizeInsights(raw?.insights),
  };
}

export const gradeExplanation = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => Input.parse(input))
  .handler(async ({ data }): Promise<GradeResult> => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");

    const gateway = createLovableAiGatewayProvider(key);
    const model = gateway("google/gemini-3-flash-preview");

    const system =
      "You are ZED-4, a tutor producing a critical-thinking diagnostic on a child's fraction explanation for parents and educators. " +
      "Be specific to what the child actually wrote — no generic praise. " +
      "verdict: 'correct' if they captured the core idea, 'partial' if close but missing a key piece, 'review' if main idea missed or wrong. " +
      "understandingLevel: 1–5 (1=way off, 3=partial, 5=clear and complete). " +
      "strengths: 1–2 short bullets naming what the child got right (≤14 words each). " +
      "gaps: 0–2 short bullets naming what's missing or fuzzy (≤14 words each). " +
      "nextStep: ONE concrete practice tip the child can try (≤22 words). " +
      "note: ONE warm sentence to the child as ZED-4 (≤20 words). " +
      "rubric: EXACTLY 3 or 4 key-idea criteria for THIS concept. For each: criterion (≤6 words), score ('met'|'partial'|'missing'), evidence (≤18 words quoting/paraphrasing the child, or 'Not mentioned'). " +
      "insights: EXACTLY 4 items, one for each of these dimensions in this order — " +
      "'Conceptual Understanding' (grasp of the core idea), " +
      "'Reasoning & Justification' (does the child explain WHY, not just what), " +
      "'Vocabulary & Precision' (accurate math terms: numerator, denominator, equal, whole, etc.), " +
      "'Problem Decomposition' (breaks the glitch into steps before fixing). " +
      "For each insight: level is 'Emerging' (absent/unclear), 'Developing' (partially shown), or 'Secure' (clearly demonstrated). " +
      "evidence is ≤22 words referencing the child's actual words, or 'Not mentioned in explanation.' if absent. " +
      "Use adult-facing, neutral, observational language in insights — this is for parents and educators.";

    const prompt =
      `Case: ${data.caseTitle} — ${data.subTitle}\n` +
      `Concept being learned: ${data.conceptMastered}\n` +
      `The glitch was: ${data.glitchSummary}\n` +
      `Child's explanation: "${data.childExplanation}"\n` +
      `Give the diagnostic.`;

    try {
      const { experimental_output } = await generateText({
        model,
        system,
        prompt,
        experimental_output: Output.object({ schema: Schema }),
      });
      return normalize(experimental_output);
    } catch {
      // Fallback: ask for plain JSON and parse manually
      try {
        const { text } = await generateText({
          model,
          system:
            system +
            " Respond ONLY with compact JSON of shape " +
            '{"verdict":"correct"|"partial"|"review","understandingLevel":1-5,' +
            '"strengths":["..."],"gaps":["..."],"nextStep":"...","note":"...",' +
            '"rubric":[{"criterion":"...","score":"met|partial|missing","evidence":"..."}],' +
            '"insights":[{"dimension":"Conceptual Understanding|Reasoning & Justification|Vocabulary & Precision|Problem Decomposition","level":"Emerging|Developing|Secure","evidence":"..."}]}. ' +
            "No prose, no markdown fences.",
          prompt,
        });
        const match = text.match(/\{[\s\S]*\}/);
        if (match) {
          const parsed = JSON.parse(match[0]);
          return normalize(parsed);
        }
      } catch {}
      return {
        verdict: "review",
        understandingLevel: 3,
        strengths: [],
        gaps: [],
        nextStep: "Replay this case and try explaining it out loud once more.",
        note: "ZED-4 couldn't grade this right now — try again later.",
        rubric: [],
        insights: normalizeInsights([]),
      };
    }
  });
