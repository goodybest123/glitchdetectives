import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { ZedBubble } from "@/components/case01/ZedBubble";
import { CaseStepper, type Stage } from "@/components/case01/CaseStepper";
import { SpeakButton } from "@/components/case01/SpeakButton";
import { DiagnosticReport } from "@/components/case01/DiagnosticReport";
import { CasePicker } from "@/components/case02/CasePicker";
import { NumberStepper } from "@/components/case02/NumberStepper";
import { SwapControl } from "@/components/case02/SwapControl";
import { DetectiveCallout } from "@/components/shared/DetectiveCallout";
import { SuccessBanner } from "@/components/shared/SuccessBanner";
import { CaptionLine } from "@/components/shared/CaptionLine";
import { VerdictButtons } from "@/components/shared/VerdictButtons";
import { SoundToggle } from "@/components/shared/SoundToggle";
import { ChatPanel } from "@/components/shared/ChatPanel";
import { WorkbookActivityPrompt, WorkbookGlitchChoices, WorkbookRepairFrame, WorkbookRepairSubmit } from "@/components/shared/WorkbookActivity";
import { getGlitchChoices } from "@/components/shared/glitchChoices";
import { useSfx } from "@/hooks/useSfx";
import { useCaseProgress } from "@/hooks/useProgress";
import { useReportRecorder } from "@/hooks/useReportRecorder";
import { celebrate } from "@/lib/celebrate";
import {
  SUB_CASES,
  SUB_CASE_ORDER,
  type GlitchPart,
  type SubCaseId,
} from "@/components/case02/cases";

export const Route = createFileRoute("/play/case-02")({
  head: () => ({
    meta: [
      { title: "Case 02: Naming the Pieces — Glitch Detectives" },
      {
        name: "description",
        content:
          "Three number puzzles: the fraction bar, the energy crate, and the solar panels — a calm Grade 1 maths case.",
      },
    ],
  }),
  component: CaseTwoPage,
});

const SOLVED_TOKEN = "[[CASE_SOLVED]]";

function CaseTwoPage() {
  const [activeCase, setActiveCase] = useState<SubCaseId | null>(null);
  const { solved: solvedMap, markSolved } = useCaseProgress("case-02", SUB_CASE_ORDER);

  if (!activeCase) {
    return (
      <PageShell title="Case 02: Naming the Pieces">
        <CasePicker solved={solvedMap} onPick={(id) => setActiveCase(id)} />
      </PageShell>
    );
  }

  return (
    <PageShell title={`Case 02 · ${SUB_CASES[activeCase].title}`}>
      <SubCaseRunner
        key={activeCase}
        caseId={activeCase}
        onSolved={() =>
          markSolved(activeCase)
        }
        onBackToPicker={() => setActiveCase(null)}
      />
    </PageShell>
  );
}

function PageShell({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-white">
      <header className="border-b border-neutral-100">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-3 py-2.5 sm:px-6 sm:py-3 lg:px-10">
          <Link to="/play" className="text-xs sm:text-sm font-medium text-neutral-500 transition-colors hover:text-neutral-900">
            ← Back
          </Link>
          <h1 className="text-sm sm:text-base font-bold tracking-tight text-neutral-900 truncate px-2">{title}</h1>
          <div className="flex w-[80px] sm:w-[120px] items-center justify-end"><SoundToggle /></div>
        </div>
      </header>
      <div className="mx-auto w-full max-w-7xl px-3 py-3 sm:px-6 sm:py-5 lg:px-10">{children}</div>
    </main>
  );
}

