import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  Lock,
  Sparkles,
  Map as MapIcon,
  Zap,
  Telescope,
  Boxes,
} from "lucide-react";
import { useLevelProgress } from "@/lib/mission-progress";
import { LEVEL_3_MISSIONS } from "@/lib/level3/missions";
import type { L3CaseDef, L3MissionDef, L3Phase } from "@/lib/level3/types";
import { useAutoSpeak } from "@/lib/speech";
import { useNarrate } from "@/lib/narrate";
import { InvestigationLayout } from "./level2/InvestigationLayout";
import { L2TopBar } from "./level2/TopBar";
import { DialogueDock } from "./level2/DialogueDock";
import { ExplainPanel } from "./level2/ExplainPanel";
import { ReplayInstructionsButton } from "./level2/ReplayInstructionsButton";
import { L3CaseFile } from "./level3/CaseFile";
import { L3GlitchCheckPanel } from "./level3/GlitchCheckPanel";
import { PathwayNavigator } from "./level3/workspaces/PathwayNavigator";
import { EquivalenceReactor } from "./level3/workspaces/EquivalenceReactor";
import { ComparisonObservatory } from "./level3/workspaces/ComparisonObservatory";
import { TransformationChamber } from "./level3/workspaces/TransformationChamber";

type View = "intro" | "mission-select" | "mission-play";

const MISSION_ICONS = [MapIcon, Zap, Telescope, Boxes] as const;

const INTRO =
  "The mapping systems are corrupted. Pathways are mis-aligned, equivalence reactors are unstable, comparison scanners are reading wrong, and the identity vault won't accept whole numbers. Welcome to Equivalence City, navigator.";

