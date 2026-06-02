import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Zap,
  Droplet,
  Cog,
  Train,
  Split,
  Network,
  Trophy,
} from "lucide-react";
import { useLevelProgress } from "@/lib/mission-progress";
import { LEVEL_5_MISSIONS } from "@/lib/level5/missions";
import type { L5CaseDef, L5MissionDef, L5Phase } from "@/lib/level5/types";
import { useAutoSpeak } from "@/lib/speech";
import { useNarrate } from "@/lib/narrate";
import { InvestigationLayout } from "./level2/InvestigationLayout";
import { L2TopBar } from "./level2/TopBar";
import { DialogueDock } from "./level2/DialogueDock";
import { ExplainPanel } from "./level2/ExplainPanel";
import { ReplayInstructionsButton } from "./level2/ReplayInstructionsButton";
import { L5CaseFile } from "./level5/CaseFile";
import { L5GlitchCheckPanel } from "./level5/GlitchCheckPanel";
import { SynchronizerRail } from "./level5/workspaces/SynchronizerRail";
import { ResourceBalanceCore } from "./level5/workspaces/ResourceBalanceCore";
import { ScalingReactorGrid } from "./level5/workspaces/ScalingReactorGrid";
import { BoosterTrainLine } from "./level5/workspaces/BoosterTrainLine";
import { DistributionTunnel } from "./level5/workspaces/DistributionTunnel";
import { CommandGridLinker } from "./level5/workspaces/CommandGridLinker";

type View = "intro" | "mission-select" | "mission-play" | "boss";

const MISSION_ICONS = [Zap, Droplet, Cog, Train, Split, Network] as const;

const INTRO =
  "The city's power grid is corrupted. Energy stations can't synchronize, scaling reactors are malfunctioning, and distribution tunnels are splitting resources incorrectly. As Chief Fraction Systems Engineer you must restore every system on the grid.";

