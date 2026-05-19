import { useCallback, useEffect, useRef, useState } from "react";

let speakingFlag = false;
export function isSpeaking() {
  if (typeof window === "undefined") return false;
  return speakingFlag || !!window.speechSynthesis?.speaking;
}

export function speakText(text: string, onEnd?: () => void) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    onEnd?.();
    return;
  }
  try {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.95;
    u.pitch = 1.1;
    u.volume = 1;
    const voices = window.speechSynthesis.getVoices();
    const preferred =
      voices.find((v) => /Google US English/i.test(v.name)) ||
      voices.find((v) => /en-US/i.test(v.lang) && /female/i.test(v.name)) ||
      voices.find((v) => /en/i.test(v.lang));
    if (preferred) u.voice = preferred;
    speakingFlag = true;
    u.onend = () => { speakingFlag = false; onEnd?.(); };
    u.onerror = () => { speakingFlag = false; onEnd?.(); };
    window.speechSynthesis.speak(u);
  } catch {
    speakingFlag = false;
    onEnd?.();
  }
}

export function useAutoSpeak(text: string, deps: unknown[] = []) {
  useEffect(() => {
    if (!text) return;
    const t = setTimeout(() => speakText(text), 150);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, ...deps]);
}

type SpeechRec = {
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onend: (() => void) | null;
  onerror: ((e: unknown) => void) | null;
  continuous: boolean;
  interimResults: boolean;
  lang: string;
};

export function useSpeechToText(onTranscript: (t: string) => void) {
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(false);
  const recRef = useRef<SpeechRec | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const w = window as unknown as {
      SpeechRecognition?: new () => SpeechRec;
      webkitSpeechRecognition?: new () => SpeechRec;
    };
    const SR = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!SR) return;
    setSupported(true);
    const r = new SR();
    r.continuous = false;
    r.interimResults = false;
    r.lang = "en-US";
    r.onresult = (e) => {
      const transcript = Array.from(e.results as ArrayLike<ArrayLike<{ transcript: string }>>)
        .map((res) => (res as ArrayLike<{ transcript: string }>)[0]?.transcript ?? "")
        .join(" ");
      onTranscript(transcript);
    };
    r.onend = () => setListening(false);
    r.onerror = () => setListening(false);
    recRef.current = r;
    return () => {
      try { r.abort(); } catch { /* */ }
    };
  }, [onTranscript]);

  const start = useCallback(() => {
    if (!recRef.current) return;
    try {
      window.speechSynthesis?.cancel();
      recRef.current.start();
      setListening(true);
    } catch { /* */ }
  }, []);
  const stop = useCallback(() => {
    recRef.current?.stop();
  }, []);

  return { listening, supported, start, stop };
}

/**
 * Continuous voice-command listener. Matches the latest transcript against
 * a map of phrase -> handler. Phrases are matched case-insensitively as
 * substrings, so "enter level" will fire for "please enter level one".
 */
export function useVoiceCommands(
  commands: Record<string, () => void>,
  enabled: boolean,
) {
  const cmdRef = useRef(commands);
  cmdRef.current = commands;

  useEffect(() => {
    if (!enabled || typeof window === "undefined") return;
    const w = window as unknown as {
      SpeechRecognition?: new () => SpeechRec;
      webkitSpeechRecognition?: new () => SpeechRec;
    };
    const SR = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!SR) return;

    const r = new SR();
    r.continuous = true;
    r.interimResults = false;
    r.lang = "en-US";
    let stopped = false;

    r.onresult = (e) => {
      const results = e.results as ArrayLike<ArrayLike<{ transcript: string }>>;
      const last = results[results.length - 1];
      const phrase = (last?.[0]?.transcript ?? "").toLowerCase().trim();
      if (!phrase) return;
      for (const [needle, fn] of Object.entries(cmdRef.current)) {
        if (phrase.includes(needle.toLowerCase())) {
          fn();
          break;
        }
      }
    };
    r.onend = () => {
      if (stopped) return;
      try { r.start(); } catch { /* */ }
    };
    r.onerror = () => { /* swallow */ };

    try { r.start(); } catch { /* */ }
    return () => {
      stopped = true;
      try { r.abort(); } catch { /* */ }
    };
  }, [enabled]);
}

