import { useCallback, useEffect, useRef, useState } from "react";
import { getVoiceSettings } from "./voice-settings";

let speakingFlag = false;
export function isSpeaking() {
  if (typeof window === "undefined") return false;
  return speakingFlag || !!window.speechSynthesis?.speaking;
}

/**
 * Speak text using the user's global voice settings. Respects mute.
 * Pass `force: true` to bypass the autoSpeak gate (e.g. tap-to-replay).
 */
export function speakText(text: string, onEnd?: () => void, opts?: { force?: boolean }) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    onEnd?.();
    return;
  }
  const s = getVoiceSettings();
  if (s.muted) { onEnd?.(); return; }
  if (!opts?.force && !s.autoSpeak) { onEnd?.(); return; }
  try {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = s.rate;
    u.pitch = s.pitch;
    u.volume = s.volume;
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
    const s = getVoiceSettings();
    if (s.muted || !s.autoSpeak) return;
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


type SpeechRecWithInterim = {
  start: () => void;
  stop: () => void;
  abort: () => void;
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult:
    | ((e: {
        results: ArrayLike<ArrayLike<{ transcript: string }> & { isFinal?: boolean }>;
        resultIndex: number;
      }) => void)
    | null;
  onend: (() => void) | null;
  onerror: ((e: unknown) => void) | null;
};

/**
 * Continuous live conversation listener. Keeps the mic open and fires
 * `onFinalChunk` every time the recognizer commits a final transcript
 * segment. Pauses while the page is speaking (TTS) so the robot doesn't
 * hear itself.
 */
export function useContinuousSpeech(
  onFinalChunk: (text: string) => void,
) {
  const [listening, setListening] = useState(false);
  const [interim, setInterim] = useState("");
  const [supported, setSupported] = useState(false);
  const recRef = useRef<SpeechRecWithInterim | null>(null);
  const wantOnRef = useRef(false);
  const startedRef = useRef(false);
  const cbRef = useRef(onFinalChunk);
  cbRef.current = onFinalChunk;

  const safeStart = useCallback(() => {
    const r = recRef.current;
    if (!r || startedRef.current) return;
    try {
      r.start();
      startedRef.current = true;
      setListening(true);
    } catch {
      // already started in another browser tab/state
    }
  }, []);

  const safeStop = useCallback(() => {
    const r = recRef.current;
    if (!r) return;
    try { r.stop(); } catch { /* */ }
    startedRef.current = false;
    setListening(false);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const w = window as unknown as {
      SpeechRecognition?: new () => SpeechRecWithInterim;
      webkitSpeechRecognition?: new () => SpeechRecWithInterim;
    };
    const SR = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!SR) return;
    setSupported(true);
    const r = new SR();
    r.continuous = true;
    r.interimResults = true;
    r.lang = "en-US";

    let finalBuffer = "";
    r.onresult = (e) => {
      let interimText = "";
      const results = e.results as ArrayLike<ArrayLike<{ transcript: string }> & { isFinal?: boolean }>;
      for (let i = e.resultIndex; i < (results as ArrayLike<unknown>).length; i++) {
        const res = results[i];
        const t = res[0]?.transcript ?? "";
        if (res.isFinal) finalBuffer += t + " ";
        else interimText += t;
      }
      setInterim(interimText);
      if (finalBuffer.trim() && !isSpeaking()) {
        const text = finalBuffer.trim();
        finalBuffer = "";
        setInterim("");
        cbRef.current(text);
      }
    };
    r.onend = () => {
      startedRef.current = false;
      setListening(false);
      finalBuffer = "";
      setInterim("");
      if (wantOnRef.current) {
        setTimeout(() => {
          if (!wantOnRef.current || startedRef.current) return;
          try { r.start(); startedRef.current = true; setListening(true); } catch { /* */ }
        }, 200);
      }
    };
    r.onerror = () => { /* onend will follow */ };

    recRef.current = r;
    return () => {
      wantOnRef.current = false;
      try { r.abort(); } catch { /* */ }
      startedRef.current = false;
      recRef.current = null;
    };
  }, []);

  const start = useCallback(() => {
    wantOnRef.current = true;
    safeStart();
  }, [safeStart]);

  const stop = useCallback(() => {
    wantOnRef.current = false;
    safeStop();
    setInterim("");
  }, [safeStop]);

  // Pause mic while TTS is speaking, resume when it stops
  useEffect(() => {
    if (typeof window === "undefined") return;
    const synth = window.speechSynthesis;
    if (!synth) return;
    const id = setInterval(() => {
      if (!wantOnRef.current) return;
      if (synth.speaking && startedRef.current) {
        safeStop();
      } else if (!synth.speaking && !startedRef.current) {
        safeStart();
      }
    }, 300);
    return () => clearInterval(id);
  }, [safeStart, safeStop]);

  return { listening, interim, supported, start, stop };
}