function SubCaseRunner({
  caseId,
  onSolved,
  onBackToPicker,
}: {
  caseId: SubCaseId;
  onSolved: () => void;
  onBackToPicker: () => void;
}) {
  const c = SUB_CASES[caseId];
  const Visual = c.Visual;

  const welcomeMessage: UIMessage = useMemo(
    () => ({
      id: `welcome-${caseId}`,
      role: "assistant",
      parts: [{ type: "text", text: c.welcomeText }],
    }),
    [caseId, c.welcomeText],
  );

  const [stage, setStage] = useState<Stage>("investigate");
  const [verdictPassed, setVerdictPassed] = useState(false);
  const [wrongVerdictCount, setWrongVerdictCount] = useState(0);
  const [verdictShakeKey, setVerdictShakeKey] = useState(0);
  const [numerator, setNumerator] = useState(c.initial.numerator);
  const [denominator, setDenominator] = useState(c.initial.denominator);
  const [pulseKey, setPulseKey] = useState(0);
  const [stepCount, setStepCount] = useState(0);
  const [glitchUnlocked, setGlitchUnlocked] = useState(false);
  const sfx = useSfx();
  const reportRef = useRef<HTMLDivElement>(null);
  const repairRef = useRef<HTMLDivElement>(null);

  const transport = useRef(
    new DefaultChatTransport({ api: c.chatEndpoint }),
  ).current;

  const { messages, sendMessage, status } = useChat({
    id: `case-02-${caseId}`,
    messages: [welcomeMessage],
    transport,
  });


  const atTarget =
    numerator === c.target.numerator && denominator === c.target.denominator;

  useEffect(() => {
    if (stage !== "explain") return;
    const hasSolved = messages.some(
      (m) =>
        m.role === "assistant" &&
        m.parts.some((p) => p.type === "text" && p.text.includes(SOLVED_TOKEN)),
    );
    if (hasSolved) {
      setStage("solved");
      onSolved();
      sfx("chime");
      celebrate();
    }
  }, [messages, stage, onSolved]);

  useEffect(() => {
    if (stage === "solved") {
      const t = setTimeout(
        () =>
          reportRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          }),
        200,
      );
      return () => clearTimeout(t);
    }
  }, [stage]);

  useEffect(() => {
    if (stage === "repair") {
      const t = setTimeout(
        () => repairRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }),
        100,
      );
      return () => clearTimeout(t);
    }
  }, [stage]);

  const handleGlitchClick = (part: GlitchPart) => {
    if (stage !== "detect" || !glitchUnlocked) return;
    setStage("repair");
    setPulseKey((k) => k + 1);
    void part;
  };

  const handleVerdictGlitch = () => {
    if (stage !== "investigate" || verdictPassed) return;
    setVerdictPassed(true);
    setStage("detect");
  };

  const handleVerdictNoGlitch = () => {
    if (stage !== "investigate" || verdictPassed) return;
    setWrongVerdictCount((n) => n + 1);
    setVerdictShakeKey((k) => k + 1);
  };

  const adjustNumerator = (next: number) => {
    if (stage !== "repair") return;
    setStepCount((s) => s + 1);
    setNumerator(next);
  };

  const adjustDenominator = (next: number) => {
    if (stage !== "repair") return;
    setStepCount((s) => s + 1);
    setDenominator(next);
  };

  const handleSwap = () => {
    if (stage !== "repair") return;
    setStepCount((s) => s + 1);
    const a = numerator;
    setNumerator(denominator);
    setDenominator(a);
  };

  const isSending = status === "submitted" || status === "streaming";

  const studentQuotes = useMemo(
    () =>
      messages
        .filter((m) => m.role === "user")
        .map((m) =>
          m.parts.map((p) => (p.type === "text" ? p.text : "")).join("").trim(),
        )
        .filter(Boolean),
    [messages],
  );

  const marks = useMemo(() => {
    const investigate =
      stage === "investigate"
        ? 0
        : wrongVerdictCount === 0
          ? 5
          : wrongVerdictCount === 1
            ? 4
            : 3;
    const detect = stage === "investigate" || stage === "detect" ? 0 : 5;
    let repair = 0;
    if (atTarget) {
      const min = c.minSteps;
      if (stepCount <= min) repair = 5;
      else if (stepCount <= min + 1) repair = 4;
      else if (stepCount <= min + 3) repair = 3;
      else repair = 2;
    }
    let explain = 0;
    if (stage === "solved") {
      const turns = studentQuotes.length;
      const longestWords = studentQuotes.reduce(
        (m, q) => Math.max(m, q.split(/\s+/).filter(Boolean).length),
        0,
      );
      if (turns <= 3 && longestWords >= 6) explain = 5;
      else if (turns <= 5 || longestWords >= 4) explain = 4;
      else explain = 3;
    }
    return { investigate, detect, repair, explain };
  }, [stage, atTarget, stepCount, c.minSteps, studentQuotes, wrongVerdictCount]);

  useReportRecorder({
    active: stage === "solved",
    caseId: "case-02",
    subId: caseId,
    caseTitle: "Case 02: Naming the Pieces",
    subTitle: c.title,
    emoji: c.emoji,
    glitchSummary: c.subtitle,
    conceptMastered: c.conceptMastered,
    studentQuotes,
    marks,
  });

  const zed =
    stage === "investigate" || stage === "detect" || stage === "repair"
      ? { tone: "neutral" as const, text: c.bubbles.investigate }
      : { tone: "happy" as const, text: c.bubbles.solved };

  const caption = c.captions[stage];
  const showDetective = (stage === "detect" || stage === "repair") && !atTarget;

  const highlight: "none" | GlitchPart =
    stage === "investigate" ? "none" : atTarget ? "none" : c.glitchTarget;

  const nextIndex = SUB_CASE_ORDER.indexOf(caseId) + 1;
  const nextCaseLabel =
    nextIndex < SUB_CASE_ORDER.length
      ? `Try ${SUB_CASES[SUB_CASE_ORDER[nextIndex]].title} next.`
      : "You've solved every case in this file!";

  return (
    <>
      <div className="mb-2 flex items-center justify-between">
        <button
          type="button"
          onClick={onBackToPicker}
          className="text-sm font-medium text-neutral-500 transition-colors hover:text-neutral-900"
        >
          ← Choose another case
        </button>
        <span className="text-xs font-bold tracking-wider text-neutral-400">
          {c.emoji} {c.title.toUpperCase()}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-6">
        {/* Case file */}
        <section>
          <div ref={repairRef} className="rounded-2xl bg-white p-3 sm:p-5 shadow-[0_10px_40px_-12px_rgba(15,23,42,0.15)] ring-1 ring-neutral-100">
            <CaseStepper stage={stage} />
            <div className="mb-6">
              <ZedBubble message={zed.text} tone={zed.tone} speakable />
            </div>

            {stage === "detect" && (
              <WorkbookGlitchChoices choices={getGlitchChoices("case-02", caseId)} unlocked={glitchUnlocked} onUnlock={() => setGlitchUnlocked(true)} />
            )}

            <WorkbookActivityPrompt stage={stage} emoji={c.emoji} title={c.title}
              detectInstruction={c.captions.investigate} repairInstruction={c.captions.repair}
              toolName={c.repair === "swap" ? "Fraction Flipper" : "Number Corrector"} />

            <div>
              <Visual
                numerator={numerator}
                denominator={denominator}
                highlight={highlight}
                onClickPart={handleGlitchClick}
                interactive={stage === "detect" && glitchUnlocked}
                pulseKey={pulseKey}
                glitchTarget={c.glitchTarget}
              />
            </div>


            {stage === "investigate" && !verdictPassed && (
              <VerdictButtons
                onGlitch={handleVerdictGlitch}
                onNoGlitch={handleVerdictNoGlitch}
                shakeKey={verdictShakeKey}
                wrongCount={wrongVerdictCount}
              />
            )}

            {!(stage === "investigate" && !verdictPassed) && (
              <CaptionLine text={caption} />
            )}
            {showDetective && <DetectiveCallout text={c.bubbles.detect} />}


            {stage === "repair" && (
              <WorkbookRepairFrame
                toolName={c.repair === "swap" ? "Fraction Flipper" : "Number Corrector"}
                instruction={c.captions.repair}
                hint={c.glitchTarget === "denominator" ? "The bottom number counts every equal piece." : c.glitchTarget === "numerator" ? "The top number counts only the selected pieces." : "Top tells how many; bottom tells the total."}
                progress={`${numerator}/${denominator} → ${c.target.numerator}/${c.target.denominator}`}
              >
                {c.repair === "stepper-denominator" && c.stepperRange && (
                  <NumberStepper
                    label="Bottom number"
                    value={denominator}
                    min={c.stepperRange.min}
                    max={c.stepperRange.max}
                    target={c.target.denominator}
                    onChange={adjustDenominator}
                  />
                )}
                {c.repair === "stepper-numerator" && c.stepperRange && (
                  <NumberStepper
                    label="Top number"
                    value={numerator}
                    min={c.stepperRange.min}
                    max={c.stepperRange.max}
                    target={c.target.numerator}
                    onChange={adjustNumerator}
                  />
                )}
                {c.repair === "swap" && <SwapControl onSwap={handleSwap} />}
                <WorkbookRepairSubmit ready={atTarget} onSubmit={() => setStage("explain")} />
              </WorkbookRepairFrame>
            )}

            {(stage === "explain" || stage === "solved") && <SuccessBanner />}
          </div>

          {stage === "solved" && (
            <div ref={reportRef}>
              <DiagnosticReport
                studentQuotes={studentQuotes}
                turnCount={studentQuotes.length}
                marks={marks}
                caseTitle={`Case 02 · ${c.title}`}
                conceptMastered={c.conceptMastered}
                nextCaseLabel={nextCaseLabel}
                onTryAnother={onBackToPicker}
              />
            </div>
          )}
        </section>

        {/* Chat panel */}
        <ChatPanel
          stage={stage}
          messages={messages}
          isSending={isSending}
          onSend={(text) => sendMessage({ text })}
          onViewReport={() => reportRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
        />
      </div>
    </>
  );
}
