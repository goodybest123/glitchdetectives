import { createFileRoute } from "@tanstack/react-router";
import "@tanstack/react-start";
import { generateText } from "ai";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway";

export const Route = createFileRoute("/api/transcribe")({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        try {
          const key = process.env.LOVABLE_API_KEY;
          if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });
          const form = await request.formData();
          const file = form.get("audio");
          if (!(file instanceof Blob)) return new Response("Missing audio", { status: 400 });
          const buf = new Uint8Array(await file.arrayBuffer());
          const mediaType = file.type || "audio/webm";

          const gateway = createLovableAiGatewayProvider(key);
          const model = gateway("google/gemini-2.5-flash");
          const { text } = await generateText({
            model,
            messages: [
              {
                role: "user",
                content: [
                  { type: "text", text: "Transcribe this audio of a young child talking. Return only the words spoken, no extra commentary." },
                  { type: "file", data: buf, mediaType },
                ],
              },
            ],
          });
          return Response.json({ text: text.trim() });
        } catch (err) {
          console.error("transcribe error", err);
          return new Response(JSON.stringify({ text: "" }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
    },
  },
});
