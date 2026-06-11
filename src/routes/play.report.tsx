import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import { clearReport, useReport, type ReportEntry, type Verdict } from "@/hooks/useReportStore";

import { SUB_CASES as C1, SUB_CASE_ORDER as O1 } from "@/components/case01/cases";
import { SUB_CASES as C2, SUB_CASE_ORDER as O2 } from "@/components/case02/cases";
import { SUB_CASES as C3, SUB_CASE_ORDER as O3 } from "@/components/case03/cases";
import { SUB_CASES as C4, SUB_CASE_ORDER as O4 } from "@/components/case04/cases";
import { SUB_CASES as C5, SUB_CASE_ORDER as O5 } from "@/components/case05/cases";
import { SUB_CASES as C6, SUB_CASE_ORDER as O6 } from "@/components/case06/cases";

export const Route = createFileRoute("/play/report")({
  head: () => ({
    meta: [
      { title: "Detective's Report — Glitch Detectives" },
      {
        name: "description",
        content:
          "A full case-by-case Diagnostic Report: every glitch the detective investigated, their explanation, and ZED-4's verdict.",
      },
    ],
  }),
  component: ReportPage,
  ssr: false,
});

type CaseMeta = {
  id: string;
  number: string;
  title: string;
  topic: string;
  subs: { id: string; title: string; subtitle: string; emoji: string; conceptMastered: string }[];
};

const CASES: CaseMeta[] = [
  {
    id: "case-01",
    number: "01",
    title: "Parts of a Whole",
    topic: "Fair Sharing",
    subs: O1.map((id) => ({
      id,
      title: C1[id].title,
      subtitle: C1[id].subtitle,
      emoji: C1[id].emoji,
      conceptMastered: C1[id].conceptMastered,
    })),
  },
  {
    id: "case-02",
    number: "02",
    title: "Naming the Pieces",
    topic: "Numerator & Denominator",
    subs: O2.map((id) => ({
      id,
      title: C2[id].title,
      subtitle: C2[id].subtitle,
      emoji: C2[id].emoji,
      conceptMastered: C2[id].conceptMastered,
    })),
  },
  {
    id: "case-03",
    number: "03",
    title: "The Shape Shifters",
    topic: "Equivalent Fractions",
    subs: O3.map((id) => ({
      id,
      title: C3[id].title,
      subtitle: C3[id].subtitle,
      emoji: C3[id].emoji,
      conceptMastered: C3[id].conceptMastered,
    })),
  },
  {
    id: "case-04",
    number: "04",
    title: "The Scale Weigh-In",
    topic: "Comparing Fractions",
    subs: O4.map((id) => ({
      id,
      title: C4[id].title,
      subtitle: C4[id].subtitle,
      emoji: C4[id].emoji,
      conceptMastered: C4[id].conceptMastered,
    })),
  },
  {
    id: "case-05",
    number: "05",
    title: "Combining Matches",
    topic: "Adding & Subtracting · Like",
    subs: O5.map((id) => ({
      id,
      title: C5[id].title,
      subtitle: C5[id].subtitle,
      emoji: C5[id].emoji,
      conceptMastered: C5[id].conceptMastered,
    })),
  },
  {
    id: "case-06",
    number: "06",
    title: "The Mismatched Puzzle",
    topic: "Adding & Subtracting · Unlike",
    subs: O6.map((id) => ({
      id,
      title: C6[id].title,
      subtitle: C6[id].subtitle,
      emoji: C6[id].emoji,
      conceptMastered: C6[id].conceptMastered,
    })),
  },
];

