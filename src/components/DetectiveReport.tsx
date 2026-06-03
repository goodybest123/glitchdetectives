import { motion } from "framer-motion";
import { ArrowRight, Award, CheckCircle2, RefreshCcw, TrendingUp } from "lucide-react";
import { CATEGORY_LABELS, type ReasoningReport, type ScoreCategory } from "@/lib/reasoning-score";
import { getDetectiveRank } from "@/lib/detective-rank";

type Props = {
  report: ReasoningReport;
  title?: string;
  primaryActionLabel?: string;
  onPrimary?: () => void;
  secondaryActionLabel?: string;
  onSecondary?: () => void;
};

export function DetectiveReport({
  report,
  title = "Detective Report",
  primaryActionLabel,
  onPrimary,
  secondaryActionLabel,
  onSecondary,
}: Props) {
  const rank = getDetectiveRank();
  const cats = Object.keys(CATEGORY_LABELS) as ScoreCategory[];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-md"
    >
      <div className="flex items-center justify-between gap-3 flex-wrap mb-6">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-primary" />
          <span className="label-eyebrow text-muted-foreground">{title}</span>
        </div>
        <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-primary/10 text-foreground">
          {rank.rank.name}
        </span>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
        <ScoreRing value={report.overall} />
        <div className="flex-1 w-full space-y-2">
          {cats.map((c) => (
            <CategoryBar key={c} label={CATEGORY_LABELS[c]} value={report.breakdown[c]} />
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mt-6">
        <div className="rounded-xl bg-success/10 border border-success/30 p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="w-4 h-4 text-success" />
            <span className="label-eyebrow text-foreground">Strengths</span>
          </div>
          <ul className="space-y-1 text-sm">
            {report.strengths.map((s, i) => (
              <li key={i} className="flex gap-2"><span aria-hidden>•</span><span>{s}</span></li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl bg-glitch/10 border border-glitch/30 p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-glitch" />
            <span className="label-eyebrow text-foreground">Growth Areas</span>
          </div>
          {report.growthAreas.length > 0 ? (
            <ul className="space-y-1 text-sm">
              {report.growthAreas.map((s, i) => (
                <li key={i} className="flex gap-2"><span aria-hidden>•</span><span>{s}</span></li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No growth areas flagged. Nice work!</p>
          )}
        </div>
      </div>

      {(onPrimary || onSecondary) && (
        <div className="flex gap-3 mt-6 flex-wrap">
          {onSecondary && secondaryActionLabel && (
            <button
              onClick={onSecondary}
              className="inline-flex items-center gap-2 px-4 py-3 rounded-xl border border-border bg-card hover:border-primary transition font-medium"
            >
              <RefreshCcw className="w-4 h-4" /> {secondaryActionLabel}
            </button>
          )}
          {onPrimary && primaryActionLabel && (
            <button
              onClick={onPrimary}
              className="ml-auto inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition"
            >
              {primaryActionLabel} <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      )}
    </motion.div>
  );
}

function ScoreRing({ value }: { value: number }) {
  const radius = 56;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (value / 100) * circ;
  return (
    <div className="relative w-36 h-36 shrink-0">
      <svg viewBox="0 0 140 140" className="w-full h-full -rotate-90">
        <circle cx="70" cy="70" r={radius} className="stroke-muted" strokeWidth="12" fill="none" />
        <motion.circle
          cx="70"
          cy="70"
          r={radius}
          className="stroke-primary"
          strokeWidth="12"
          strokeLinecap="round"
          fill="none"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-black">{value}</span>
        <span className="label-eyebrow text-muted-foreground">/ 100</span>
      </div>
    </div>
  );
}

function CategoryBar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex justify-between text-xs text-muted-foreground mb-1">
        <span>{label}</span>
        <span className="font-mono text-foreground">{value}</span>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="h-full bg-primary rounded-full"
        />
      </div>
    </div>
  );
}
