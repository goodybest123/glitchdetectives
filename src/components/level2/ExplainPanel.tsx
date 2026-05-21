import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Lightbulb, Sparkles } from "lucide-react";
import type { CaseDef } from "@/lib/level2/types";
import { ExplainInput } from "@/components/ExplainInput";
import { HintTray } from "./HintTray";
import {
  MODEL_REASONING,
  shouldOverrideToFalseL2,
} from "@/lib/level2/evaluator";

type EvalResult = { isCorrect: boolean; feedbackText: string; reasoningScore: number };

async function callEvaluate(text: string, shapeContext: string): Promise<EvalResult> {
  const res = await fetch("/api/evaluate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, mode: "explain", shapeContext }),
  });
  return (await res.json()) as EvalResult;
}

/**
 * Explain + Feedback phase, shared by all 4 missions.
 * Shows the prompt, hint tray, voice/typing input, then 3-line feedback.
 */
export function ExplainPanel({
  caseDef,
  onComplete,
  onHintUsed,
  onZedSpeak,
}: {
  caseDef: CaseDef;
  onComplete: (stats: { reasoningScore: number; explanation: string }) => void;
  onHintUsed?: (level: number) => void;
  onZedSpeak?: (line: string) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<EvalResult | null>(null);
  const [savedText, setSavedText] = useState("");

  const submit = async (text: string) => {
    setBusy(true);
    setSavedText(text);
    try {
      const ctx = `Concept: ${caseDef.conceptKey}. ZED claim ${caseDef.zedClaim.numerator}/${caseDef.zedClaim.denominator}. Truth ${caseDef.truth.numerator}/${caseDef.truth.denominator}.`;
      const r = await callEvaluate(text, ctx);
      // Local override: vague answers without concept keywords don't pass
      if (r.isCorrect && shouldOverrideToFalseL2(text, caseDef.conceptKey)) {
        r.isCorrect = false;
        r.feedbackText =
          "Thank you teacher! Can you say one more word about how the numbers work?";
      }
      setResult(r);
      onZedSpeak?.(r.feedbackText);
      if (r.isCorrect) {
        setTimeout(
          () => onComplete({ reasoningScore: r.reasoningScore, explanation: text }),
          1800,
        );
      }
    } catch {
      setResult({
        isCorrect: false,
        feedbackText: "My ears glitched — can you say that again, teacher?",
        reasoningScore: 1,
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <header>
        <p className="label-eyebrow text-cyan-300/80">Phase 3 · Teach ZED-4</p>
        <h3 className="text-xl font-bold text-cyan-50 mt-1">
          {caseDef.explainPrompt}
        </h3>
      </header>

      <HintTray hints={caseDef.hints} onHintUsed={onHintUsed} />

      <ExplainInput
        placeholder="Type or talk to ZED-4..."
        promptText={caseDef.explainPrompt}
        onSubmit={submit}
        disabled={busy}
      />

      {result && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border p-4 space-y-1.5"
          style={{
            background: result.isCorrect
              ? "rgba(125,244,198,0.08)"
              : "rgba(255,233,138,0.06)",
            borderColor: result.isCorrect
              ? "color-mix(in oklab, #7df4c6 40%, transparent)"
              : "color-mix(in oklab, #ffe98a 35%, transparent)",
          }}
        >
          {result.isCorrect ? (
            <p className="text-sm text-emerald-200 inline-flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{result.feedbackText}</span>
            </p>
          ) : (
            <p className="text-sm text-amber-100 inline-flex items-start gap-2">
              <Lightbulb className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{result.feedbackText}</span>
            </p>
          )}
          <p className="text-xs text-cyan-200/80 inline-flex items-start gap-2 pt-1">
            <Sparkles className="w-3.5 h-3.5 mt-0.5 shrink-0" />
            <span>
              <span className="font-bold">Model reasoning: </span>
              {MODEL_REASONING[caseDef.conceptKey]}
            </span>
          </p>
          {!result.isCorrect && (
            <button
              type="button"
              onClick={() =>
                onComplete({
                  reasoningScore: result.reasoningScore,
                  explanation: savedText,
                })
              }
              className="mt-2 inline-flex items-center gap-2 text-xs font-semibold text-cyan-200 hover:text-cyan-100"
            >
              Continue anyway <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </motion.div>
      )}
    </div>
  );
}
