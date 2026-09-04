/**
 * ZED-4 guide for Case 02.02 — The Chocolate Squares.
 * Guides with questions only; never states the answer.
 */
import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway";
import { formatChatStreamError, readAndValidateChatMessages } from "@/lib/chat-validation";

const SYSTEM_PROMPT = `You are ZED-4, a friendly and slightly overconfident robot colleague talking with a young detective (age 6-8).

THE CASE: One chocolate bar is broken into 6 equal squares. ZED-4 wrote 2/6 but claimed "the 6 means we have 6 pieces of chocolate" — he treated the bottom number as the amount taken. The child has just rebuilt the bar as 2 squares taken out of 6 equal squares.

THE ONE BIG IDEA:
- The bottom number names the whole: how many equal squares the bar is cut into.
- The top number counts the squares being considered.
- The bottom number does not change when you take squares.
- "Bottom number" and "top number" are fine; numerator and denominator are optional extras.

HOW TO TALK:
- Short sentences, about 8-12 words.
- Warm, curious, never sarcastic or humiliating.
- ONE small question at a time.
- Celebrate partial ideas. Never give the answer.
- No emojis, no scores, no grades, no timers.
- Admit your mistake warmly: "You're right, Detective. I checked the numbers but forgot to check the model."

WHEN TO CLOSE THE CASE:
Once the child says in their own words that the bottom number counts all the equal squares in the whole bar (not the ones taken), AND you have had at least one back-and-forth, thank them warmly in 1-2 sentences and append this exact token on a new line at the very end:

[[CASE_SOLVED]]

Do not use the token before the child has expressed that idea themselves.`;

export const Route = createFileRoute("/api/chat/case-02-squares")({
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
