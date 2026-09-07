/**
 * `/play/case-03` — LEVEL 03: The Shape Shifters.
 *
 * Four investigations on the shared case engine
 * (`src/components/investigation`):
 * CASE BRIEF → INVESTIGATE → DETECT → REPAIR → EXPLAIN → CASE CLOSED.
 *
 * The level establishes equivalence visually — same whole, same amount,
 * different pieces. The multiplication rule and simplifying are deliberately
 * left out; those belong after this idea is secure.
 */
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { InvestigationCase } from "@/components/investigation/InvestigationCase";
import { LevelCasePicker } from "@/components/investigation/LevelCasePicker";
import { SpeakButton } from "@/components/case01/SpeakButton";
import { SoundToggle } from "@/components/shared/SoundToggle";
import { ReadPageButton } from "@/components/shared/ReadPageButton";
import { useCaseProgress } from "@/hooks/useProgress";
import { LEVEL_03_CASES, LEVEL_03_ORDER, type Level03CaseId } from "@/components/level03/cases";

export const Route = createFileRoute("/play/case-03")({
  head: () => ({
    meta: [
      { title: "Level 03: The Shape Shifters — Glitch Detectives" },
      {
        name: "description",
        content:
          "Four hands-on investigations where a young detective discovers that fractions can look different and still show exactly the same amount.",
      },
      { property: "og:title", content: "Level 03: The Shape Shifters — Glitch Detectives" },
      {
        property: "og:description",
        content:
          "Compare the amount, not the numbers. Investigate ZED-4's equivalent-fraction glitches with models and a number line.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: LevelThreePage,
});

function LevelThreePage() {
  const [activeCase, setActiveCase] = useState<Level03CaseId | null>(null);
  const { solved, markSolved } = useCaseProgress("case-03", LEVEL_03_ORDER);
  const levelComplete = LEVEL_03_ORDER.every((id) => solved[id]);

  if (!activeCase) {
    return (
      <PageShell title="Level 03: The Shape Shifters">
        <div className="space-y-5">
          {levelComplete && <LevelClosed />}
          <LevelCasePicker
            levelNumber="03"
            levelTitle="The Shape Shifters"
            concept="When different fractions mean the same amount"
            cases={LEVEL_03_ORDER.map((id) => LEVEL_03_CASES[id])}
            solved={solved}
            idFor={(definition) =>
              LEVEL_03_ORDER.find((id) => LEVEL_03_CASES[id].caseId === definition.caseId) ?? ""
            }
            onPick={(id) => setActiveCase(id as Level03CaseId)}
          />
        </div>
      </PageShell>
    );
  }

  const definition = LEVEL_03_CASES[activeCase];
  return (
    <PageShell title={`Level 03 · ${definition.title}`}>
      <InvestigationCase
        key={activeCase}
        definition={definition}
        onSolved={() => markSolved(activeCase)}
        onBackToPicker={() => setActiveCase(null)}
      />
    </PageShell>
  );
}

/** Shown once all four investigations in the level are closed. */
function LevelClosed() {
  const idea =
    "Fractions can have different numbers and different-sized pieces while still showing the same amount of the same whole.";
  const skills = [
    "03.01 — Compare the amount. You learned not to judge a fraction by its numbers alone.",
    "03.02 — Look for the same amount. You found equivalent fractions in a new situation.",
    "03.03 — Track the change. You saw what happens when each part is split into smaller equal pieces.",
    "03.04 — Prove your claim. You used models and a number line as evidence.",
  ];
  return (
    <section className="rounded-3xl border-2 border-success bg-card p-6 shadow-sm">
      <p className="label-eyebrow text-muted-foreground">LEVEL CLOSED</p>
      <div className="mt-1 flex items-start justify-between gap-3">
        <h2 className="text-2xl font-black text-foreground sm:text-3xl">
          You solved the Shape Shifter mystery!
        </h2>
        <SpeakButton
          text={`Level closed. You solved the Shape Shifter mystery. Different pieces. Different numbers. Same amount. ${idea}`}
          size="md"
        />
      </div>
      <p className="mt-4 text-lg font-black tracking-tight text-foreground">
        DIFFERENT PIECES. DIFFERENT NUMBERS. SAME AMOUNT.
      </p>
      <p className="mt-2 max-w-2xl text-base leading-relaxed text-muted-foreground">{idea}</p>
      <ul className="mt-4 space-y-1 text-sm font-semibold text-foreground">
        {skills.map((skill) => (
          <li key={skill}>{skill}</li>
        ))}
      </ul>
      <div className="mt-5 flex flex-wrap gap-3">
        <Link
          to="/play/report"
          className="rounded-xl bg-primary px-5 py-3 text-sm font-black text-primary-foreground"
        >
          VIEW DETECTIVE'S REPORT
        </Link>
        <Link
          to="/play/case-04"
          className="rounded-xl border-2 border-border px-5 py-3 text-sm font-black text-foreground"
        >
          CONTINUE TO NEXT LEVEL
        </Link>
      </div>
    </section>
  );
}

function PageShell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-3 py-2.5 sm:px-6 sm:py-3 lg:px-10">
          <Link
            to="/play"
            className="text-xs font-medium text-muted-foreground transition-colors hover:text-foreground sm:text-sm"
          >
            ← Back
          </Link>
          <h1 className="truncate px-2 text-sm font-bold tracking-tight text-foreground sm:text-base">
            {title}
          </h1>
          <div className="flex w-[80px] items-center justify-end sm:w-[120px]">
            <SoundToggle />
          </div>
        </div>
      </header>
      <div data-readable className="mx-auto w-full max-w-7xl px-3 py-3 sm:px-6 sm:py-5 lg:px-10">
        <div className="mb-3 flex justify-end">
          <ReadPageButton />
        </div>
        {children}
      </div>
    </main>
  );
}
