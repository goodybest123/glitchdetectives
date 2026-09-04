/**
 * Child-facing case reflection.
 *
 * Shown at the end of an investigation instead of a score. It names the
 * detective skill, lists what the child actually did (from recorded
 * evidence), and points to the parent report — nothing is ranked or graded.
 */
import { Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { SpeakButton } from "@/components/case01/SpeakButton";
import type { CaseReflection } from "@/lib/reasoning";

export function CaseReflectionCard({
  reflection,
  onTryAnother,
}: {
  reflection: CaseReflection;
  onTryAnother?: () => void;
}) {
  const spoken = [
    reflection.title,
    `Detective skill: ${reflection.skill}`,
    ...reflection.observations,
    reflection.closing,
  ].join(". ");

  return (
    <section className="rounded-3xl border-2 border-success bg-card p-6 shadow-sm sm:p-8">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="label-eyebrow text-success">CASE CLOSED</p>
          <h2 className="mt-2 text-3xl font-black text-foreground">{reflection.title}</h2>
        </div>
        <SpeakButton text={spoken} size="md" />
      </div>

      <div className="mt-5 rounded-2xl bg-secondary p-4">
        <p className="label-eyebrow text-muted-foreground">DETECTIVE SKILL</p>
        <p className="mt-2 text-xl font-black text-foreground">{reflection.skill}</p>
      </div>

      <ul className="mt-5 grid gap-2 sm:grid-cols-2">
        {reflection.observations.map((observation) => (
          <li key={observation} className="flex items-start gap-2 text-sm font-semibold text-foreground">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden />
            {observation}
          </li>
        ))}
      </ul>

      <p className="mt-5 text-sm leading-relaxed text-muted-foreground">{reflection.closing}</p>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          to="/play/report"
          className="rounded-full bg-primary px-5 py-3 text-xs font-black tracking-wider text-primary-foreground"
        >
          OPEN THE DETECTIVE'S REPORT
        </Link>
        {onTryAnother && (
          <button
            type="button"
            onClick={onTryAnother}
            className="rounded-full border border-border px-5 py-3 text-xs font-black tracking-wider text-foreground"
          >
            CHOOSE ANOTHER CASE
          </button>
        )}
      </div>
    </section>
  );
}