function ReportPage() {
  const report = useReport();

  const totals = useMemo(() => {
    let attempted = 0;
    let total = 0;
    let correct = 0;
    for (const c of CASES) {
      for (const s of c.subs) {
        total += 1;
        const entry = report[c.id]?.[s.id];
        if (entry) {
          attempted += 1;
          if (entry.verdict === "correct") correct += 1;
        }
      }
    }
    return { attempted, total, correct };
  }, [report]);

  const onPrint = () => {
    if (typeof window !== "undefined") window.print();
  };

  const reportRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

  const onDownloadPdf = async () => {
    if (!reportRef.current || downloading) return;
    setDownloading(true);
    try {
      const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
        import("html2canvas-pro"),
        import("jspdf"),
      ]);
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        backgroundColor: "#ffffff",
        useCORS: true,
      });
      const pdf = new jsPDF({ unit: "pt", format: "a4" });
      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();
      const imgW = pageW;
      const imgH = (canvas.height * imgW) / canvas.width;
      const imgData = canvas.toDataURL("image/jpeg", 0.92);

      let heightLeft = imgH;
      let position = 0;
      pdf.addImage(imgData, "JPEG", 0, position, imgW, imgH);
      heightLeft -= pageH;
      while (heightLeft > 0) {
        position -= pageH;
        pdf.addPage();
        pdf.addImage(imgData, "JPEG", 0, position, imgW, imgH);
        heightLeft -= pageH;
      }
      const date = new Date().toISOString().slice(0, 10);
      const filename = `glitch-detectives-report-${date}.pdf`;
      const blob = pdf.output("blob");
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      // Fallback: inside the embedded preview iframe, downloads are often blocked —
      // also open the PDF in a new tab so it can be saved from there.
      const embedded = window.self !== window.top;
      if (embedded) {
        window.setTimeout(() => {
          try {
            window.open(url, "_blank", "noopener");
          } catch {
            /* ignore */
          }
        }, 300);
      }
      window.setTimeout(() => URL.revokeObjectURL(url), 30000);
    } catch (err) {
      console.error("PDF generation failed", err);
      if (typeof window !== "undefined") window.alert("Sorry — PDF generation failed. Try Print / Save PDF instead.");
    } finally {
      setDownloading(false);
    }
  };

  const onReset = () => {
    if (typeof window === "undefined") return;
    if (window.confirm("Clear the Detective's Report for this browser?")) {
      clearReport();
    }
  };

  return (
    <main className="min-h-screen bg-[#f8fafc] print:bg-white">
      <header className="border-b border-neutral-100 bg-white print:hidden">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-6 py-5 sm:px-10">
          <Link
            to="/play"
            className="text-sm font-medium text-neutral-500 transition-colors hover:text-neutral-900"
          >
            ← Back to Active Cases
          </Link>
          <h1 className="text-base sm:text-lg font-bold tracking-tight text-neutral-900">
            Detective's Report
          </h1>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onReset}
              className="rounded-full border border-neutral-200 px-3 py-1.5 text-xs font-bold tracking-wider text-neutral-600 transition hover:bg-neutral-50"
            >
              RESET
            </button>
            <button
              type="button"
              onClick={onPrint}
              className="rounded-full border border-neutral-200 px-3 py-1.5 text-xs font-bold tracking-wider text-neutral-700 transition hover:bg-neutral-50"
            >
              PRINT
            </button>
            <button
              type="button"
              onClick={onDownloadPdf}
              disabled={downloading}
              className="rounded-full bg-neutral-900 px-3 py-1.5 text-xs font-bold tracking-wider text-white transition hover:bg-black disabled:opacity-60"
            >
              {downloading ? "GENERATING…" : "DOWNLOAD PDF"}
            </button>
          </div>
        </div>
      </header>


      <div ref={reportRef} className="mx-auto w-full max-w-6xl px-6 py-10 sm:px-10 bg-[#f8fafc]">
        {/* Hero */}
        <section className="rounded-3xl bg-white p-6 sm:p-10 shadow-[0_10px_40px_-12px_rgba(15,23,42,0.15)] ring-1 ring-neutral-100">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="text-xs font-bold tracking-[0.2em] text-[#10b981]">
                FRACTION FACTORY · CASE REPORT
              </div>
              <h2 className="mt-1 text-3xl sm:text-4xl font-black tracking-tight text-neutral-900">
                Detective's Report
              </h2>
              <p className="mt-2 max-w-xl text-sm text-neutral-500">
                A summary of every glitch the detective tackled, what they told ZED-4, and how ZED-4 graded it.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Stat label="Glitches Solved" value={`${totals.attempted}/${totals.total}`} tone="blue" />
              <Stat label="Marked Correct by ZED-4" value={`${totals.correct}`} tone="green" />
            </div>
          </div>
        </section>

        {/* Per-case sections */}
        <div className="mt-8 space-y-8">
          {CASES.map((c) => (
            <CaseSection key={c.id} meta={c} report={report} />
          ))}
        </div>

        <footer className="mt-10 flex items-center justify-between text-xs text-neutral-400 print:mt-6">
          <span>Made with Glitch Detectives</span>
          <Link to="/play" className="hover:text-neutral-700 print:hidden">
            Back to cases →
          </Link>
        </footer>
      </div>
    </main>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone: "blue" | "green" }) {
  const bg = tone === "green" ? "bg-[#dcfce7] text-[#166534]" : "bg-[#dbeafe] text-[#1e40af]";
  return (
    <div className={`rounded-2xl ${bg} px-4 py-3`}>
      <div className="text-[10px] font-bold tracking-widest uppercase opacity-75">{label}</div>
      <div className="text-2xl font-black tabular-nums">{value}</div>
    </div>
  );
}

