import { Mic, Send, Volume2 } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { useSpeechToText, speakText } from "@/lib/speech";

type Props = {
  placeholder: string;
  onSubmit: (text: string) => void;
  disabled?: boolean;
  promptText?: string;
};

export function ExplainInput({ placeholder, onSubmit, disabled, promptText }: Props) {
  const [text, setText] = useState("");
  const { listening, supported, start, stop } = useSpeechToText((t) =>
    setText((prev) => (prev ? prev + " " + t : t)),
  );

  const submit = () => {
    if (!text.trim() || disabled) return;
    onSubmit(text.trim());
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
      <div className="flex items-center justify-between mb-2">
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
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        rows={3}
        className="w-full resize-none bg-transparent text-foreground placeholder:text-muted-foreground/60 outline-none text-lg"
      />
      <div className="flex items-center justify-between gap-3 mt-3">
        {supported ? (
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
        ) : (
          <span className="text-xs text-muted-foreground">Mic not available — type your answer</span>
        )}
        <button
          onClick={submit}
          disabled={disabled || !text.trim()}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition"
        >
          Send to ZED-4
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
