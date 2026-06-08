import { Link } from "@tanstack/react-router";
import { SpeakButton } from "./SpeakButton";

type Props = {
  studentQuotes: string[];
  turnCount: number;
};

export function DiagnosticReport({ studentQuotes, turnCount }: Props) {
  const evidenceStatement =
    [...studentQuotes].sort((a, b) => b.length - a.length)[0] ?? "";

  const thanks =
    "Thank you for teaching me, Detective. You helped me learn what fair sharing really means.";

  const handlePrint = () => {
    if (typeof window !== "undefined") window.print();
  };

  return (
    <section
      id="diagnostic-report"
      className="mt-8 rounded-3xl bg-white p-6 sm:p-10 shadow-[0_10px_40px_-12px_rgba(15,23,42,0.15)] ring-1 ring-neutral-100 print:shadow-none print:ring-0"
    >
      <header className="flex items-start justify-between gap-4 border-b border-neutral-100 pb-5">
        <div>
          <div className="text-xs font-bold tracking-[0.2em] text-[#10b981]">
            CASE CLOSED
          </div>
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-neutral-900">
            Diagnostic Report
          </h2>
        </div>
        <span className="rounded-full bg-[#dcfce7] px-3 py-1 text-xs font-bold text-[#166534]">
          Case 01 · Fair Sharing
        </span>
      </header>

      {/* Thank-you bubble */}
      <div className="mt-6 flex items-start gap-3 rounded-2xl border border-[#c8d9f0] bg-[#eaf2ff] p-4">
        <div className="flex-1 text-sm sm:text-base text-neutral-800">
          <span className="font-semibold text-neutral-900">ZED-4: </span>
          {thanks}
        </div>
        <SpeakButton text={`ZED-4 says: ${thanks}`} />
      </div>

      {/* Concept mastered */}
      <div className="mt-6">
        <div className="text-xs font-bold uppercase tracking-wider text-neutral-500">
          Concept Mastered
        </div>
        <div className="mt-2 flex items-center gap-2 text-lg font-semibold text-neutral-900">
          <CheckDot /> Fair Sharing — equal parts of one whole
        </div>
      </div>

      {/* Evidence */}
      <div className="mt-6">
        <div className="text-xs font-bold uppercase tracking-wider text-neutral-500">
          Evidence Collected
        </div>
        <ul className="mt-3 space-y-2 text-sm text-neutral-700">
          <li className="flex items-start gap-2">
            <CheckDot /> Spotted the glitch in ZED-4's pizza.
          </li>
          <li className="flex items-start gap-2">
            <CheckDot /> Repaired the slices so all parts were equal.
          </li>
          <li className="flex items-start gap-2">
            <CheckDot /> Explained the idea in their own words.
          </li>
        </ul>
        {evidenceStatement && (
          <blockquote className="mt-4 rounded-xl border-l-4 border-[#10b981] bg-[#f8fafc] px-4 py-3 text-sm italic text-neutral-700">
            "{evidenceStatement}"
          </blockquote>
        )}
      </div>

      {/* Conversation summary */}
      {studentQuotes.length > 0 && (
        <div className="mt-6">
          <div className="text-xs font-bold uppercase tracking-wider text-neutral-500">
            Detective's Words ({turnCount} {turnCount === 1 ? "turn" : "turns"})
          </div>
          <ul className="mt-2 space-y-1 text-sm text-neutral-600">
            {studentQuotes.map((q, i) => (
              <li key={i} className="leading-snug">• {q}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Next */}
      <div className="mt-6 rounded-2xl bg-[#fff4cc] px-5 py-4 text-sm text-[#7c5e10]">
        <span className="font-bold">Next up: </span>
        Case 02 — comparing fair shares.
      </div>

      {/* Actions */}
      <div className="mt-6 flex flex-wrap items-center justify-end gap-3 print:hidden">
        <button
          type="button"
          onClick={handlePrint}
          className="rounded-full border border-neutral-200 px-4 py-2 text-xs font-bold tracking-wider text-neutral-700 transition-colors hover:bg-neutral-50"
        >
          PRINT REPORT
        </button>
        <Link
          to="/play"
          className="rounded-full bg-[#1f2937] px-4 py-2 text-xs font-bold tracking-wider text-white transition-colors hover:bg-black"
        >
          BACK TO CASES
        </Link>
      </div>
    </section>
  );
}

function CheckDot() {
  return (
    <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#10b981] text-white">
      <svg viewBox="0 0 20 20" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="3">
        <path d="M5 10l3 3 7-7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}
