import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { ZedBubble } from "@/components/case01/ZedBubble";
import { CaseStepper, type Stage } from "@/components/case01/CaseStepper";
import { SpeakButton } from "@/components/case01/SpeakButton";
import { MicButton } from "@/components/case01/MicButton";
import { DiagnosticReport } from "@/components/case01/DiagnosticReport";
import { CasePicker } from "@/components/case06/CasePicker";
import { EquationDisplay } from "@/components/case06/EquationDisplay";
import { BlueprintSlicer } from "@/components/case06/BlueprintSlicer";
import { PaintCalibrator } from "@/components/case06/PaintCalibrator";
import { CircuitSegmenter } from "@/components/case06/CircuitSegmenter";
import { DetectiveCallout } from "@/components/shared/DetectiveCallout";
import { SuccessBanner } from "@/components/shared/SuccessBanner";
import { CaptionLine } from "@/components/shared/CaptionLine";
import { VerdictButtons } from "@/components/shared/VerdictButtons";
import { SoundToggle } from "@/components/shared/SoundToggle";
import { WorkbookActivityPrompt, WorkbookRepairFrame } from "@/components/shared/WorkbookActivity";
import { useSfx } from "@/hooks/useSfx";
import { useCaseProgress } from "@/hooks/useProgress";
import { useReportRecorder } from "@/hooks/useReportRecorder";
import { celebrate } from "@/lib/celebrate";
import {
  SUB_CASES,
  SUB_CASE_ORDER,
  type SubCaseId,
} from "@/components/case06/cases";

export const Route = createFileRoute("/play/case-06")({
  head: () => ({
    meta: [
      { title: "Case 06: The Mismatched Puzzle — Glitch Detectives" },
      {
        name: "description",
        content:
          "Three unlike-denominator puzzles: blueprint, paint vats, and circuit board — the final Fraction Factory case.",
      },
    ],
  }),
  component: CaseSixPage,
});

const SOLVED_TOKEN = "[[CASE_SOLVED]]";

