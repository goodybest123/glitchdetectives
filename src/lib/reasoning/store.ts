/**
 * On-device storage service for reasoning evidence.
 *
 * Contract:
 *   key   = "gd:reasoning:v1"
 *   value = Record<caseId, CaseResult>
 *
 * All reads/writes funnel through this module so persistence can later be
 * swapped for a backend without touching the report UI or the activities.
 * Writes dispatch "gd:reasoning:change" so open report views update live.
 */
import { useEffect, useState } from "react";
import type { CaseResult } from "./types";

const STORAGE_KEY = "gd:reasoning:v1";
const CHANGE_EVENT = "gd:reasoning:change";

export type CaseResultMap = Record<string, CaseResult>;

function read(): CaseResultMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CaseResultMap) : {};
  } catch {
    return {};
  }
}

function write(map: CaseResultMap) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
    window.dispatchEvent(new Event(CHANGE_EVENT));
  } catch {
    /* storage full or blocked — the investigation must never break */
  }
}

/** Records (or replaces) the evidence for one completed investigation. */
export function saveCaseResult(result: CaseResult) {
  const all = read();
  all[result.caseId] = result;
  write(all);
}

export function getCaseResults(): CaseResult[] {
  return Object.values(read()).sort((a, b) => a.timestamp - b.timestamp);
}

export function clearCaseResults() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

/**
 * Live-updating list of recorded results. Starts empty on the server and on
 * the first client render so hydration is deterministic.
 */
export function useCaseResults(): CaseResult[] {
  const [results, setResults] = useState<CaseResult[]>([]);
  useEffect(() => {
    const sync = () => setResults(getCaseResults());
    sync();
    const onStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) sync();
    };
    window.addEventListener("storage", onStorage);
    window.addEventListener(CHANGE_EVENT, sync);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener(CHANGE_EVENT, sync);
    };
  }, []);
  return results;
}
