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
import { SpeakButton } from "@/components/case01/SpeakButton";
import { DiagnosticReport } from "@/components/case01/DiagnosticReport";
import { CasePicker } from "@/components/case01/CasePicker";
import { DetectiveCallout } from "@/components/shared/DetectiveCallout";
import { SuccessBanner } from "@/components/shared/SuccessBanner";
import { CaptionLine } from "@/components/shared/CaptionLine";
import { VerdictButtons } from "@/components/shared/VerdictButtons";
import { SoundToggle } from "@/components/shared/SoundToggle";
import { ChatPanel } from "@/components/shared/ChatPanel";
import {
  WorkbookActivityPrompt,
  WorkbookGlitchChoices,
  WorkbookRepairFrame,
  WorkbookRepairSubmit,
} from "@/components/shared/WorkbookActivity";
import { getGlitchChoices } from "@/components/shared/glitchChoices";
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
  const [verdictPassed, setVerdictPassed] = useState(false);
  const [wrongVerdictCount, setWrongVerdictCount] = useState(0);
  const [verdictShakeKey, setVerdictShakeKey] = useState(0);
  const [equalized, setEqualized] = useState(0);
  const [pulseKey, setPulseKey] = useState(0);
  const [glitchUnlocked, setGlitchUnlocked] = useState(false);
  const sfx = useSfx();
  const reportRef = useRef<HTMLDivElement>(null);
  const repairRef = useRef<HTMLDivElement>(null);

  const transport = useRef(new DefaultChatTransport({ api: c.chatEndpoint })).current;

  const { messages, sendMessage, status, error } = useChat({
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

  const handleGlitchClick = () => {
    if (stage !== "detect" || !glitchUnlocked) return;
    setStage("repair");
    setPulseKey((k) => k + 1);
  };

  const handleVerdictGlitch = () => {
    if (stage !== "investigate" || verdictPassed) return;
    setVerdictPassed(true);
    setStage("detect");
    // start canvas slider mid-trip so kids see motion either way
    if (caseId === "canvas") setEqualized(0.15);
  };

  const handleVerdictNoGlitch = () => {
    if (stage !== "investigate" || verdictPassed) return;
    setWrongVerdictCount((n) => n + 1);
    setVerdictShakeKey((k) => k + 1);
  };

  const isSending = status === "submitted" || status === "streaming";
  const target = c.correctTarget;
  const tol = c.targetTolerance;
  const distance = Math.abs(equalized - target);
  const atTarget = distance <= tol;
  const progressPct = Math.max(0, Math.round((1 - distance) * 100));

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

  const caption = c.captions[stage];
  const showDetective = stage === "detect" || stage === "repair";

  const nextIndex = SUB_CASE_ORDER.indexOf(caseId) + 1;
  const nextCaseLabel =
    nextIndex < SUB_CASE_ORDER.length
      ? `Try ${SUB_CASES[SUB_CASE_ORDER[nextIndex]].title} next.`
      : "You've solved every case in this file!";

  const hint =
    stage === "repair" && !atTarget
      ? distance > tol && caseId === "canvas"
        ? equalized < target
          ? "A little more to the right…"
          : "A little to the left…"
        : c.toolHint
      : undefined;

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

            {stage === "detect" && (
              <WorkbookGlitchChoices
                choices={getGlitchChoices("case-01", caseId)}
                unlocked={glitchUnlocked}
                onUnlock={() => setGlitchUnlocked(true)}
                onCorrect={() =>
                  setTimeout(
                    () =>
                      repairRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }),
                    100,
                  )
                }
              />
            )}

            <WorkbookActivityPrompt
              stage={stage}
              emoji={c.emoji}
              title={c.title}
              detectInstruction={c.captions.investigate}
              repairInstruction={c.toolTagline}
              toolName={c.sliderLabel}
            />

            {/* Visual + Repair side-by-side on sm+, stacked on phones */}
            <div
              ref={repairRef}
              className={`grid gap-3 ${stage === "repair" || stage === "explain" || stage === "solved" ? "sm:grid-cols-2 sm:items-start" : "grid-cols-1"}`}
            >
              <div
                className={
                  stage === "detect"
                    ? "cursor-pointer rounded-xl ring-2 ring-[#fcd34d] ring-offset-2 transition"
                    : ""
                }
              >
                <Visual
                  equalized={equalized}
                  onGlitchClick={handleGlitchClick}
                  interactive={stage === "detect" && glitchUnlocked}
                  pulseKey={pulseKey}
                />
              </div>

              {(stage === "repair" || stage === "explain" || stage === "solved") && (
                <WorkbookRepairFrame
                  toolName={c.sliderLabel}
                  instruction={c.toolTagline}
                  hint={hint}
                  progress={atTarget ? "✓ BALANCED" : `${progressPct}%`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span aria-hidden className="text-lg">
                          🛠️
                        </span>
                        <label
                          htmlFor="equalizer"
                          className="text-xs font-bold tracking-wider text-neutral-800"
                        >
                          {c.sliderLabel}
                        </label>
                        <SpeakButton text={`${c.sliderLabel}. ${c.toolTagline}`} />
                      </div>
                      <p className="mt-1 text-[11px] text-neutral-600">{c.toolTagline}</p>
                    </div>
                    {atTarget ? (
                      <span className="shrink-0 rounded-full bg-[#10b981] px-2 py-0.5 text-[9px] font-bold tracking-wider text-white">
                        ✓ BALANCED
                      </span>
                    ) : (
                      <span className="shrink-0 rounded-full bg-white px-2 py-0.5 text-[9px] font-bold tracking-wider text-neutral-500 ring-1 ring-neutral-200">
                        {progressPct}%
                      </span>
                    )}
                  </div>

                  {stage === "repair" && !atTarget && (
                    <div className="mt-2 rounded-lg bg-[#fef3c7] px-2.5 py-1.5 text-[11px] font-semibold text-[#92400e] ring-1 ring-[#fcd34d]">
                      ⚡ Drag the slider to repair the glitch.
                    </div>
                  )}
                  {(stage === "explain" || stage === "solved") && (
                    <div className="mt-2 rounded-lg bg-white/70 px-2.5 py-1.5 text-[11px] font-medium text-neutral-500 ring-1 ring-neutral-200">
                      🔒 Tool locked — explain your reasoning to close the case.
                    </div>
                  )}

                  <input
                    id="equalizer"
                    type="range"
                    min={0}
                    max={1}
                    step={0.01}
                    value={equalized}
                    onChange={(e) => setEqualized(parseFloat(e.target.value))}
                    disabled={stage === "explain" || stage === "solved"}
                    className="mt-3 w-full accent-[#2563eb]"
                  />
                  <div className="mt-1 flex justify-between text-[10px] font-medium text-neutral-600">
                    <span>{c.toolMinLabel}</span>
                    <span>{c.toolMaxLabel}</span>
                  </div>
                  {stage === "repair" && (
                    <WorkbookRepairSubmit
                      ready={atTarget}
                      onSubmit={() => {
                        setEqualized(target);
                        setStage("explain");
                      }}
                    />
                  )}
                </WorkbookRepairFrame>
              )}
            </div>

            {stage === "investigate" && !verdictPassed && (
              <VerdictButtons
                onGlitch={handleVerdictGlitch}
                onNoGlitch={handleVerdictNoGlitch}
                shakeKey={verdictShakeKey}
                wrongCount={wrongVerdictCount}
              />
            )}

            {!(stage === "investigate" && !verdictPassed) && <CaptionLine text={caption} />}
            {showDetective && <DetectiveCallout text={c.bubbles.detect} />}

            {(stage === "explain" || stage === "solved") && <SuccessBanner />}
          </div>

          {stage === "solved" && (
            <div ref={reportRef}>
              <DiagnosticReport
                studentQuotes={studentQuotes}
                turnCount={studentQuotes.length}
                marks={marks}
                caseTitle={`Case 01 · ${c.title}`}
                conceptMastered={c.conceptMastered}
                nextCaseLabel={nextCaseLabel}
                onTryAnother={onBackToPicker}
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
          onViewReport={() =>
            reportRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
          }
        />
      </div>
    </>
  );
}
