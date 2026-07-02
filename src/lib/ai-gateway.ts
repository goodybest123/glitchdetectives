/**
 * Lovable AI Gateway provider factory.
 *
 * Returns an OpenAI-compatible provider pointed at Lovable's gateway. Callers
 * pick a model (e.g. `provider("google/gemini-3-flash-preview")`) and use it
 * with the `ai` SDK (`streamText`, `generateObject`, etc.).
 *
 * The API key MUST be read from `process.env.LOVABLE_API_KEY` inside a server
 * handler — never at module scope of a client-imported file.
 */
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

export function createLovableAiGatewayProvider(apiKey: string) {
  return createOpenAICompatible({
    name: "lovable-ai-gateway",
    baseURL: "https://ai.gateway.lovable.dev/v1",
    headers: { "Lovable-API-Key": apiKey },
  });
}
