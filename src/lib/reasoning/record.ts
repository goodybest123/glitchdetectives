/**
 * Hook used by an investigation to record its reasoning evidence exactly
 * once, on the first transition to "solved". Guarded by a ref so re-renders
 * never write twice.
 */
import { useEffect, useRef } from "react";
import { saveCaseResult } from "./store";
import type { CaseResult } from "./types";

export function useCaseResultRecorder(active: boolean, build: () => CaseResult) {
  const savedRef = useRef(false);
  const buildRef = useRef(build);
  buildRef.current = build;

  useEffect(() => {
    if (!active || savedRef.current) return;
    savedRef.current = true;
    saveCaseResult(buildRef.current());
  }, [active]);
}
