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

    const { id, role, parts } = msg as {
      id?: unknown;
      role?: unknown;
      parts?: unknown;
    };

    if (typeof id !== "string" || id.length === 0 || id.length > 200) {
      return new Response("Each message needs a valid id", { status: 400 });
    }

    if (typeof role !== "string" || !["user", "assistant", "system"].includes(role)) {
      return new Response("Invalid message role", { status: 400 });
    }

    if (!Array.isArray(parts) || parts.length === 0) {
      return new Response("Each message needs at least one part", { status: 400 });
    }

    for (const part of parts) {
      if (!part || typeof part !== "object") {
        return new Response("Each message part must be an object", { status: 400 });
      }

      const { type, text } = part as { type?: unknown; text?: unknown };

      // The AI SDK adds bookkeeping parts (e.g. `step-start`) to assistant
      // messages. They carry no text and must be ignored, not rejected —
      // rejecting them broke every follow-up turn in the conversation.
      if (type !== "text" && type !== "reasoning") continue;

      if (typeof text !== "string") {
        return new Response("Text message parts must contain text", { status: 400 });
      }

      if (text.length > MAX_MESSAGE_LENGTH) {
        return new Response(`Message part too long (max ${MAX_MESSAGE_LENGTH} characters)`, {
          status: 400,
        });
      }

      totalLength += text.length;
    }
  }

  if (totalLength > MAX_TOTAL_LENGTH) {
    return new Response(`Total message length exceeds ${MAX_TOTAL_LENGTH} characters`, {
      status: 400,
    });
  }

  return messages as UIMessage[];
}

/** Reads the transport body without turning malformed JSON into a server error page. */
export async function readAndValidateChatMessages(
  request: Request,
): Promise<UIMessage[] | Response> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new Response("Invalid JSON body", { status: 400 });
  }

  return validateChatMessages(body);
}

/** Converts gateway failures into a safe, useful message for the child-facing chat. */
export function formatChatStreamError(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error);
  const normalized = message.toLowerCase();

  if (normalized.includes("401")) {
    return "ZED-4 is unavailable because the AI service is not configured.";
  }
  if (normalized.includes("402")) {
    return "ZED-4 is paused because AI credits are unavailable right now.";
  }
  if (normalized.includes("403")) {
    return "ZED-4 is unavailable because the AI service is blocked.";
  }
  if (normalized.includes("429")) {
    return "ZED-4 is busy right now. Please try again in a moment.";
  }

  return "ZED-4 could not reply right now. Please try again.";
}
