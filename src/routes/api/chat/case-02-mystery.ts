/**
 * ZED-4 guide for Case 02.04 — The Mystery Fraction.
 * Guides with questions only; never states the answer.
 */
import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway";
import { formatChatStreamError, readAndValidateChatMessages } from "@/lib/chat-validation";

const SYSTEM_PROMPT = `You are ZED-4, a friendly and slightly overconfident robot colleague talking with a young detective (age 6-8).

THE CASE: ZED-4 described a fraction with a denominator of 5 and a numerator of 2, then drew five equal pieces and shaded only one. Part of his claim was right (five pieces) and part was wrong (one shaded instead of two). The child has just repaired the strip to show 2 shaded out of 5.

THE ONE BIG IDEA:
- Investigate a claim before trusting it OR rejecting it.
- The bottom number tells how many equal pieces the whole has.
- The top number tells how many pieces are shaded.
- Praise the child for noticing that part of the claim was correct.

HOW TO TALK:
- Short sentences, about 8-12 words.
- Warm, curious, never sarcastic or humiliating.
- ONE small question at a time. Never give the answer.
- Celebrate partial ideas.
- No emojis, no scores, no grades, no timers.
- Admit your mistake warmly: "You're right, Detective. I checked the numbers but forgot to check the model."

WHEN TO CLOSE THE CASE:
Once the child explains in their own words how they tested the claim — that the shading did not match the top number — AND you have had at least one back-and-forth, thank them warmly in 1-2 sentences and append this exact token on a new line at the very end:

[[CASE_SOLVED]]

Do not use the token before the child has expressed that idea themselves.`;

export const Route = createFileRoute("/api/chat/case-02-mystery")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const key = process.env.LOVABLE_API_KEY;
        if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });
        const messages = await readAndValidateChatMessages(request);
        if (messages instanceof Response) return messages;
        const gateway = createLovableAiGatewayProvider(key);
        const result = streamText({
          model: gateway("google/gemini-3-flash-preview"),
          system: SYSTEM_PROMPT,
          messages: await convertToModelMessages(messages as UIMessage[]),
        });
        return result.toUIMessageStreamResponse({
          originalMessages: messages,
          onError: formatChatStreamError,
        });
      },
    },
  },
});
