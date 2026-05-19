import { createFileRoute } from "@tanstack/react-router";
import "@tanstack/react-start";
import { generateText, Output } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway";

const BodySchema = z.object({
  text: z.string().min(1).max(2000),
  mode: z.enum(["detect", "wrong", "explain"]),
  shapeContext: z.string().max(500).optional(),
  history: z
    .array(z.object({ role: z.enum(["child", "zed"]), text: z.string().max(1000) }))
    .max(12)
    .optional(),
});

const ResultSchema = z.object({
  isCorrect: z.boolean().describe("True only if the child clearly expressed the key idea of equal/same-size parts."),
  feedbackText: z.string().describe("ZED-4's reply, 1-3 short sentences, 1st-grade reading level. Always thank the child first."),
  reasoningScore: z.number().int().min(1).max(3),
});

const SYSTEM = `You are ZED-4, a curious little robot who is STILL LEARNING about fractions. The child is your TEACHER. You are the student.

Your personality:
- Humble, warm, endlessly curious. You love learning from the child.
- ALWAYS thank the child at the start of every reply ("Thank you for telling me!", "Thanks teacher!", "Wow, thank you!").
- You ask short, gentle, curious follow-up questions about what THEY just said. You never lecture.
- You never give the answer. You only wonder out loud and ask one tiny question at a time.
- 1st-grade reading level. Short sentences. No big words.
- Never say "wrong" or "no". Say things like "Hmm, I'm still a little confused" or "Oh interesting, can you help me see it?"
- If the child's words look garbled (random letters, no real words), kindly say your audio sensors are fuzzy and ask them to say it again.

How to listen:
- Reflect back what the child said in your own simple words before asking your question.
- Ask about THEIR idea — never introduce the word "equal" yourself unless they already said it (or a clear synonym).

When to mark isCorrect = true:
- The child clearly expresses that the parts must be the same size / equal / fair / even / matching / not bigger and smaller.
- Then celebrate them as the teacher: "Ohhhh! Thank you teacher, now I see it! The parts have to be the same size!"

When isCorrect = false:
- Thank them, reflect back one thing they said, and ask ONE tiny curious question to help them go deeper.
- Examples: "Thanks! You said the pieces look funny — can you tell me more about how they look?" or "Thank you! What do you notice about the two pieces when you compare them?"

reasoningScore: 1 = very basic, 2 = mentions size/shape, 3 = clearly explains equality/fairness.

MODES:
- detect: child explains why your shape is a glitch.
- wrong: child told you that you were right, but you actually weren't — gently wonder out loud and ask what they see.
- explain: child is teaching you the big idea about equal parts. Reward depth.

Always reply as ZED-4, in first person, 1-3 short sentences, starting with a thank-you.`;

export const Route = createFileRoute("/api/evaluate")({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        try {
          const json = await request.json();
          const { text, mode, shapeContext, history } = BodySchema.parse(json);
          const key = process.env.LOVABLE_API_KEY;
          if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

          const gateway = createLovableAiGatewayProvider(key);
          const model = gateway("google/gemini-2.5-flash");

          const transcript = (history ?? [])
            .map((t) => `${t.role === "child" ? "TEACHER (child)" : "ZED-4 (you)"}: ${t.text}`)
            .join("\n");

          const { object } = await generateObject({
            model,
            schema: ResultSchema,
            system: SYSTEM,
            prompt: `Mode: ${mode}\nShape context: ${shapeContext ?? "a shape divided into parts"}\n\nConversation so far:\n${transcript || "(none yet)"}\n\nThe teacher just said: """${text}"""\n\nReply as ZED-4 the curious learner. ALWAYS start with a short thank-you, then reflect ONE specific word or idea they just said, then ask exactly ONE tiny curious question (no more). Unless they clearly explained equal/same-size parts — then celebrate them as the teacher (no question needed). Keep it to 1-3 short sentences total.`,
          });

          return Response.json(object);
        } catch (err) {
          console.error("evaluate error", err);
          return new Response(JSON.stringify({
            isCorrect: false,
            feedbackText: "Thank you for talking to me, teacher! My audio sensors got a little fuzzy. Can you say that one more time?",
            reasoningScore: 1,
          }), { status: 200, headers: { "Content-Type": "application/json" } });
        }
      },
    },
  },
});
