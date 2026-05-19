import { createFileRoute } from "@tanstack/react-router";
import "@tanstack/react-start";
import { EvaluateBodySchema, runEvaluate, evaluateErrorResponse } from "@/lib/evaluate-core";

export const Route = createFileRoute("/api/evaluate-wrong-reasoning")({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        try {
          const json = await request.json();
          // Force mode to "wrong" for this endpoint
          const input = EvaluateBodySchema.parse({ ...json, mode: "wrong" });
          const out = await runEvaluate(input);
          return Response.json(out);
        } catch (err) {
          return evaluateErrorResponse(err);
        }
      },
    },
  },
});