export default function FractionFactoryLevel5({
  onExitToHub,
}: {
  onExitToHub: () => void;
}) {
  const [view, setView] = useState<View>("intro");
  const [activeMissionId, setActiveMissionId] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);
  const progress = useLevelProgress(5);
  const activeMission =
    LEVEL_5_MISSIONS.find((m) => m.id === activeMissionId) ?? LEVEL_5_MISSIONS[0];

  const start = (id: 1 | 2 | 3 | 4 | 5 | 6) => {
    setActiveMissionId(id);
    setView("mission-play");
  };

  const allComplete = LEVEL_5_MISSIONS.every((m) => progress.isMissionComplete(m.id));

  return (
    <main
      className="min-h-screen"
      style={{
        background:
          "radial-gradient(ellipse at top, #0b1f3d 0%, #050d24 60%, #02060f 100%)",
        color: "#cdf2ff",
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
              onStartBoss={() => setView("boss")}
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
            <BossChallenge onBack={() => setView("mission-select")} onExitToHub={onExitToHub} />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

/* ─────────────────────────── Intro ─────────────────────────── */

function Intro({ onBack, onContinue }: { onBack: () => void; onContinue: () => void }) {
  useNarrate(
    `Level 5. The Fraction Power Grid is failing. ${INTRO} When you're ready, tap Enter Power Grid.`,
  );
  return (
    <>
      <L2TopBar title="Level 5 · Fraction Power Grid" subtitle="Briefing" onBack={onBack} backLabel="Hub" />
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <motion.div
          initial={{ scale: 0.98, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="rounded-3xl border p-8 space-y-5"
          style={{
            background: "linear-gradient(180deg, rgba(8,20,42,0.92), rgba(12,28,58,0.85))",
            borderColor: "color-mix(in oklab, #5fd0ff 35%, transparent)",
            boxShadow: "0 30px 80px -40px rgba(95,208,255,0.5)",
          }}
        >
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div>
              <p className="label-eyebrow text-cyan-300">Engineer briefing</p>
              <h1 className="text-3xl sm:text-4xl font-bold text-cyan-50 mt-1">
                The City Networks Are Out of Sync
              </h1>
            </div>
            <ReplayInstructionsButton text={INTRO} />
          </div>
          <p className="text-lg sm:text-xl text-cyan-100/90 leading-relaxed">{INTRO}</p>
          <div
            className="rounded-xl border px-4 py-3 text-sm text-cyan-100/90"
            style={{
              background: "rgba(95,208,255,0.08)",
              borderColor: "color-mix(in oklab, #5fd0ff 35%, transparent)",
            }}
          >
            <span className="label-eyebrow text-cyan-200 mr-2">Mission focus</span>
            Add unlike · Subtract unlike · Multiply · Multiply by whole · Divide · Fractions as division
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onContinue}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl font-bold transition-transform hover:scale-[1.02]"
              style={{
                background: "linear-gradient(135deg, #5fd0ff, #b18bff)",
                color: "#06122a",
                boxShadow: "0 0 30px rgba(95,208,255,0.35)",
              }}
            >
              Enter Power Grid <ArrowRight className="w-4 h-4" />
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
  onStartBoss,
}: {
  onBack: () => void;
  onStart: (id: 1 | 2 | 3 | 4 | 5 | 6) => void;
  isComplete: (id: number) => boolean;
  allComplete: boolean;
  onStartBoss: () => void;
}) {
  useNarrate("Grid control. Pick a system to repair, engineer.");
  return (
    <>
      <L2TopBar title="Grid Control" subtitle="Level 5 · Fraction Power Grid" onBack={onBack} backLabel="Briefing" />
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <ul className="grid sm:grid-cols-2 gap-4">
          {LEVEL_5_MISSIONS.map((m, i) => {
            const Icon = MISSION_ICONS[i];
            const done = isComplete(m.id);
            return (
              <motion.li
                key={m.id}
                whileHover={{ y: -3 }}
                className="rounded-2xl border p-5 cursor-pointer transition"
                style={{
                  background: "linear-gradient(180deg, rgba(8,20,42,0.8), rgba(12,28,58,0.75))",
                  borderColor: "color-mix(in oklab, #5fd0ff 35%, transparent)",
                }}
                onClick={() => onStart(m.id)}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                    style={{
                      background: "linear-gradient(135deg, #5fd0ff, #b18bff)",
                      boxShadow: "0 0 20px rgba(95,208,255,0.4)",
                    }}
                  >
                    <Icon className="w-6 h-6 text-[#06122a]" />
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
                <p className="text-base text-cyan-100/85 mt-3">
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
              background: "rgba(177,139,255,0.08)",
            }}
          >
            <Trophy className="w-10 h-10 mx-auto text-violet-200" />
            <h3 className="text-2xl font-bold text-cyan-50">Fraction Power Grid Emergency</h3>
            <p className="text-cyan-100/85">All systems failing simultaneously. Launch the city-wide rescue.</p>
            <button
              type="button"
              onClick={onStartBoss}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold"
              style={{
                background: "linear-gradient(135deg, #b18bff, #5fd0ff)",
                color: "#06122a",
                boxShadow: "0 0 24px rgba(177,139,255,0.5)",
              }}
            >
              Launch Emergency <ArrowRight className="w-4 h-4" />
            </button>
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
  mission: L5MissionDef;
  onBack: () => void;
  onExitToHub: () => void;
  onMissionComplete: (stats: { reasoningScore: number; repairAttempts: number; hintsUsed: number }) => void;
}) {
  const cases = mission.cases;
  const [caseIdx, setCaseIdx] = useState(0);
  const [phase, setPhase] = useState<L5Phase>("briefing");
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
    setZedLine("Whoa — the grid is humming. Now help me see WHY this works.");
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
      case 1: return SynchronizerRail;
      case 2: return ResourceBalanceCore;
      case 3: return ScalingReactorGrid;
      case 4: return BoosterTrainLine;
      case 5: return DistributionTunnel;
      case 6: return CommandGridLinker;
      default: return SynchronizerRail;
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
          backLabel="Grid"
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
        <L5CaseFile
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
          <L5GlitchCheckPanel
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

function BriefingPanel({ caseDef, onContinue }: { caseDef: L5CaseDef; onContinue: () => void }) {
  const combined = `${caseDef.zedBriefing} … ${caseDef.voiceInstructions}`;
  useNarrate(combined, [caseDef.id]);
  return (
    <div className="flex flex-col gap-5">
      <header className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <p className="label-eyebrow text-cyan-300/80">{caseDef.caseNumber}</p>
          <h3 className="text-2xl font-bold text-cyan-50 mt-1">Investigate the failing system</h3>
        </div>
        <ReplayInstructionsButton text={combined} />
      </header>
      <p className="text-lg text-cyan-100/90 leading-relaxed">{caseDef.voiceInstructions}</p>
      <button
        type="button"
        onClick={onContinue}
        className="self-end inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold"
        style={{
          background: "linear-gradient(135deg, #5fd0ff, #b18bff)",
          color: "#06122a",
          boxShadow: "0 0 20px rgba(95,208,255,0.4)",
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
      ? "System restored. Mission complete! The grid is humming again."
      : "System restored. ZED-4 logged your reasoning. Moving to the next pathway.",
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
      <p className="label-eyebrow text-emerald-200">System restored</p>
      <h3 className="text-3xl font-bold text-cyan-50">
        {isLast ? "Mission complete!" : "Pathway repaired."}
      </h3>
      <p className="text-base text-cyan-100/90">
        ZED-4 logged your reasoning. The grid is humming.
      </p>
      {isLast ? (
        <button
          type="button"
          onClick={onFinish}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold"
          style={{ background: "linear-gradient(135deg, #5fd0ff, #b18bff)", color: "#06122a" }}
        >
          Return to grid <ArrowRight className="w-4 h-4" />
        </button>
      ) : (
        <button
          type="button"
          onClick={onNext}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold"
          style={{ background: "linear-gradient(135deg, #5fd0ff, #b18bff)", color: "#06122a" }}
        >
          Next case <ArrowRight className="w-4 h-4" />
        </button>
      )}
    </motion.div>
  );
}

/* ─────────────────────── Boss Challenge ─────────────────────── */

function BossChallenge({ onBack, onExitToHub }: { onBack: () => void; onExitToHub: () => void }) {
  const bossCases = useMemo(
    () => LEVEL_5_MISSIONS.map((m) => ({ mission: m, caseDef: m.cases[0] })),
    [],
  );
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const current = bossCases[step];

  useNarrate(
    done
      ? "Emergency resolved. The entire city is back online. You earned the Fraction Systems Engineer Badge."
      : `Emergency phase ${step + 1} of ${bossCases.length}. ${current.mission.name} system is failing.`,
    [step, done],
  );

  if (done) {
    return (
      <>
        <L2TopBar title="Emergency Resolved" subtitle="Level 5 · Boss" onBack={onBack} backLabel="Grid" />
        <section className="max-w-2xl mx-auto px-4 sm:px-6 py-16 text-center space-y-5">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center justify-center w-24 h-24 rounded-3xl"
            style={{
              background: "linear-gradient(135deg, #b18bff, #5fd0ff)",
              boxShadow: "0 0 40px rgba(177,139,255,0.5)",
            }}
          >
            <Trophy className="w-12 h-12 text-[#06122a]" />
          </motion.div>
          <p className="label-eyebrow text-violet-200">Reward unlocked</p>
          <h2 className="text-4xl font-bold text-cyan-50">Fraction Systems Engineer Badge</h2>
          <blockquote className="text-cyan-100/90 italic text-lg max-w-xl mx-auto">
            "I thought fractions were just numbers. Now I understand they are systems that work together." — ZED-4
          </blockquote>
          <div className="flex items-center justify-center gap-3 pt-4 flex-wrap">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold"
              style={{ background: "linear-gradient(135deg, #5fd0ff, #b18bff)", color: "#06122a" }}
            >
              Back to grid <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onExitToHub}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold border"
              style={{
                borderColor: "color-mix(in oklab, #5fd0ff 40%, transparent)",
                color: "#cdf2ff",
                background: "rgba(95,208,255,0.08)",
              }}
            >
              Exit to hub
            </button>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <L2TopBar
        title="Fraction Power Grid Emergency"
        subtitle={`Phase ${step + 1} / ${bossCases.length} · ${current.mission.name}`}
        onBack={onBack}
        backLabel="Grid"
      />
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-6">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border p-6 space-y-4"
          style={{
            background: "linear-gradient(180deg, rgba(8,20,42,0.92), rgba(12,28,58,0.85))",
            borderColor: "color-mix(in oklab, #b18bff 35%, transparent)",
            boxShadow: "0 30px 80px -40px rgba(177,139,255,0.5)",
          }}
        >
          <p className="label-eyebrow text-violet-200">{current.caseDef.caseNumber}</p>
          <h2 className="text-2xl font-bold text-cyan-50">
            {current.mission.name} — emergency restart
          </h2>
          <p className="text-cyan-100/85 leading-relaxed">{current.caseDef.voiceInstructions}</p>
          <p className="text-sm text-rose-300/85 italic">ZED says: "{current.caseDef.zedBriefing}"</p>

          <div className="flex items-center justify-between gap-3 pt-2">
            <ReplayInstructionsButton text={current.caseDef.voiceInstructions} />
            <button
              type="button"
              onClick={() => {
                if (step + 1 < bossCases.length) setStep(step + 1);
                else setDone(true);
              }}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold"
              style={{
                background: "linear-gradient(135deg, #5fd0ff, #b18bff)",
                color: "#06122a",
                boxShadow: "0 0 20px rgba(95,208,255,0.4)",
              }}
            >
              Mark system restored <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>

        <p className="text-center text-xs text-cyan-200/60">
          Tip: revisit each mission for the full repair workspace. This emergency chain confirms you've mastered all six.
        </p>
      </section>
    </>
  );
}
