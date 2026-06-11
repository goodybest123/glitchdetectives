import { useEffect, useState } from "react";

const STORAGE_KEY = "gd:report:v1";

export type ReportMarks = {
  investigate: number;
  detect: number;
  repair: number;
  explain: number;
};

export type Verdict = "correct" | "review" | "pending";

export type ReportEntry = {
  caseId: string;
  subId: string;
  caseTitle: string;
  subTitle: string;
  emoji: string;
  glitchSummary: string;
  conceptMastered: string;
  explanation: string;
  marks: ReportMarks;
  verdict: Verdict;
  verdictNote: string;
  solvedAt: number;
};

export type ReportMap = Record<string, Record<string, ReportEntry>>;

function read(): ReportMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ReportMap) : {};
  } catch {
    return {};
  }
}

function write(map: ReportMap) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
    window.dispatchEvent(new Event("gd:report:change"));
  } catch {
    /* ignore */
  }
}

export function saveReportEntry(entry: ReportEntry) {
  const all = read();
  const caseMap = { ...(all[entry.caseId] ?? {}) };
  const prev = caseMap[entry.subId];
  caseMap[entry.subId] = { ...prev, ...entry };
  all[entry.caseId] = caseMap;
  write(all);
}

export function patchReportEntry(
  caseId: string,
  subId: string,
  patch: Partial<ReportEntry>,
) {
  const all = read();
  const caseMap = { ...(all[caseId] ?? {}) };
  const prev = caseMap[subId];
  if (!prev) return;
  caseMap[subId] = { ...prev, ...patch };
  all[caseId] = caseMap;
  write(all);
}

export function getReport(): ReportMap {
  return read();
}

export function clearReport() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new Event("gd:report:change"));
}

export function useReport(): ReportMap {
  const [map, setMap] = useState<ReportMap>({});
  useEffect(() => {
    const sync = () => setMap(read());
    sync();
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) sync();
    };
    window.addEventListener("storage", onStorage);
    window.addEventListener("gd:report:change", sync);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("gd:report:change", sync);
    };
  }, []);
  return map;
}
