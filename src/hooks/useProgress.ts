/**
 * `useCaseProgress` — per-device tracker for which sub-cases the child has
 * solved inside a case. Persists to `localStorage` under `gd:progress:v1`.
 *
 * Shape: `{ [caseId]: { [subCaseId]: true } }`. Idempotent: `markSolved` is
 * a no-op if the sub-case is already solved. SSR-safe (returns `{}` when
 * `window` is undefined).
 */
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
    // SSR and the first browser render must match. Saved progress is loaded
    // in the effect below, after hydration, to avoid changing the markup.
    return Object.fromEntries(subCaseIds.map((id) => [id, false])) as Record<S, boolean>;
  });

  // Sync on mount in case storage changed since first render (SSR).
  useEffect(() => {
    const stored = read()[caseId] ?? {};
    setSolved(Object.fromEntries(subCaseIds.map((id) => [id, !!stored[id]])) as Record<S, boolean>);
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
