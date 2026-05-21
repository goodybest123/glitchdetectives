import { useEffect, useState } from "react";

export type VoiceSettings = {
  autoSpeak: boolean;
  rate: number; // 0.5 – 1.5
  volume: number; // 0 – 1
  pitch: number; // 0.5 – 2
  muted: boolean;
};

const DEFAULTS: VoiceSettings = {
  autoSpeak: true,
  rate: 0.95,
  volume: 1,
  pitch: 1.1,
  muted: false,
};

const STORAGE_KEY = "ffd:voice-settings:v1";
const listeners = new Set<(s: VoiceSettings) => void>();
let current: VoiceSettings = DEFAULTS;

function load(): VoiceSettings {
  if (typeof window === "undefined") return DEFAULTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULTS;
    return { ...DEFAULTS, ...(JSON.parse(raw) as Partial<VoiceSettings>) };
  } catch {
    return DEFAULTS;
  }
}

if (typeof window !== "undefined") {
  current = load();
}

export function getVoiceSettings(): VoiceSettings {
  return current;
}

export function setVoiceSettings(patch: Partial<VoiceSettings>) {
  current = { ...current, ...patch };
  if (typeof window !== "undefined") {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(current)); } catch { /* */ }
    if (current.muted || !current.autoSpeak) {
      try { window.speechSynthesis?.cancel(); } catch { /* */ }
    }
  }
  listeners.forEach((l) => l(current));
}

export function useVoiceSettings(): [VoiceSettings, (p: Partial<VoiceSettings>) => void] {
  const [s, setS] = useState<VoiceSettings>(current);
  useEffect(() => {
    setS(current);
    const l = (v: VoiceSettings) => setS(v);
    listeners.add(l);
    return () => { listeners.delete(l); };
  }, []);
  return [s, setVoiceSettings];
}
