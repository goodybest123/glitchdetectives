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

const Schema = z.object({
  verdict: z.enum(["correct", "partial", "review"]),
  understandingLevel: z.number().min(1).max(5),
  strengths: z.array(z.string()).max(2),
  gaps: z.array(z.string()).max(2),
  nextStep: z.string(),
  note: z.string(),
  rubric: z.array(RubricItem).min(3).max(4),
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

function normalizeRubric(r: unknown): GradeResult["rubric"] {
  if (!Array.isArray(r)) return [];
  return r.slice(0, 4).map((item: any) => ({
    criterion: clampNote(item?.criterion, 80),
    score: normalizeScore(item?.score),
    evidence: clampNote(item?.evidence, 140),
  })).filter((x) => x.criterion);
}

function normalize(raw: any): GradeResult {
  const lvl = Number(raw?.understandingLevel);
  return {
    verdict: normalizeVerdict(raw?.verdict),
    understandingLevel: Number.isFinite(lvl)
      ? Math.max(1, Math.min(5, Math.round(lvl)))
      : 3,
    strengths: Array.isArray(raw?.strengths)
      ? raw.strengths.slice(0, 2).map((x: unknown) => clampNote(x, 120))
      : [],
    gaps: Array.isArray(raw?.gaps)
      ? raw.gaps.slice(0, 2).map((x: unknown) => clampNote(x, 120))
      : [],
    nextStep: clampNote(raw?.nextStep, 160),
    note: clampNote(raw?.note, 160),
    rubric: normalizeRubric(raw?.rubric),
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
      "You are ZED-4, a friendly robot tutor giving a young detective (kid) a diagnostic on their fraction explanation. " +
      "Use warm, simple, kid-friendly language. Be specific to what the child actually wrote. " +
      "verdict: 'correct' if they captured the core idea, 'partial' if close but missing a key piece, 'review' if main idea missed or wrong. " +
      "understandingLevel: 1–5 (1=way off, 3=partial, 5=clear and complete). " +
      "strengths: 1–2 short bullets naming what the child got right (≤14 words each). " +
      "gaps: 0–2 short bullets naming what's missing or fuzzy (≤14 words each). " +
      "nextStep: ONE concrete practice tip the child can try (≤22 words). " +
      "note: ONE warm sentence to the child as ZED-4 (≤20 words). " +
      "rubric: EXACTLY 3 or 4 key-idea criteria for THIS concept (e.g. for Fair Sharing: 'Splits the whole', 'Parts are equal size', 'Names the fraction', 'Fixes the glitch'). " +
      "For each: criterion (≤6 words), score ('met'|'partial'|'missing'), evidence (≤18 words quoting/paraphrasing what the child said, or 'Not mentioned' if missing).";


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
            ' Respond ONLY with compact JSON of shape ' +
            '{"verdict":"correct"|"partial"|"review","understandingLevel":1-5,' +
            '"strengths":["..."],"gaps":["..."],"nextStep":"...","note":"..."}. ' +
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
      };
    }
  });
