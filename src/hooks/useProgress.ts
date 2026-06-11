import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "gd:progress:v1";

type ProgressMap = Record<string, Record<string, boolean>>;

function read(): ProgressMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as ProgressMap;
  } catch {
    return {};
  }
}

function write(map: ProgressMap) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch {
    /* ignore */
  }
}

export function useCaseProgress<S extends string>(caseId: string, subCaseIds: readonly S[]) {
  const [solved, setSolved] = useState<Record<S, boolean>>(() => {
    const stored = read()[caseId] ?? {};
    return Object.fromEntries(subCaseIds.map((id) => [id, !!stored[id]])) as Record<S, boolean>;
  });

  // Sync on mount in case storage changed since first render (SSR).
  useEffect(() => {
    const stored = read()[caseId] ?? {};
    setSolved(
      Object.fromEntries(subCaseIds.map((id) => [id, !!stored[id]])) as Record<S, boolean>,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [caseId]);

  const markSolved = useCallback(
    (subId: S) => {
      setSolved((prev) => {
        if (prev[subId]) return prev;
        const next = { ...prev, [subId]: true };
        const all = read();
        all[caseId] = { ...(all[caseId] ?? {}), [subId]: true };
        write(all);
        return next;
      });
    },
    [caseId],
  );

  return { solved, markSolved };
}
