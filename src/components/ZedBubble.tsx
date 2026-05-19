import { motion } from "framer-motion";
import { Bot } from "lucide-react";
import { useAutoSpeak } from "@/lib/speech";

export function ZedBubble({ text, speak = true }: { text: string; speak?: boolean }) {
  useAutoSpeak(speak ? text : "", [text]);
  return (
    <motion.div
      key={text}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex items-start gap-3"
    >
      <div className="shrink-0 w-12 h-12 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shadow-lg">
        <Bot className="w-6 h-6" />
      </div>
      <div className="flex-1 rounded-2xl rounded-tl-sm bg-card border border-border px-5 py-4 shadow-sm">
        <div className="label-eyebrow text-muted-foreground mb-1">ZED-4 // ROBOT</div>
        <p className="text-base sm:text-lg text-foreground leading-snug">{text}</p>
      </div>
    </motion.div>
  );
}
