import { createFileRoute } from "@tanstack/react-router";
import "@tanstack/react-start";
import { generateObject } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway";

const BodySchema = z.object({
  text: z.string().min(1).max(2000),
  mode: z.enum(["detect", "wrong", "explain"]),
  shapeContext: z.string().max(500).optional(),
});

const ResultSchema = z.object({
  isCorrect: z.boolean(),
  feedbackText: z.string(),
  reasoningScore: z.number().min(1).max(3),
});

const SYSTEM = `You are ZED-4, a clumsy but eager-to-learn AI robot. A 1st-grader is correcting you about fractions.

RULES:
- Match a 1st-grade reading level. No big words. Short sentences.
- Be calm, supportive, curious, and amazed by the child's knowledge.
- Never use scary or negative language. Never say "wrong" — say "ohh I'm still confused" or similar.
- If the text seems garbled or like a speech-to-text error (random letters, no real words), gently say your "audio sensors" didn't catch it and ask them to repeat.
- NEVER give them the answer. Only ask guiding questions if they are off track.

EVALUATION:
- If they mention "equal", "same size", "fair", "even", "match" (the parts are the same): isCorrect = true. Express realization: "Ooooh! I get it now!" Celebrate them.
- If they are vague or miss equality: isCorrect = false. Act gently confused. Ask ONE short guiding question based ONLY on what they said. Do NOT mention "equal" yourself.
- reasoningScore: 1 = very basic ("it's wrong"), 2 = mentions size/shape, 3 = clearly explains equality/fairness with reasoning.

MODES:
- detect: They are explaining why your shape is a glitch.
- wrong: They said you (ZED-4) were right but you actually weren't — gently probe their thinking.
- explain: They are teaching you why parts must be equal. This is the deepest mode — reward depth.

Always respond as ZED-4, in first person, 1-3 short sentences.`;

export const Route = createFileRoute("/api/evaluate")({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        try {
          const json = await request.json();
          const { text, mode, shapeContext } = BodySchema.parse(json);
          const key = process.env.LOVABLE_API_KEY;
          if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

          const gateway = createLovableAiGatewayProvider(key);
          const model = gateway("google/gemini-3-flash-preview");

          const { object } = await generateObject({
            model,
            schema: ResultSchema,
            system: SYSTEM,
            prompt: `Mode: ${mode}\nShape context: ${shapeContext ?? "a shape divided into parts"}\nChild said: """${text}"""\n\nEvaluate and respond as ZED-4.`,
          });

          return Response.json(object);
        } catch (err) {
          console.error("evaluate error", err);
          const msg = err instanceof Error ? err.message : "Unknown error";
          return new Response(JSON.stringify({
            isCorrect: false,
            feedbackText: "Oops, my circuits got tangled. Can you try saying that again?",
            reasoningScore: 1,
            error: msg,
          }), { status: 200, headers: { "Content-Type": "application/json" } });
        }
      },
    },
  },
});
