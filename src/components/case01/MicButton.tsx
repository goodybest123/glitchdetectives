import { useEffect, useRef, useState } from "react";
import { Mic, MicOff } from "lucide-react";

type MicButtonProps = {
  onTranscript: (text: string, isFinal: boolean) => void;
  disabled?: boolean;
  onListeningChange?: (listening: boolean) => void;
};

type SRConstructor = new () => any;

function getRecognition(): SRConstructor | null {
  if (typeof window === "undefined") return null;
  const w = window as any;
  return (w.SpeechRecognition ?? w.webkitSpeechRecognition) ?? null;
}

export function MicButton({ onTranscript, disabled, onListeningChange }: MicButtonProps) {
  const [supported, setSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recRef = useRef<any>(null);
  const interimSentLenRef = useRef(0);

  useEffect(() => {
    const SR = getRecognition();
    setSupported(!!SR);
  }, []);

  useEffect(() => {
    onListeningChange?.(listening);
  }, [listening, onListeningChange]);

  if (!supported) return null;

  const start = () => {
    const SR = getRecognition();
    if (!SR) return;
    try {
      const rec = new SR();
      rec.lang = "en-US";
      rec.interimResults = true;
      rec.continuous = false;
      interimSentLenRef.current = 0;

      rec.onresult = (e: any) => {
        let interim = "";
        let finalText = "";
        for (let i = e.resultIndex; i < e.results.length; i++) {
          const res = e.results[i];
          if (res.isFinal) finalText += res[0].transcript;
          else interim += res[0].transcript;
        }
        if (finalText) {
          onTranscript(finalText.trim() + " ", true);
        } else if (interim) {
          onTranscript(interim, false);
        }
      };
      rec.onerror = (e: any) => {
        setError(e.error === "not-allowed" ? "Microphone access blocked." : null);
        setListening(false);
      };
      rec.onend = () => setListening(false);
      rec.start();
      recRef.current = rec;
      setListening(true);
      setError(null);
    } catch {
      setListening(false);
    }
  };

  const stop = () => {
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
      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  );
}
