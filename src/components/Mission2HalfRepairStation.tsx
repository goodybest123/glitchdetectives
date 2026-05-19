import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Loader2, Radio, RefreshCcw, Volume2, VolumeX, Wrench } from "lucide-react";
import { DragSlider } from "./mission2/DragSlider";
import { ZedConsole } from "./mission2/ZedConsole";
import { EnergyBarShape, PowerCellShape, ReactorDiscShape } from "./mission2/shapes";
import { ExplainInput } from "./ExplainInput";
import { speakText, useAutoSpeak, useVoiceCommands } from "@/lib/speech";

type ShapeKind = "bar" | "disc" | "cell";

type BrokenItem = {
  id: string;
  name: string;
  shape: ShapeKind;
  initialPct: number;
  intro: string;
  repairHint: string;
  successLine: string;
  explainPrompt: string;
};

const ITEMS: BrokenItem[] = [
  {
    id: "energy-bar",
    name: "Energy Bar",
    shape: "bar",
    initialPct: 22,
    intro: "Look! Two pieces! That means I made perfect halves, right?",
    repairHint: "Drag the thick line to make two fair halves.",
    successLine: "Whoa! Now both pieces are the EXACT same size. Halves must be equal!",
    explainPrompt: "Tell me, teacher — why are these two pieces real halves now?",
  },
  {
    id: "reactor",
    name: "Reactor Core",
    shape: "disc",
    initialPct: 78,
    intro: "I split the reactor core. Two slices means halves… right?",
    repairHint: "Slide the line until both slices match.",
    successLine: "Equal slices! So a half is one of TWO equal parts. Got it!",
    explainPrompt: "Why do BOTH slices need to be the same size to be halves?",
  },
  {
    id: "disk",
    name: "Software Disk",
    shape: "disc",
    initialPct: 30,
    intro: "This disk is cut in two. That's halves by definition!",
    repairHint: "Adjust the line so the two parts are the same size.",
    successLine: "Two pieces AND equal — now it's really halves!",
    explainPrompt: "What makes these two parts real halves and not just two pieces?",
  },
  {
    id: "powercell",
    name: "Power Cell",
    shape: "cell",
    initialPct: 70,
    intro: "Top piece, bottom piece. Two pieces = two halves, easy!",
    repairHint: "Drag the line until the top and bottom match.",
    successLine: "Both halves are equal now. The power cell is balanced!",
    explainPrompt: "Why does the top piece have to match the bottom piece?",
  },
];

const BLUE = "var(--color-brand-blue)";
const YELLOW = "var(--color-brand-yellow)";

type ExplainPhase = "idle" | "asking" | "thinking" | "done";

