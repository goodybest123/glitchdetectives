/**
 * `/play/case-01` — Case 01: Parts of a Whole (Fair Sharing).
 *
 * Two-mode page:
 *   1. `CasePicker` when no sub-case is selected.
 *   2. `SubCaseRunner` (the full Investigate → Detect → Repair → Explain
 *      loop) once a sub-case is picked.
 *
 * `SubCaseRunner` orchestrates:
 *   - `stage` state machine (investigate | detect | repair | explain | solved).
 *   - The verdict buttons (was there a glitch? yes/no).
 *   - The multiple-choice "which glitch is it?" step.
 *   - A slider that repairs the visual (`equalized` 0..1, target from case def).
 *   - `useChat` with the case-specific `/api/chat/case-01*` endpoint for the
 *     free-text explanation dialogue. The AI ends its final message with
 *     `[[CASE_SOLVED]]` when the child has explained the concept — that token
 *     flips `stage` to "solved", fires confetti, and records a `ReportEntry`
 *     via `useReportRecorder`.
 *   - `marks` (0–5 per stage) fed into the Diagnostic Report.
 *
 * Cases 02–06 follow the same structure with different visuals + prompts.
 */
import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { ZedBubble } from "@/components/case01/ZedBubble";
import { CaseStepper, type Stage } from "@/components/case01/CaseStepper";
import { DiagnosticReport } from "@/components/case01/DiagnosticReport";
import { CasePicker } from "@/components/case01/CasePicker";
import {
  Case01ApplyChallenge,
  Case01DetectPanel,
  Case01EvidenceBoard,
  Case01ExplainPrompts,
  Case01RepairBoard,
  Case01SkillUnlock,
  Case01StoryBrief,
  Case01Verdict,
} from "@/components/case01/Case01Activity";
import { SuccessBanner } from "@/components/shared/SuccessBanner";
import { SoundToggle } from "@/components/shared/SoundToggle";
import { ChatPanel } from "@/components/shared/ChatPanel";
import { useSfx } from "@/hooks/useSfx";
import { useCaseProgress } from "@/hooks/useProgress";
import { useReportRecorder } from "@/hooks/useReportRecorder";
import { celebrate } from "@/lib/celebrate";
import { SUB_CASES, SUB_CASE_ORDER, type SubCaseId } from "@/components/case01/cases";

export const Route = createFileRoute("/play/case-01")({
  head: () => ({
    meta: [
      { title: "Case 01: Fair Sharing — Glitch Detectives" },
      {
        name: "description",
        content:
          "Three fair-sharing puzzles: pizza, chocolate, and a painted canvas — a calm Grade 1 maths case.",
      },
    ],
  }),
  component: CaseOnePage,
});

const SOLVED_TOKEN = "[[CASE_SOLVED]]";

function CaseOnePage() {
  const [activeCase, setActiveCase] = useState<SubCaseId | null>(null);
  const { solved: solvedMap, markSolved } = useCaseProgress("case-01", SUB_CASE_ORDER);

  if (!activeCase) {
    return (
      <PageShell title="Case 01: Fair Sharing">
        <CasePicker solved={solvedMap} onPick={(id) => setActiveCase(id)} />
      </PageShell>
    );
  }

  return (
    <PageShell title={`Case 01 · ${SUB_CASES[activeCase].title}`}>
      <SubCaseRunner
        key={activeCase}
        caseId={activeCase}
        onSolved={() => markSolved(activeCase)}
        onBackToPicker={() => setActiveCase(null)}
      />
    </PageShell>
  );
}

