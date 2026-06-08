import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { PizzaSVG } from "@/components/case01/PizzaSVG";
import { ZedBubble } from "@/components/case01/ZedBubble";
import { CaseStepper } from "@/components/case01/CaseStepper";
import { SpeakButton } from "@/components/case01/SpeakButton";
import { MicButton } from "@/components/case01/MicButton";

export const Route = createFileRoute("/play/case-01")({
  head: () => ({
    meta: [
      { title: "Case 01: Parts of a Whole — Fraction Factory" },
      {
        name: "description",
        content:
          "Audit ZED-4's logic, find the glitch in the pizza, repair it, and explain why — a calm, neuro-inclusive maths puzzle.",
      },
    ],
  }),
  component: CaseOnePage,
});

type Stage = "investigate" | "detect" | "repair" | "explain";

const WELCOME_MESSAGE: UIMessage = {
  id: "welcome",
  role: "assistant",
  parts: [
    {
      type: "text",
      text:
        "Great detective work! You fixed ZED-4's glitch. Before we close the case, tell me: why was it wrong to call that first tiny slice 1/4?",
    },
  ],
};

function CaseOnePage() {
  const [stage, setStage] = useState<Stage>("investigate");
  const [equalized, setEqualized] = useState(0);
  const [pulseKey, setPulseKey] = useState(0);
  const composerRef = useRef<HTMLTextAreaElement>(null);

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

  const handleGlitchClick = () => {
    if (stage !== "investigate") return;
    setStage("detect");
    setPulseKey((k) => k + 1);
  };

  const isSending = status === "submitted" || status === "streaming";
  const chatEnabled = stage === "explain";

  const zed =
    stage === "investigate"
      ? { tone: "neutral" as const, text: "Look! I served exactly 1/4 of the pizza!" }
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
            Case 01: Parts of a Whole
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
                "Scan ZED-4's logic. Click on the pizza where the logic breaks."}
              {stage === "detect" &&
                "Now drag the Equalizer Tool to repair the slices."}
              {stage === "repair" &&
                "Keep going — make all four parts the same size."}
              {stage === "explain" &&
                "The chat panel is now open. Share your reasoning with the AI Guide."}
            </p>

            {/* Repair tool */}
            {(stage === "detect" || stage === "repair" || stage === "explain") && (
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
                  disabled={stage === "explain"}
                  className="w-full accent-[#60a5fa]"
                />
                <div className="mt-2 flex justify-between text-xs text-neutral-500">
                  <span>Unfair</span>
                  <span>Equal</span>
                </div>
              </div>
            )}

            {/* Repaired banner */}
            {stage === "explain" && (
              <div className="mt-6 rounded-2xl bg-[#dcfce7] px-5 py-4 text-center text-sm font-semibold text-[#166534]">
                Logic Repaired: The parts are now equal.
              </div>
            )}
          </div>
        </section>

        {/* Chat panel */}
        <aside className="lg:sticky lg:top-8 lg:self-start">
          <div
            className={`flex h-[600px] flex-col rounded-3xl bg-white shadow-[0_10px_40px_-12px_rgba(15,23,42,0.15)] ring-1 ring-neutral-100 transition-opacity ${
              chatEnabled ? "opacity-100" : "opacity-50"
            }`}
            aria-disabled={!chatEnabled}
          >
            <div className="border-b border-neutral-100 px-5 py-4">
              <h2 className="text-sm font-bold tracking-wider text-neutral-700">
                AI GUIDE
              </h2>
              <p className="mt-0.5 text-xs text-neutral-500">
                {chatEnabled
                  ? "Explain your reasoning."
                  : "Unlocks after you repair the logic."}
              </p>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
              {chatEnabled ? (
                messages.map((m) => {
                  const text = m.parts
                    .map((p) => (p.type === "text" ? p.text : ""))
                    .join("");
                  if (!text) return null;
                  const isUser = m.role === "user";
                  return (
                    <div
                      key={m.id}
                      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
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
                    ? "Type your reasoning…"
                    : "Locked until repair is complete"
                }
                className="w-full resize-none rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-[#60a5fa] focus:outline-none focus:ring-2 focus:ring-[#dbeafe] disabled:bg-neutral-50"
              />
              <div className="mt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={!chatEnabled || isSending || !input.trim()}
                  className="rounded-full bg-[#1f2937] px-4 py-2 text-xs font-bold tracking-wider text-white transition-colors hover:bg-black disabled:bg-neutral-300"
                >
                  SUBMIT EVIDENCE
                </button>
              </div>
            </form>
          </div>
        </aside>
      </div>
    </main>
  );
}
