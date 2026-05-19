import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, ArrowRight, AlertTriangle, Volume2, VolumeX, Lock, Bot, Mic, MicOff,
  Send, CheckCircle2, Wrench, Sparkles, RefreshCcw, Zap, Atom, Share2, Loader2,
  Radio, ScanSearch,
} from "lucide-react";
import { GLITCHES, type Glitch } from "@/lib/glitches";
import { speakText, useAutoSpeak, useContinuousSpeech, useVoiceCommands } from "@/lib/speech";

const BLUE = "var(--color-brand-blue)";
const YELLOW = "var(--color-brand-yellow)";
const MINT = "var(--color-brand-mint)";
const BG_LIGHT = "var(--color-bg-light)";
const SKY = "color-mix(in oklab, var(--color-brand-blue) 12%, white)";


type View = "intro" | "mission-select" | "mission-1-investigate";
type Phase =
  | "briefing"
  | "investigate"
  | "explainWrong"
  | "detect"
  | "repairPrompt"
  | "repair"
  | "teach"
  | "shapeDone"
  | "missionDone";

const INTRO_TEXT =
  "The factory's partition machines are malfunctioning. Shapes are being divided incorrectly, and the AI robots can no longer tell what fair sharing looks like. Can you repair the system? If yes, proceed to the Access Mission Map.";

const MISSION_1_SHAPES: Glitch[] = [
  GLITCHES.find((g) => g.id === "pizza")!,
  GLITCHES.find((g) => g.id === "battery")!,
  GLITCHES.find((g) => g.id === "fuelrod")!,
];

const MISSIONS = [
  { id: 1, name: "Broken Partition Scanner", focus: "Detect unequal parts", unlocked: true, Icon: Zap },
  { id: 2, name: "Half Repair Station", focus: "Understand halves", unlocked: false, Icon: Wrench },
  { id: 3, name: "Quarter Core Reactor", focus: "Understand fourths", unlocked: false, Icon: Atom },
  { id: 4, name: "Share Builder Challenge", focus: "Apply concepts", unlocked: false, Icon: Share2 },
];

export default function FractionFactoryLevel1({ onExitToHub }: { onExitToHub: () => void }) {
  const [view, setView] = useState<View>("intro");
  const [voiceOn, setVoiceOn] = useState(false);

  return (
    <main className="min-h-screen" style={{ background: BG_LIGHT }}>
      <AnimatePresence mode="wait">
        {view === "intro" && (
          <motion.div key="intro" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <IntroView voiceOn={voiceOn} onBack={onExitToHub} onContinue={() => setView("mission-select")} />
          </motion.div>
        )}
        {view === "mission-select" && (
          <motion.div key="select" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <MissionSelectView
              voiceOn={voiceOn}
              onBack={() => setView("intro")}
              onStartMission1={() => setView("mission-1-investigate")}
            />
          </motion.div>
        )}
        {view === "mission-1-investigate" && (
          <motion.div key="mission" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <Mission1View
              voiceOn={voiceOn}
              onBack={() => setView("mission-select")}
              onFinish={() => setView("mission-select")}
              onExitToHub={onExitToHub}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <VoiceCommandToggle on={voiceOn} onToggle={() => setVoiceOn((v) => !v)} />
    </main>
  );
}

function VoiceCommandToggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <div className="fixed bottom-5 right-5 z-40 flex items-center gap-2">
      {on && (
        <span
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono shadow-sm border bg-white"
          style={{ color: BLUE, borderColor: "color-mix(in oklab, var(--color-brand-blue) 20%, white)" }}
        >
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: YELLOW }} />
          Listening: say "Enter Level", "Back to Hub", "Next Mission"
        </span>
      )}
      <button
        onClick={onToggle}
        aria-pressed={on}
        aria-label={on ? "Disable voice commands" : "Enable voice commands"}
        title={on ? "Voice commands on" : "Voice commands off"}
        className="w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-105"
        style={{ background: on ? YELLOW : BLUE, color: on ? BLUE : "white" }}
      >
        <Radio className={`w-5 h-5 ${on ? "animate-pulse" : ""}`} />
      </button>
    </div>
  );
}

