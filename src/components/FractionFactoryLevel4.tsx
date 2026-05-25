import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Combine,
  Droplet,
  Cog,
  Zap,
  Scissors,
  Wrench,
} from "lucide-react";
import { useLevelProgress } from "@/lib/mission-progress";
import { LEVEL_4_MISSIONS } from "@/lib/level4/missions";
import type { L4CaseDef, L4MissionDef, L4Phase } from "@/lib/level4/types";
import { useAutoSpeak } from "@/lib/speech";
import { useNarrate } from "@/lib/narrate";
import { InvestigationLayout } from "./level2/InvestigationLayout";
import { L2TopBar } from "./level2/TopBar";
import { DialogueDock } from "./level2/DialogueDock";
import { ExplainPanel } from "./level2/ExplainPanel";
import { ReplayInstructionsButton } from "./level2/ReplayInstructionsButton";
import { L4CaseFile } from "./level4/CaseFile";
import { L4GlitchCheckPanel } from "./level4/GlitchCheckPanel";
import { SupplyMergeStation } from "./level4/workspaces/SupplyMergeStation";
import { LeakDetector } from "./level4/workspaces/LeakDetector";
import { DenominatorCore } from "./level4/workspaces/DenominatorCore";
import { EquivalenceBooster } from "./level4/workspaces/EquivalenceBooster";
import { SimplificationEngine } from "./level4/workspaces/SimplificationEngine";
import { MasterRepairStation } from "./level4/workspaces/MasterRepairStation";

type View = "intro" | "mission-select" | "mission-play";

const MISSION_ICONS = [Combine, Droplet, Cog, Zap, Scissors, Wrench] as const;

const INTRO =
  "The arithmetic engines are malfunctioning. Supply systems are merging wrong, fuel tanks are leaking quantities, the denominator core is unstable, and the repair pipelines are jammed. Welcome to the repair facility, engineer.";

