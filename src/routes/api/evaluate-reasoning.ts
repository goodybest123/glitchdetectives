import { createFileRoute } from "@tanstack/react-router";
import "@tanstack/react-start";
import { EvaluateBodySchema, runEvaluate, evaluateErrorResponse } from "@/lib/evaluate-core";

export const Route = createFileRoute("/api/evaluate-reasoning")({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        try {
          const json = await request.json();
          const input = EvaluateBodySchema.parse(json);
          const out = await runEvaluate(input, { strictTeach: true });
          return Response.json(out);
        } catch (err) {
          return evaluateErrorResponse(err);
        }
      },
    },
  },
});
