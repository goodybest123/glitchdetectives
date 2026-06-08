import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { PizzaSVG } from "@/components/case01/PizzaSVG";
import { ZedBubble } from "@/components/case01/ZedBubble";
import { CaseStepper, type Stage } from "@/components/case01/CaseStepper";
import { SpeakButton } from "@/components/case01/SpeakButton";
import { MicButton } from "@/components/case01/MicButton";
import { DiagnosticReport } from "@/components/case01/DiagnosticReport";

export const Route = createFileRoute("/play/case-01")({
  head: () => ({
    meta: [
      { title: "Case 01: Fair Sharing — Glitch Detectives" },
      {
        name: "description",
        content:
          "Audit ZED-4's logic, find the unfair slice, repair it, and explain fair sharing — a calm Grade 1 maths case.",
      },
    ],
  }),
  component: CaseOnePage,
});

const SOLVED_TOKEN = "[[CASE_SOLVED]]";

const WELCOME_MESSAGE: UIMessage = {
  id: "welcome",
  role: "assistant",
  parts: [
    {
      type: "text",
      text:
        "Great detective work! You fixed my pizza. Can you tell me — why was my first try not fair?",
    },
  ],
};

function CaseOnePage() {
  const [stage, setStage] = useState<Stage>("investigate");
  const [equalized, setEqualized] = useState(0);
  const [pulseKey, setPulseKey] = useState(0);
  const composerRef = useRef<HTMLTextAreaElement>(null);
  const reportRef = useRef<HTMLDivElement>(null);

  const transport = useRef(
    new DefaultChatTransport({ api: "/api/chat/case-01" }),
  ).current;

  const { messages, sendMessage, status } = useChat({
    id: "case-01",
    messages: [WELCOME_MESSAGE],
    transport,
  });

  const [input, setInput] = useState("");

  // Promote to "repair" the moment the slider moves
  useEffect(() => {
    if (stage === "detect" && equalized > 0) setStage("repair");
  }, [equalized, stage]);

  // Promote to "explain" when fully equalized
  useEffect(() => {
    if (stage === "repair" && equalized >= 0.995) {
      setEqualized(1);
      const t = setTimeout(() => setStage("explain"), 400);
      return () => clearTimeout(t);
    }
  }, [equalized, stage]);

  // Focus composer when chat unlocks
  useEffect(() => {
    if (stage === "explain") composerRef.current?.focus();
  }, [stage]);

  // Detect solved sentinel from any assistant message
  useEffect(() => {
    if (stage !== "explain") return;
    const hasSolved = messages.some(
      (m) =>
        m.role === "assistant" &&
        m.parts.some((p) => p.type === "text" && p.text.includes(SOLVED_TOKEN)),
    );
    if (hasSolved) setStage("solved");
  }, [messages, stage]);

  // Scroll report into view when it appears
  useEffect(() => {
    if (stage === "solved") {
      const t = setTimeout(
        () => reportRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
        200,
      );
      return () => clearTimeout(t);
    }
  }, [stage]);

  const handleGlitchClick = () => {
    if (stage !== "investigate") return;
    setStage("detect");
    setPulseKey((k) => k + 1);
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

  const zed =
    stage === "investigate"
      ? { tone: "neutral" as const, text: "Look! I served exactly four pieces of pizza!" }
      : stage === "detect" || stage === "repair"
      ? { tone: "alert" as const, text: "Glitch Detected! The pieces don't look fair." }
      : { tone: "happy" as const, text: "Logic repaired. The case is yours to close." };

  return (
    <main className="min-h-screen bg-white">
      {/* Top nav */}
      <header className="border-b border-neutral-100">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-5 sm:px-10">
          <Link
            to="/play"
            className="text-sm font-medium text-neutral-500 transition-colors hover:text-neutral-900"
          >
            ← Back to Active Cases
          </Link>
          <h1 className="text-base sm:text-lg font-bold tracking-tight text-neutral-900">
            Case 01: Fair Sharing
          </h1>
          <span className="w-[160px]" aria-hidden />
        </div>
      </header>

      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-8 px-6 py-10 sm:px-10 lg:grid-cols-3 lg:gap-10">
        {/* Case file */}
        <section className="lg:col-span-2">
          <div className="rounded-3xl bg-white p-6 sm:p-10 shadow-[0_10px_40px_-12px_rgba(15,23,42,0.15)] ring-1 ring-neutral-100">
            <CaseStepper stage={stage} />
            <div className="mb-6">
              <ZedBubble message={zed.text} tone={zed.tone} speakable />
            </div>

            <PizzaSVG
              equalized={equalized}
              onGlitchClick={handleGlitchClick}
              interactive={stage === "investigate"}
              pulseKey={pulseKey}
            />

            <p className="mt-6 text-center text-neutral-600">
              {stage === "investigate" &&
                "Scan ZED-4's logic. Click on the pizza where the sharing is not fair."}
              {stage === "detect" &&
                "Now drag the Equalizer Tool to make the pieces the same size."}
              {stage === "repair" &&
                "Keep going — make all four parts the same size."}
              {stage === "explain" &&
                "The chat panel is now open. Tell ZED-4 why it wasn't fair."}
              {stage === "solved" &&
                "Case closed. Read your diagnostic report below."}
            </p>

            {/* Repair tool */}
            {(stage === "detect" || stage === "repair" || stage === "explain" || stage === "solved") && (
              <div className="mt-8 rounded-2xl bg-[#f8fafc] p-5">
                <label
                  htmlFor="equalizer"
                  className="mb-3 block text-sm font-semibold tracking-wide text-neutral-700"
                >
                  EQUALIZER TOOL
                </label>
                <input
                  id="equalizer"
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={equalized}
                  onChange={(e) => setEqualized(parseFloat(e.target.value))}
                  disabled={stage === "explain" || stage === "solved"}
                  className="w-full accent-[#60a5fa]"
                />
                <div className="mt-2 flex justify-between text-xs text-neutral-500">
                  <span>Unfair</span>
                  <span>Equal</span>
                </div>
              </div>
            )}

            {/* Repaired banner */}
            {(stage === "explain" || stage === "solved") && (
              <div className="mt-6 rounded-2xl bg-[#dcfce7] px-5 py-4 text-center text-sm font-semibold text-[#166534]">
                Logic Repaired: The parts are now equal.
              </div>
            )}
          </div>

          {/* Diagnostic Report */}
          {stage === "solved" && (
            <div ref={reportRef}>
              <DiagnosticReport
                studentQuotes={studentQuotes}
                turnCount={studentQuotes.length}
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
                    reportRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
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
    </main>
  );
}