/* -------------------------------- Shared UI -------------------------------- */

function TopBar({ title, onBack, backLabel = "Hub" }: { title: string; onBack: () => void; backLabel?: string }) {
  return (
    <header className="border-b" style={{ background: "white", borderColor: "color-mix(in oklab, var(--color-brand-blue) 10%, white)" }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-3">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium hover:bg-slate-100 transition"
          style={{ color: BLUE }}
        >
          <ArrowLeft className="w-4 h-4" /> Back to {backLabel}
        </button>
        <h1 className="text-sm sm:text-base font-mono uppercase tracking-widest" style={{ color: BLUE }}>
          {title}
        </h1>
        <span className="label-eyebrow px-2.5 py-1 rounded-full" style={{ background: YELLOW, color: BLUE }}>
          Level 1
        </span>
      </div>
    </header>
  );
}

/* --------------------------------- Intro ---------------------------------- */

function IntroView({ voiceOn, onBack, onContinue }: { voiceOn: boolean; onBack: () => void; onContinue: () => void }) {
  useAutoSpeak(`Level 1: Fraction Foundations. ${INTRO_TEXT}`);
  useVoiceCommands(
    {
      "enter level": onContinue,
      "access mission map": onContinue,
      "continue": onContinue,
      "back to hub": onBack,
      "return to hub": onBack,
    },
    voiceOn,
  );
  const [muted, setMuted] = useState(false);
  return (
    <>
      <TopBar title="Level 1: Fraction Foundations" onBack={onBack} />
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="flex items-center justify-between gap-3 mb-6 flex-wrap">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono"
            style={{ background: "color-mix(in oklab, #ef4444 18%, white)", color: "#7a1d1d" }}>
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            Glitching
          </div>
          <div className="flex items-center gap-2">
            <span className="label-eyebrow px-2.5 py-1 rounded-full" style={{ background: YELLOW, color: BLUE }}>
              0 / 4 Missions Completed
            </span>
            <button
              onClick={() => { setMuted((m) => !m); if (!muted) window.speechSynthesis?.cancel(); }}
              aria-label={muted ? "Unmute voice" : "Mute voice"}
              className="w-9 h-9 inline-flex items-center justify-center rounded-full border hover:bg-slate-50"
              style={{ color: BLUE, borderColor: "color-mix(in oklab, var(--color-brand-blue) 25%, white)" }}
            >
              {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <motion.div
          className="flex flex-col items-center text-center gap-5 p-8 rounded-3xl border"
          style={{ background: "white", borderColor: "color-mix(in oklab, #ef4444 35%, white)" }}
          initial={{ scale: 0.98, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        >
          <motion.div
            animate={{ scale: [1, 1.12, 1] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            className="w-24 h-24 rounded-full flex items-center justify-center shrink-0"
            style={{ background: "color-mix(in oklab, #ef4444 22%, white)" }}
          >
            <Zap className="w-12 h-12" fill="#ef4444" style={{ color: "#ef4444" }} />
          </motion.div>
          <div>
            <p className="label-eyebrow" style={{ color: "#7a1d1d" }}>System status</p>
            <h2 className="text-3xl sm:text-4xl font-bold mt-1" style={{ color: BLUE }}>System Failure Detected</h2>
          </div>
        </motion.div>

        <article className="mt-6 bg-white rounded-3xl p-6 sm:p-8 border shadow-sm" style={{ borderColor: "color-mix(in oklab, var(--color-brand-blue) 12%, white)" }}>
          <div className="flex items-center justify-between gap-3 mb-4">
            <p className="label-eyebrow" style={{ color: BLUE }}>Detective Briefing</p>
            <button
              onClick={() => speakText(INTRO_TEXT)}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border hover:bg-slate-50 transition"
              style={{ color: BLUE, borderColor: "color-mix(in oklab, var(--color-brand-blue) 25%, white)" }}
            >
              <Volume2 className="w-3.5 h-3.5" /> Read Aloud
            </button>
          </div>
          <p className="text-base sm:text-lg leading-relaxed" style={{ color: BLUE }}>{INTRO_TEXT}</p>

          <div className="mt-8 flex justify-end">
            <button
              onClick={onContinue}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl font-semibold transition-transform hover:scale-[1.02] shadow-md"
              style={{ background: YELLOW, color: BLUE }}
            >
              Access Mission Map <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </article>
      </section>
    </>
  );
}

/* ----------------------------- Mission Select ----------------------------- */

function MissionSelectView({ voiceOn, onBack, onStartMission1 }: { voiceOn: boolean; onBack: () => void; onStartMission1: () => void }) {
  useAutoSpeak("Mission map online. Choose a mission, detective.");
  useVoiceCommands(
    {
      "start mission": onStartMission1,
      "first mission": onStartMission1,
      "mission one": onStartMission1,
      "enter mission": onStartMission1,
      "broken partition": onStartMission1,
      "back to hub": onBack,
      "back to briefing": onBack,
      "go back": onBack,
    },
    voiceOn,
  );
  return (
    <>
      <TopBar title="Mission Map" onBack={onBack} backLabel="Briefing" />
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <p className="label-eyebrow" style={{ color: BLUE }}>Level 1 / Mission Select</p>
        <h2 className="text-3xl sm:text-4xl font-bold mt-2" style={{ color: BLUE }}>Choose your mission</h2>
        <p className="text-sm mt-2 max-w-xl" style={{ color: "color-mix(in oklab, var(--color-brand-blue) 70%, white)" }}>
          Start with the Broken Partition Scanner to learn how to spot a glitch.
        </p>

        <ul className="mt-8 grid sm:grid-cols-2 gap-5">
          {MISSIONS.map((m) => {
            const Icon = m.Icon;
            const onClick = m.unlocked && m.id === 1 ? onStartMission1 : undefined;
            return (
              <motion.li
                key={m.id}
                whileHover={m.unlocked ? { y: -3 } : undefined}
                className={`relative rounded-2xl border bg-white p-5 transition ${m.unlocked ? "shadow-sm hover:shadow-md cursor-pointer" : "opacity-60"}`}
                style={{ borderColor: m.unlocked ? "color-mix(in oklab, var(--color-brand-yellow) 70%, white)" : "#e5e7eb" }}
                onClick={onClick}
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: m.unlocked ? BLUE : "#94a3b8" }}
                  >
                    <Icon className="w-6 h-6" style={{ color: m.unlocked ? YELLOW : "white" }} />
                  </div>
                  <div className="min-w-0">
                    <p className="label-eyebrow text-gray-500">Mission {m.id}</p>
                    <h3 className="text-lg font-bold truncate" style={{ color: BLUE }}>{m.name}</h3>
                  </div>
                  {!m.unlocked && (
                    <span className="ml-auto inline-flex items-center gap-1 text-xs font-mono px-2 py-1 rounded-full bg-gray-100 text-gray-500">
                      <Lock className="w-3 h-3" /> Locked
                    </span>
                  )}
                </div>
                <p className="mt-4 text-sm" style={{ color: "color-mix(in oklab, var(--color-brand-blue) 70%, white)" }}>
                  <span className="font-semibold" style={{ color: BLUE }}>Focus: </span>{m.focus}
                </p>
              </motion.li>
            );
          })}
        </ul>
      </section>
    </>
  );
}

/* -------------------------- Mission 1 Gameplay ---------------------------- */

function Mission1View({ voiceOn, onBack, onFinish, onExitToHub }: { voiceOn: boolean; onBack: () => void; onFinish: () => void; onExitToHub: () => void }) {
  const [shapeIdx, setShapeIdx] = useState(0);
  const [phase, setPhase] = useState<Phase>("briefing");
  const shape = MISSION_1_SHAPES[shapeIdx];
  const [vals, setVals] = useState<number[]>(shape.initialVals);
  const [repaired, setRepaired] = useState(false);
  const [repairMsg, setRepairMsg] = useState<string | null>(null);

  const isLast = shapeIdx === MISSION_1_SHAPES.length - 1;

  const goToShape = (idx: number) => {
    const s = MISSION_1_SHAPES[idx];
    setShapeIdx(idx);
    setVals(s.initialVals);
    setRepaired(false);
    setRepairMsg(null);
    setPhase("briefing");
  };

  const nextShape = () => {
    if (isLast) setPhase("missionDone");
    else goToShape(shapeIdx + 1);
  };

  useVoiceCommands(
    {
      "back to hub": onExitToHub,
      "return to hub": onExitToHub,
      "back to missions": onBack,
      "back to mission map": onBack,
      "start scanner": () => phase === "briefing" && setPhase("investigate"),
      "no glitch": () => phase === "investigate" && setPhase("explainWrong"),
      "robot is right": () => phase === "investigate" && setPhase("explainWrong"),
      "there is a glitch": () => phase === "investigate" && setPhase("detect"),
      "yes glitch": () => phase === "investigate" && setPhase("detect"),
      "next mission": nextShape,
      "next shape": nextShape,
      "finish mission": () => phase === "shapeDone" && isLast && setPhase("missionDone"),
      "return to missions": () => phase === "missionDone" && onFinish(),
    },
    voiceOn,
  );


  const robotLine = useMemo(() => {
    switch (phase) {
      case "briefing": return shape.robotBriefing;
      case "investigate": return shape.robotInvestigate;
      case "explainWrong": return shape.robotExplainWrong;
      case "detect": return shape.robotDetect;
      case "repairPrompt": return "You spotted the glitch! I can't fix this alone — will you help me repair it?";
      case "repair": return shape.robotRepair;
      case "teach": return shape.robotExplain;
      case "shapeDone": return shape.robotSuccess;
      case "missionDone": return "Mission complete! You taught me so much about halves!";
      default: return "";
    }
  }, [phase, shape]);

  useAutoSpeak(robotLine, [phase, shapeIdx]);

  const checkRepair = () => {
    const ok = shape.target.every((t, i) => Math.abs(vals[i] - t) <= shape.tolerance);
    if (ok) {
      setRepaired(true);
      setRepairMsg(null);
      setTimeout(() => setPhase("teach"), 700);
    } else {
      setRepairMsg("Almost! The parts aren't quite equal yet. Keep adjusting.");
    }
  };

  return (
    <>
      <TopBar title={`Mission 1 — Shape ${shapeIdx + 1} of ${MISSION_1_SHAPES.length}`} onBack={onBack} backLabel="Missions" />
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-8 grid lg:grid-cols-2 gap-6">
        {/* LEFT: Shape canvas */}
        <div className="bg-white rounded-2xl border p-6 shadow-sm flex flex-col" style={{ borderColor: "color-mix(in oklab, var(--color-brand-blue) 12%, white)" }}>
          <div className="flex items-center justify-between">
            <p className="label-eyebrow" style={{ color: BLUE }}>Specimen</p>
            <span className="text-xs font-mono px-2 py-1 rounded-full" style={{ background: SKY, color: BLUE }}>
              {shape.robotLabel}
            </span>
          </div>
          <div className="flex-1 flex items-center justify-center min-h-[280px] mt-4">
            {phase === "briefing" ? (
              <motion.div
                key="target-area"
                initial={{ scale: 0.96, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                className="w-full max-w-md aspect-square flex flex-col items-center justify-center"
              >
                <div
                  className="w-56 h-56 sm:w-64 sm:h-64 rounded-full border-4 border-dashed flex items-center justify-center"
                  style={{ borderColor: "color-mix(in oklab, var(--color-brand-blue) 30%, white)" }}
                >
                  <ScanSearch className="w-12 h-12 opacity-40" style={{ color: BLUE }} />
                </div>
                <p className="label-eyebrow mt-4" style={{ color: BLUE }}>Target Area</p>
              </motion.div>
            ) : (
              <motion.div
                key={`${shape.id}-${repaired}`}
                initial={{ scale: 0.96, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                className="w-full max-w-md aspect-square"
              >
                {shape.render(vals, repaired)}
              </motion.div>
            )}
          </div>

          {phase === "repair" && (
            <div className="mt-6 space-y-4">
              {vals.map((v, i) => (
                <div key={i}>
                  <div className="flex justify-between text-xs font-mono mb-1" style={{ color: BLUE }}>
                    <span>Divider {i + 1}</span>
                    <span>{Math.round(v)}</span>
                  </div>
                  <input
                    type="range" min={0} max={100} step={0.5} value={v}
                    onChange={(e) => {
                      const next = [...vals];
                      next[i] = Number(e.target.value);
                      setVals(next);
                    }}
                    className="w-full accent-[var(--color-brand-blue)]"
                  />
                </div>
              ))}
              {repairMsg && (
                <p className="text-sm" style={{ color: BLUE }}>{repairMsg}</p>
              )}
              <button
                onClick={checkRepair}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-transform hover:scale-[1.02]"
                style={{ background: YELLOW, color: BLUE }}
              >
                <Wrench className="w-4 h-4" /> Check Repair
              </button>
            </div>
          )}
        </div>

        {/* RIGHT: Robot dialogue + controls */}
        <div className="bg-white rounded-2xl border p-6 shadow-sm flex flex-col" style={{ borderColor: "color-mix(in oklab, var(--color-brand-blue) 12%, white)" }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: BLUE }}>
              <Bot className="w-5 h-5" style={{ color: YELLOW }} />
            </div>
            <div>
              <p className="label-eyebrow" style={{ color: BLUE }}>ZED-4</p>
              <p className="text-xs font-mono text-gray-500">Apprentice Robot</p>
            </div>
            <button
              onClick={() => speakText(robotLine)}
              className="ml-auto inline-flex items-center gap-2 px-2.5 py-1.5 rounded-full text-xs font-semibold border hover:bg-slate-50 transition"
              style={{ color: BLUE, borderColor: "color-mix(in oklab, var(--color-brand-blue) 25%, white)" }}
            >
              <Volume2 className="w-3.5 h-3.5" /> Replay
            </button>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={phase + shapeIdx}
              initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
              className="mt-4 p-4 rounded-xl"
              style={{ background: SKY, color: BLUE }}
            >
              <p className="text-base leading-relaxed">{robotLine}</p>
            </motion.div>
          </AnimatePresence>

          <div className="mt-6 flex-1">
            <PhaseControls
              phase={phase}
              shapeId={shape.id}
              shapeName={shape.name}
              robotLine={robotLine}
              isLast={isLast}
              onStartScanner={() => setPhase("investigate")}
              onAnswerYes={() => setPhase("explainWrong")}
              onAnswerNo={() => setPhase("detect")}
              onCorrectDetect={() => setPhase("repairPrompt")}
              onEnterRepair={() => setPhase("repair")}
              onRetryWrong={() => setPhase("investigate")}
              onCorrectTeach={() => setPhase("shapeDone")}
              onNextShape={() => {
                if (isLast) setPhase("missionDone");
                else goToShape(shapeIdx + 1);
              }}
              onFinishMission={onFinish}
            />
          </div>
        </div>
      </section>
    </>
  );
}

/* ------------------------------ Phase Controls ---------------------------- */

function PhaseControls(props: {
  phase: Phase;
  shapeId: string;
  shapeName: string;
  robotLine: string;
  isLast: boolean;
  onStartScanner: () => void;
  onAnswerYes: () => void;
  onAnswerNo: () => void;
  onCorrectDetect: () => void;
  onEnterRepair: () => void;
  onRetryWrong: () => void;
  onCorrectTeach: () => void;
  onNextShape: () => void;
  onFinishMission: () => void;
}) {
  const { phase } = props;

  if (phase === "briefing") {
    return (
      <div className="space-y-3">
        <p className="text-xs font-mono text-center" style={{ color: "color-mix(in oklab, var(--color-brand-blue) 70%, white)" }}>
          Tap Start Scanner so we can share it together.
        </p>
        <motion.button
          onClick={props.onStartScanner}
          animate={{ scale: [1, 1.03, 1] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold"
          style={{ background: BLUE, color: "white" }}
        >
          <ScanSearch className="w-4 h-4" /> Start Scanner
        </motion.button>
      </div>
    );
  }

  if (phase === "investigate") {
    return (
      <div className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-3">
          <button
            onClick={props.onAnswerYes}
            className="px-4 py-3 rounded-xl font-semibold border transition hover:bg-slate-50"
            style={{ color: BLUE, borderColor: "color-mix(in oklab, var(--color-brand-blue) 25%, white)" }}
          >
            Yes, the robot is right.
          </button>
          <button
            onClick={props.onAnswerNo}
            className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold transition-transform hover:scale-[1.02]"
            style={{ background: YELLOW, color: BLUE }}
          >
            <AlertTriangle className="w-4 h-4" /> No, there is a glitch!
          </button>
        </div>
        <p className="text-xs font-mono text-center" style={{ color: "color-mix(in oklab, var(--color-brand-blue) 70%, white)" }}>
          Look closely — are the parts really equal?
        </p>
      </div>
    );
  }

  if (phase === "detect" || phase === "explainWrong" || phase === "teach") {
    const mode: "detect" | "wrong" | "explain" =
      phase === "detect" ? "detect" : phase === "explainWrong" ? "wrong" : "explain";
    return (
      <ReasoningBox
        key={phase + props.shapeId}
        mode={mode}
        shapeContext={`${props.shapeName} (${props.shapeId})`}
        seedZedLine={props.robotLine}
        autoStart
        onCorrect={phase === "teach" ? props.onCorrectTeach : phase === "detect" ? props.onCorrectDetect : props.onRetryWrong}
        secondaryAction={phase === "explainWrong" ? { label: "I changed my mind", run: props.onRetryWrong } : null}
      />
    );
  }

  if (phase === "shapeDone") {
    return (
      <motion.div initial={{ scale: 0.96 }} animate={{ scale: [0.96, 1.04, 1] }} className="flex flex-col items-center gap-4">
        <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: YELLOW }}>
          <CheckCircle2 className="w-7 h-7" style={{ color: BLUE }} />
        </div>
        <p className="font-semibold text-lg" style={{ color: BLUE }}>Shape repaired!</p>
        <button
          onClick={props.onNextShape}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold transition-transform hover:scale-[1.02]"
          style={{ background: BLUE, color: "white" }}
        >
          {props.isLast ? "Finish Mission" : "Next Shape"} <ArrowRight className="w-4 h-4" />
        </button>
      </motion.div>
    );
  }

  if (phase === "missionDone") {
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <Sparkles className="w-10 h-10" style={{ color: YELLOW }} />
        <p className="font-bold text-xl" style={{ color: BLUE }}>Mission Complete</p>
        <p className="text-sm" style={{ color: "color-mix(in oklab, var(--color-brand-blue) 70%, white)" }}>
          You repaired every shape and taught ZED-4 what fair sharing means.
        </p>
        <button
          onClick={props.onFinishMission}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold transition-transform hover:scale-[1.02]"
          style={{ background: BLUE, color: "white" }}
        >
          Return to Missions <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return null;
}

/* ----------------------------- Reasoning Box ------------------------------ */

type Turn = { role: "child" | "zed"; text: string };

function ReasoningBox({
  mode,
  shapeContext,
  seedZedLine,
  autoStart,
  onCorrect,
  secondaryAction,
}: {
  mode: "detect" | "wrong" | "explain";
  shapeContext: string;
  seedZedLine?: string;
  autoStart?: boolean;
  onCorrect: () => void;
  secondaryAction: { label: string; run: () => void } | null;
}) {
  const [turns, setTurns] = useState<Turn[]>(
    seedZedLine ? [{ role: "zed", text: seedZedLine }] : [],
  );
  const [pending, setPending] = useState(false);
  const [typed, setTyped] = useState("");
  const correctRef = useRef(false);
  const logRef = useRef<HTMLDivElement>(null);
  const lastZedRef = useRef<string>(seedZedLine ?? "");

  // Defined later, but referenced inside sendToZed via refs
  const startRef = useRef<() => void>(() => {});
  const stopRef = useRef<() => void>(() => {});

  const sendToZed = useCallback(
    async (childText: string) => {
      if (!childText.trim() || correctRef.current) return;
      // Pause mic immediately so we don't hear ZED's reply
      try { stopRef.current(); } catch { /* */ }
      const newChild: Turn = { role: "child", text: childText.trim() };
      const history = [...turns, newChild];
      setTurns(history);
      setPending(true);
      // After 2 child explanations in "wrong" mode (investigate),
      // ZED concedes and moves to the Repair phase so the child can fix it.
      const childTurnsCount = history.filter((t) => t.role === "child").length;
      const forceAdvance = mode === "wrong" && childTurnsCount >= 2;
      try {
        const endpoint =
          mode === "explain" ? "/api/evaluate-reasoning"
          : mode === "wrong" ? "/api/evaluate-wrong-reasoning"
          : "/api/evaluate-detect-reasoning";
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: childText.trim(),
            mode,
            shapeContext,
            history: turns.slice(-10),
          }),
        });
        const data = await res.json();
        const replyText = forceAdvance
          ? "Okay teacher, I think I see it now! Help me fix it — drag the slider so the parts are really equal."
          : data.feedbackText;
        setTurns((prev) => [...prev, { role: "zed", text: replyText }]);
        lastZedRef.current = replyText;
        const resume = () => {
          if (!correctRef.current && autoStart) {
            setTimeout(() => { try { startRef.current(); } catch { /* */ } }, 250);
          }
        };
        if (data.isCorrect || forceAdvance) {
          correctRef.current = true;
          speakText(replyText, () => setTimeout(onCorrect, 600));
        } else {
          speakText(replyText, resume);
        }
      } catch {
        if (forceAdvance) {
          const concede = "Okay teacher, I think I see it now! Help me fix it — drag the slider so the parts are really equal.";
          setTurns((prev) => [...prev, { role: "zed", text: concede }]);
          lastZedRef.current = concede;
          correctRef.current = true;
          speakText(concede, () => setTimeout(onCorrect, 600));
        } else {
          const fallback = "Thanks teacher! My ears got a little fuzzy. Can you say that again?";
          setTurns((prev) => [...prev, { role: "zed", text: fallback }]);
          lastZedRef.current = fallback;
          speakText(fallback, () => {
            if (!correctRef.current && autoStart) {
              setTimeout(() => { try { startRef.current(); } catch { /* */ } }, 250);
            }
          });
        }
      } finally {
        setPending(false);
      }
    },
    [turns, mode, shapeContext, onCorrect, autoStart],
  );

  const handleFinal = useCallback(
    (t: string) => {
      if (correctRef.current || pending) return;
      // Drop transcripts that echo ZED's most recent line (mic picked up TTS)
      const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9 ]/g, "").trim();
      const last = norm(lastZedRef.current);
      const got = norm(t);
      if (last && got && (last.startsWith(got.slice(0, 24)) || got.startsWith(last.slice(0, 24)))) {
        return;
      }
      void sendToZed(t);
    },
    [sendToZed, pending],
  );

  const { listening, interim, supported, start, stop } = useContinuousSpeech(handleFinal);
  startRef.current = start;
  stopRef.current = stop;

  // Auto-scroll log
  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: "smooth" });
  }, [turns, interim, pending]);

  // Stop mic on unmount
  useEffect(() => () => { try { stop(); } catch { /* */ } }, [stop]);

  // Auto-start mic shortly after mount (after seeded TTS settles)
  useEffect(() => {
    if (!autoStart || !supported) return;
    const t = setTimeout(() => { try { start(); } catch { /* */ } }, 600);
    return () => clearTimeout(t);
  }, [autoStart, supported, start]);

  const submitTyped = () => {
    if (!typed.trim() || pending) return;
    const t = typed.trim();
    setTyped("");
    void sendToZed(t);
  };

  return (
    <div className="space-y-3">
      {/* Conversation log */}
      <div
        ref={logRef}
        className="rounded-xl border bg-white p-3 max-h-64 overflow-y-auto space-y-2"
        style={{ borderColor: "color-mix(in oklab, var(--color-brand-blue) 15%, white)" }}
      >
        {turns.length === 0 && !interim && !pending && (
          <p className="text-xs font-mono text-gray-400 text-center py-4">
            {supported ? "Tap the mic and start talking to ZED-4." : "Type your reply below to talk to ZED-4."}
          </p>
        )}
        {turns.map((t, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
            className={`text-sm leading-snug px-3 py-2 rounded-xl max-w-[90%] ${t.role === "child" ? "ml-auto" : ""}`}
            style={{
              background: t.role === "child" ? SKY : "color-mix(in oklab, var(--color-brand-yellow) 25%, white)",
              color: BLUE,
            }}
          >
            <span className="label-eyebrow block mb-0.5 opacity-70">
              {t.role === "child" ? "You" : "ZED-4"}
            </span>
            {t.text}
          </motion.div>
        ))}
        {interim && (
          <div className="text-sm italic text-gray-400 px-3 py-1 ml-auto max-w-[90%]">{interim}…</div>
        )}
        {pending && (
          <div className="flex items-center gap-2 text-xs text-gray-500 px-3 py-1">
            <Loader2 className="w-3 h-3 animate-spin" /> ZED-4 is thinking…
          </div>
        )}
      </div>

      {/* Mic toggle */}
      {supported && (
        <div className="flex items-center gap-3">
          <motion.button
            onClick={listening ? stop : start}
            whileTap={{ scale: 0.95 }}
            animate={listening ? { boxShadow: ["0 0 0 0 rgba(0,0,0,0)", "0 0 0 8px rgba(234,179,8,0.25)", "0 0 0 0 rgba(0,0,0,0)"] } : {}}
            transition={listening ? { repeat: Infinity, duration: 1.4 } : {}}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition"
            style={{
              background: listening ? YELLOW : BLUE,
              color: listening ? BLUE : "white",
            }}
          >
            {listening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            {listening ? "Listening — tap to pause" : "Talk to ZED-4"}
          </motion.button>
          {secondaryAction && (
            <button
              onClick={secondaryAction.run}
              className="ml-auto text-xs font-mono underline opacity-70 hover:opacity-100"
              style={{ color: BLUE }}
            >
              {secondaryAction.label}
            </button>
          )}
        </div>
      )}

      {/* Try Again — clears last exchange so the child can rephrase */}
      {!pending && !correctRef.current && turns.some((t) => t.role === "child") &&
        turns[turns.length - 1]?.role === "zed" && (
          <button
            onClick={() => {
              setTurns((prev) => {
                // Drop trailing zed + preceding child to undo the last exchange
                const next = [...prev];
                if (next[next.length - 1]?.role === "zed") next.pop();
                if (next[next.length - 1]?.role === "child") next.pop();
                return next;
              });
            }}
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border hover:bg-slate-50 transition"
            style={{ color: BLUE, borderColor: "color-mix(in oklab, var(--color-brand-blue) 25%, white)" }}
          >
            <RefreshCcw className="w-3.5 h-3.5" /> Try Again
          </button>
        )}

      {/* Typed fallback */}
      <div className="flex items-center gap-2">
        <input
          value={typed}
          onChange={(e) => setTyped(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") submitTyped(); }}
          placeholder={supported ? "…or type instead" : "Type your reply to ZED-4"}
          className="flex-1 px-3 py-2 rounded-xl border bg-white text-sm focus:outline-none focus:ring-2"
          style={{ color: BLUE, borderColor: "color-mix(in oklab, var(--color-brand-blue) 20%, white)" }}
        />
        <button
          onClick={submitTyped}
          disabled={!typed.trim() || pending}
          className="inline-flex items-center gap-1 px-3 py-2 rounded-xl font-semibold text-sm disabled:opacity-50"
          style={{ background: BLUE, color: "white" }}
        >
          <Send className="w-3.5 h-3.5" /> Send
        </button>
        {turns.length > 0 && !correctRef.current && (
          <button
            onClick={() => { setTurns([]); }}
            title="Reset conversation"
            className="inline-flex items-center gap-1 px-2 py-2 rounded-xl text-xs border"
            style={{ color: BLUE, borderColor: "color-mix(in oklab, var(--color-brand-blue) 20%, white)" }}
          >
            <RefreshCcw className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}

