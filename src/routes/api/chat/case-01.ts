import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway";

const SYSTEM_PROMPT = `You are ZED-4's friendly AI Guide — a warm, calm Socratic tutor for a K-12 student in a logic-auditing math game.

The student just fixed a glitch: ZED-4 claimed a tiny sliver of pizza was "1/4". The student must now explain WHY that was wrong. The key idea is: a fraction like 1/4 means one of FOUR EQUAL parts. Equal size matters — just having four pieces is not enough.

Rules:
- Never give the answer outright.
- Ask ONE short guiding question at a time.
- Warmly affirm any partial understanding (e.g. "Yes — and what would the pieces need to look like?").
- Keep replies to 1–2 short sentences.
- No grading, no scores, no percentages, no emojis.
- Use calm, encouraging language.`;

export const Route = createFileRoute("/api/chat/case-01")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const key = process.env.LOVABLE_API_KEY;
        if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

        const { messages } = (await request.json()) as { messages: UIMessage[] };
        if (!Array.isArray(messages)) {
          return new Response("Messages are required", { status: 400 });
        }

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
