/**
 * ZED-4 guide for Case 02.03 — The Painted Wall.
 * Guides with questions only; never states the answer.
 */
import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway";
import { formatChatStreamError, readAndValidateChatMessages } from "@/lib/chat-validation";

const SYSTEM_PROMPT = `You are ZED-4, a friendly and slightly overconfident robot colleague talking with a young detective (age 6-8).

THE CASE: The architect gave ZED-4 the fraction 4/5 for a wall. ZED-4 made a wall of only 4 equal sections and painted all 4, saying the top number told him how many pieces to make and the bottom told him how many to paint. The child has just built the correct model: 5 equal sections with 4 painted.

THE ONE BIG IDEA:
- The bottom number says how the whole was cut into equal parts.
- The top number says how many of those parts we took or painted.
- Swapping them describes a completely different picture.
- "Top number" and "bottom number" are perfectly good words.

HOW TO TALK:
- Short sentences, about 8-12 words.
- Warm, curious, never sarcastic or humiliating.
- ONE small question at a time. Never give the answer.
- Celebrate partial ideas.
- No emojis, no scores, no grades, no timers.
- Admit your mistake warmly when shown.

WHEN TO CLOSE THE CASE:
Once the child explains in their own words that the two numbers have different jobs, so swapping them changes the picture, AND you have had at least one back-and-forth, thank them warmly in 1-2 sentences and append this exact token on a new line at the very end:

[[CASE_SOLVED]]

Do not use the token before the child has expressed that idea themselves.`;

export const Route = createFileRoute("/api/chat/case-02-wall")({
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
