import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Bot, Cpu, Lock, ScanSearch, Sparkles, Wrench } from "lucide-react";
import { MissionRunner } from "@/components/MissionRunner";
import { speakText } from "@/lib/speech";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Glitch Detectives: Fraction Factory" },
      { name: "description", content: "Investigate AI mistakes, repair fractions, and teach ZED-4 why. A reasoning-first math platform for kids." },
      { property: "og:title", content: "Glitch Detectives: Fraction Factory" },
      { property: "og:description", content: "A calm, reasoning-first fractions game for Grade 1." },
    ],
  }),
  component: App,
});

type View = "intro" | "map" | "mission";

function App() {
  const [view, setView] = useState<View>("intro");

  if (view === "mission") return <MissionRunner onExit={() => setView("map")} />;
  if (view === "map") return <MissionMap onStart={() => setView("mission")} onBack={() => setView("intro")} />;
  return <Intro onContinue={() => setView("map")} />;
}

function Intro({ onContinue }: { onContinue: () => void }) {
  return (
    <main className="min-h-screen grid-bg flex items-center justify-center px-4 py-12">
      <div className="max-w-3xl w-full">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="flex items-center gap-2 label-eyebrow text-muted-foreground mb-6">
            <Cpu className="w-3.5 h-3.5" /> FACTORY OS // BUILD 4.0
          </div>
          <h1 className="text-5xl sm:text-7xl font-bold tracking-tight text-primary mb-2">
            Glitch
            <br />
            Detectives.
          </h1>
          <p className="label-eyebrow text-energy-foreground bg-energy inline-block px-3 py-1.5 rounded-full mt-2">
            FRACTION FACTORY
          </p>
          <p className="text-lg sm:text-xl text-foreground/80 mt-8 max-w-2xl leading-relaxed">
            The factory's partition machines are malfunctioning. Shapes are being divided incorrectly,
            and our robot <strong>ZED-4</strong> can't figure out why. Can you investigate, repair the system,
            and teach the robot what it got wrong?
          </p>

          <div className="grid sm:grid-cols-3 gap-3 mt-10">
            {[
              { icon: ScanSearch, label: "Investigate" },
              { icon: Wrench, label: "Repair" },
              { icon: Bot, label: "Teach ZED-4" },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl border border-border bg-card p-4 flex items-center gap-3">
                <s.icon className="w-5 h-5 text-primary" />
                <span className="font-medium">{s.label}</span>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => { speakText("Welcome detective. Tap continue to enter the mission map."); onContinue(); }}
              className="px-6 py-4 rounded-2xl bg-primary text-primary-foreground font-semibold inline-flex items-center justify-center gap-2 hover:opacity-90 transition shadow-lg"
            >
              Enter Mission Map <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => speakText("The factory's partition machines are malfunctioning. Shapes are being divided incorrectly. Can you repair the system?")}
              className="px-6 py-4 rounded-2xl border border-border bg-card font-medium hover:border-primary transition"
            >
              🔊 Hear briefing
            </button>
          </div>
        </motion.div>
      </div>
    </main>
  );
}

const MISSIONS = [
  { id: 1, title: "Broken Partition Scanner", subtitle: "Repair 5 mis-cut shapes", unlocked: true },
  { id: 2, title: "Fraction Bakery", subtitle: "Equal slices for every robot", unlocked: false },
  { id: 3, title: "Equivalent Engine Room", subtitle: "Match the matching fractions", unlocked: false },
  { id: 4, title: "Comparison Control Tower", subtitle: "Bigger, smaller, or same?", unlocked: false },
];

function MissionMap({ onStart, onBack }: { onStart: () => void; onBack: () => void }) {
  return (
    <main className="min-h-screen grid-bg px-4 sm:px-6 py-10">
      <div className="max-w-5xl mx-auto">
        <button onClick={onBack} className="label-eyebrow text-muted-foreground hover:text-primary mb-6">← INTRO</button>
        <div className="flex items-end justify-between flex-wrap gap-3 mb-8">
          <div>
            <span className="label-eyebrow text-muted-foreground">MISSION MAP</span>
            <h2 className="text-4xl sm:text-5xl font-bold text-primary mt-1">Pick a mission, detective.</h2>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Sparkles className="w-4 h-4 text-energy-foreground" />
            <span>1 mission unlocked</span>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-4">
          {MISSIONS.map((m) => (
            <motion.button
              key={m.id}
              whileHover={m.unlocked ? { y: -2 } : {}}
              onClick={() => m.unlocked && onStart()}
              disabled={!m.unlocked}
              className={`text-left rounded-3xl border p-6 transition relative overflow-hidden ${
                m.unlocked
                  ? "border-border bg-card hover:border-primary shadow-sm cursor-pointer"
                  : "border-border/60 bg-card/50 opacity-60 cursor-not-allowed"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="label-eyebrow text-muted-foreground">MISSION 0{m.id}</span>
                {m.unlocked ? (
                  <span className="label-eyebrow px-2 py-1 rounded-full bg-energy text-energy-foreground">READY</span>
                ) : (
                  <Lock className="w-4 h-4 text-muted-foreground" />
                )}
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-1">{m.title}</h3>
              <p className="text-muted-foreground">{m.subtitle}</p>
              {m.unlocked && (
                <div className="mt-6 inline-flex items-center gap-2 text-primary font-semibold">
                  Begin <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </motion.button>
          ))}
        </div>
      </div>
    </main>
  );
}
