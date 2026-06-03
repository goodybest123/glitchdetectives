import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Volume2, X } from "lucide-react";
import { speakText } from "@/lib/speech";

export type BuilderChip = {
  id: string;
  text: string;
  /** Marks a chip whose text contains a target concept keyword. */
  isStrong?: boolean;
};

export type BuilderConfig = {
  stem: string;
  chips: BuilderChip[];
};

type Props = {
  config: BuilderConfig;
  disabled?: boolean;
  onSubmit: (text: string) => void;
};

export function SentenceBuilder({ config, disabled, onSubmit }: Props) {
  const [selected, setSelected] = useState<string[]>([]);

  const selectedChips = selected
    .map((id) => config.chips.find((c) => c.id === id))
    .filter((c): c is BuilderChip => Boolean(c));

  const sentence = selectedChips.map((c) => c.text).join(", ");
  const hasStrong = selectedChips.some((c) => c.isStrong);
  const canSend = selectedChips.length > 0 && hasStrong && !disabled;

  function toggle(id: string) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  function submit() {
    if (!canSend) return;
    const full = `${config.stem} ${sentence}.`;
    onSubmit(full);
  }

  return (
    <div className="space-y-4">
      {/* Live sentence preview */}
      <div className="rounded-xl border border-border bg-muted/40 p-4 min-h-[72px]">
        <span className="label-eyebrow text-muted-foreground">YOUR SENTENCE</span>
        <p className="mt-1.5 text-base leading-relaxed">
          <span className="text-foreground">{config.stem}</span>{" "}
          <AnimatePresence mode="popLayout">
            {selectedChips.length === 0 ? (
              <motion.span
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-muted-foreground/70 italic"
              >
                tap chips below to build your answer…
              </motion.span>
            ) : (
              selectedChips.map((c, i) => (
                <motion.span
                  key={c.id}
                  layout
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="inline-flex items-center gap-1 mx-0.5 px-2 py-0.5 rounded-md bg-primary/15 text-foreground font-medium"
                >
                  {c.text}{i < selectedChips.length - 1 ? "," : "."}
                </motion.span>
              ))
            )}
          </AnimatePresence>
        </p>
      </div>

      {/* Chip grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {config.chips.map((chip) => {
          const isOn = selected.includes(chip.id);
          return (
            <motion.button
              key={chip.id}
              type="button"
              onClick={() => toggle(chip.id)}
              disabled={disabled}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.12 }}
              className={`group flex items-center justify-between gap-2 text-left rounded-xl border px-3 py-3 text-sm transition ${
                isOn
                  ? "border-primary bg-primary/10 text-foreground font-medium"
                  : "border-border bg-card text-foreground hover:border-primary/60"
              } disabled:opacity-50`}
            >
              <span className="flex items-center gap-2">
                <span
                  aria-hidden
                  className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 ${
                    isOn ? "bg-primary border-primary" : "border-border"
                  }`}
                >
                  {isOn && <X className="w-3 h-3 text-primary-foreground rotate-45" />}
                </span>
                <span>{chip.text}</span>
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  speakText(chip.text);
                }}
                className="opacity-0 group-hover:opacity-100 transition text-muted-foreground hover:text-primary"
                aria-label={`Hear: ${chip.text}`}
              >
                <Volume2 className="w-3.5 h-3.5" />
              </button>
            </motion.button>
          );
        })}
      </div>

      {/* Send */}
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">
          {hasStrong || selectedChips.length === 0
            ? "Pick the chips that explain your thinking."
            : "Add a chip that names the big idea (like equal or fair)."}
        </p>
        <button
          type="button"
          onClick={submit}
          disabled={!canSend}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition"
        >
          Send to ZED-4
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