function CaseSection({ meta, report }: { meta: CaseMeta; report: ReturnType<typeof useReport> }) {
  const entries = report[meta.id] ?? {};
  const solvedCount = meta.subs.filter((s) => entries[s.id]).length;

  return (
    <section className="rounded-3xl bg-white p-6 sm:p-8 shadow-[0_10px_40px_-12px_rgba(15,23,42,0.12)] ring-1 ring-neutral-100 print:shadow-none print:ring-0 print:break-inside-avoid">
      <header className="mb-5 flex flex-wrap items-end justify-between gap-3 border-b border-neutral-100 pb-4">
        <div>
          <div className="text-[11px] font-bold tracking-widest text-neutral-400">
            CASE {meta.number}
          </div>
          <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900">
            {meta.title}
          </h3>
          <p className="text-xs font-medium text-neutral-500">{meta.topic}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-bold text-neutral-600">
            {solvedCount}/{meta.subs.length} solved
          </span>
          <div className="flex gap-1.5">
            {meta.subs.map((s) => {
              const v = entries[s.id]?.verdict;
              const color =
                v === "correct"
                  ? "bg-[#10b981]"
                  : v === "review"
                    ? "bg-[#f59e0b]"
                    : v === "pending"
                      ? "bg-[#60a5fa]"
                      : "bg-neutral-200";
              return <span key={s.id} className={`h-2.5 w-2.5 rounded-full ${color}`} />;
            })}
          </div>
        </div>
      </header>

      <ul className="space-y-4">
        {meta.subs.map((s) => (
          <GlitchRow key={s.id} sub={s} entry={entries[s.id]} />
        ))}
      </ul>
    </section>
  );
}

function GlitchRow({
  sub,
  entry,
}: {
  sub: CaseMeta["subs"][number];
  entry?: ReportEntry;
}) {
  if (!entry) {
    return (
      <li className="flex items-start gap-4 rounded-2xl border border-dashed border-neutral-200 bg-neutral-50/60 p-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-xl">
          {sub.emoji}
        </div>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="text-sm font-bold text-neutral-700">{sub.title}</h4>
            <VerdictPill verdict={null} />
          </div>
          <p className="mt-1 text-xs text-neutral-500">{sub.subtitle}</p>
        </div>
      </li>
    );
  }

  return (
    <li className="rounded-2xl border border-neutral-100 bg-[#fbfdff] p-4 print:break-inside-avoid">
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-xl ring-1 ring-neutral-100">
          {entry.emoji || sub.emoji}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="text-sm font-bold text-neutral-900">{entry.subTitle || sub.title}</h4>
            <VerdictPill verdict={entry.verdict} />
          </div>
          <p className="mt-1 text-xs text-neutral-500">
            <span className="font-semibold text-neutral-600">Glitch:</span> {entry.glitchSummary || sub.subtitle}
          </p>

          {entry.explanation && (
            <blockquote className="mt-3 rounded-xl border-l-4 border-[#60a5fa] bg-white px-3 py-2 text-sm italic text-neutral-700">
              "{entry.explanation}"
            </blockquote>
          )}

          {entry.verdictNote && (
            <div className="mt-2 rounded-xl bg-[#eaf2ff] px-3 py-2 text-xs text-neutral-700">
              <span className="font-bold text-[#1e3a8a]">ZED-4:</span> {entry.verdictNote}
            </div>
          )}

          <MarksRow marks={entry.marks} />
        </div>
      </div>
    </li>
  );
}

function VerdictPill({ verdict }: { verdict: Verdict | null }) {
  if (verdict === "correct")
    return <Pill className="bg-[#dcfce7] text-[#166534]">✓ Correct</Pill>;
  if (verdict === "review")
    return <Pill className="bg-[#fef3c7] text-[#92400e]">Almost — needs review</Pill>;
  if (verdict === "pending")
    return <Pill className="bg-[#dbeafe] text-[#1e40af]">ZED-4 grading…</Pill>;
  return <Pill className="bg-neutral-100 text-neutral-500">Not attempted yet</Pill>;
}

function Pill({ children, className }: { children: React.ReactNode; className: string }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold tracking-wider ${className}`}>
      {children}
    </span>
  );
}

function MarksRow({ marks }: { marks: ReportEntry["marks"] }) {
  const items = [
    { label: "Investigate", v: marks.investigate },
    { label: "Detect", v: marks.detect },
    { label: "Repair", v: marks.repair },
    { label: "Explain", v: marks.explain },
  ];
  const total = items.reduce((s, i) => s + i.v, 0);
  return (
    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-neutral-100 pt-2.5 text-[11px]">
      {items.map((i) => (
        <div key={i.label} className="flex items-center gap-1.5 text-neutral-500">
          <span className="font-semibold uppercase tracking-wider">{i.label}</span>
          <span className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, k) => (
              <span
                key={k}
                className={`h-1.5 w-1.5 rounded-full ${k < i.v ? "bg-[#10b981]" : "bg-neutral-200"}`}
              />
            ))}
          </span>
        </div>
      ))}
      <span className="ml-auto rounded-full bg-neutral-900 px-2 py-0.5 text-[10px] font-bold text-white">
        {total}/20
      </span>
    </div>
  );
}
