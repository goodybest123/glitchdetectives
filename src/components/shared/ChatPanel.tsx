import { useEffect, useRef, useState } from "react";
import { MessageCircle, X } from "lucide-react";
import type { UIMessage } from "ai";
import { SpeakButton } from "@/components/case01/SpeakButton";
import { MicButton } from "@/components/case01/MicButton";
import { Button } from "@/components/ui/button";

const SOLVED_TOKEN = "[[CASE_SOLVED]]";

type Stage = "investigate" | "detect" | "repair" | "explain" | "solved";

type Props = {
  stage: Stage;
  messages: UIMessage[];
  isSending: boolean;
  error?: Error;
  onSend: (text: string) => void;
  onRetry?: () => void;
  onViewReport?: () => void;
};

/** Inline-composer chat panel.
 *  - Composer lives at the END of the message list (flows with chats, not pinned)
 *  - When `explain` opens, container scrolls to TOP so ZED-4's prompt is first thing the child sees
 *  - On <lg, opens as a slide-up drawer instead of a sidebar
 */
export function ChatPanel(props: Props) {
  return (
    <>
      {/* Desktop / large tablets: docked right column */}
      <div className="hidden lg:block lg:sticky lg:top-4 lg:self-start">
        <ChatPanelInner {...props} variant="docked" />
      </div>
      {/* Tablet / Chromebook / mobile: bottom drawer */}
      <div className="lg:hidden">
        <ChatPanelDrawer {...props} />
      </div>
    </>
  );
}

