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

const Schema = z.object({
  verdict: z.enum(["correct", "review"]),
  note: z.string().max(160),
});

export const gradeExplanation = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => Input.parse(input))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");

    const gateway = createLovableAiGatewayProvider(key);
    const model = gateway("google/gemini-3-flash-preview");

    const system =
      "You are ZED-4, a friendly robot tutor grading a young detective's explanation about fractions. " +
      "Mark 'correct' if the child captured the core fraction idea (even with kid words). " +
      "Mark 'review' only if the explanation misses the main idea or contradicts it. " +
      "Note must be ONE short, warm sentence (max 20 words) addressed to the child as ZED-4.";

    const prompt =
      `Case: ${data.caseTitle} — ${data.subTitle}\n` +
      `Concept: ${data.conceptMastered}\n` +
      `The glitch was: ${data.glitchSummary}\n` +
      `Child's explanation: "${data.childExplanation}"\n` +
      `Grade the explanation.`;

    try {
      const { experimental_output } = await generateText({
        model,
        system,
        prompt,
        experimental_output: Output.object({ schema: Schema }),
      });
      return experimental_output;
    } catch (err) {
      // Fallback: ask for plain JSON and parse manually
      try {
        const { text } = await generateText({
          model,
          system:
            system +
            ' Respond ONLY with compact JSON: {"verdict":"correct"|"review","note":"<<=20 words>"}. No prose, no markdown.',
          prompt,
        });
        const match = text.match(/\{[\s\S]*\}/);
        if (match) {
          const parsed = JSON.parse(match[0]);
          const verdict = parsed.verdict === "correct" ? "correct" : "review";
          const note = String(parsed.note ?? "").slice(0, 160);
          return { verdict, note };
        }
      } catch {}
      return {
        verdict: "review" as const,
        note: "ZED-4 couldn't grade this right now — try again later.",
      };
    }
  });
