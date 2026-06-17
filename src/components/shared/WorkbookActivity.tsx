import { useEffect, useState, type ReactNode } from "react";
import type { Stage } from "@/components/case01/CaseStepper";
import { SpeakButton } from "@/components/case01/SpeakButton";
import { Button } from "@/components/ui/button";

type PromptProps = {
  stage: Stage;
  emoji: string;
  title: string;
  detectInstruction: string;
  repairInstruction: string;
  toolName: string;
};

export function WorkbookActivityPrompt({
  stage,
  emoji,
  title,
  detectInstruction,
  repairInstruction,
  toolName,
}: PromptProps) {
  if (stage !== "detect" && stage !== "repair") return null;

  const isDetect = stage === "detect";
  const instruction = isDetect ? detectInstruction : repairInstruction;

  return (
    <section className="relative mb-3 overflow-hidden rounded-xl border-2 border-dashed border-border bg-background px-3 py-2.5 sm:px-4">
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-40" />
      <div className="relative flex items-start gap-2.5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-energy text-base shadow-sm">
          {isDetect ? "🔎" : "🛠️"}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="label-eyebrow text-[10px] text-muted-foreground">
              {emoji} {title}
            </span>
            <span className="rounded-full bg-primary px-2 py-0.5 text-[9px] font-black tracking-widest text-primary-foreground">
              {isDetect ? "DETECT" : "REPAIR"}
            </span>
          </div>
          <div className="mt-1 flex items-start gap-2">
            <p className="flex-1 text-xs font-bold leading-snug text-foreground sm:text-sm">
              {isDetect ? "Circle the glitch: " : `${toolName}: `}
              <span className="font-medium">{instruction}</span>
            </p>
            <SpeakButton text={`${isDetect ? "Detect" : toolName}. ${instruction}`} />
          </div>
        </div>
      </div>
    </section>
  );
}

export type GlitchChoice = {
  label: string;
  correct: boolean;
};

type GlitchChoicesProps = {
  choices: GlitchChoice[];
  unlocked: boolean;
  onUnlock: () => void;
  onCorrect?: () => void;
};

