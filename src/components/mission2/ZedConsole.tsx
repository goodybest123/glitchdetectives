import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, AlertTriangle, CheckCircle2 } from "lucide-react";

export function ZedConsole({
  dialogue,
  dialogueKey,
  repaired,
  itemName,
}: {
  dialogue: string;
  dialogueKey: string;
  repaired: boolean;
  itemName: string;
}) {
  const [typed, setTyped] = useState("");

  useEffect(() => {
    setTyped("");
    let i = 0;
    const id = window.setInterval(() => {
      i++;
      setTyped(dialogue.slice(0, i));
      if (i >= dialogue.length) window.clearInterval(id);
    }, 22);
    return () => window.clearInterval(id);
  }, [dialogue, dialogueKey]);

  return (
    <div
      className="rounded-2xl p-6 h-full flex flex-col gap-5 text-white shadow-xl"
      style={{ background: "linear-gradient(180deg, #0f172a 0%, #1e293b 100%)" }}
    >
      <div className="flex items-center gap-3">
        <motion.div
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          className="w-12 h-12 rounded-xl flex items-center justify-center shadow-md"
          style={{ background: "#ffde59" }}
        >
          <Bot className="w-7 h-7" style={{ color: "#1e293b" }} />
        </motion.div>
        <div>
          <div className="text-xs uppercase tracking-widest text-sky-300/80">AI Console</div>
          <div className="font-bold">ZED-4 · {itemName}</div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={repaired ? "ok" : "err"}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          className="inline-flex items-center gap-2 self-start px-3 py-1.5 rounded-full text-xs font-semibold"
          style={{
            background: repaired ? "rgba(34,197,94,0.15)" : "rgba(248,113,113,0.15)",
            color: repaired ? "#86efac" : "#fca5a5",
            border: `1px solid ${repaired ? "rgba(34,197,94,0.4)" : "rgba(248,113,113,0.4)"}`,
          }}
        >
          {repaired ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
          {repaired ? "Fixed: Equal Halves" : "Error: Unequal Shares"}
        </motion.div>
      </AnimatePresence>

      <div
        className="rounded-xl p-4 font-mono text-sm leading-relaxed min-h-[140px] flex-1"
        style={{ background: "rgba(15,23,42,0.6)", border: "1px solid rgba(148,163,184,0.2)" }}
      >
        <span className="text-sky-300">ZED-4 &gt; </span>
        <span>{typed}</span>
        <motion.span
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 0.9, repeat: Infinity }}
          className="inline-block w-2 h-4 align-middle ml-0.5"
          style={{ background: "#a5f5de" }}
        />
      </div>
    </div>
  );
}