function PageShell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-white">
      <header className="border-b border-neutral-100">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-3 py-2.5 sm:px-6 sm:py-3 lg:px-10">
          <Link
            to="/play"
            className="text-xs sm:text-sm font-medium text-neutral-500 transition-colors hover:text-neutral-900"
          >
            ← Back
          </Link>
          <h1 className="text-sm sm:text-base font-bold tracking-tight text-neutral-900 truncate px-2">
            {title}
          </h1>
          <div className="flex w-[80px] sm:w-[120px] items-center justify-end">
            <SoundToggle />
          </div>
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
  const [wrongVerdictCount, setWrongVerdictCount] = useState(0);
  const [equalized, setEqualized] = useState(0);
  const [pulseKey, setPulseKey] = useState(0);
  const [investigationMoved, setInvestigationMoved] = useState(false);
  const [investigationResetKey, setInvestigationResetKey] = useState(0);
  const [selectedObservation, setSelectedObservation] = useState<string | null>(null);
  const [assigned, setAssigned] = useState<string[]>([]);
  const [applyComplete, setApplyComplete] = useState(false);
  const sfx = useSfx();
  const reportRef = useRef<HTMLDivElement>(null);
  const repairRef = useRef<HTMLDivElement>(null);

  const transport = useRef(new DefaultChatTransport({ api: c.chatEndpoint })).current;

  const { messages, sendMessage, regenerate, status, error } = useChat({
    id: `case-01-${caseId}`,
    messages: [welcomeMessage],
    transport,
  });

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
  }, [messages, stage, onSolved, sfx]);

  useEffect(() => {
    if (stage === "solved") {
      const t = setTimeout(
        () => reportRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
        200,
      );
      return () => clearTimeout(t);
    }
  }, [stage]);

  // When the child clicks the glitch and we open the repair tool,
  // scroll the visual+repair pair into view so the child sees both.
  useEffect(() => {
    if (stage === "repair") {
      const t = setTimeout(
        () => repairRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }),
        100,
      );
      return () => clearTimeout(t);
    }
  }, [stage]);

  const resetInvestigation = () => {
    setInvestigationMoved(false);
    setSelectedObservation(null);
    setInvestigationResetKey((key) => key + 1);
    setEqualized(caseId === "canvas" ? 0.15 : 0);
  };

  const resetRepair = () => {
    setEqualized(caseId === "canvas" ? 0.15 : 0);
    setAssigned([]);
  };

  const isSending = status === "submitted" || status === "streaming";
  const target = c.correctTarget;
  const tol = c.targetTolerance;
  const distance = Math.abs(equalized - target);
  const atTarget = distance <= tol;
  const progressPct = Math.max(0, Math.round((1 - distance) * 100));
  const repairReady =
    atTarget && (caseId === "canvas" || assigned.length === c.story.participants.length);

  const studentQuotes = useMemo(
    () =>
      messages
        .filter((m) => m.role === "user")
        .map((m) =>
          m.parts
            .map((p) => (p.type === "text" ? p.text : ""))
            .join("")
            .trim(),
        )
        .filter(Boolean),
    [messages],
  );

  const marks = useMemo(() => {
    const investigate =
      stage === "investigate" ? 0 : wrongVerdictCount === 0 ? 5 : wrongVerdictCount === 1 ? 4 : 3;
    const detect = stage === "investigate" ? 0 : 5;
    const repair = atTarget ? 5 : distance < 0.15 ? 4 : distance < 0.3 ? 3 : 2;
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
  }, [stage, atTarget, distance, studentQuotes, wrongVerdictCount]);

  useReportRecorder({
    active: stage === "solved",
    caseId: "case-01",
    subId: caseId,
    caseTitle: "Case 01: Parts of a Whole",
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
          className="text-xs font-medium text-neutral-500 transition-colors hover:text-neutral-900"
        >
          ← Choose another case
        </button>
        <span className="text-[10px] font-bold tracking-wider text-neutral-400">
          {c.emoji} {c.title.toUpperCase()}
        </span>
      </div>

      <CaseStepper stage={stage} />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-6">
        <section>
          <div className="rounded-2xl bg-white p-3 sm:p-5 shadow-[0_10px_40px_-12px_rgba(15,23,42,0.15)] ring-1 ring-neutral-100">
            <div className="mb-3">
              <ZedBubble message={zed.text} tone={zed.tone} speakable />
            </div>

            {stage === "investigate" && (
              <>
                <Case01StoryBrief caseId={caseId} definition={c} />
                <Case01EvidenceBoard
                  caseId={caseId}
                  stage="investigate"
                  equalized={equalized}
                  onEqualizedChange={setEqualized}
                  moved={investigationMoved}
                  onMoved={() => setInvestigationMoved(true)}
                  onReset={resetInvestigation}
                  resetKey={investigationResetKey}
                />
                <Case01Verdict
                  onAgree={() => setWrongVerdictCount((count) => count + 1)}
                  onGlitch={() => {
                    setStage("detect");
                  }}
                  onUnsure={() => setInvestigationMoved(true)}
                  note={
                    wrongVerdictCount > 0
                      ? "It is okay to check again. Move a piece and compare before deciding."
                      : undefined
                  }
                />
              </>
            )}

            {stage === "detect" && (
              <>
                <Case01EvidenceBoard
                  caseId={caseId}
                  stage="detect"
                  equalized={equalized}
                  onEqualizedChange={setEqualized}
                  moved={investigationMoved}
                  onMoved={() => setInvestigationMoved(true)}
                  onReset={resetInvestigation}
                  resetKey={investigationResetKey}
                />
                <Case01DetectPanel
                  definition={c}
                  selected={selectedObservation}
                  onSelect={(choice, correct) => {
                    setSelectedObservation(choice);
                  }}
                  evidenceReady={investigationMoved}
                  onConfirm={() => {
                    setStage("repair");
                  }}
                />
              </>
            )}

            {stage === "repair" && (
                <Case01RepairBoard
                definition={c}
                equalized={equalized}
                onEqualizedChange={setEqualized}
                assigned={assigned}
                onAssign={(person) =>
                  setAssigned((current) =>
                    current.includes(person)
                      ? current.filter((item) => item !== person)
                      : [...current, person],
                  )
                }
                ready={repairReady}
                onSubmit={() => setStage("explain")}
                onReset={resetRepair}
              />
            )}

            <div
              ref={repairRef}
              className="rounded-xl border border-border bg-background p-3 sm:p-4"
            >
              <Visual equalized={equalized} pulseKey={pulseKey} />
              <p className="mt-2 text-center text-xs font-semibold text-muted-foreground">
                {stage === "detect"
                  ? "Use your evidence board to decide what you notice."
                  : stage === "repair"
                    ? "Your repaired model will appear here."
                    : "The model shows ZED-4’s original solution."}
              </p>
            </div>

            {(stage === "explain" || stage === "solved") && <SuccessBanner />}
            {stage === "explain" && (
              <>
                <Case01ExplainPrompts definition={c} onSend={(text) => sendMessage({ text })} />
                <div className="rounded-xl border border-border bg-background px-3 py-2 text-xs font-semibold text-muted-foreground">
                  Evidence recap: you compared the pieces and repaired the model. Tell ZED-4 what
                  made the first share unfair.
                </div>
              </>
            )}
          </div>

          {stage === "solved" && (
            <div ref={reportRef}>
              <Case01SkillUnlock caseId={caseId} definition={c} />
              <Case01ApplyChallenge
                definition={c}
                completed={applyComplete}
                onComplete={() => setApplyComplete(true)}
              />
              <DiagnosticReport
                studentQuotes={studentQuotes}
                turnCount={studentQuotes.length}
                marks={marks}
                caseTitle={`Case 01 · ${c.title}`}
                conceptMastered={c.conceptMastered}
                nextCaseLabel={nextCaseLabel}
                onTryAnother={onBackToPicker}
                showMarks={false}
              />
            </div>
          )}
        </section>

        <ChatPanel
          stage={stage}
          messages={messages}
          isSending={isSending}
          error={error}
          onSend={(text) => sendMessage({ text })}
          onRetry={() => void regenerate()}
          onViewReport={() =>
            reportRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
          }
        />
      </div>
    </>
  );
}
