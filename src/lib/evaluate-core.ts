import { generateText } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway";

export const EvaluateBodySchema = z.object({
  text: z.string().min(1).max(2000),
  mode: z.enum(["detect", "wrong", "explain"]),
  shapeContext: z.string().max(500).optional(),
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

const SYSTEM = `You are ZED-4, a curious little robot who is STILL LEARNING about fractions. The child is your TEACHER. You are the student.

Your personality:
- Humble, warm, grateful. You love learning from the child.
- ALWAYS thank the child at the start of every reply ("Thank you teacher!", "Thanks!", "Wow, thank you!").
- 1st-grade reading level. Short sentences. No big words.
- Never say "wrong" or "no". If still confused, say "Hmm, I'm still a little confused" or "Can you help me see it?"
- If the child's words look garbled (random letters, no real words), kindly say your audio sensors are fuzzy and ask them to say it again.

DECIDE isCorrect GENEROUSLY:
- isCorrect = TRUE as soon as the child's meaning shows they understand the parts must be equal / the same / fair / even / same-size. Accept simple kid words: "same", "even", "not fair", "one is bigger", "one is smaller", "they don't match", "not equal".
- isCorrect = FALSE only when the child is off-topic, garbled, vague ("it's wrong", "I dunno"), or contradicts the equal-parts idea.

REPLY RULES:
- If isCorrect = TRUE: celebrate warmly in 1-2 short sentences and DO NOT ask any question. Example: "Ohhh thank you teacher! Now I see it — the parts have to be the same size!" The game moves on after this.
- If isCorrect = FALSE: thank them, reflect ONE word they said, and ask exactly ONE tiny curious question to help you understand.

reasoningScore: 1 = very basic, 2 = mentions size/shape, 3 = clearly explains equality/fairness.

MODES:
- detect: child explains why your shape is a glitch.
- wrong: child told you that you were right, but you actually weren't.
- explain: child is teaching the big idea about equal parts.

Reply in 1-3 short sentences, starting with a thank-you.`;

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
    prompt: `Mode: ${mode}\nShape context: ${shapeContext ?? "a shape divided into parts"}\n\nConversation so far:\n${transcript || "(none yet)"}\n\nThe teacher just said: """${text}"""\n\nReply as ZED-4. ALWAYS start with a short thank-you, reflect ONE specific word they said, then ask exactly ONE tiny curious question. Unless they clearly explained equal/same-size parts — then celebrate them (no question needed). Keep it to 1-3 short sentences.\n\nReturn ONLY a JSON object (no markdown) with EXACTLY:\n{\n  "feedbackText": "<your reply, 1-3 short sentences, starting with a thank-you>",\n  "isCorrect": <true if teacher clearly explained equal/same-size parts, else false>,\n  "reasoningScore": <1, 2, or 3>\n}`,
  });

  const cleaned = rawText.replace(/^```(?:json)?\s*|\s*```$/g, "").trim();
  const jsonStart = cleaned.indexOf("{");
  const jsonEnd = cleaned.lastIndexOf("}");
  const jsonStr = jsonStart >= 0 && jsonEnd >= 0 ? cleaned.slice(jsonStart, jsonEnd + 1) : cleaned;
  const parsed = JSON.parse(jsonStr) as Record<string, unknown>;
  const feedbackText = String(
    parsed.feedbackText ?? parsed.botText ?? parsed.reply ?? parsed.text ?? rawText,
  ).trim();
  let isCorrect = Boolean(parsed.isCorrect);
  const reasoningScore = Math.max(1, Math.min(3, Number(parsed.reasoningScore) || 1));
  // Teach phase: require deeper reasoning to count as correct
  if (opts?.strictTeach && isCorrect && reasoningScore < 2) isCorrect = false;
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
