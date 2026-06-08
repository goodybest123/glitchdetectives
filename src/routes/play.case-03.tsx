import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { ZedBubble } from "@/components/case01/ZedBubble";
import { CaseStepper, type Stage } from "@/components/case01/CaseStepper";
import { SpeakButton } from "@/components/case01/SpeakButton";
import { MicButton } from "@/components/case01/MicButton";
import { DiagnosticReport } from "@/components/case01/DiagnosticReport";
import { CasePicker } from "@/components/case03/CasePicker";
import { ComparatorSymbol } from "@/components/case03/ComparatorSymbol";
import { ComparatorToggle } from "@/components/case03/ComparatorToggle";
import {
  SUB_CASES,
  SUB_CASE_ORDER,
  type Operator,
  type SubCaseId,
} from "@/components/case03/cases";

export const Route = createFileRoute("/play/case-03")({
  head: () => ({
    meta: [
      { title: "Case 03: The Shape Shifters — Glitch Detectives" },
      {
        name: "description",
        content:
          "Three equivalent-fraction puzzles: fuel tanks, garden beds, and memory disks — a calm Grade 1 maths case.",
      },
    ],
  }),
  component: CaseThreePage,
});

const SOLVED_TOKEN = "[[CASE_SOLVED]]";

function CaseThreePage() {
  const [activeCase, setActiveCase] = useState<SubCaseId | null>(null);
  const [solvedMap, setSolvedMap] = useState<Record<SubCaseId, boolean>>({
    tanks: false,
    garden: false,
    disks: false,
  });

  if (!activeCase) {
    return (
      <PageShell title="Case 03: The Shape Shifters">
        <CasePicker solved={solvedMap} onPick={(id) => setActiveCase(id)} />
      </PageShell>
    );
  }

  return (
    <PageShell title={`Case 03 · ${SUB_CASES[activeCase].title}`}>
      <SubCaseRunner
        key={activeCase}
        caseId={activeCase}
        onSolved={() => setSolvedMap((m) => ({ ...m, [activeCase]: true }))}
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
          <span className="w-[160px]" aria-hidden />
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
  const [operator, setOperator] = useState<Operator>(c.wrongOperator);
  const [pulseKey, setPulseKey] = useState(0);
  const [dividersVisible, setDividersVisible] = useState(true);
  const [spinKey, setSpinKey] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const composerRef = useRef<HTMLTextAreaElement>(null);
  const reportRef = useRef<HTMLDivElement>(null);

  const transport = useRef(new DefaultChatTransport({ api: c.chatEndpoint })).current;

  const { messages, sendMessage, status } = useChat({
    id: `case-03-${caseId}`,
    messages: [welcomeMessage],
    transport,
  });

  const [input, setInput] = useState("");
  const atTarget = operator === "=";

  // When the student picks "=", play the reveal animation, then unlock explain.
  useEffect(() => {
    if ((stage === "repair" || stage === "detect") && atTarget) {
      setDividersVisible(false);
      setSpinKey((k) => k + 1);
      const t1 = setTimeout(() => setStage("explain"), 800);
      const t2 = setTimeout(() => setDividersVisible(true), 2200);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [atTarget, stage]);

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

  const handleSymbolClick = () => {
    if (stage !== "investigate") return;
    setStage("detect");
    setPulseKey((k) => k + 1);
  };

  const handleOperatorChange = (op: Operator) => {
    if (stage !== "detect" && stage !== "repair") return;
    if (stage === "detect") setStage("repair");
    setAttempts((a) => a + 1);
    setOperator(op);
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
    const investigate = stage === "investigate" ? 0 : 5;
    const detect = stage === "investigate" || stage === "detect" ? 0 : 5;
    let repair = 0;
    if (atTarget) {
      if (attempts <= 1) repair = 5;
      else if (attempts === 2) repair = 3;
      else repair = 1;
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
  }, [stage, atTarget, attempts, studentQuotes]);

  const zed =
    stage === "investigate"
      ? { tone: "neutral" as const, text: c.bubbles.investigate }
      : stage === "detect" || (stage === "repair" && !atTarget)
        ? { tone: "alert" as const, text: c.bubbles.detect }
        : { tone: "happy" as const, text: c.bubbles.solved };

  const caption = c.captions[stage];

  const nextIndex = SUB_CASE_ORDER.indexOf(caseId) + 1;
  const nextCaseLabel =
    nextIndex < SUB_CASE_ORDER.length
      ? `Try ${SUB_CASES[SUB_CASE_ORDER[nextIndex]].title} next.`
      : "You've solved every case in this file!";

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
        {/* Case file */}
        <section className="lg:col-span-2">
          <div className="rounded-3xl bg-white p-6 sm:p-10 shadow-[0_10px_40px_-12px_rgba(15,23,42,0.15)] ring-1 ring-neutral-100">
            <CaseStepper stage={stage} />
            <div className="mb-6">
              <ZedBubble message={zed.text} tone={zed.tone} speakable />
            </div>

            {/* Tanks/beds/disks with comparator in the middle */}
            <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:justify-center sm:gap-4">
              <SideWithLabel
                fraction={`${c.left.n}/${c.left.d}`}
                inline={false}
              >
                <LeftHalf Visual={Visual} dividersVisible={dividersVisible} spinKey={spinKey} side="left" />
              </SideWithLabel>

              <div className="flex flex-col items-center gap-1">
                <FractionInline n={c.left.n} d={c.left.d} />
                <ComparatorSymbol
                  operator={operator}
                  highlight={stage === "detect" || stage === "repair"}
                  clickable={stage === "investigate"}
                  onClick={handleSymbolClick}
                  pulseKey={pulseKey}
                />
                <FractionInline n={c.right.n} d={c.right.d} />
              </div>

              <SideWithLabel
                fraction={`${c.right.n}/${c.right.d}`}
                inline={false}
              >
                <LeftHalf Visual={Visual} dividersVisible={dividersVisible} spinKey={spinKey} side="right" />
              </SideWithLabel>
            </div>

            <p className="mt-6 text-center text-neutral-600">{caption}</p>

            {(stage === "detect" || stage === "repair") && !atTarget && (
              <div className="mt-8 flex justify-center rounded-2xl bg-[#f8fafc] p-5">
                <ComparatorToggle value={operator} onChange={handleOperatorChange} />
              </div>
            )}

            {(stage === "explain" || stage === "solved") && (
              <div className="mt-6 rounded-2xl bg-[#dcfce7] px-5 py-4 text-center text-sm font-semibold text-[#166534]">
                {c.successBanner}
              </div>
            )}
          </div>

          {stage === "solved" && (
            <div ref={reportRef}>
              <DiagnosticReport
                studentQuotes={studentQuotes}
                turnCount={studentQuotes.length}
                marks={marks}
                caseTitle={`Case 03 · ${c.title}`}
                conceptMastered={c.conceptMastered}
                nextCaseLabel={nextCaseLabel}
                onTryAnother={onBackToPicker}
              />
            </div>
          )}
        </section>

        {/* Chat panel */}
        <aside className="lg:sticky lg:top-8 lg:self-start">
          <div
            className={`flex h-[600px] flex-col rounded-3xl bg-white shadow-[0_10px_40px_-12px_rgba(15,23,42,0.15)] ring-1 ring-neutral-100 transition-opacity ${
              chatEnabled || stage === "solved" ? "opacity-100" : "opacity-50"
            }`}
            aria-disabled={!chatEnabled}
          >
            <div className="flex items-start justify-between gap-2 border-b border-neutral-100 px-5 py-4">
              <div>
                <h2 className="text-sm font-bold tracking-wider text-neutral-700">
                  AI GUIDE
                </h2>
                <p className="mt-0.5 text-xs text-neutral-500">
                  {stage === "solved"
                    ? "Case closed — great work, Detective!"
                    : chatEnabled
                      ? "Explain your reasoning — type or speak."
                      : "Unlocks after you repair the logic."}
                </p>
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
                  className="w-full resize-none rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-[#60a5fa] focus:outline-none focus:ring-2 focus:ring-[#dbeafe] disabled:bg-neutral-50"
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

/** Renders the full visual (both shapes) but masks to one side via CSS clip. */
function LeftHalf({
  Visual,
  dividersVisible,
  spinKey,
  side,
}: {
  Visual: React.ComponentType<{ dividersVisible: boolean; spinKey?: number }>;
  dividersVisible: boolean;
  spinKey: number;
  side: "left" | "right";
}) {
  // Hide the entire shared visual on a side flag; we render the full visual once below.
  // To keep things simple, we render the entire visual on each call but only display the
  // requested half via overflow + width trick.
  return (
    <div
      className="relative overflow-hidden"
      style={{
        width: 220,
        height: 240,
      }}
    >
      <div
        className="absolute top-0 h-full"
        style={{
          left: side === "left" ? 0 : -240,
          width: 480,
        }}
      >
        <Visual dividersVisible={dividersVisible} spinKey={spinKey} />
      </div>
    </div>
  );
}

function SideWithLabel({
  children,
}: {
  fraction: string;
  inline: boolean;
  children: React.ReactNode;
}) {
  return <div className="flex flex-col items-center">{children}</div>;
}

function FractionInline({ n, d }: { n: number; d: number }) {
  return (
    <div className="flex items-center gap-2 text-base font-bold text-neutral-500">
      <span className="tabular-nums">{n}/{d}</span>
    </div>
  );
}
