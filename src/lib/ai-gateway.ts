/**
 * AI Gateway provider factory.
 * Supports Hugging Face Serverless Inference (HUGGINGFACE_API_KEY / HF_TOKEN),
 * Lovable Gateway (LOVABLE_API_KEY), and other standard OpenAI-compatible providers.
 */
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

export function getAiApiKey(): string | null {
  return (
    process.env.HUGGINGFACE_API_KEY ||
    process.env.HF_TOKEN ||
    process.env.LOVABLE_API_KEY ||
    null
  );
}

export function createAiProvider(apiKey?: string) {
  const hfKey =
    process.env.HUGGINGFACE_API_KEY ||
    process.env.HF_TOKEN ||
    (apiKey?.startsWith("hf_") ? apiKey : undefined);

  if (hfKey) {
    return createOpenAICompatible({
      name: "huggingface",
      baseURL: "https://router.huggingface.co/v1",
      headers: {
        Authorization: `Bearer ${hfKey.trim()}`,
      },
    });
  }

  const lovableKey = process.env.LOVABLE_API_KEY || apiKey;
  if (lovableKey) {
    return createOpenAICompatible({
      name: "lovable-ai-gateway",
      baseURL: "https://ai.gateway.lovable.dev/v1",
      headers: { "Lovable-API-Key": lovableKey.trim() },
    });
  }

  throw new Error("Missing AI API key. Please set HUGGINGFACE_API_KEY in .env");
}

export function getAiModel(modelOverride?: string) {
  const hfKey = process.env.HUGGINGFACE_API_KEY || process.env.HF_TOKEN;
  if (hfKey) {
    const provider = createOpenAICompatible({
      name: "huggingface",
      baseURL: "https://router.huggingface.co/v1",
      headers: {
        Authorization: `Bearer ${hfKey.trim()}`,
      },
    });
    // Fast, reliable, high-reasoning open-source model on Hugging Face Serverless
    return provider(modelOverride || "Qwen/Qwen2.5-72B-Instruct");
  }

  const lovableKey = process.env.LOVABLE_API_KEY;
  if (lovableKey) {
    const provider = createOpenAICompatible({
      name: "lovable-ai-gateway",
      baseURL: "https://ai.gateway.lovable.dev/v1",
      headers: { "Lovable-API-Key": lovableKey.trim() },
    });
    return provider(modelOverride || "google/gemini-3-flash-preview");
  }

  throw new Error("Missing AI API key. Please set HUGGINGFACE_API_KEY in .env");
}

/** Backwards-compatible export for existing routes */
export function createLovableAiGatewayProvider(apiKey?: string) {
  const hfKey = process.env.HUGGINGFACE_API_KEY || process.env.HF_TOKEN;
  if (hfKey || (apiKey && apiKey.startsWith("hf_"))) {
    const token = (hfKey || apiKey)!;
    const provider = createOpenAICompatible({
      name: "huggingface",
      baseURL: "https://router.huggingface.co/v1",
      headers: { Authorization: `Bearer ${token.trim()}` },
    });
    return (_modelName: string) => provider("Qwen/Qwen2.5-72B-Instruct");
  }

  return createOpenAICompatible({
    name: "lovable-ai-gateway",
    baseURL: "https://ai.gateway.lovable.dev/v1",
    headers: { "Lovable-API-Key": apiKey || "" },
  });
}
