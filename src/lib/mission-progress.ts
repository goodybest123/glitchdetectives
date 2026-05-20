import { useCallback, useEffect, useState } from "react";

/**
 * Persistent mission progression for Glitch Detectives.
 * MVP storage: localStorage (survives refresh). Schema is shaped so we can
 * sync to Lovable Cloud later without breaking consumers.
 */

export type MissionStats = {
  completedAt: string; // ISO
  reasoningScore: number; // 1-3 average
  repairAttempts: number;
  hintsUsed: number;
};

export type LevelProgress = {
  level: number;
  completed: Record<number, MissionStats>; // missionId -> stats
};

const STORAGE_KEY = "glitch-detectives:progress:v1";

type AllProgress = Record<string, LevelProgress>; // key = `level-${n}`

function read(): AllProgress {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as AllProgress;
  } catch {
    return {};
  }
}

function write(all: AllProgress) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    window.dispatchEvent(new CustomEvent("glitch-progress-change"));
  } catch {
    /* quota / private mode — silently fall back to in-memory only */
  }
}

export function useLevelProgress(level: number) {
  const key = `level-${level}`;
  const [progress, setProgress] = useState<LevelProgress>(() => {
    const all = read();
    return all[key] ?? { level, completed: {} };
  });

  useEffect(() => {
    const refresh = () => {
      const all = read();
      setProgress(all[key] ?? { level, completed: {} });
    };
    window.addEventListener("glitch-progress-change", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("glitch-progress-change", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, [key, level]);

  const markComplete = useCallback(
    (missionId: number, stats: Omit<MissionStats, "completedAt">) => {
      const all = read();
      const current = all[key] ?? { level, completed: {} };
      // Don't overwrite a better score
      const prev = current.completed[missionId];
      const next: MissionStats = {
        completedAt: prev?.completedAt ?? new Date().toISOString(),
        reasoningScore: Math.max(prev?.reasoningScore ?? 0, stats.reasoningScore),
        repairAttempts: (prev?.repairAttempts ?? 0) + stats.repairAttempts,
        hintsUsed: (prev?.hintsUsed ?? 0) + stats.hintsUsed,
      };
      current.completed[missionId] = next;
      all[key] = current;
      write(all);
      setProgress({ ...current });
    },
    [key, level],
  );

  const reset = useCallback(() => {
    const all = read();
    delete all[key];
    write(all);
    setProgress({ level, completed: {} });
  }, [key, level]);

  const completedIds = Object.keys(progress.completed).map(Number).sort();
  const completedCount = completedIds.length;
  const isMissionComplete = (id: number) => Boolean(progress.completed[id]);
  /** Mission N unlocked when N=1 OR mission N-1 is complete. */
  const isMissionUnlocked = (id: number) => id === 1 || isMissionComplete(id - 1);

  return {
    progress,
    completedIds,
    completedCount,
    isMissionComplete,
    isMissionUnlocked,
    markComplete,
    reset,
  };
}

/** Read-only snapshot for the hub (avoids hook in non-component contexts). */
export function getLevelCompletedCount(level: number): number {
  const all = read();
  return Object.keys(all[`level-${level}`]?.completed ?? {}).length;
}
