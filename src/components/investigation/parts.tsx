/**
 * Small shared UI pieces every investigation uses, lifted straight from the
 * Level 01 master cases so the six levels look and behave identically.
 */
import type { ReactNode } from "react";
import { Check, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SpeakButton } from "@/components/case01/SpeakButton";

export const CASE_STEPS = ["brief", "investigate", "detect", "repair", "explain"] as const;
export type CaseStep = (typeof CASE_STEPS)[number] | "solved";

/** The always-visible "where am I" indicator. */
export function CaseProgress({ current }: { current: CaseStep }) {
  const active = current === "solved" ? CASE_STEPS.length : CASE_STEPS.indexOf(current);
  return (
    <ol
      className="grid grid-cols-5 gap-1 rounded-2xl border border-border bg-card p-3 text-center"
      aria-label="Case progress"
    >
      {CASE_STEPS.map((step, index) => (
        <li
          key={step}
          className={`rounded-xl px-1 py-2 text-[10px] font-black uppercase tracking-wider ${
            index === active
              ? "bg-primary text-primary-foreground"
              : index < active
                ? "bg-secondary text-foreground"
                : "text-muted-foreground"
          }`}
        >
          {index < active ? "✓ " : ""}
          {step === "brief" ? "Brief" : step}
        </li>
      ))}
    </ol>
  );
}

export function StageIntro({
  eyebrow,
  title,
  text,
}: {
  eyebrow: string;
  title: string;
  text: string;
}) {
  return (
    <section className="flex items-start gap-3 border-b border-border pb-4">
      <div className="flex-1">
        <p className="label-eyebrow text-primary">{eyebrow}</p>
        <h2 className="mt-1 text-2xl font-black text-foreground sm:text-3xl">{title}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{text}</p>
      </div>
      <SpeakButton text={`${eyebrow}. ${title}. ${text}`} size="md" />
    </section>
  );
}

/** Layered clues. Never reveals the answer, never counts as failure. */
export function HintBox({
  hints,
  hintIndex,
  onHint,
}: {
  hints: readonly string[];
  hintIndex: number;
  onHint: () => void;
}) {
  const text = hintIndex > 0 ? hints[hintIndex - 1] : "Need a clue? You can investigate first.";
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-secondary p-3">
      <div className="flex flex-1 items-start gap-2">
        <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
        <p className="text-sm text-foreground">{text}</p>
        <SpeakButton text={text} />
      </div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onHint}
        disabled={hintIndex >= hints.length}
      >
        <Lightbulb className="h-4 w-4" aria-hidden /> NEED A CLUE?
      </Button>
    </div>
  );
}

export function PrimaryNext({ children, onClick }: { children: ReactNode; onClick: () => void }) {
  return (
    <div className="flex justify-end">
      <Button type="button" onClick={onClick} size="lg" className="font-black">
        {children}
      </Button>
    </div>
  );
}

export function ApplyChallenge({
  text,
  complete,
  onComplete,
}: {
  text: string;
  complete: boolean;
  onComplete: () => void;
}) {
  return (
    <section className="rounded-2xl border-2 border-primary bg-card p-5 shadow-sm sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="label-eyebrow text-muted-foreground">REAL-WORLD CHALLENGE</p>
          <h2 className="mt-1 text-2xl font-black text-foreground">DETECTIVE CHALLENGE</h2>
        </div>
        <SpeakButton text={`Detective challenge. ${text}`} size="md" />
      </div>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{text}</p>
      <Button type="button" onClick={onComplete} disabled={complete} className="mt-4 font-black">
        {complete ? (
          <>
            <Check className="h-4 w-4" aria-hidden /> CHALLENGE LOGGED
          </>
        ) : (
          "I TRIED THE CHALLENGE"
        )}
      </Button>
    </section>
  );
}

/** CASE CLOSED banner with the case's Detective Skill. */
export function CaseClosedBanner({
  zedWasCorrect,
  skill,
}: {
  zedWasCorrect: boolean;
  skill: string;
}) {
  const headline = zedWasCorrect ? "You checked the evidence!" : "You caught the glitch!";
  return (
    <section className="rounded-2xl border-2 border-success bg-card p-5 shadow-sm">
      <p className="label-eyebrow text-muted-foreground">CASE CLOSED</p>
      <div className="mt-1 flex items-start justify-between gap-3">
        <h2 className="text-2xl font-black text-foreground">{headline}</h2>
        <SpeakButton text={`Case closed. ${headline}. Detective skill. ${skill}`} size="md" />
      </div>
      <div className="mt-4 rounded-xl border border-border bg-secondary p-4">
        <p className="label-eyebrow text-muted-foreground">DETECTIVE SKILL</p>
        <p className="mt-1 text-lg font-black text-foreground">{skill}</p>
      </div>
    </section>
  );
}
