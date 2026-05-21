import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Mic, MicOff, RefreshCcw, Send, Sparkles } from "lucide-react";
import { speakText, useContinuousSpeech } from "@/lib/speech";
import type { CaseDef } from "@/lib/level2/types";

type Turn = { role: "child" | "zed"; text: string };

/**
 * Voice-first, LLM-driven chat between the child and ZED-4.
 * - Auto-speaks every ZED line.
 * - Mic always available; transcribed speech is sent on the next final chunk.
 * - No hints. After 3 child attempts, ZED gently teaches the answer, then
 *   the child taps "I get it" to move on.
 */
export function ConversationPanel({
  caseDef,
  seedZedLine,
  onComplete,
}: {
  caseDef: CaseDef;
  seedZedLine: string;
  onComplete: (stats: { reasoningScore: number; explanation: string }) => void;
}) {
  const [turns, setTurns] = useState<Turn[]>([{ role: "zed", text: seedZedLine }]);
  const [pending, setPending] = useState(false);
  const [typed, setTyped] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [helped, setHelped] = useState(false);
  const lockedRef = useRef(false);
  const lastZedRef = useRef<string>(seedZedLine);
  const logRef = useRef<HTMLDivElement>(null);
  const startRef = useRef<() => void>(() => {});
  const stopRef = useRef<() => void>(() => {});
  const seedRef = useRef(false);

  // Auto-speak the seed line ONCE per case
  useEffect(() => {
    if (seedRef.current) return;
    seedRef.current = true;
    speakText(seedZedLine);
  }, [seedZedLine]);

  const buildContext = () => {
    const { conceptKey, truth, zedClaim, visual } = caseDef;
    const litMap: Record<string, string> = {
      pizza: "pizza slices with toppings",
      circle: "glowing slices",
      bar: "lit parts",
      grid: "lit cells",
      set: "glowing objects",
    };
    return [
      `Concept: ${conceptKey}.`,
      `Visual: ${visual.kind} with ${visual.total} equal ${visual.kind === "set" ? "objects" : "parts"}; ${visual.selected.length} are ${litMap[visual.kind] ?? "selected"}.`,
      `ZED's wrong reading: ${zedClaim.numerator}/${zedClaim.denominator}. The correct answer: ${truth.numerator}/${truth.denominator}.`,
      `The child is teaching you why ${truth.numerator}/${truth.denominator} is correct.`,
    ].join(" ");
  };

  const buildHelperLine = (): string => {
    const { conceptKey, truth, visual } = caseDef;
    const total = visual.total;
    const lit = visual.selected.length;
    if (conceptKey === "numerator") {
      return `Ohh, I see now! Let me try, teacher. The top number is how many parts have something on them. ${lit} parts are lit, so the top number is ${lit}. The answer is ${lit} out of ${total}!`;
    }
    if (conceptKey === "denominator") {
      return `Ohh! I get it now. The bottom number is ALL the equal parts in the whole — even the empty ones. There are ${total} parts in all, so the bottom number is ${total}!`;
    }
    if (conceptKey === "unit-fraction") {
      return `Ohh! A unit fraction always has a 1 on top. That means only one piece is taken!`;
    }
    return `Ohh! I see now. The top number is how many are glowing (${truth.numerator}), and the bottom is ALL of them (${truth.denominator}). So it's ${truth.numerator} out of ${truth.denominator}!`;
  };

  const sendToZed = useCallback(
    async (childText: string) => {
      if (!childText.trim() || lockedRef.current || pending) return;
      try { stopRef.current(); } catch { /* */ }
      const next: Turn = { role: "child", text: childText.trim() };
      const history = [...turns, next];
      setTurns(history);
      setPending(true);
      try {
        const res = await fetch("/api/evaluate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: childText.trim(),
            mode: "explain",
            shapeContext: buildContext(),
            history: turns.slice(-10),
          }),
        });
        const data = (await res.json()) as {
          isCorrect: boolean;
          feedbackText: string;
          reasoningScore: number;
        };
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);

        if (data.isCorrect) {
          lockedRef.current = true;
          const reply = data.feedbackText;
          setTurns((p) => [...p, { role: "zed", text: reply }]);
          lastZedRef.current = reply;
          const score = newAttempts <= 1 ? 3 : newAttempts <= 2 ? 2 : 1;
          speakText(reply, () =>
            setTimeout(
              () => onComplete({ reasoningScore: score, explanation: childText.trim() }),
              600,
            ),
          );
          return;
        }

        // After 3 misses, ZED teaches the answer
        if (newAttempts >= 3 && !helped) {
          setHelped(true);
          const helper = buildHelperLine();
          setTurns((p) => [
            ...p,
            { role: "zed", text: data.feedbackText },
            { role: "zed", text: helper },
          ]);
          lastZedRef.current = helper;
          speakText(data.feedbackText, () => speakText(helper));
          return;
        }

        const reply = data.feedbackText;
        setTurns((p) => [...p, { role: "zed", text: reply }]);
        lastZedRef.current = reply;
        speakText(reply, () => {
          if (!lockedRef.current) {
            setTimeout(() => { try { startRef.current(); } catch { /* */ } }, 250);
          }
        });
      } catch {
        const fallback = "Thanks teacher! My ears got fuzzy. Can you say that again?";
        setTurns((p) => [...p, { role: "zed", text: fallback }]);
        lastZedRef.current = fallback;
        speakText(fallback);
      } finally {
        setPending(false);
      }
    },
    [turns, attempts, helped, pending, caseDef, onComplete],
  );

  const handleFinal = useCallback(
    (t: string) => {
      if (lockedRef.current || pending) return;
      const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9 ]/g, "").trim();
      const last = norm(lastZedRef.current);
      const got = norm(t);
      if (last && got && (last.startsWith(got.slice(0, 24)) || got.startsWith(last.slice(0, 24)))) return;
      void sendToZed(t);
    },
    [sendToZed, pending],
  );

  const { listening, interim, supported, start, stop } = useContinuousSpeech(handleFinal);
  startRef.current = start;
  stopRef.current = stop;

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: "smooth" });
  }, [turns, interim, pending]);

  useEffect(() => () => { try { stop(); } catch { /* */ } }, [stop]);

  const submitTyped = () => {
    if (!typed.trim() || pending) return;
    const t = typed.trim();
    setTyped("");
    void sendToZed(t);
  };

  const acceptHelp = () => {
    onComplete({ reasoningScore: 1, explanation: "(taught by ZED)" });
  };

  return (
    <div className="flex flex-col gap-3">
      <div
        ref={logRef}
        className="rounded-2xl border p-3 max-h-72 overflow-y-auto space-y-2"
        style={{
          background: "rgba(8,22,48,0.6)",
          borderColor: "color-mix(in oklab, #5fd0ff 25%, transparent)",
        }}
      >
        {turns.map((t, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className={`text-sm leading-snug px-3 py-2 rounded-xl max-w-[90%] ${t.role === "child" ? "ml-auto" : ""}`}
            style={{
              background:
                t.role === "child"
                  ? "rgba(125,244,198,0.18)"
                  : "rgba(95,208,255,0.18)",
              color: "#e6faff",
              borderLeft:
                t.role === "zed"
                  ? "3px solid color-mix(in oklab, #5fd0ff 60%, transparent)"
                  : undefined,
              borderRight:
                t.role === "child"
                  ? "3px solid color-mix(in oklab, #7df4c6 60%, transparent)"
                  : undefined,
            }}
          >
            <span className="label-eyebrow block mb-0.5 opacity-70">
              {t.role === "child" ? "You" : "ZED-4"}
            </span>
            {t.text}
          </motion.div>
        ))}
        {interim && (
          <div className="text-sm italic text-cyan-200/60 px-3 py-1 ml-auto max-w-[90%]">{interim}…</div>
        )}
        {pending && (
          <div className="flex items-center gap-2 text-xs text-cyan-200/70 px-3 py-1">
            <Loader2 className="w-3 h-3 animate-spin" /> ZED-4 is thinking…
          </div>
        )}
      </div>

      {helped && (
        <motion.button
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={acceptHelp}
          className="self-end inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold"
          style={{
            background: "linear-gradient(135deg, #7df4c6, #2bb789)",
            color: "#04162e",
          }}
        >
          <Sparkles className="w-4 h-4" /> I get it now
        </motion.button>
      )}

      <div className="flex items-center gap-2">
        {supported && (
          <motion.button
            onClick={listening ? stop : start}
            whileTap={{ scale: 0.95 }}
            animate={
              listening
                ? { boxShadow: ["0 0 0 0 rgba(95,208,255,0)", "0 0 0 10px rgba(95,208,255,0.25)", "0 0 0 0 rgba(95,208,255,0)"] }
                : {}
            }
            transition={listening ? { repeat: Infinity, duration: 1.4 } : {}}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold"
            style={{
              background: listening ? "#ffe98a" : "linear-gradient(135deg, #5fd0ff, #2a8ec9)",
              color: listening ? "#04162e" : "white",
            }}
          >
            {listening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            {listening ? "Listening…" : "Talk to ZED-4"}
          </motion.button>
        )}
        <input
          value={typed}
          onChange={(e) => setTyped(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") submitTyped(); }}
          placeholder={supported ? "…or type" : "Type your reply to ZED-4"}
          className="flex-1 px-3 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2"
          style={{
            background: "rgba(255,255,255,0.06)",
            color: "#e6faff",
            border: "1px solid color-mix(in oklab, #5fd0ff 25%, transparent)",
          }}
        />
        <button
          onClick={submitTyped}
          disabled={!typed.trim() || pending}
          className="inline-flex items-center gap-1 px-3 py-2.5 rounded-xl font-semibold text-sm disabled:opacity-40"
          style={{ background: "linear-gradient(135deg, #5fd0ff, #2a8ec9)", color: "white" }}
        >
          <Send className="w-3.5 h-3.5" /> Send
        </button>
        {turns.length > 1 && !lockedRef.current && !helped && (
          <button
            onClick={() => { setTurns([{ role: "zed", text: seedZedLine }]); setAttempts(0); }}
            title="Reset"
            className="inline-flex items-center px-2 py-2.5 rounded-xl text-xs"
            style={{
              color: "#e6faff",
              border: "1px solid color-mix(in oklab, #5fd0ff 25%, transparent)",
            }}
          >
            <RefreshCcw className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
