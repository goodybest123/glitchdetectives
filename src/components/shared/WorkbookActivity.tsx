import type { ReactNode } from "react";
import type { Stage } from "@/components/case01/CaseStepper";
import { SpeakButton } from "@/components/case01/SpeakButton";

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
    <section className="relative mb-5 overflow-hidden rounded-2xl border-2 border-dashed border-border bg-background px-4 py-4 sm:px-5">
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-40" />
      <div className="relative flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-energy text-xl shadow-sm">
          {isDetect ? "🔎" : "🛠️"}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="label-eyebrow text-muted-foreground">
              {emoji} {title}
            </span>
            <span className="rounded-full bg-primary px-2.5 py-1 text-[10px] font-black tracking-widest text-primary-foreground">
              {isDetect ? "DETECT" : "REPAIR"}
            </span>
          </div>
          <div className="mt-2 flex items-start gap-2">
            <p className="flex-1 text-sm font-bold leading-relaxed text-foreground sm:text-base">
              {isDetect ? "Circle the glitch: " : `${toolName}: `}
              <span className="font-medium">{instruction}</span>
            </p>
            <SpeakButton text={`${isDetect ? "Detect" : toolName}. ${instruction}`} />
          </div>
        </div>
      </div>
      <div className="relative mt-3 flex items-center gap-2 text-[11px] font-semibold text-muted-foreground">
        <span className="h-px flex-1 border-t border-dashed border-border" />
        {isDetect ? "Tap the exact part—not the whole picture" : "Watch the model change as you work"}
        <span className="h-px flex-1 border-t border-dashed border-border" />
      </div>
    </section>
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