export default function FractionFactoryLevel4({
  onExitToHub,
}: {
  onExitToHub: () => void;
}) {
  const [view, setView] = useState<View>("intro");
  const [activeMissionId, setActiveMissionId] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);
  const progress = useLevelProgress(4);
  const activeMission =
    LEVEL_4_MISSIONS.find((m) => m.id === activeMissionId) ?? LEVEL_4_MISSIONS[0];

  const start = (id: 1 | 2 | 3 | 4 | 5 | 6) => {
    setActiveMissionId(id);
    setView("mission-play");
  };

  return (
    <main
      className="min-h-screen"
      style={{
        background:
          "radial-gradient(ellipse at top, #2a1608 0%, #1a0d04 60%, #0a0502 100%)",
        color: "#ffe6c6",
      }}
    >
      <AnimatePresence mode="wait">
        {view === "intro" && (
          <motion.div key="intro" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <Intro onBack={onExitToHub} onContinue={() => setView("mission-select")} />
          </motion.div>
        )}
        {view === "mission-select" && (
          <motion.div key="select" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <MissionSelect
              onBack={() => setView("intro")}
              onStart={start}
              isComplete={progress.isMissionComplete}
            />
          </motion.div>
        )}
        {view === "mission-play" && (
          <motion.div key={`m-${activeMission.id}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <MissionPlay
              mission={activeMission}
              onBack={() => setView("mission-select")}
              onExitToHub={onExitToHub}
              onMissionComplete={(stats) => progress.markComplete(activeMission.id, stats)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

/* ─────────────────────────── Intro ─────────────────────────── */

function Intro({ onBack, onContinue }: { onBack: () => void; onContinue: () => void }) {
  useNarrate(
    `Level 4. The Arithmetic Engines Are Malfunctioning. ${INTRO} When you're ready, tap Enter Repair Facility.`,
  );
  return (
    <>
      <L2TopBar title="Level 4 · Repair Systems" subtitle="Briefing" onBack={onBack} backLabel="Hub" />
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <motion.div
          initial={{ scale: 0.98, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="rounded-3xl border p-8 space-y-5"
          style={{
            background: "linear-gradient(180deg, rgba(40,22,8,0.85), rgba(28,16,8,0.85))",
            borderColor: "color-mix(in oklab, #ffb86b 35%, transparent)",
            boxShadow: "0 30px 80px -40px rgba(255,184,107,0.5)",
          }}
        >
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div>
              <p className="label-eyebrow text-amber-300">Engineer briefing</p>
              <h1 className="text-3xl sm:text-4xl font-bold text-amber-50 mt-1">
                The Arithmetic Engines Are Malfunctioning
              </h1>
            </div>
            <ReplayInstructionsButton text={INTRO} />
          </div>
          <p className="text-lg sm:text-xl text-amber-100/90 leading-relaxed">{INTRO}</p>
          <div
            className="rounded-xl border px-4 py-3 text-sm text-amber-100/90"
            style={{
              background: "rgba(255,233,138,0.08)",
              borderColor: "color-mix(in oklab, #ffe98a 35%, transparent)",
            }}
          >
            <span className="label-eyebrow text-amber-200 mr-2">Mission focus</span>
            Add · Subtract · Denominator stability · Equivalence · Simplify · Master repair
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onContinue}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl font-bold transition-transform hover:scale-[1.02]"
              style={{
                background: "linear-gradient(135deg, #ffe98a, #f5c84a)",
                color: "#1c1408",
                boxShadow: "0 0 30px rgba(255,233,138,0.35)",
              }}
            >
              Enter Repair Facility <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </section>
    </>
  );
}

/* ─────────────────────── Mission Select ────────────────────── */

function MissionSelect({
  onBack,
  onStart,
  isComplete,
}: {
  onBack: () => void;
  onStart: (id: 1 | 2 | 3 | 4 | 5 | 6) => void;
  isComplete: (id: number) => boolean;
}) {
  useNarrate("Repair bay. Pick an engine to repair, engineer.");
  return (
    <>
      <L2TopBar title="Repair Bay" subtitle="Level 4 · Repair Systems" onBack={onBack} backLabel="Briefing" />
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <ul className="grid sm:grid-cols-2 gap-4">
          {LEVEL_4_MISSIONS.map((m, i) => {
            const Icon = MISSION_ICONS[i];
            const done = isComplete(m.id);
            return (
              <motion.li
                key={m.id}
                whileHover={{ y: -3 }}
                className="rounded-2xl border p-5 cursor-pointer transition"
                style={{
                  background: "linear-gradient(180deg, rgba(40,22,8,0.75), rgba(28,16,8,0.7))",
                  borderColor: "color-mix(in oklab, #ffb86b 35%, transparent)",
                }}
                onClick={() => onStart(m.id)}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                    style={{
                      background: "linear-gradient(135deg, #ffb86b, #d4742a)",
                      boxShadow: "0 0 20px rgba(255,184,107,0.4)",
                    }}
                  >
                    <Icon className="w-6 h-6 text-[#1c1408]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="label-eyebrow text-amber-300/80">Mission {m.id}</p>
                    <h3 className="text-xl font-bold text-amber-50 truncate">{m.name}</h3>
                  </div>
                  {done && (
                    <span
                      className="inline-flex items-center gap-1 text-xs font-mono px-2 py-1 rounded-full"
                      style={{ background: "rgba(125,244,198,0.18)", color: "#7df4c6" }}
                    >
                      <CheckCircle2 className="w-3 h-3" /> Done
                    </span>
                  )}
                </div>
                <p className="text-base text-amber-100/80 mt-3">
                  <span className="font-semibold text-amber-100">Focus: </span>
                  {m.focus}
                </p>
                <p className="text-sm text-amber-200/60 mt-1">{m.sector}</p>
              </motion.li>
            );
          })}
        </ul>
      </section>
    </>
  );
}

/* ───────────────────────── Mission Play ──────────────────────── */

function MissionPlay({
  mission,
  onBack,
  onExitToHub,
  onMissionComplete,
}: {
  mission: L4MissionDef;
  onBack: () => void;
  onExitToHub: () => void;
  onMissionComplete: (stats: { reasoningScore: number; repairAttempts: number; hintsUsed: number }) => void;
}) {
  const cases = mission.cases;
  const [caseIdx, setCaseIdx] = useState(0);
  const [phase, setPhase] = useState<L4Phase>("briefing");
  const [repairedLabel, setRepairedLabel] = useState<string | undefined>();
  const [childExplanation, setChildExplanation] = useState<string | undefined>();
  const [zedLine, setZedLine] = useState<string>("");

  const attemptsRef = useRef(0);
  const scoresRef = useRef<number[]>([]);
  const firedRef = useRef(false);

  const caseDef = cases[caseIdx];
  const isLastCase = caseIdx === cases.length - 1;
  const isMissionDone = phase === "caseDone" && isLastCase;

  useEffect(() => {
    setCaseIdx(0);
    setPhase("briefing");
    setRepairedLabel(undefined);
    setChildExplanation(undefined);
    attemptsRef.current = 0;
    scoresRef.current = [];
    firedRef.current = false;
  }, [mission.id]);

  useEffect(() => {
    setZedLine(caseDef.zedBriefing);
    setRepairedLabel(undefined);
    setChildExplanation(undefined);
  }, [caseDef.id, caseDef.zedBriefing]);

  useAutoSpeak(zedLine, [zedLine]);

  useEffect(() => {
    if (isMissionDone && !firedRef.current) {
      firedRef.current = true;
      const avg = scoresRef.current.length
        ? Math.round(scoresRef.current.reduce((a, b) => a + b, 0) / scoresRef.current.length)
        : 2;
      onMissionComplete({
        reasoningScore: Math.max(1, Math.min(3, avg)),
        repairAttempts: attemptsRef.current,
        hintsUsed: 0,
      });
    }
  }, [isMissionDone, onMissionComplete]);

  const startCase = () => setPhase("glitch-check");
  const handleGlitchResolved = () => setPhase("repair");
  const handleRepairComplete = (label: string) => {
    setRepairedLabel(label);
    setPhase("explain");
    setZedLine("Ohhh thank you teacher! Now help me see WHY — how does this work?");
  };
  const handleExplainComplete = (s: { reasoningScore: number; explanation: string }) => {
    scoresRef.current.push(s.reasoningScore);
    setChildExplanation(s.explanation);
    setPhase("feedback");
    setTimeout(() => setPhase("caseDone"), 1000);
  };

  const nextCase = () => {
    if (isLastCase) return;
    setCaseIdx((i) => i + 1);
    setPhase("briefing");
  };

  const Workspace = useMemo(() => {
    switch (mission.id) {
      case 1: return SupplyMergeStation;
      case 2: return LeakDetector;
      case 3: return DenominatorCore;
      case 4: return EquivalenceBooster;
      case 5: return SimplificationEngine;
      case 6: return MasterRepairStation;
      default: return SupplyMergeStation;
    }
  }, [mission.id]);

  return (
    <InvestigationLayout
      topBar={
        <L2TopBar
          title={`Mission ${mission.id} · ${mission.name}`}
          subtitle={mission.sector}
          caseIndex={caseIdx}
          totalCases={cases.length}
          onBack={onBack}
          backLabel="Bay"
          rightSlot={
            <button
              type="button"
              onClick={onExitToHub}
              className="hidden sm:inline-flex label-eyebrow text-amber-200 hover:text-amber-50 px-2.5 py-1 rounded-full hover:bg-white/10"
            >
              Exit to hub
            </button>
          }
        />
      }
      caseFile={
        <L4CaseFile
          caseDef={caseDef}
          phase={phase}
          repaired={repairedLabel}
          childExplanation={childExplanation}
        />
      }
      workspace={
        phase === "briefing" ? (
          <BriefingPanel caseDef={caseDef} onContinue={startCase} />
        ) : phase === "glitch-check" ? (
          <L4GlitchCheckPanel
            caseDef={caseDef}
            onZedSpeak={setZedLine}
            onResolved={handleGlitchResolved}
          />
        ) : phase === "repair" ? (
          <Workspace
            caseDef={caseDef}
            onRepairComplete={handleRepairComplete}
            onAttempt={() => (attemptsRef.current += 1)}
          />
        ) : phase === "explain" || phase === "feedback" ? (
          <ExplainPanel caseDef={caseDef} onComplete={handleExplainComplete} />
        ) : (
          <CaseDonePanel isLast={isLastCase} onNext={nextCase} onFinish={onBack} />
        )
      }
      dock={<DialogueDock line={zedLine} replayText={caseDef.voiceInstructions} />}
    />
  );
}

function BriefingPanel({ caseDef, onContinue }: { caseDef: L4CaseDef; onContinue: () => void }) {
  const combined = `${caseDef.zedBriefing} … ${caseDef.voiceInstructions}`;
  useNarrate(combined, [caseDef.id]);
  return (
    <div className="flex flex-col gap-5">
      <header className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <p className="label-eyebrow text-amber-300/80">{caseDef.caseNumber}</p>
          <h3 className="text-2xl font-bold text-amber-50 mt-1">Investigate the broken engine</h3>
        </div>
        <ReplayInstructionsButton text={combined} />
      </header>
      <p className="text-lg text-amber-100/90 leading-relaxed">{caseDef.voiceInstructions}</p>
      <button
        type="button"
        onClick={onContinue}
        className="self-end inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold"
        style={{
          background: "linear-gradient(135deg, #ffb86b, #d4742a)",
          color: "#1c1408",
          boxShadow: "0 0 20px rgba(255,184,107,0.4)",
        }}
      >
        Let's repair it <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}

function CaseDonePanel({ isLast, onNext, onFinish }: { isLast: boolean; onNext: () => void; onFinish: () => void }) {
  useNarrate(
    isLast
      ? "Case resolved. Mission complete! ZED-4 logged your reasoning. The engine is back online."
      : "Case resolved. ZED-4 logged your reasoning. The engine is back online.",
    [isLast],
  );
  return (
    <motion.div
      initial={{ scale: 0.96, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="rounded-2xl border-2 p-6 text-center space-y-4"
      style={{
        borderColor: "color-mix(in oklab, #7df4c6 60%, transparent)",
        background: "rgba(125,244,198,0.06)",
      }}
    >
      <Sparkles className="w-10 h-10 mx-auto text-emerald-300" />
      <p className="label-eyebrow text-emerald-200">Case resolved</p>
      <h3 className="text-3xl font-bold text-amber-50">
        {isLast ? "Mission complete!" : "Engine restored."}
      </h3>
      <p className="text-base text-amber-100/90">
        ZED-4 logged your reasoning. The engine is back online.
      </p>
      {isLast ? (
        <button
          type="button"
          onClick={onFinish}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold"
          style={{ background: "linear-gradient(135deg, #ffe98a, #f5c84a)", color: "#1c1408" }}
        >
          Return to bay <ArrowRight className="w-4 h-4" />
        </button>
      ) : (
        <button
          type="button"
          onClick={onNext}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold"
          style={{ background: "linear-gradient(135deg, #ffb86b, #d4742a)", color: "#1c1408" }}
        >
          Next case <ArrowRight className="w-4 h-4" />
        </button>
      )}
    </motion.div>
  );
}
