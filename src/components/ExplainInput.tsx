import { Mic, Send, Volume2, Keyboard, Puzzle } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { useSpeechToText, speakText } from "@/lib/speech";
import { SentenceBuilder, type BuilderConfig } from "./SentenceBuilder";

type Mode = "voice" | "type" | "build";

type Props = {
  placeholder: string;
  onSubmit: (text: string, modality: Mode) => void;
  disabled?: boolean;
  promptText?: string;
  builder?: BuilderConfig;
};

export function ExplainInput({ placeholder, onSubmit, disabled, promptText, builder }: Props) {
  const [text, setText] = useState("");
  const [mode, setMode] = useState<Mode>(builder ? "build" : "type");
  const { listening, supported, start, stop } = useSpeechToText((t) =>
    setText((prev) => (prev ? prev + " " + t : t)),
  );

  const submitText = (m: Mode) => {
    if (!text.trim() || disabled) return;
    onSubmit(text.trim(), m);
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3 gap-2 flex-wrap">
        <span className="label-eyebrow text-muted-foreground">YOUR ANSWER</span>
        {promptText && (
          <button
            onClick={() => speakText(promptText)}
            className="text-muted-foreground hover:text-primary transition"
            aria-label="Hear question again"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Modality tabs */}
      <div role="tablist" className="flex gap-1 p-1 rounded-xl bg-muted/50 mb-3 text-xs font-medium">
        {builder && (
          <TabButton
            label="Build"
            icon={<Puzzle className="w-3.5 h-3.5" />}
            active={mode === "build"}
            onClick={() => setMode("build")}
          />
        )}
        <TabButton
          label="Type"
          icon={<Keyboard className="w-3.5 h-3.5" />}
          active={mode === "type"}
          onClick={() => setMode("type")}
        />
        {supported && (
          <TabButton
            label="Voice"
            icon={<Mic className="w-3.5 h-3.5" />}
            active={mode === "voice"}
            onClick={() => setMode("voice")}
          />
        )}
      </div>

      {mode === "build" && builder && (
        <SentenceBuilder
          config={builder}
          disabled={disabled}
          onSubmit={(t) => onSubmit(t, "build")}
        />
      )}

      {mode === "type" && (
        <>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            rows={3}
            className="w-full resize-none bg-transparent text-foreground placeholder:text-muted-foreground/60 outline-none text-lg"
          />
          <div className="flex items-center justify-end mt-2">
            <button
              onClick={() => submitText("type")}
              disabled={disabled || !text.trim()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition"
            >
              Send to ZED-4
              <Send className="w-4 h-4" />
            </button>
          </div>
        </>
      )}

      {mode === "voice" && supported && (
        <div className="space-y-3">
          <div className="rounded-xl border border-border bg-muted/30 p-3 min-h-[72px] text-base">
            {text || (
              <span className="text-muted-foreground/70 italic">Tap the mic and explain out loud…</span>
            )}
          </div>
          <div className="flex items-center justify-between gap-3">
            <motion.button
              onClick={listening ? stop : start}
              disabled={disabled}
              whileTap={{ scale: 0.95 }}
              animate={listening ? { scale: [1, 1.08, 1] } : { scale: 1 }}
              transition={listening ? { repeat: Infinity, duration: 1 } : {}}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition ${
                listening
                  ? "bg-glitch text-glitch-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-accent"
              }`}
            >
              <Mic className="w-4 h-4" />
              {listening ? "Listening..." : "Tap to talk"}
            </motion.button>
            <button
              onClick={() => submitText("voice")}
              disabled={disabled || !text.trim()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition"
            >
              Send to ZED-4
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function TabButton({
  label,
  icon,
  active,
  onClick,
}: {
  label: string;
  icon: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg transition ${
        active
          ? "bg-card text-foreground shadow-sm"
          : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