export default function FractionFactoryLevel3({
  onExitToHub,
}: {
  onExitToHub: () => void;
}) {
  const [view, setView] = useState<View>("intro");
  const [activeMissionId, setActiveMissionId] = useState<1 | 2 | 3 | 4>(1);
  const progress = useLevelProgress(3);
  const activeMission =
    LEVEL_3_MISSIONS.find((m) => m.id === activeMissionId) ?? LEVEL_3_MISSIONS[0];

  const start = (id: 1 | 2 | 3 | 4) => {
    setActiveMissionId(id);
    setView("mission-play");
  };

  return (
    <main
      className="min-h-screen"
      style={{
        background:
          "radial-gradient(ellipse at top, #0b1f3d 0%, #050d24 60%, #02060f 100%)",
        color: "#e6faff",
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
  useNarrate(`Level 3. The Mapping Systems Are Corrupted. ${INTRO} When you're ready, tap Enter Equivalence City.`);
  return (
    <>
      <L2TopBar title="Level 3 · Equivalence City" subtitle="Briefing" onBack={onBack} backLabel="Hub" />
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <motion.div
          initial={{ scale: 0.98, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="rounded-3xl border p-8 space-y-5"
          style={{
            background: "linear-gradient(180deg, rgba(10,28,60,0.85), rgba(6,16,38,0.85))",
            borderColor: "color-mix(in oklab, #5fd0ff 30%, transparent)",
            boxShadow: "0 30px 80px -40px rgba(95,208,255,0.5)",
          }}
        >
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div>
              <p className="label-eyebrow text-cyan-300">Navigator briefing</p>
              <h1 className="text-3xl sm:text-4xl font-bold text-cyan-50 mt-1">
                The Mapping Systems Are Corrupted
              </h1>
            </div>
            <ReplayInstructionsButton text={INTRO} />
          </div>
          <p className="text-lg sm:text-xl text-cyan-100/90 leading-relaxed">{INTRO}</p>
          <div
            className="rounded-xl border px-4 py-3 text-sm text-cyan-100/90"
            style={{
              background: "rgba(255,233,138,0.08)",
              borderColor: "color-mix(in oklab, #ffe98a 35%, transparent)",
            }}
          >
            <span className="label-eyebrow text-amber-200 mr-2">Mission focus</span>
            Number lines · Equivalent fractions · Comparing fractions · Whole numbers as fractions
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onContinue}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl font-bold transition-transform hover:scale-[1.02]"
              style={{
                background: "linear-gradient(135deg, #ffe98a, #f5c84a)",
                color: "#04162e",
                boxShadow: "0 0 30px rgba(255,233,138,0.35)",
              }}
            >
              Enter Equivalence City <ArrowRight className="w-4 h-4" />
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
  onStart: (id: 1 | 2 | 3 | 4) => void;
  isComplete: (id: number) => boolean;
}) {
  useNarrate("Sector map. Pick a district to begin, navigator.");
  return (
    <>
      <L2TopBar title="Sector Map" subtitle="Level 3 · Equivalence City" onBack={onBack} backLabel="Briefing" />
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <ul className="grid sm:grid-cols-2 gap-4">
          {LEVEL_3_MISSIONS.map((m, i) => {
            const Icon = MISSION_ICONS[i];
            const done = isComplete(m.id);
            return (
              <motion.li
                key={m.id}
                whileHover={{ y: -3 }}
                className="rounded-2xl border p-5 cursor-pointer transition"
                style={{
                  background: "linear-gradient(180deg, rgba(12,28,58,0.75), rgba(8,20,42,0.7))",
                  borderColor: "color-mix(in oklab, #5fd0ff 35%, transparent)",
                }}
                onClick={() => onStart(m.id)}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                    style={{
                      background: "linear-gradient(135deg, #5fd0ff, #1e7fbf)",
                      boxShadow: "0 0 20px rgba(95,208,255,0.4)",
                    }}
                  >
                    <Icon className="w-6 h-6 text-[#04162e]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="label-eyebrow text-cyan-300/80">Mission {m.id}</p>
                    <h3 className="text-xl font-bold text-cyan-50 truncate">{m.name}</h3>
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
                <p className="text-base text-cyan-100/80 mt-3">
                  <span className="font-semibold text-cyan-100">Focus: </span>
                  {m.focus}
                </p>
                <p className="text-sm text-cyan-200/60 mt-1">{m.sector}</p>
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
  mission: L3MissionDef;
  onBack: () => void;
  onExitToHub: () => void;
  onMissionComplete: (stats: { reasoningScore: number; repairAttempts: number; hintsUsed: number }) => void;
}) {
  const cases = mission.cases;
  const [caseIdx, setCaseIdx] = useState(0);
  const [phase, setPhase] = useState<L3Phase>("briefing");
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
      case 1: return PathwayNavigator;
      case 2: return EquivalenceReactor;
      case 3: return ComparisonObservatory;
      case 4: return TransformationChamber;
      default: return PathwayNavigator;
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
          backLabel="Sectors"
          rightSlot={
            <button
              type="button"
              onClick={onExitToHub}
              className="hidden sm:inline-flex label-eyebrow text-cyan-200 hover:text-cyan-50 px-2.5 py-1 rounded-full hover:bg-white/10"
            >
              Exit to hub
            </button>
          }
        />
      }
      caseFile={
        <L3CaseFile
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
          <L3GlitchCheckPanel
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

function BriefingPanel({ caseDef, onContinue }: { caseDef: L3CaseDef; onContinue: () => void }) {
  const combined = `${caseDef.zedBriefing} … ${caseDef.voiceInstructions}`;
  useNarrate(combined, [caseDef.id]);
  return (
    <div className="flex flex-col gap-5">
      <header className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <p className="label-eyebrow text-cyan-300/80">{caseDef.caseNumber}</p>
          <h3 className="text-2xl font-bold text-cyan-50 mt-1">Investigate ZED's mapping</h3>
        </div>
        <ReplayInstructionsButton text={combined} />
      </header>
      <p className="text-lg text-cyan-100/90 leading-relaxed">{caseDef.voiceInstructions}</p>
      <button
        type="button"
        onClick={onContinue}
        className="self-end inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold"
        style={{
          background: "linear-gradient(135deg, #5fd0ff, #2a8ec9)",
          color: "#04162e",
          boxShadow: "0 0 20px rgba(95,208,255,0.4)",
        }}
      >
        Let's investigate <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}

function CaseDonePanel({ isLast, onNext, onFinish }: { isLast: boolean; onNext: () => void; onFinish: () => void }) {
  useNarrate(
    isLast
      ? "Case resolved. Mission complete! ZED-4 logged your reasoning. The city's mapping systems are coming back online."
      : "Case resolved. ZED-4 logged your reasoning. The mapping systems are coming back online.",
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
      <h3 className="text-3xl font-bold text-cyan-50">
        {isLast ? "Mission complete!" : "System restored."}
      </h3>
      <p className="text-base text-cyan-100/90">
        ZED-4 logged your reasoning. The city's mapping systems are coming back online.
      </p>
      {isLast ? (
        <button
          type="button"
          onClick={onFinish}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold"
          style={{ background: "linear-gradient(135deg, #ffe98a, #f5c84a)", color: "#04162e" }}
        >
          Return to sectors <ArrowRight className="w-4 h-4" />
        </button>
      ) : (
        <button
          type="button"
          onClick={onNext}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold"
          style={{ background: "linear-gradient(135deg, #5fd0ff, #2a8ec9)", color: "#04162e" }}
        >
          Next case <ArrowRight className="w-4 h-4" />
        </button>
      )}
    </motion.div>
  );
}

// Mark Lock as used to satisfy linting on isolated imports
void Lock;
