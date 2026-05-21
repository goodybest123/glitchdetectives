import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight, Atom, CheckCircle2, FlaskConical, Layers,
  Lock, Scan, Sparkles,
} from "lucide-react";
import { useLevelProgress } from "@/lib/mission-progress";
import { LEVEL_2_MISSIONS } from "@/lib/level2/missions";
import type { CaseDef, CasePhase, FractionPair, Mission2Def } from "@/lib/level2/types";
import { useAutoSpeak } from "@/lib/speech";
import { useNarrate } from "@/lib/narrate";
import { InvestigationLayout } from "./level2/InvestigationLayout";
import { L2TopBar } from "./level2/TopBar";
import { CaseFile } from "./level2/CaseFile";
import { DialogueDock } from "./level2/DialogueDock";
import { ExplainPanel } from "./level2/ExplainPanel";
import { GlitchCheckPanel } from "./level2/GlitchCheckPanel";
import { NumeratorScanner } from "./level2/workspaces/NumeratorScanner";
import { DenominatorRepair } from "./level2/workspaces/DenominatorRepair";
import { UnitFractionSorter } from "./level2/workspaces/UnitFractionSorter";
import { CollectionVault } from "./level2/workspaces/CollectionVault";

type View = "intro" | "mission-select" | "mission-play";

const MISSION_ICONS = [Scan, Layers, Atom, FlaskConical] as const;

const INTRO =
  "The factory's naming systems are corrupted. Numerators and denominators are mixed up, and ZED-4 cannot interpret fractions correctly. Welcome to the Fraction Discovery Zone, analyst.";

