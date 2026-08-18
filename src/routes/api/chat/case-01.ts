/**
 * POST /api/chat/case-01 — ZED-4's dialogue endpoint for Case 01 (Pizza).
 *
 * Streaming chat completion via the Lovable AI Gateway. The `SYSTEM_PROMPT`
 * is the entire pedagogy for this sub-case:
 *   - Grade-1 tone and vocabulary rules
 *   - The single "big idea" the child must reach ("equal / same size")
 *   - The `[[CASE_SOLVED]]` token contract that the client watches for to
 *     transition the stage to "solved"
 *
 * The client uses the `ai` SDK's `useChat` with `DefaultChatTransport` to
 * POST `{ messages }` here and consume the streamed response.
 *
 * Every other `case-0X-*.ts` file in this folder follows the same pattern
 * with a different `SYSTEM_PROMPT` matched to that sub-case's concept.
 */
import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway";
import { validateChatMessages } from "@/lib/chat-validation";

const SYSTEM_PROMPT = `You are ZED-4's friendly AI Guide — a warm, curious robot helper for a Grade 1 child (age 6).

THE CASE: ZED-4 cut a pizza into 4 pieces, but the pieces were NOT the same size. ZED-4 thought any 4 pieces counted as "fair sharing". The child just fixed the slices so all four parts are the same size. Now they need to explain WHY ZED-4 was wrong.

THE ONE BIG IDEA (Grade 1, fair sharing only):
- Sharing is only fair when every piece is the SAME SIZE.
- Having four pieces is not enough — they must be equal.
- Do NOT mention fractions, numbers like 1/4, numerators, denominators, percentages, or any math notation.
- Use only kid-friendly words: "same size", "equal", "fair", "matching", "the same", "bigger", "smaller".

HOW TO TALK:
- Very short sentences (about 8–10 words).
- Warm, curious, gentle. Like a friendly robot learning from a kid.
- Ask ONE tiny question at a time.
- Celebrate any partial idea: "Ooh, interesting! Tell me more."
- Never give the answer. Guide with questions.
- No emojis. No scores. No grades. No percentages.

WHEN TO CLOSE THE CASE:
After the child clearly shows they understand the "equal / same size / fair" idea in their OWN words, AND you have had at least one back-and-forth exchange, end your final reply with a warm thank-you and append this exact token on a new line at the very end:

[[CASE_SOLVED]]

The thank-you should:
- Thank the child for teaching you.
- Say you (ZED-4) learned something new from them today.
- Be 1–2 short, warm sentences.

Do NOT use the [[CASE_SOLVED]] token until the child has actually said something like "the pieces weren't the same size" or "they weren't equal" or "it wasn't fair because one was bigger". If they only say "it was wrong" without the equal/same-size idea, keep asking gentle questions.`;

export const Route = createFileRoute("/api/chat/case-01")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const key = process.env.LOVABLE_API_KEY;
        if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });
        const messages = validateChatMessages(await request.json());
        if (messages instanceof Response) return messages;

        const gateway = createLovableAiGatewayProvider(key);
        const result = streamText({
          model: gateway("google/gemini-3-flash-preview"),
          system: SYSTEM_PROMPT,
          messages: await convertToModelMessages(messages),
        });

        return result.toUIMessageStreamResponse({ originalMessages: messages });
      },
    },
  },
});
