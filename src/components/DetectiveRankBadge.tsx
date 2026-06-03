import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getDetectiveRank, type RankInfo } from "@/lib/detective-rank";

type Props = {
  compact?: boolean;
  className?: string;
};

export function DetectiveRankBadge({ compact, className = "" }: Props) {
  const [info, setInfo] = useState<RankInfo | null>(null);

  useEffect(() => {
    const refresh = () => setInfo(getDetectiveRank());
    refresh();
    window.addEventListener("glitch-progress-change", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("glitch-progress-change", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  if (!info) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      className={`inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 shadow-sm border border-border ${className}`}
    >
      <span className="text-base leading-none" aria-hidden>{info.rank.icon}</span>
      <div className={compact ? "leading-tight" : "leading-tight pr-1"}>
        <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
          Detective Rank
        </div>
        <div className="text-sm font-bold text-foreground">{info.rank.name}</div>
      </div>
      {!compact && (
        <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden ml-1" aria-hidden>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${info.progressToNext * 100}%` }}
            transition={{ duration: 0.5 }}
            className="h-full bg-primary"
          />
        </div>
      )}
    </motion.div>
  );
}
