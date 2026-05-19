import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, ArrowRight, CheckCircle2, RefreshCcw, Sparkles, Wrench } from "lucide-react";
import { GLITCHES, type Glitch } from "@/lib/glitches";
import { ZedBubble } from "./ZedBubble";
import { ExplainInput } from "./ExplainInput";
import { StepIndicator } from "./StepIndicator";

type Phase =
  | "briefing"
  | "investigate"
  | "explainWrong"
  | "detect"
  | "repair"
  | "teach"
  | "success";

type EvalResult = { isCorrect: boolean; feedbackText: string; reasoningScore: number };

async function evaluate(text: string, mode: "detect" | "wrong" | "explain", shapeContext: string): Promise<EvalResult> {
  const res = await fetch("/api/evaluate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, mode, shapeContext }),
  });
  return (await res.json()) as EvalResult;
}

export function MissionRunner({ onExit }: { onExit: () => void }) {
  const [shapeIdx, setShapeIdx] = useState(0);
  const [phase, setPhase] = useState<Phase>("briefing");
  const glitch: Glitch = GLITCHES[shapeIdx];
  const [vals, setVals] = useState<number[]>(glitch.initialVals);
  const [feedback, setFeedback] = useState<string>("");
  const [busy, setBusy] = useState(false);
  const [scores, setScores] = useState<number[]>([]);
  const [repaired, setRepaired] = useState(false);

  const isRepaired = useMemo(
    () => vals.every((v, i) => Math.abs(v - glitch.target[i]) <= glitch.tolerance),
    [vals, glitch],
  );

  function resetForShape(idx: number) {
    setShapeIdx(idx);
    setPhase("briefing");
    setVals(GLITCHES[idx].initialVals);
    setFeedback("");
    setRepaired(false);
  }

  async function handleExplain(text: string, mode: "detect" | "wrong" | "explain", nextPhase: Phase) {
    setBusy(true);
    setFeedback("");
    try {
      const result = await evaluate(text, mode, `${glitch.name} divided into ${glitch.parts} parts`);
      setFeedback(result.feedbackText);
      if (result.isCorrect) {
        if (mode === "explain") setScores((s) => [...s, result.reasoningScore]);
        setTimeout(() => {
          setFeedback("");
          setPhase(nextPhase);
        }, 2200);
      }
    } catch {
      setFeedback("My circuits hiccupped. Try sending that again!");
    } finally {
      setBusy(false);
    }
  }

  function handleCheckRepair() {
    if (isRepaired) {
      setRepaired(true);
      setTimeout(() => setPhase("teach"), 1200);
    } else {
      setFeedback("Hmm, the parts still don't look the same. Keep adjusting!");
      setTimeout(() => setFeedback(""), 2200);
    }
  }

  function nextShape() {
    if (shapeIdx + 1 < GLITCHES.length) {
      resetForShape(shapeIdx + 1);
    } else {
      setPhase("success");
    }
  }

  const currentStep =
    phase === "investigate" ? 1
    : phase === "detect" || phase === "explainWrong" ? 2
    : phase === "repair" ? 3
    : phase === "teach" ? 4
    : 0;

  const robotLine =
    phase === "briefing" ? glitch.robotBriefing
    : phase === "investigate" ? glitch.robotInvestigate
    : phase === "detect" ? glitch.robotDetect
    : phase === "explainWrong" ? glitch.robotExplainWrong
    : phase === "repair" ? glitch.robotRepair
    : phase === "teach" ? glitch.robotExplain
    : glitch.robotSuccess;

  return (
    <div className="min-h-screen grid-bg">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-6">
          <button onClick={onExit} className="label-eyebrow text-muted-foreground hover:text-primary transition flex items-center gap-2">
            ← MISSION MAP
          </button>
          <div className="label-eyebrow text-muted-foreground">
            SHAPE {shapeIdx + 1} / {GLITCHES.length}
          </div>
        </div>

        {currentStep > 0 && (
          <div className="mb-6 overflow-x-auto"><StepIndicator step={currentStep} /></div>
        )}

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Shape panel */}
          <div className="lg:col-span-3">
            <div className="rounded-3xl border border-border bg-card p-5 sm:p-8 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="label-eyebrow text-muted-foreground">TARGET AREA</span>
                {phase !== "briefing" && phase !== "success" && (
                  <span className={`label-eyebrow px-2.5 py-1 rounded-full ${
                    repaired || (phase === "repair" && isRepaired)
                      ? "bg-success/15 text-foreground"
                      : "bg-glitch/15 text-foreground"
                  }`}>
                    {repaired || (phase === "repair" && isRepaired) ? "STABLE" : "GLITCH DETECTED"}
                  </span>
                )}
              </div>

              <div className="aspect-square sm:aspect-[4/3] flex items-center justify-center">
                <motion.div
                  key={glitch.id + phase + (repaired ? "r" : "g")}
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="w-full max-w-md"
                >
                  {glitch.render(vals, repaired)}
                </motion.div>
              </div>

              <div className="mt-4 text-center label-eyebrow text-muted-foreground">
                {glitch.robotLabel}
              </div>

              {phase === "repair" && (
                <div className="mt-6 space-y-4">
                  {vals.map((v, i) => (
                    <div key={i}>
                      <div className="flex justify-between label-eyebrow text-muted-foreground mb-1.5">
                        <span>DIVIDER {i + 1}</span>
                        <span>{Math.round(v)}%</span>
                      </div>
                      <input
                        type="range"
                        min={5}
                        max={95}
                        step={0.5}
                        value={v}
                        onChange={(e) => {
                          const nv = [...vals];
                          nv[i] = parseFloat(e.target.value);
                          setVals(nv);
                        }}
                        className="w-full accent-[color:var(--color-energy)]"
                      />
                    </div>
                  ))}
                  <button
                    onClick={handleCheckRepair}
                    className="w-full mt-2 flex items-center justify-center gap-2 py-3 rounded-xl bg-energy text-energy-foreground font-bold hover:opacity-90 transition shadow-md"
                  >
                    <Wrench className="w-5 h-5" />
                    CHECK REPAIR
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Dialogue panel */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence mode="wait">
              <motion.div key={phase + glitch.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <ZedBubble text={robotLine} />
              </motion.div>
            </AnimatePresence>

            {feedback && (
              <ZedBubble text={feedback} />
            )}

            {phase === "briefing" && (
              <button
                onClick={() => setPhase("investigate")}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition"
              >
                Start Investigation
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            {phase === "investigate" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() => setPhase("explainWrong")}
                  className="flex items-center gap-2 justify-center py-4 px-4 rounded-2xl border border-border bg-card hover:border-primary transition"
                >
                  <CheckCircle2 className="w-5 h-5 text-success" />
                  <span className="font-medium">Yes, ZED-4 is right</span>
                </button>
                <button
                  onClick={() => setPhase("detect")}
                  className="flex items-center gap-2 justify-center py-4 px-4 rounded-2xl bg-glitch text-glitch-foreground font-medium hover:opacity-90 transition shadow-md"
                >
                  <AlertTriangle className="w-5 h-5" />
                  No, there's a glitch!
                </button>
              </div>
            )}

            {(phase === "detect" || phase === "explainWrong") && (
              <ExplainInput
                placeholder="Explain your thinking to ZED-4..."
                promptText={robotLine}
                disabled={busy}
                onSubmit={(t) =>
                  handleExplain(
                    t,
                    phase === "detect" ? "detect" : "wrong",
                    "repair",
                  )
                }
              />
            )}

            {phase === "teach" && (
              <ExplainInput
                placeholder="Tell ZED-4 why the parts had to be equal..."
                promptText={robotLine}
                disabled={busy}
                onSubmit={(t) => handleExplain(t, "explain", "success")}
              />
            )}

            {phase === "success" && (
              <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                <div className="rounded-2xl border-2 border-success bg-success/10 p-5 text-center">
                  <Sparkles className="w-8 h-8 mx-auto text-success mb-2" />
                  <div className="label-eyebrow text-foreground mb-1">SHAPE RESTORED</div>
                  <p className="text-lg font-semibold mb-4">Reasoning score: {scores[scores.length - 1] ?? 3} / 3</p>
                  {shapeIdx + 1 < GLITCHES.length ? (
                    <button onClick={nextShape} className="px-5 py-3 rounded-xl bg-primary text-primary-foreground font-semibold inline-flex items-center gap-2">
                      Next Shape <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground">Mission complete. Max Depth Potential: {Math.round((scores.reduce((a, b) => a + b, 0) / Math.max(scores.length, 1)) * 33)}%</p>
                      <button onClick={onExit} className="px-5 py-3 rounded-xl bg-primary text-primary-foreground font-semibold inline-flex items-center gap-2">
                        <RefreshCcw className="w-4 h-4" /> Return to Map
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
