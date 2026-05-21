import { Bot } from "lucide-react";
import { motion } from "framer-motion";
import { ReplayInstructionsButton } from "./ReplayInstructionsButton";

/**
 * Persistent bottom dialogue dock — always shows ZED-4's current line
 * with captions. Tap-to-replay voice. Never auto-plays mid-flow.
 */
export function DialogueDock({
  line,
  replayText,
}: {
  line: string;
  /** What the replay button reads aloud (usually = line). */
  replayText?: string;
}) {
  return (
    <div
      className="rounded-2xl border p-4 sm:p-5 backdrop-blur-md"
      style={{
        background: "rgba(8, 22, 48, 0.7)",
        borderColor: "color-mix(in oklab, #5fd0ff 25%, transparent)",
        boxShadow: "0 10px 40px -20px rgba(95, 208, 255, 0.4)",
      }}
    >
      <div className="flex items-start gap-3">
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{
            background: "linear-gradient(135deg, #4dd2ff 0%, #1e7fbf 100%)",
            boxShadow: "0 0 20px rgba(77, 210, 255, 0.5)",
          }}
        >
          <Bot className="w-5 h-5 text-white" />
        </motion.div>
        <div className="flex-1 min-w-0">
          <p className="label-eyebrow text-cyan-300/80 mb-1">ZED-4 · LIVE</p>
          <p
            className="text-base sm:text-lg leading-relaxed text-cyan-50"
            aria-live="polite"
          >
            {line}
          </p>
        </div>
        <ReplayInstructionsButton text={replayText ?? line} compact />
      </div>
    </div>
  );
}