function ChatPanelDrawer(props: Props) {
  const [open, setOpen] = useState(false);
  const autoOpenedRef = useRef(false);

  // Auto-open the first time the explain stage starts.
  useEffect(() => {
    if ((props.stage === "explain" || props.stage === "solved") && !autoOpenedRef.current) {
      autoOpenedRef.current = true;
      setOpen(true);
    }
  }, [props.stage]);

  const enabled = props.stage === "explain" || props.stage === "solved";

  return (
    <>
      {/* Floating launcher button (always available, prominent when explain unlocks) */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`fixed bottom-4 right-4 z-40 flex items-center gap-2 rounded-full px-4 py-3 text-sm font-bold tracking-wider text-white shadow-lg transition-all ${
          enabled ? "bg-[#1f2937] hover:bg-black animate-pulse-once" : "bg-neutral-400"
        }`}
        aria-label="Open AI Guide chat"
      >
        <MessageCircle size={18} />
        AI GUIDE
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex flex-col bg-black/40"
          onClick={() => setOpen(false)}
        >
          <div
            className="mt-auto h-[85vh] rounded-t-3xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-neutral-100 px-4 py-2">
              <h2 className="text-sm font-bold tracking-wider text-neutral-700">AI GUIDE</h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full p-1.5 text-neutral-500 hover:bg-neutral-100"
                aria-label="Close chat"
              >
                <X size={18} />
              </button>
            </div>
            <div className="h-[calc(85vh-44px)]">
              <ChatPanelInner {...props} variant="drawer" />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function ChatPanelInner({
  stage,
  messages,
  isSending,
  error,
  onSend,
  onRetry,
  onViewReport,
  variant,
}: Props & { variant: "docked" | "drawer" }) {
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const composerRef = useRef<HTMLTextAreaElement>(null);
  const composerWrapRef = useRef<HTMLFormElement>(null);
  const lastStageRef = useRef<Stage | null>(null);

  // Keep chatting after the case closes — kids often want to keep talking to ZED-4.
  const chatEnabled = stage === "explain" || stage === "solved";
  const visible = chatEnabled;

  // When entering explain, scroll to TOP so ZED's prompt is the first thing visible.
  useEffect(() => {
    if (stage === "explain" && lastStageRef.current !== "explain") {
      requestAnimationFrame(() => {
        scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
      });
      // Delay focus so the scroll lands on the prompt, not the input.
      const t = window.setTimeout(() => composerRef.current?.focus(), 700);
      lastStageRef.current = stage;
      return () => window.clearTimeout(t);
    }
    lastStageRef.current = stage;
  }, [stage]);

  // After a new message arrives, keep the composer in view so it visibly follows the conversation.
  useEffect(() => {
    if (!visible) return;
    if (messages.length <= 1) return; // don't override prompt-first scroll on initial mount
    requestAnimationFrame(() => {
      composerWrapRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    });
  }, [messages.length, visible]);

  const heightClass = variant === "drawer" ? "h-full" : "h-[min(78vh,720px)]";

  return (
    <div
      className={`flex ${heightClass} flex-col rounded-3xl bg-white shadow-[0_10px_40px_-12px_rgba(15,23,42,0.15)] ring-1 ring-neutral-100 transition-opacity ${
        visible ? "opacity-100" : "opacity-60"
      }`}
      aria-disabled={!chatEnabled}
    >
      <div className="flex items-start justify-between gap-2 border-b border-neutral-100 px-4 py-2">
        <div>
          <h2 className="text-xs font-bold tracking-wider text-neutral-700">AI GUIDE</h2>
          <div className="mt-0.5 flex items-center gap-2">
            <p className="text-[11px] text-neutral-500">
              {stage === "solved"
                ? "Case closed — great work, Detective!"
                : chatEnabled
                  ? "Explain your reasoning — type or speak."
                  : "Unlocks after you repair the logic."}
            </p>
            <SpeakButton
              text={
                stage === "solved"
                  ? "Case closed — great work, Detective!"
                  : chatEnabled
                    ? "Explain your reasoning — type or speak."
                    : "Unlocks after you repair the logic."
              }
            />
          </div>
        </div>
      </div>

      {/* Single scroll container — messages AND composer flow together */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3">
        {visible ? (
          <div className="space-y-3">
            {messages.map((m) => {
              const raw = m.parts.map((p) => (p.type === "text" ? p.text : "")).join("");
              const text = raw.replace(SOLVED_TOKEN, "").trim();
              if (!text) return null;
              const isUser = m.role === "user";
              return (
                <div key={m.id} className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}>
                  <div
                    className={`max-w-[88%] rounded-2xl px-4 py-2.5 text-sm ${
                      isUser ? "bg-[#1f2937] text-white" : "bg-[#eaf2ff] text-neutral-800"
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
            })}
            {isSending && (
              <div className="text-xs italic text-neutral-400">AI Guide is thinking…</div>
            )}
            {error && (
              <div
                className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700"
                role="alert"
              >
                <p>
                  {error.message.toLowerCase().includes("abort") ||
                  error.message.toLowerCase().includes("network") ||
                  error.message.toLowerCase().includes("fetch")
                    ? "ZED-4's reply was interrupted. You can try that evidence again."
                    : error.message || "ZED-4 could not reply right now. Please try again."}
                </p>
                {onRetry && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={onRetry}
                    className="mt-2 border-red-200 bg-background text-xs text-red-700 hover:bg-red-100 hover:text-red-800"
                  >
                    RETRY RESPONSE
                  </Button>
                )}
              </div>
            )}

            {/* INLINE composer — flows directly under the latest message */}
            {stage === "solved" && onViewReport && (
              <div className="pt-3">
                <button
                  type="button"
                  onClick={onViewReport}
                  className="w-full rounded-full bg-[#10b981] px-4 py-3 text-sm font-bold tracking-wider text-white transition-colors hover:bg-[#0ea371]"
                >
                  VIEW DIAGNOSTIC REPORT
                </button>
              </div>
            )}
            {(
              <form
                ref={composerWrapRef}
                className="pt-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  const text = input.trim();
                  if (!text || !chatEnabled || isSending) return;
                  onSend(text);
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
        ) : (
          <div className="flex h-full items-center justify-center text-center text-sm text-neutral-400">
            Complete the repair to unlock the chat.
          </div>
        )}
      </div>
    </div>
  );
}
