import type { UIMessage } from "ai";

const MAX_MESSAGES = 50;
const MAX_MESSAGE_LENGTH = 2000;
const MAX_TOTAL_LENGTH = 8000;

/**
 * Validates and sanitizes chat messages sent to the ZED-4 AI endpoints.
 *
 * Enforces:
 * - messages must be an array
 * - messages length is bounded (prevents abuse / runaway context windows)
 * - each message has a supported role and string content
 * - individual and total content length are capped (prevents oversized prompts)
 *
 * Returns a `Response` on validation failure so the route handler can return it
 * directly; otherwise returns the validated messages array.
 */
export function validateChatMessages(body: unknown): UIMessage[] | Response {
  if (!body || typeof body !== "object") {
    return new Response("Invalid JSON body", { status: 400 });
  }

  const { messages } = body as { messages?: unknown };

  if (!Array.isArray(messages)) {
    return new Response("Messages are required", { status: 400 });
  }

  if (messages.length === 0) {
    return new Response("Messages cannot be empty", { status: 400 });
  }

  if (messages.length > MAX_MESSAGES) {
    return new Response(`Too many messages (max ${MAX_MESSAGES})`, { status: 400 });
  }

  let totalLength = 0;

  for (const msg of messages) {
    if (!msg || typeof msg !== "object") {
      return new Response("Each message must be an object", { status: 400 });
    }

    const { role, content } = msg as { role?: unknown; content?: unknown };

    if (typeof role !== "string" || !["user", "assistant", "system"].includes(role)) {
      return new Response("Invalid message role", { status: 400 });
    }

    if (typeof content !== "string") {
      return new Response("Message content must be a string", { status: 400 });
    }

    if (content.length > MAX_MESSAGE_LENGTH) {
      return new Response(
        `Message too long (max ${MAX_MESSAGE_LENGTH} characters)`,
        { status: 400 }
      );
    }

    totalLength += content.length;
  }

  if (totalLength > MAX_TOTAL_LENGTH) {
    return new Response(
      `Total message length exceeds ${MAX_TOTAL_LENGTH} characters`,
      { status: 400 }
    );
  }

  return messages as UIMessage[];
}