export default function Mission2HalfRepairStation({ onExit }: { onExit: () => void }) {
  const [idx, setIdx] = useState(0);
  const item = ITEMS[idx];
  const [pct, setPct] = useState(item.initialPct);
  const [repaired, setRepaired] = useState(false);
  const [muted, setMuted] = useState(false);
  const [voiceOn, setVoiceOn] = useState(false);

  const [explainPhase, setExplainPhase] = useState<ExplainPhase>("idle");
  const [zedReply, setZedReply] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);
  const historyRef = useRef<{ role: "child" | "zed"; text: string }[]>([]);

  const isFinal = idx + 1 >= ITEMS.length;
  const orientation = item.shape === "cell" ? "vertical" : "horizontal";

  // Compose the dialogue line ZED is currently "saying"
  const dialogue = useMemo(() => {
    if (zedReply) return zedReply;
    if (repaired && explainPhase === "asking") return `${item.successLine} ${item.explainPrompt}`;
    if (repaired) return item.successLine;
    return item.intro;
  }, [zedReply, repaired, explainPhase, item]);

  const dialogueKey = `${item.id}-${repaired ? "ok" : "err"}-${explainPhase}-${attempts}`;

  // Auto TTS
  useAutoSpeak(muted ? "" : dialogue, [dialogueKey]);
  useAutoSpeak(muted || repaired ? "" : item.repairHint, [item.id, muted, repaired]);

  function handleSnap() {
    if (!repaired) {
      setRepaired(true);
      setExplainPhase("asking");
      historyRef.current = [];
    }
  }

  function nextItem() {
    if (idx + 1 < ITEMS.length) {
      window.speechSynthesis?.cancel();
      const ni = idx + 1;
      setIdx(ni);
      setPct(ITEMS[ni].initialPct);
      setRepaired(false);
      setExplainPhase("idle");
      setZedReply(null);
      setAttempts(0);
      historyRef.current = [];
    }
  }

  function restart() {
    window.speechSynthesis?.cancel();
    setIdx(0);
    setPct(ITEMS[0].initialPct);
    setRepaired(false);
    setExplainPhase("idle");
    setZedReply(null);
    setAttempts(0);
    historyRef.current = [];
  }

  function toggleMute() {
    setMuted((m) => {
      if (!m) window.speechSynthesis?.cancel();
      return !m;
    });
  }

  async function handleExplainSubmit(text: string) {
    setExplainPhase("thinking");
    setZedReply(null);
    historyRef.current = [...historyRef.current, { role: "child", text }];
    try {
      const res = await fetch("/api/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          mode: "explain",
          shapeContext: `Two equal halves of a ${item.name}. The child just dragged the partition to make both pieces the same size.`,
          history: historyRef.current.slice(-10),
        }),
      });
      const data = (await res.json()) as { isCorrect: boolean; feedbackText: string };
      historyRef.current = [...historyRef.current, { role: "zed", text: data.feedbackText }];
      setZedReply(data.feedbackText);
      setAttempts((a) => a + 1);
      setExplainPhase(data.isCorrect ? "done" : "asking");
    } catch {
      const fallback = "My ears glitched! Can you tell me again, teacher?";
      setZedReply(fallback);
      setExplainPhase("asking");
    }
  }

  const shapeNode = useMemo(() => {
    if (item.shape === "bar") return <EnergyBarShape pct={pct} repaired={repaired} />;
    if (item.shape === "disc") return <ReactorDiscShape pct={pct} repaired={repaired} />;
    return <PowerCellShape pct={pct} repaired={repaired} />;
  }, [item.shape, pct, repaired]);

  // Voice commands
  useVoiceCommands(
    {
      "back to map": onExit,
      "return to map": onExit,
      "next object": () => explainPhase === "done" && !isFinal && nextItem(),
      "next item": () => explainPhase === "done" && !isFinal && nextItem(),
      "replay": restart,
      "restart": restart,
      "read again": () => !muted && speakText(dialogue),
    },
    voiceOn,
  );

  // Cancel speech on unmount
  useEffect(() => () => { window.speechSynthesis?.cancel(); }, []);

  const canAdvance = repaired && explainPhase === "done";

  return (
    <div className="min-h-screen" style={{ background: "var(--color-bg-light)" }}>
      {/* Top bar */}
      <header className="border-b border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-3">
          <button
            onClick={onExit}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium text-slate-600 hover:bg-slate-100 transition"
          >
            <ArrowLeft className="w-4 h-4" /> Map
          </button>
          <div className="text-center">
            <div className="text-xs uppercase tracking-widest text-slate-400">Mission 2</div>
            <h1 className="text-lg sm:text-xl font-bold" style={{ color: BLUE }}>
              Half Repair Station
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline text-xs font-mono text-slate-500">
              Item {idx + 1} / {ITEMS.length}
            </span>
            <button
              onClick={toggleMute}
              aria-label={muted ? "Unmute ZED-4" : "Mute ZED-4"}
              className="w-9 h-9 inline-flex items-center justify-center rounded-full border hover:bg-slate-50"
              style={{ color: BLUE, borderColor: "color-mix(in oklab, var(--color-brand-blue) 25%, white)" }}
            >
              {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 grid lg:grid-cols-5 gap-6">
        {/* Workshop */}
        <section className="lg:col-span-3">
          <div
            className="rounded-3xl bg-white p-6 sm:p-10 shadow-md border border-slate-200"
            style={{
              backgroundImage:
                "linear-gradient(rgba(30,41,59,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(30,41,59,0.05) 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          >
            <div className="flex items-center justify-between mb-6">
              <span className="text-xs uppercase tracking-widest text-slate-500">
                Workshop · {item.name}
              </span>
              <span
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
                style={{
                  background: repaired ? "#dcfce7" : "#fef3c7",
                  color: repaired ? "#15803d" : "#92400e",
                }}
              >
                <Wrench className="w-3.5 h-3.5" />
                {repaired ? "Repaired" : "Needs Repair"}
              </span>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35 }}
                className={
                  orientation === "horizontal"
                    ? "w-full max-w-xl mx-auto"
                    : "w-full max-w-[240px] mx-auto"
                }
              >
                <DragSlider
                  orientation={orientation}
                  value={pct}
                  onChange={setPct}
                  onSnap={handleSnap}
                  locked={repaired}
                  isRepaired={repaired}
                >
                  {shapeNode}
                </DragSlider>
              </motion.div>
            </AnimatePresence>

            <div className="mt-8 flex items-center justify-center gap-2 max-w-md mx-auto">
              <p className="text-center text-sm text-slate-600">
                {repaired ? "Perfectly equal. Both pieces match." : item.repairHint}
              </p>
              {!muted && !repaired && (
                <button
                  onClick={() => speakText(item.repairHint)}
                  aria-label="Read hint aloud"
                  className="text-slate-500 hover:text-slate-800"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Console */}
        <aside className="lg:col-span-2 flex flex-col gap-4">
          <ZedConsole
            dialogue={dialogue}
            dialogueKey={dialogueKey}
            repaired={repaired}
            itemName={item.name}
            muted={muted}
          >
            <AnimatePresence>
              {repaired && (explainPhase === "asking" || explainPhase === "thinking") && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-2"
                >
                  {explainPhase === "thinking" ? (
                    <div className="flex items-center gap-2 text-sky-200 text-sm font-mono px-3 py-3 rounded-xl bg-white/5">
                      <Loader2 className="w-4 h-4 animate-spin" /> ZED-4 is thinking…
                    </div>
                  ) : (
                    <div className="rounded-xl bg-white/95 p-1">
                      <ExplainInput
                        placeholder="Type or talk: why are these equal halves?"
                        onSubmit={handleExplainSubmit}
                        promptText={item.explainPrompt}
                      />
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </ZedConsole>

          <AnimatePresence>
            {canAdvance && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
                transition={{ delay: 0.2, duration: 0.4 }}
              >
                {isFinal ? (
                  <div className="rounded-2xl border-2 border-green-400 bg-green-50 p-5 text-center">
                    <p className="text-sm font-semibold text-green-800 mb-3">
                      Mission complete! ZED-4 finally gets halves.
                    </p>
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={restart}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-700 font-semibold hover:bg-slate-50"
                      >
                        <RefreshCcw className="w-4 h-4" /> Replay
                      </button>
                      <button
                        onClick={onExit}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-white"
                        style={{ background: BLUE }}
                      >
                        Return to Map <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={nextItem}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold shadow-md transition hover:scale-[1.02]"
                    style={{ background: BLUE, color: YELLOW }}
                  >
                    Next Object <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </aside>
      </main>

      {/* Voice command toggle */}
      <div className="fixed bottom-5 right-5 z-40 flex items-center gap-2">
        {voiceOn && (
          <span
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono shadow-sm border bg-white"
            style={{ color: BLUE, borderColor: "color-mix(in oklab, var(--color-brand-blue) 20%, white)" }}
          >
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: YELLOW }} />
            Listening: "next object", "back to map", "replay"
          </span>
        )}
        <button
          onClick={() => setVoiceOn((v) => !v)}
          aria-pressed={voiceOn}
          aria-label={voiceOn ? "Disable voice commands" : "Enable voice commands"}
          className="w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-105"
          style={{ background: voiceOn ? YELLOW : BLUE, color: voiceOn ? BLUE : "white" }}
        >
          <Radio className={`w-5 h-5 ${voiceOn ? "animate-pulse" : ""}`} />
        </button>
      </div>
    </div>
  );
}