function CaseSixPage() {
  const [activeCase, setActiveCase] = useState<SubCaseId | null>(null);
  const { solved: solvedMap, markSolved } = useCaseProgress("case-06", SUB_CASE_ORDER);

  if (!activeCase) {
    return (
      <PageShell title="Case 06: The Mismatched Puzzle">
        <CasePicker solved={solvedMap} onPick={(id) => setActiveCase(id)} />
      </PageShell>
    );
  }

  return (
    <PageShell title={`Case 06 · ${SUB_CASES[activeCase].title}`}>
      <SubCaseRunner
        key={activeCase}
        caseId={activeCase}
        onSolved={() => markSolved(activeCase)}
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
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-5 sm:px-10">
          <Link
            to="/play"
            className="text-sm font-medium text-neutral-500 transition-colors hover:text-neutral-900"
          >
            ← Back to Active Cases
          </Link>
          <h1 className="text-base sm:text-lg font-bold tracking-tight text-neutral-900">
            {title}
          </h1>
          <div className="flex w-[160px] items-center justify-end"><SoundToggle /></div>
        </div>
      </header>
      <div className="mx-auto w-full max-w-7xl px-6 py-10 sm:px-10">{children}</div>
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
  const [repaired, setRepaired] = useState(false);
  const [pulseKey, setPulseKey] = useState(0);
  const composerRef = useRef<HTMLTextAreaElement>(null);
  const reportRef = useRef<HTMLDivElement>(null);

  const transport = useRef(
    new DefaultChatTransport({ api: c.chatEndpoint }),
  ).current;

  const { messages, sendMessage, status } = useChat({
    id: `case-06-${caseId}`,
    messages: [welcomeMessage],
    transport,
  });

  const [input, setInput] = useState("");
  const sfx = useSfx();

  useEffect(() => {
    if (stage === "explain") composerRef.current?.focus();
  }, [stage]);

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

  const handleResultClick = () => {
    if (stage !== "detect") return;
    setStage("repair");
    setPulseKey((k) => k + 1);
    sfx("ding");
  };

  const handleVerdictGlitch = () => {
    if (stage !== "investigate" || verdictPassed) return;
    setVerdictPassed(true);
    setStage("detect");
    sfx("ding");
  };

  const handleVerdictNoGlitch = () => {
    if (stage !== "investigate" || verdictPassed) return;
    setWrongVerdictCount((n) => n + 1);
    setVerdictShakeKey((k) => k + 1);
    sfx("error");
  };

  const handleRepair = () => {
    if (stage !== "repair") return;
    setRepaired(true);
    setPulseKey((k) => k + 1);
    const t = setTimeout(() => setStage("explain"), 900);
    return () => clearTimeout(t);
  };

  const isSending = status === "submitted" || status === "streaming";
  const chatEnabled = stage === "explain";

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
    const repair = repaired ? 5 : 0;
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
  }, [stage, repaired, studentQuotes, wrongVerdictCount]);

  useReportRecorder({
    active: stage === "solved",
    caseId: "case-06",
    subId: caseId,
    caseTitle: "Case 06: The Mismatched Puzzle",
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
  const showDetective = (stage === "detect" || stage === "repair") && !repaired;

  const nextIndex = SUB_CASE_ORDER.indexOf(caseId) + 1;
  const nextCaseLabel =
    nextIndex < SUB_CASE_ORDER.length
      ? `Try ${SUB_CASES[SUB_CASE_ORDER[nextIndex]].title} next.`
      : "You've solved every case in this file!";

  const resultState =
    stage === "solved" || stage === "explain"
      ? "solved"
      : stage === "detect" || stage === "repair"
        ? "glitch"
        : "idle";

  const displayedLeft = repaired ? c.repairedLeft : c.left;
  const displayedResult = repaired ? c.repairedResult : c.wrongResult;

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
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

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-10">
        <section className="lg:col-span-2">
          <div className="rounded-3xl bg-white p-6 sm:p-10 shadow-[0_10px_40px_-12px_rgba(15,23,42,0.15)] ring-1 ring-neutral-100">
            <CaseStepper stage={stage} />
            <div className="mb-6">
              <ZedBubble message={zed.text} tone={zed.tone} speakable />
            </div>

            <WorkbookActivityPrompt stage={stage} emoji={c.emoji} title={c.title}
              detectInstruction={c.captions.investigate} repairInstruction={c.toolHint}
              toolName={c.toolLabel} />

            {stage === "repair" && !repaired ? (
              <WorkbookRepairFrame toolName={c.toolLabel} instruction={c.toolHint}
                hint="Make both fractions use equal-sized pieces before calculating." progress="MATCH THE PIECES">
                {caseId === "blueprint" && <BlueprintSlicer onComplete={handleRepair} />}
                {caseId === "paint" && <PaintCalibrator onComplete={handleRepair} />}
                {caseId === "circuit" && <CircuitSegmenter onComplete={handleRepair} />}
              </WorkbookRepairFrame>
            ) : (
              <div
                onClick={stage === "detect" ? handleResultClick : undefined}
                className={stage === "detect" ? "cursor-pointer rounded-2xl ring-2 ring-[#fcd34d] ring-offset-2 transition" : ""}
              >
                <Visual repaired={repaired} pulseKey={pulseKey} />
              </div>
            )}

            <div className="mt-6">
              <EquationDisplay
                left={displayedLeft}
                right={c.right}
                operator={c.operator}
                result={displayedResult}
                resultState={resultState}
                clickable={stage === "detect"}
                onResultClick={handleResultClick}
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

            {(stage === "explain" || stage === "solved") && <SuccessBanner />}
          </div>

          {stage === "solved" && (
            <div ref={reportRef}>
              <DiagnosticReport
                studentQuotes={studentQuotes}
                turnCount={studentQuotes.length}
                marks={marks}
                caseTitle={`Case 06 · ${c.title}`}
                conceptMastered={c.conceptMastered}
                nextCaseLabel={nextCaseLabel}
                onTryAnother={onBackToPicker}
              />
            </div>
          )}
        </section>

        <aside className="lg:self-stretch">
          <div
            className={`flex h-full min-h-[600px] flex-col rounded-3xl bg-white shadow-[0_10px_40px_-12px_rgba(15,23,42,0.15)] ring-1 ring-neutral-100 transition-opacity ${
              chatEnabled || stage === "solved" ? "opacity-100" : "opacity-50"
            }`}
            aria-disabled={!chatEnabled}
          >
            <div className="flex items-start justify-between gap-2 border-b border-neutral-100 px-5 py-4">
              <div>
                <h2 className="text-sm font-bold tracking-wider text-neutral-700">
                  AI GUIDE
                </h2>
                <div className="mt-0.5 flex items-center gap-2"><p className="text-xs text-neutral-500">{stage === "solved" ? "Case closed — great work, Detective!" : chatEnabled ? "Explain your reasoning — type or speak." : "Unlocks after you repair the logic."}</p><SpeakButton text={stage === "solved" ? "Case closed — great work, Detective!" : chatEnabled ? "Explain your reasoning — type or speak." : "Unlocks after you repair the logic."} /></div>
              </div>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
              {chatEnabled || stage === "solved" ? (
                messages.map((m) => {
                  const raw = m.parts
                    .map((p) => (p.type === "text" ? p.text : ""))
                    .join("");
                  const text = raw.replace(SOLVED_TOKEN, "").trim();
                  if (!text) return null;
                  const isUser = m.role === "user";
                  return (
                    <div
                      key={m.id}
                      className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                          isUser
                            ? "bg-[#1f2937] text-white"
                            : "bg-[#eaf2ff] text-neutral-800"
                        }`}
                      >
                        {text}
                      </div>
                      {!isUser && (
                        <div className="mt-1.5 ml-1">
                          <SpeakButton text={text} />
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="flex h-full items-center justify-center text-center text-sm text-neutral-400">
                  Complete the repair to unlock the chat.
                </div>
              )}
              {isSending && (
                <div className="text-xs italic text-neutral-400">
                  AI Guide is thinking…
                </div>
              )}
            </div>

            {stage === "solved" ? (
              <div className="border-t border-neutral-100 p-4">
                <button
                  type="button"
                  onClick={() =>
                    reportRef.current?.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    })
                  }
                  className="w-full rounded-full bg-[#10b981] px-4 py-2.5 text-xs font-bold tracking-wider text-white transition-colors hover:bg-[#0ea371]"
                >
                  VIEW DIAGNOSTIC REPORT
                </button>
              </div>
            ) : (
              <form
                className="border-t border-neutral-100 p-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  const text = input.trim();
                  if (!text || !chatEnabled || isSending) return;
                  sendMessage({ text });
                  setInput("");
                }}
              >
                <textarea
                  ref={composerRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      (e.currentTarget.form as HTMLFormElement).requestSubmit();
                    }
                  }}
                  disabled={!chatEnabled || isSending}
                  rows={2}
                  placeholder={
                    chatEnabled
                      ? "Type your reasoning, or tap the mic to speak…"
                      : "Locked until repair is complete"
                  }
                  className="w-full resize-none rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-[#fb923c] focus:outline-none focus:ring-2 focus:ring-[#fed7aa] disabled:bg-neutral-50"
                />
                <div className="mt-2 flex items-center justify-between gap-2">
                  <MicButton
                    disabled={!chatEnabled || isSending}
                    onTranscript={(t, isFinal) => {
                      if (isFinal) {
                        setInput((prev) => (prev ? prev.trimEnd() + " " : "") + t);
                      }
                    }}
                  />
                  <button
                    type="submit"
                    disabled={!chatEnabled || isSending || !input.trim()}
                    className="rounded-full bg-[#1f2937] px-4 py-2 text-xs font-bold tracking-wider text-white transition-colors hover:bg-black disabled:bg-neutral-300"
                  >
                    SUBMIT EVIDENCE
                  </button>
                </div>
              </form>
            )}
          </div>
        </aside>
      </div>
    </>
  );
}
