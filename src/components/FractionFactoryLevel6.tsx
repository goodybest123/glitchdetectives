import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Trophy,
  Zap,
  Boxes,
  Compass,
  Gauge,
  Network,
  Cpu,
  Globe2,
} from "lucide-react";
import { useLevelProgress } from "@/lib/mission-progress";
import { LEVEL_6_MISSIONS } from "@/lib/level6/missions";
import type { L6CaseDef, L6MissionDef, L6Phase } from "@/lib/level6/types";
import { useAutoSpeak } from "@/lib/speech";
import { useNarrate } from "@/lib/narrate";
import { InvestigationLayout } from "./level2/InvestigationLayout";
import { L2TopBar } from "./level2/TopBar";
import { DialogueDock } from "./level2/DialogueDock";
import { ExplainPanel } from "./level2/ExplainPanel";
import { ReplayInstructionsButton } from "./level2/ReplayInstructionsButton";
import { L6CaseFile } from "./level6/CaseFile";
import { L6GlitchCheckPanel } from "./level6/GlitchCheckPanel";
import { DivisionReactor } from "./level6/workspaces/DivisionReactor";
import { MixedNumberAssembler } from "./level6/workspaces/MixedNumberAssembler";
import { DecimalTranslator } from "./level6/workspaces/DecimalTranslator";
import { PercentageCommand } from "./level6/workspaces/PercentageCommand";
import { NexusPortalLinker } from "./level6/workspaces/NexusPortalLinker";
import { MultiSystemLab } from "./level6/workspaces/MultiSystemLab";

type View = "intro" | "mission-select" | "mission-play" | "boss" | "completion";

const PLAYABLE = LEVEL_6_MISSIONS.filter((m) => m.id !== 7); // boss handled separately
const MISSION_ICONS = [Zap, Boxes, Compass, Gauge, Network, Cpu] as const;

const INTRO =
  "Deep beneath Fraction Factory lies the Nexus Core — the network connecting every mathematical language in the city. ZED-4 corrupted the Translation Engine. Some systems speak fractions, others decimals, others percentages. Reconnect them all.";

