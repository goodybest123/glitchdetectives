/**
 * `LevelCasePicker` — the four-case menu for one level.
 *
 * Cases are complete investigations, never "sub-cases". Progression is
 * simple for now: the next case opens when the previous one is closed, and
 * the data model keeps room to loosen that later.
 */
import { SpeakButton } from "@/components/case01/SpeakButton";
import type { CaseDefinition } from "./types";

type Props = {
  levelNumber: string;
  levelTitle: string;
  concept: string;
  cases: CaseDefinition[];
  solved: Record<string, boolean>;
  onPick: (id: string) => void;
  /** Key used in the solved map for each case. */
  idFor: (definition: CaseDefinition) => string;
};

const PROGRESSION_LABEL: Record<CaseDefinition["progression"], string> = {
  discover: "DISCOVER THE IDEA",
  transfer: "TRANSFER THE IDEA",
  represent: "REPRESENT THE IDEA",
  reason: "REASON ABOUT THE IDEA",
};

export function LevelCasePicker({
  levelNumber,
  levelTitle,
  concept,
  cases,
  solved,
  onPick,
  idFor,
}: Props) {
  const intro = `Level ${levelNumber}. ${levelTitle}. Four investigations. Open them in order.`;
  return (
    <section className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-10">
      <div className="mb-6 text-center">
        <p className="label-eyebrow text-primary">LEVEL {levelNumber}</p>
        <h2 className="mt-1 text-2xl font-black tracking-tight text-foreground sm:text-3xl">
          {levelTitle}
        </h2>
        <div className="mt-2 flex items-center justify-center gap-2">
          <p className="text-sm text-muted-foreground">
            {concept} · four investigations, opened in order.
          </p>
          <SpeakButton text={intro} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {cases.map((definition, index) => {
          const id = idFor(definition);
          const isSolved = !!solved[id];
          const previous = index === 0 ? null : idFor(cases[index - 1]!);
          const locked = previous ? !solved[previous] : false;
          return (
            <button
              key={id}
              type="button"
              disabled={locked}
              onClick={() => onPick(id)}
              className={`group relative flex flex-col items-start gap-2 rounded-2xl border-2 p-5 text-left transition-all ${
                locked
                  ? "cursor-not-allowed border-border bg-secondary/50 opacity-70"
                  : "border-border bg-background hover:-translate-y-1 hover:border-primary hover:shadow-lg"
              }`}
            >
              {isSolved && (
                <span
                  aria-label="Case closed"
                  className="absolute right-3 top-3 inline-flex h-7 w-7 items-center justify-center rounded-full bg-success text-sm font-black text-success-foreground"
                >
                  ✓
                </span>
              )}
              <span className="text-4xl" aria-hidden>
                {definition.emoji}
              </span>
              <span className="label-eyebrow text-muted-foreground">
                CASE {definition.number} · {PROGRESSION_LABEL[definition.progression]}
              </span>
              <span className="text-lg font-black text-foreground">{definition.title}</span>
              <span className="text-sm text-muted-foreground">{definition.subtitle}</span>
              <span className="mt-2 text-xs font-black tracking-wider text-primary">
                {locked ? "CLOSE THE CASE BEFORE THIS ONE" : isSolved ? "REPLAY →" : "OPEN CASE →"}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