export default function FractionFactoryLevel2({
  onExitToHub,
}: {
  onExitToHub: () => void;
}) {
  const [view, setView] = useState<View>("intro");
  const [activeMissionId, setActiveMissionId] = useState<1 | 2 | 3 | 4>(1);
  const progress = useLevelProgress(2);
  const activeMission =
    LEVEL_2_MISSIONS.find((m) => m.id === activeMissionId) ?? LEVEL_2_MISSIONS[0];

  const start = (id: 1 | 2 | 3 | 4) => {
    if (!progress.isMissionUnlocked(id)) return;
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
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <Intro onBack={onExitToHub} onContinue={() => setView("mission-select")} />
          </motion.div>
        )}
        {view === "mission-select" && (
          <motion.div
            key="select"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <MissionSelect
              onBack={() => setView("intro")}
              onStart={start}
              isUnlocked={progress.isMissionUnlocked}
              isComplete={progress.isMissionComplete}
            />
          </motion.div>
        )}
        {view === "mission-play" && (
          <motion.div
            key={`m-${activeMission.id}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <MissionPlay
              mission={activeMission}
              onBack={() => setView("mission-select")}
              onExitToHub={onExitToHub}
              onMissionComplete={(stats) =>
                progress.markComplete(activeMission.id, stats)
              }
            />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

/* --------------------------------- Intro ---------------------------------- */

function Intro({ onBack, onContinue }: { onBack: () => void; onContinue: () => void }) {
  useNarrate(
    `Level 2. The Naming Systems Are Corrupted. ${INTRO} When you're ready, tap Enter Analysis Lab.`,
  );
  return (
    <>
      <L2TopBar
        title="Level 2 · Fraction Discovery Zone"
        subtitle="Briefing"
        onBack={onBack}
        backLabel="Hub"
      />
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <motion.div
          initial={{ scale: 0.98, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="rounded-3xl border p-8 space-y-5"
          style={{
            background:
              "linear-gradient(180deg, rgba(10,28,60,0.85), rgba(6,16,38,0.85))",
            borderColor: "color-mix(in oklab, #5fd0ff 30%, transparent)",
            boxShadow: "0 30px 80px -40px rgba(95,208,255,0.5)",
          }}
        >
          <p className="label-eyebrow text-cyan-300">Detective briefing</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-cyan-50">
            The Naming Systems Are Corrupted
          </h1>
          <p className="text-base sm:text-lg text-cyan-100/90 leading-relaxed">
            {INTRO}
          </p>
          <div
            className="rounded-xl border px-4 py-3 text-sm text-cyan-100/90"
            style={{
              background: "rgba(255,233,138,0.08)",
              borderColor: "color-mix(in oklab, #ffe98a 35%, transparent)",
            }}
          >
            <span className="label-eyebrow text-amber-200 mr-2">Mission focus</span>
            Numerators · Denominators · Unit fractions · Fractions of sets
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
              Enter Analysis Lab <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </section>
    </>
  );
}

/* ----------------------------- Mission select ----------------------------- */

function MissionSelect({
  onBack,
  onStart,
  isUnlocked,
  isComplete,
}: {
  onBack: () => void;
  onStart: (id: 1 | 2 | 3 | 4) => void;
  isUnlocked: (id: number) => boolean;
  isComplete: (id: number) => boolean;
}) {
  useNarrate("Sector Map. Pick a mission to begin, analyst.");
  return (
    <>
      <L2TopBar
        title="Sector Map"
        subtitle="Level 2 · Discovery Zone"
        onBack={onBack}
        backLabel="Briefing"
      />
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <ul className="grid sm:grid-cols-2 gap-4">
          {LEVEL_2_MISSIONS.map((m, i) => {
            const Icon = MISSION_ICONS[i];
            const unlocked = isUnlocked(m.id);
            const done = isComplete(m.id);
            return (
              <motion.li
                key={m.id}
                whileHover={unlocked ? { y: -3 } : undefined}
                className={`rounded-2xl border p-5 cursor-pointer transition ${
                  unlocked ? "" : "opacity-50 pointer-events-none"
                }`}
                style={{
                  background:
                    "linear-gradient(180deg, rgba(12,28,58,0.75), rgba(8,20,42,0.7))",
                  borderColor: unlocked
                    ? "color-mix(in oklab, #5fd0ff 35%, transparent)"
                    : "color-mix(in oklab, #5fd0ff 12%, transparent)",
                }}
                onClick={() => unlocked && onStart(m.id as 1 | 2 | 3 | 4)}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                    style={{
                      background:
                        "linear-gradient(135deg, #5fd0ff, #1e7fbf)",
                      boxShadow: "0 0 20px rgba(95,208,255,0.4)",
                    }}
                  >
                    <Icon className="w-6 h-6 text-[#04162e]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="label-eyebrow text-cyan-300/80">Mission {m.id}</p>
                    <h3 className="text-lg font-bold text-cyan-50 truncate">
                      {m.name}
                    </h3>
                  </div>
                  {done ? (
                    <span
                      className="inline-flex items-center gap-1 text-xs font-mono px-2 py-1 rounded-full"
                      style={{ background: "rgba(125,244,198,0.18)", color: "#7df4c6" }}
                    >
                      <CheckCircle2 className="w-3 h-3" /> Done
                    </span>
                  ) : !unlocked ? (
                    <span className="inline-flex items-center gap-1 text-xs font-mono px-2 py-1 rounded-full bg-white/10 text-cyan-200/70">
                      <Lock className="w-3 h-3" /> Locked
                    </span>
                  ) : null}
                </div>
                <p className="text-sm text-cyan-100/80 mt-3">
                  <span className="font-semibold text-cyan-100">Focus: </span>
                  {m.focus}
                </p>
                <p className="text-xs text-cyan-200/60 mt-1">{m.sector}</p>
              </motion.li>
            );
          })}
        </ul>
      </section>
    </>
  );
}

/* ------------------------------ Mission play ------------------------------ */

function MissionPlay({
  mission,
  onBack,
  onExitToHub,
  onMissionComplete,
}: {
  mission: Mission2Def;
  onBack: () => void;
  onExitToHub: () => void;
  onMissionComplete: (stats: {
    reasoningScore: number;
    repairAttempts: number;
    hintsUsed: number;
  }) => void;
}) {
  const cases = mission.cases;
  const [caseIdx, setCaseIdx] = useState(0);
  const [phase, setPhase] = useState<CasePhase>("briefing");
  const [repairedNotation, setRepairedNotation] = useState<FractionPair | undefined>();
  const [childExplanation, setChildExplanation] = useState<string | undefined>();
  const [zedLine, setZedLine] = useState<string>("");

  const attemptsRef = useRef(0);
  const hintsRef = useRef(0);
  const scoresRef = useRef<number[]>([]);
  const firedRef = useRef(false);

  const caseDef = cases[caseIdx];
  const isLastCase = caseIdx === cases.length - 1;
  const isMissionDone = phase === "caseDone" && isLastCase;

  // Reset on mission change
  useEffect(() => {
    setCaseIdx(0);
    setPhase("briefing");
    setRepairedNotation(undefined);
    setChildExplanation(undefined);
    attemptsRef.current = 0;
    hintsRef.current = 0;
    scoresRef.current = [];
    firedRef.current = false;
  }, [mission.id]);

  // Per-case briefing line + auto-advance to detect/repair phase
  useEffect(() => {
    setZedLine(caseDef.zedBriefing);
    setRepairedNotation(undefined);
    setChildExplanation(undefined);
  }, [caseDef.id, caseDef.zedBriefing]);

  // Auto-speak every ZED line as it changes
  useAutoSpeak(zedLine, [zedLine]);

  // Fire mission-complete once
  useEffect(() => {
    if (isMissionDone && !firedRef.current) {
      firedRef.current = true;
      const avg =
        scoresRef.current.length > 0
          ? Math.round(
              scoresRef.current.reduce((a, b) => a + b, 0) /
                scoresRef.current.length,
            )
          : 2;
      onMissionComplete({
        reasoningScore: Math.max(1, Math.min(3, avg)),
        repairAttempts: attemptsRef.current,
        hintsUsed: hintsRef.current,
      });
    }
  }, [isMissionDone, onMissionComplete]);

  const startCase = () => setPhase("repair"); // we collapse detect+repair into workspace
  const handleRepairComplete = (truth: FractionPair) => {
    setRepairedNotation(truth);
    setPhase("explain");
    setZedLine(
      "Ohhh thank you teacher! Now help me see WHY — how does this fraction work?",
    );
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

  // Workspace selector
  const Workspace = useMemo(() => {
    switch (mission.id) {
      case 1: return NumeratorScanner;
      case 2: return DenominatorRepair;
      case 3: return UnitFractionSorter;
      case 4: return CollectionVault;
      default: return NumeratorScanner;
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
        <CaseFile
          caseDef={caseDef}
          phase={phase}
          repairedNotation={repairedNotation}
          childExplanation={childExplanation}
        />
      }
      workspace={
        phase === "briefing" ? (
          <BriefingPanel caseDef={caseDef} onContinue={startCase} />
        ) : phase === "repair" ? (
          <Workspace
            caseDef={caseDef}
            onRepairComplete={handleRepairComplete}
            onAttempt={() => (attemptsRef.current += 1)}
          />
        ) : phase === "explain" || phase === "feedback" ? (
          <ExplainPanel
            caseDef={caseDef}
            onZedSpeak={setZedLine}
            onHintUsed={(lvl) => (hintsRef.current = Math.max(hintsRef.current, lvl))}
            onComplete={handleExplainComplete}
          />
        ) : (
          <CaseDonePanel
            isLast={isLastCase}
            onNext={nextCase}
            onFinish={onBack}
          />
        )
      }
      dock={<DialogueDock line={zedLine} replayText={caseDef.voiceInstructions} />}
    />
  );
}

function BriefingPanel({
  caseDef,
  onContinue,
}: {
  caseDef: CaseDef;
  onContinue: () => void;
}) {
  useAutoSpeak(caseDef.zedBriefing, [caseDef.id]);
  return (
    <div className="flex flex-col gap-5">
      <header>
        <p className="label-eyebrow text-cyan-300/80">{caseDef.caseNumber}</p>
        <h3 className="text-xl font-bold text-cyan-50 mt-1">
          Help ZED-4 read this fraction
        </h3>
      </header>
      <p className="text-cyan-100/90 leading-relaxed">
        Listen to ZED-4. Look at the picture. Is ZED right? Tap the picture to
        help fix it, then tell ZED what you noticed.
      </p>
      <button
        type="button"
        onClick={onContinue}
        className="self-end inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-transform hover:scale-[1.02]"
        style={{
          background: "linear-gradient(135deg, #5fd0ff, #2a8ec9)",
          color: "#04162e",
          boxShadow: "0 0 20px rgba(95,208,255,0.4)",
        }}
      >
        Let's look <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}

function CaseDonePanel({
  isLast,
  onNext,
  onFinish,
}: {
  isLast: boolean;
  onNext: () => void;
  onFinish: () => void;
}) {
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
      <h3 className="text-2xl font-bold text-cyan-50">
        {isLast ? "Mission complete!" : "Glitch repaired."}
      </h3>
      <p className="text-sm text-cyan-100/90">
        ZED-4 logged your reasoning. The factory's naming systems are coming
        back online.
      </p>
      {isLast ? (
        <button
          type="button"
          onClick={onFinish}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold"
          style={{
            background: "linear-gradient(135deg, #ffe98a, #f5c84a)",
            color: "#04162e",
          }}
        >
          Return to sectors <ArrowRight className="w-4 h-4" />
        </button>
      ) : (
        <button
          type="button"
          onClick={onNext}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold"
          style={{
            background: "linear-gradient(135deg, #5fd0ff, #2a8ec9)",
            color: "#04162e",
          }}
        >
          Next case <ArrowRight className="w-4 h-4" />
        </button>
      )}
    </motion.div>
  );
}