export default function FractionFactoryLevel6({
  onExitToHub,
}: {
  onExitToHub: () => void;
}) {
  const [view, setView] = useState<View>("intro");
  const [activeMissionId, setActiveMissionId] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);
  const progress = useLevelProgress(6);
  const activeMission =
    PLAYABLE.find((m) => m.id === activeMissionId) ?? PLAYABLE[0];

  const start = (id: 1 | 2 | 3 | 4 | 5 | 6) => {
    setActiveMissionId(id);
    setView("mission-play");
  };

  const allComplete = PLAYABLE.every((m) => progress.isMissionComplete(m.id));
  const bossComplete = progress.isMissionComplete(7);

  return (
    <main
      className="min-h-screen"
      style={{
        background:
          "radial-gradient(ellipse at top, #0c1a3d 0%, #07103a 60%, #03061a 100%)",
        color: "#e0ecff",
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
              allComplete={allComplete}
              bossComplete={bossComplete}
              onStartBoss={() => setView("boss")}
              onViewCompletion={() => setView("completion")}
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
        {view === "boss" && (
          <motion.div key="boss" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <BossChallenge
              onBack={() => setView("mission-select")}
              onComplete={() => {
                progress.markComplete(7, { reasoningScore: 3, repairAttempts: 0, hintsUsed: 0 });
                setView("completion");
              }}
            />
          </motion.div>
        )}
        {view === "completion" && (
          <motion.div key="done" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <Completion onBack={() => setView("mission-select")} onExitToHub={onExitToHub} />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

/* ─────────────────────────── Intro ─────────────────────────── */

function Intro({ onBack, onContinue }: { onBack: () => void; onContinue: () => void }) {
  useNarrate(
    `Level 6. The Fraction Nexus. ${INTRO} When you're ready, tap Enter Nexus.`,
  );
  return (
    <>
      <L2TopBar title="Level 6 · Fraction Nexus" subtitle="Briefing" onBack={onBack} backLabel="Hub" />
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <motion.div
          initial={{ scale: 0.98, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="rounded-3xl border p-8 space-y-5"
          style={{
            background: "linear-gradient(180deg, rgba(8,20,52,0.92), rgba(20,18,68,0.85))",
            borderColor: "color-mix(in oklab, #8db8ff 35%, transparent)",
            boxShadow: "0 30px 80px -40px rgba(141,184,255,0.5)",
          }}
        >
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div>
              <p className="label-eyebrow text-cyan-200">Architect briefing</p>
              <h1 className="text-3xl sm:text-4xl font-bold text-cyan-50 mt-1">
                The Nexus Has Lost Its Language
              </h1>
            </div>
            <ReplayInstructionsButton text={INTRO} />
          </div>
          <p className="text-lg sm:text-xl text-cyan-50/90 leading-relaxed">{INTRO}</p>
          <div
            className="rounded-xl border px-4 py-3 text-sm text-cyan-50/90"
            style={{
              background: "rgba(141,184,255,0.08)",
              borderColor: "color-mix(in oklab, #8db8ff 35%, transparent)",
            }}
          >
            <span className="label-eyebrow text-cyan-200 mr-2">Mission focus</span>
            Divide fractions · Mixed numbers · Fractions ↔ Decimals · Fractions ↔ Percentages · Triple match · Multi-step reasoning · Nexus Core
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onContinue}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl font-bold transition-transform hover:scale-[1.02]"
              style={{
                background: "linear-gradient(135deg, #8db8ff, #b18bff)",
                color: "#06122a",
                boxShadow: "0 0 30px rgba(141,184,255,0.4)",
              }}
            >
              Enter Nexus <ArrowRight className="w-4 h-4" />
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
  allComplete,
  bossComplete,
  onStartBoss,
  onViewCompletion,
}: {
  onBack: () => void;
  onStart: (id: 1 | 2 | 3 | 4 | 5 | 6) => void;
  isComplete: (id: number) => boolean;
  allComplete: boolean;
  bossComplete: boolean;
  onStartBoss: () => void;
  onViewCompletion: () => void;
}) {
  useNarrate("Nexus control. Choose a translation system to repair.");
  return (
    <>
      <L2TopBar title="Nexus Control" subtitle="Level 6 · Fraction Nexus" onBack={onBack} backLabel="Briefing" />
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <ul className="grid sm:grid-cols-2 gap-4">
          {PLAYABLE.map((m, i) => {
            const Icon = MISSION_ICONS[i];
            const done = isComplete(m.id);
            return (
              <motion.li
                key={m.id}
                whileHover={{ y: -3 }}
                className="rounded-2xl border p-5 cursor-pointer transition"
                style={{
                  background: "linear-gradient(180deg, rgba(8,20,52,0.8), rgba(20,18,68,0.75))",
                  borderColor: "color-mix(in oklab, #8db8ff 35%, transparent)",
                }}
                onClick={() => onStart(m.id as 1 | 2 | 3 | 4 | 5 | 6)}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                    style={{
                      background: "linear-gradient(135deg, #8db8ff, #b18bff)",
                      boxShadow: "0 0 20px rgba(141,184,255,0.45)",
                    }}
                  >
                    <Icon className="w-6 h-6 text-[#06122a]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="label-eyebrow text-cyan-200/80">Mission {m.id}</p>
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
                <p className="text-base text-cyan-50/85 mt-3">
                  <span className="font-semibold text-cyan-50">Focus: </span>
                  {m.focus}
                </p>
                <p className="text-sm text-cyan-200/60 mt-1">{m.sector}</p>
              </motion.li>
            );
          })}
        </ul>

        {allComplete && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 rounded-2xl border-2 p-6 text-center space-y-3"
            style={{
              borderColor: "color-mix(in oklab, #b18bff 60%, transparent)",
              background: "rgba(177,139,255,0.1)",
            }}
          >
            <Network className="w-10 h-10 mx-auto text-violet-200" />
            <h3 className="text-2xl font-bold text-cyan-50">The Nexus Core</h3>
            <p className="text-cyan-50/85">
              Every translation system has corrupted simultaneously. Repair every language at once to save the city.
            </p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <button
                type="button"
                onClick={onStartBoss}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold"
                style={{
                  background: "linear-gradient(135deg, #b18bff, #8db8ff)",
                  color: "#06122a",
                  boxShadow: "0 0 24px rgba(177,139,255,0.5)",
                }}
              >
                Enter Nexus Core <ArrowRight className="w-4 h-4" />
              </button>
              {bossComplete && (
                <button
                  type="button"
                  onClick={onViewCompletion}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold border"
                  style={{
                    borderColor: "color-mix(in oklab, #8db8ff 40%, transparent)",
                    color: "#e0ecff",
                    background: "rgba(141,184,255,0.1)",
                  }}
                >
                  View ceremony <Trophy className="w-4 h-4" />
                </button>
              )}
            </div>
          </motion.div>
        )}
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
  mission: L6MissionDef;
  onBack: () => void;
  onExitToHub: () => void;
  onMissionComplete: (stats: { reasoningScore: number; repairAttempts: number; hintsUsed: number }) => void;
}) {
  const cases = mission.cases;
  const [caseIdx, setCaseIdx] = useState(0);
  const [phase, setPhase] = useState<L6Phase>("briefing");
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
    setZedLine("Whoa — the translation portal lit up. Now help me see WHY this works.");
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
      case 1: return DivisionReactor;
      case 2: return MixedNumberAssembler;
      case 3: return DecimalTranslator;
      case 4: return PercentageCommand;
      case 5: return NexusPortalLinker;
      case 6: return MultiSystemLab;
      default: return DivisionReactor;
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
          backLabel="Nexus"
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
        <L6CaseFile
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
          <L6GlitchCheckPanel
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

function BriefingPanel({ caseDef, onContinue }: { caseDef: L6CaseDef; onContinue: () => void }) {
  const combined = `${caseDef.zedBriefing} … ${caseDef.voiceInstructions}`;
  useNarrate(combined, [caseDef.id]);
  return (
    <div className="flex flex-col gap-5">
      <header className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <p className="label-eyebrow text-cyan-200/80">{caseDef.caseNumber}</p>
          <h3 className="text-2xl font-bold text-cyan-50 mt-1">Investigate the failing translation</h3>
        </div>
        <ReplayInstructionsButton text={combined} />
      </header>
      <p className="text-lg text-cyan-50/90 leading-relaxed">{caseDef.voiceInstructions}</p>
      <button
        type="button"
        onClick={onContinue}
        className="self-end inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold"
        style={{
          background: "linear-gradient(135deg, #8db8ff, #b18bff)",
          color: "#06122a",
          boxShadow: "0 0 20px rgba(141,184,255,0.4)",
        }}
      >
        Begin repair <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}

function CaseDonePanel({ isLast, onNext, onFinish }: { isLast: boolean; onNext: () => void; onFinish: () => void }) {
  useNarrate(
    isLast
      ? "Translation restored. Mission complete. ZED-4 is learning fast."
      : "Translation restored. ZED-4 logged your reasoning. Next case coming up.",
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
      <p className="label-eyebrow text-emerald-200">Translation restored</p>
      <h3 className="text-3xl font-bold text-cyan-50">
        {isLast ? "Mission complete!" : "Portal repaired."}
      </h3>
      <p className="text-base text-cyan-50/90">
        ZED-4 logged your reasoning. The Nexus glows brighter.
      </p>
      {isLast ? (
        <button
          type="button"
          onClick={onFinish}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold"
          style={{ background: "linear-gradient(135deg, #8db8ff, #b18bff)", color: "#06122a" }}
        >
          Return to Nexus <ArrowRight className="w-4 h-4" />
        </button>
      ) : (
        <button
          type="button"
          onClick={onNext}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold"
          style={{ background: "linear-gradient(135deg, #8db8ff, #b18bff)", color: "#06122a" }}
        >
          Next case <ArrowRight className="w-4 h-4" />
        </button>
      )}
    </motion.div>
  );
}

/* ─────────────────────── Boss Challenge ─────────────────────── */

function BossChallenge({ onBack, onComplete }: { onBack: () => void; onComplete: () => void }) {
  const bossCases = useMemo(
    () => PLAYABLE.map((m) => ({ mission: m, caseDef: m.cases[0] })),
    [],
  );
  const [step, setStep] = useState(0);
  const current = bossCases[step];

  useNarrate(
    `Nexus Core phase ${step + 1} of ${bossCases.length}. ${current.mission.name} system collapsing.`,
    [step],
  );

  return (
    <>
      <L2TopBar
        title="The Nexus Core"
        subtitle={`Phase ${step + 1} / ${bossCases.length} · ${current.mission.name}`}
        onBack={onBack}
        backLabel="Nexus"
      />
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-6">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border p-6 space-y-4"
          style={{
            background: "linear-gradient(180deg, rgba(8,20,52,0.92), rgba(20,18,68,0.85))",
            borderColor: "color-mix(in oklab, #b18bff 35%, transparent)",
            boxShadow: "0 30px 80px -40px rgba(177,139,255,0.5)",
          }}
        >
          <p className="label-eyebrow text-violet-200">{current.caseDef.caseNumber}</p>
          <h2 className="text-2xl font-bold text-cyan-50">
            {current.mission.name} — Nexus repair
          </h2>
          <p className="text-cyan-50/85 leading-relaxed">{current.caseDef.voiceInstructions}</p>
          <p className="text-sm text-rose-300/85 italic">ZED says: "{current.caseDef.zedBriefing}"</p>

          <div className="flex items-center justify-between gap-3 pt-2">
            <ReplayInstructionsButton text={current.caseDef.voiceInstructions} />
            <button
              type="button"
              onClick={() => {
                if (step + 1 < bossCases.length) setStep(step + 1);
                else onComplete();
              }}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold"
              style={{
                background: "linear-gradient(135deg, #8db8ff, #b18bff)",
                color: "#06122a",
                boxShadow: "0 0 20px rgba(141,184,255,0.4)",
              }}
            >
              Mark system restored <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>

        <p className="text-center text-xs text-cyan-200/60">
          Tip: revisit each mission for the full repair workspace. This sequence confirms you've mastered every language.
        </p>
      </section>
    </>
  );
}

/* ─────────────────────── Completion ─────────────────────── */

function Completion({ onBack, onExitToHub }: { onBack: () => void; onExitToHub: () => void }) {
  useNarrate(
    "Nexus restored. You have earned the Fraction Nexus Architect badge. A new world has unlocked — Decimal District.",
  );
  return (
    <>
      <L2TopBar title="Nexus Restored" subtitle="Level 6 · Ceremony" onBack={onBack} backLabel="Nexus" />
      <section className="max-w-2xl mx-auto px-4 sm:px-6 py-12 text-center space-y-5">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="inline-flex items-center justify-center w-24 h-24 rounded-3xl"
          style={{
            background: "linear-gradient(135deg, #b18bff, #8db8ff)",
            boxShadow: "0 0 40px rgba(177,139,255,0.55)",
          }}
        >
          <Trophy className="w-12 h-12 text-[#06122a]" />
        </motion.div>
        <p className="label-eyebrow text-violet-200">Reward unlocked</p>
        <h2 className="text-4xl font-bold text-cyan-50">Fraction Nexus Architect</h2>
        <p className="text-cyan-100/85">All six levels of Fraction Factory mastered.</p>
        <blockquote className="text-cyan-50/90 italic text-lg max-w-xl mx-auto">
          "At the beginning, I thought fractions were just pieces of things. Now I understand they connect systems, translate information, and help us understand the world." — ZED-4
        </blockquote>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 0.3 } }}
          className="rounded-2xl border-2 p-5 text-center space-y-2"
          style={{
            borderColor: "color-mix(in oklab, #7df4c6 50%, transparent)",
            background: "rgba(125,244,198,0.08)",
          }}
        >
          <Globe2 className="w-8 h-8 mx-auto text-emerald-300" />
          <p className="label-eyebrow text-emerald-200">New world unlocked</p>
          <h3 className="text-2xl font-bold text-cyan-50">Decimal District</h3>
          <p className="text-sm text-cyan-100/80">Coming soon — you're ready for it.</p>
        </motion.div>

        <div className="flex items-center justify-center gap-3 pt-4 flex-wrap">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold"
            style={{ background: "linear-gradient(135deg, #8db8ff, #b18bff)", color: "#06122a" }}
          >
            Back to Nexus <ArrowRight className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onExitToHub}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold border"
            style={{
              borderColor: "color-mix(in oklab, #8db8ff 40%, transparent)",
              color: "#e0ecff",
              background: "rgba(141,184,255,0.08)",
            }}
          >
            Exit to hub
          </button>
        </div>
      </section>
    </>
  );
}