export function WorkbookGlitchChoices({ choices, unlocked, onUnlock, onCorrect }: GlitchChoicesProps) {
  const [wrongChoice, setWrongChoice] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [pendingChoice, setPendingChoice] = useState<GlitchChoice | null>(null);

  useEffect(() => {
    if (!pendingChoice) return;
    const timer = window.setTimeout(() => {
      if (pendingChoice.correct) {
        setWrongChoice(null);
        onUnlock();
        onCorrect?.();
      } else {
        setWrongChoice(pendingChoice.label);
        setAttempts((current) => current + 1);
      }
      setPendingChoice(null);
    }, 900);
    return () => window.clearTimeout(timer);
  }, [pendingChoice, onUnlock, onCorrect]);


  const supportiveFeedback =
    attempts <= 1
      ? "Good detective thinking—check what ZED-4’s numbers or picture actually show, then try again."
      : attempts === 2
        ? "You’re getting closer. Compare each option with the exact part that does not match."
        : "Keep going, Detective. Cross out what is true, then choose the statement that explains the mistake.";
  const readAllText = `Detective check. What is the glitch? ${choices
    .map((choice, index) => `Option ${String.fromCharCode(65 + index)}. ${choice.label}`)
    .join(" ")}`;

  return (
    <section className="mb-5 rounded-2xl border-2 border-dashed border-border bg-secondary/50 p-4 sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="label-eyebrow text-muted-foreground">Detective check</p>
          <h3 className="mt-1 text-base font-black text-foreground">What is the glitch?</h3>
        </div>
        <div className="flex items-center gap-2">
          <SpeakButton text={readAllText} size="md" rate={0.75} />
          <span className="rounded-full bg-background px-3 py-1 text-[10px] font-black tracking-wider text-muted-foreground ring-1 ring-border">
            CHOOSE ONE
          </span>
        </div>
      </div>
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {choices.map((choice, index) => {
          const isWrong = wrongChoice === choice.label;
          const isChecking = pendingChoice?.label === choice.label;
          return (
            <div key={choice.label} className="flex items-stretch gap-2">
              <Button
                type="button"
                variant={unlocked && choice.correct ? "default" : "outline"}
                disabled={unlocked || pendingChoice !== null}
                onClick={() => {
                  setWrongChoice(null);
                  setPendingChoice(choice);
                }}
                aria-pressed={isWrong}
                className={`h-auto min-h-12 flex-1 justify-start whitespace-normal px-4 py-3 text-left font-bold ${isWrong ? "border-energy bg-energy/10 text-foreground" : ""}`}
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-black text-secondary-foreground">
                  {isChecking ? "…" : isWrong ? "↻" : String.fromCharCode(65 + index)}
                </span>
                {choice.label}
                {isChecking && <span className="ml-auto text-[10px] font-black tracking-wider">THINKING…</span>}
              </Button>
              <SpeakButton
                text={`Option ${String.fromCharCode(65 + index)}. ${choice.label}`}
                size="md"
                rate={0.75}
                className="my-auto shrink-0"
              />
            </div>
          );
        })}
      </div>
      <div className={`mt-3 rounded-xl px-3 py-2 text-center text-xs font-bold ${wrongChoice ? "bg-energy/15 text-foreground" : "text-muted-foreground"}`} aria-live="polite">
        {pendingChoice
          ? "Take a moment, Detective… let’s check your thinking."
          : wrongChoice
          ? `Pencil note: ${supportiveFeedback}`
          : unlocked
            ? "✓ Good thinking! Now tap that exact glitch in the picture."
            : "Pick an answer to unlock the picture."}
      </div>
    </section>
  );
}

type RepairSubmitProps = {
  ready: boolean;
  onSubmit: () => void;
};

export function WorkbookRepairSubmit({ ready, onSubmit }: RepairSubmitProps) {
  return (
    <div className="mt-4 border-t border-dashed border-border pt-4 text-center">
      <Button type="button" onClick={onSubmit} disabled={!ready} className="min-h-11 px-6 font-black">
        ✓ Submit repaired logic
      </Button>
      <p className="mt-2 text-xs font-medium text-muted-foreground" aria-live="polite">
        {ready ? "Your repair is ready. Submit it when you are sure." : "Finish the repair before submitting your logic."}
      </p>
    </div>
  );
}

type RepairProps = {
  toolName: string;
  instruction: string;
  hint?: string;
  progress?: string;
  children: ReactNode;
};

export function WorkbookRepairFrame({
  toolName,
  instruction,
  hint,
  progress,
  children,
}: RepairProps) {
  return (
    <section className="mt-7 overflow-hidden rounded-2xl border-2 border-primary bg-card shadow-sm">
      <header className="flex items-start justify-between gap-3 border-b border-border bg-secondary px-4 py-3 sm:px-5">
        <div>
          <p className="label-eyebrow text-muted-foreground">Repair tool</p>
          <h3 className="mt-0.5 text-base font-black text-card-foreground">🛠️ {toolName}</h3>
          <p className="mt-1 text-xs text-muted-foreground">{instruction}</p>
        </div>
        {progress && (
          <span className="shrink-0 rounded-full bg-background px-3 py-1 text-[10px] font-black tracking-wider text-foreground ring-1 ring-border">
            {progress}
          </span>
        )}
      </header>
      <div className="relative p-4 sm:p-5">
        <div className="pointer-events-none absolute inset-0 grid-bg opacity-25" />
        <div className="relative">{children}</div>
        {hint && (
          <p className="relative mt-4 border-t border-dashed border-border pt-3 text-center text-xs font-medium italic text-muted-foreground">
            Pencil note: {hint}
          </p>
        )}
      </div>
    </section>
  );
}