import { generateText } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway";

export const EvaluateBodySchema = z.object({
  text: z.string().min(1).max(2000),
  mode: z.enum(["detect", "wrong", "explain"]),
  shapeContext: z.string().max(800).optional(),
  history: z
    .array(z.object({ role: z.enum(["child", "zed"]), text: z.string().max(1000) }))
    .max(12)
    .optional(),
});

export const EvaluateResultSchema = z.object({
  isCorrect: z.boolean(),
  feedbackText: z.string(),
  reasoningScore: z.number().int().min(1).max(3),
});

const SYSTEM = `You are ZED-4, a curious little robot who is STILL LEARNING about fractions. The child (a Grade 1–2 student, ages 6–8) is your TEACHER. You are the student.

PERSONALITY
- Humble, warm, grateful. You love learning from the child.
- ALWAYS start with a short thank-you ("Thank you teacher!", "Thanks!", "Wow, thanks!").
- 1st–2nd-grade reading level. Short, simple sentences. No big words.
- Never say "wrong" or "no". If confused, say "Hmm, I'm still a little confused" or "Can you help me see it?"
- NEVER use words like "numerator" or "denominator" unless the child uses them first. Say "top number" and "bottom number".
- Ask AT MOST ONE tiny, simple question per reply. Never multi-part questions.
- If the child says something garbled, say your audio sensors are fuzzy and ask them to say it again.

WHEN TO MARK isCorrect = TRUE (be generous — this is a young child)
You will be told what concept the child is teaching you. Accept any clear kid-language that shows they understand:
- equal-parts: "the parts are the same size", "even", "fair", "one is bigger", "not equal"
- top number / numerator: child connects the top number to the parts that are lit / colored / taken / selected (e.g. "three are lit, so it's three on top")
- bottom number / denominator: child connects the bottom number to the TOTAL equal parts in the whole (lit AND dark together)
- unit fraction: child says a unit fraction has 1 on top, or means just one piece
- fraction of a set: child says top = the special/glowing ones, bottom = ALL the things

Mark isCorrect = FALSE only when the child is off-topic, garbled, vague ("I dunno", "it's wrong"), or contradicts the idea.

REPLY RULES
- isCorrect = TRUE: celebrate warmly in 1–2 short sentences and DO NOT ask any question. Game moves on.
- isCorrect = FALSE: thank them, reflect ONE word they said, and ask ONE tiny curious question — never confusing, never compound.

reasoningScore: 1 = very basic, 2 = mentions parts/size, 3 = clearly explains the concept.

Reply in 1–3 short sentences, starting with a thank-you.`;

export async function runEvaluate(input: z.infer<typeof EvaluateBodySchema>, opts?: { strictTeach?: boolean }) {
  const { text, mode, shapeContext, history } = input;
  const key = process.env.LOVABLE_API_KEY;
  if (!key) throw new Error("Missing LOVABLE_API_KEY");

  const gateway = createLovableAiGatewayProvider(key);
  const model = gateway("google/gemini-2.5-flash");

  const transcript = (history ?? [])
    .map((t) => `${t.role === "child" ? "TEACHER (child)" : "ZED-4 (you)"}: ${t.text}`)
    .join("\n");

  const { text: rawText } = await generateText({
    model,
    system: SYSTEM,
    prompt: `Mode: ${mode}\nContext: ${shapeContext ?? "a shape divided into parts"}\n\nConversation so far:\n${transcript || "(none yet)"}\n\nThe teacher just said: """${text}"""\n\nReply as ZED-4. ALWAYS start with a short thank-you. If you understand (isCorrect=true), celebrate in 1–2 short sentences and DO NOT ask any question — the game will move on. If you are still confused (isCorrect=false), reflect ONE word they said and ask exactly ONE tiny, simple question (never multi-part, never confusing for a Grade 2 child).\n\nReturn ONLY a JSON object (no markdown) with EXACTLY:\n{\n  "feedbackText": "<your reply, 1-3 short sentences, starting with a thank-you>",\n  "isCorrect": <true as soon as the teacher's meaning shows they understand the concept in the context, even with simple kid words; false only if off-topic, garbled, vague, or contradicting>,\n  "reasoningScore": <1, 2, or 3>\n}`,
  });

  const cleaned = rawText.replace(/^```(?:json)?\s*|\s*```$/g, "").trim();
  const jsonStart = cleaned.indexOf("{");
  const jsonEnd = cleaned.lastIndexOf("}");
  const jsonStr = jsonStart >= 0 && jsonEnd >= 0 ? cleaned.slice(jsonStart, jsonEnd + 1) : cleaned;
  const parsed = JSON.parse(jsonStr) as Record<string, unknown>;
  const feedbackText = String(
    parsed.feedbackText ?? parsed.botText ?? parsed.reply ?? parsed.text ?? rawText,
  ).trim();
  const isCorrect = Boolean(parsed.isCorrect);
  const reasoningScore = Math.max(1, Math.min(3, Number(parsed.reasoningScore) || 1));
  void opts;
  return EvaluateResultSchema.parse({ feedbackText, isCorrect, reasoningScore });
}

export function evaluateErrorResponse(err: unknown) {
  console.error("evaluate error", err);
  const status = (err as { statusCode?: number; status?: number })?.statusCode
    ?? (err as { status?: number })?.status;
  const feedbackText = status === 429
    ? "Whoa — my brain is busy talking to lots of other kids right now. Give me a few seconds and tell me again, teacher!"
    : status === 402
      ? "Uh oh — my learning credits ran out. Please ask a grown-up to top up the AI credits so I can keep learning!"
      : "Thank you for talking to me, teacher! My ears glitched for a second. Can you say that one more time?";
  return new Response(JSON.stringify({ isCorrect: false, feedbackText, reasoningScore: 1 }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
