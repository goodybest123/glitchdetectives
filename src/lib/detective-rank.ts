import { getAllMissionStats } from "./mission-progress";

export type Rank = {
  id: string;
  name: string;
  icon: string;
  /** Minimum weighted score to unlock. */
  threshold: number;
};

export const RANKS: Rank[] = [
  { id: "rookie", name: "Rookie Detective", icon: "🕵️", threshold: 0 },
  { id: "junior", name: "Junior Investigator", icon: "🔍", threshold: 120 },
  { id: "hunter", name: "Glitch Hunter", icon: "⚡", threshold: 320 },
  { id: "expert", name: "Reasoning Expert", icon: "🧠", threshold: 640 },
  { id: "master", name: "Master Detective", icon: "🏆", threshold: 1100 },
  { id: "nexus", name: "Nexus Architect", icon: "🎓", threshold: 1700 },
];

export type RankInfo = {
  rank: Rank;
  next: Rank | null;
  weightedScore: number;
  progressToNext: number; // 0..1
  missionsCompleted: number;
  avgScore: number;
};

/** Quality × quantity: avg score scaled by missions completed. */
export function computeWeightedScore(avgScore: number, missionsCompleted: number): number {
  return Math.round(avgScore * Math.sqrt(missionsCompleted));
}

export function getDetectiveRank(): RankInfo {
  const all = getAllMissionStats();
  const scores = all.map((s) => s.score ?? 0).filter((n) => n > 0);
  const missionsCompleted = all.length;
  const avgScore = scores.length
    ? scores.reduce((a, b) => a + b, 0) / scores.length
    : 0;
  const weightedScore = computeWeightedScore(avgScore, missionsCompleted);

  let current = RANKS[0];
  let next: Rank | null = RANKS[1] ?? null;
  for (let i = 0; i < RANKS.length; i++) {
    if (weightedScore >= RANKS[i].threshold) {
      current = RANKS[i];
      next = RANKS[i + 1] ?? null;
    }
  }
  const progressToNext = next
    ? Math.min(
        1,
        (weightedScore - current.threshold) /
          Math.max(1, next.threshold - current.threshold),
      )
    : 1;

  return { rank: current, next, weightedScore, progressToNext, missionsCompleted, avgScore };
}
