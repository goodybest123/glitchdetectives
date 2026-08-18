import { useEffect, useRef, useState } from "react";
import { Mic, MicOff } from "lucide-react";

interface SpeechRecognitionResult {
  isFinal: boolean;
  [index: number]: { transcript: string };
}

interface SpeechRecognitionResultList {
  length: number;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognitionInstance extends EventTarget {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognitionInstance;
}

type MicButtonProps = {
  onTranscript: (text: string, isFinal: boolean) => void;
  disabled?: boolean;
  onListeningChange?: (listening: boolean) => void;
  /** How many ms of silence (after last result) before we auto-stop. Default 5000. */
  silenceMs?: number;
};

function getRecognition(): SpeechRecognitionConstructor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export function MicButton({
  onTranscript,
  disabled,
  onListeningChange,
  silenceMs = 5000,
}: MicButtonProps) {
  const [supported, setSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recRef = useRef<SpeechRecognitionInstance | null>(null);
  const userStoppedRef = useRef(false);
  const silenceTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const SR = getRecognition();
    setSupported(!!SR);
  }, []);

  useEffect(() => {
    onListeningChange?.(listening);
  }, [listening, onListeningChange]);

  useEffect(() => {
    return () => {
      if (silenceTimerRef.current) window.clearTimeout(silenceTimerRef.current);
      try {
        recRef.current?.stop();
      } catch {
        /* noop */
      }
    };
  }, []);

  if (!supported) return null;

  const resetSilenceTimer = () => {
    if (silenceTimerRef.current) window.clearTimeout(silenceTimerRef.current);
    silenceTimerRef.current = window.setTimeout(() => {
      userStoppedRef.current = true;
      try {
        recRef.current?.stop();
      } catch {
        /* noop */
      }
      setListening(false);
    }, silenceMs);
  };

  const buildRec = () => {
    const SR = getRecognition();
    if (!SR) return null;
    const rec = new SR();
    rec.lang = "en-US";
    rec.interimResults = true;
    // continuous keeps the recognizer running across pauses so kids can think mid-sentence.
    rec.continuous = true;

    rec.onresult = (e: SpeechRecognitionEvent) => {
      let interim = "";
      let finalText = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const res = e.results[i];
        if (res.isFinal) finalText += res[0].transcript;
        else interim += res[0].transcript;
      }
      if (finalText) onTranscript(finalText.trim() + " ", true);
      else if (interim) onTranscript(interim, false);
      resetSilenceTimer();
    };
    rec.onerror = (e: SpeechRecognitionErrorEvent) => {
      if (e.error === "not-allowed") {
        setError("Microphone access blocked.");
        userStoppedRef.current = true;
        setListening(false);
      }
      // "no-speech" / "aborted" → let onend decide whether to restart
    };
    rec.onend = () => {
      // If the user hasn't tapped stop and we're still within silence window, restart transparently.
      if (!userStoppedRef.current) {
        try {
          rec.start();
          return;
        } catch {
          /* fallthrough */
        }
      }
      setListening(false);
    };
    return rec;
  };

  const start = () => {
    const rec = buildRec();
    if (!rec) return;
    try {
      userStoppedRef.current = false;
      rec.start();
      recRef.current = rec;
      setListening(true);
      setError(null);
      resetSilenceTimer();
    } catch {
      setListening(false);
    }
  };

  const stop = () => {
    userStoppedRef.current = true;
    if (silenceTimerRef.current) window.clearTimeout(silenceTimerRef.current);
    try {
      recRef.current?.stop();
    } catch {
      /* noop */
    }
    setListening(false);
  };

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={listening ? stop : start}
        disabled={disabled}
        aria-label={listening ? "Stop voice input" : "Start voice input"}
        aria-pressed={listening}
        className={`inline-flex h-9 w-9 items-center justify-center rounded-full border transition-all focus:outline-none focus:ring-2 focus:ring-[#60a5fa] disabled:opacity-40 ${
          listening
            ? "border-red-400 bg-red-500 text-white animate-pulse"
            : "border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50"
        }`}
      >
        {listening ? <MicOff size={16} /> : <Mic size={16} />}
      </button>
      {listening && (
        <span className="text-[11px] font-medium text-red-600">Listening… tap to stop</span>
      )}
      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  );
}
