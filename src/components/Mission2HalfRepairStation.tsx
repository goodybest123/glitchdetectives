import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, RefreshCcw, Wrench } from "lucide-react";
import { DragSlider } from "./mission2/DragSlider";
import { ZedConsole } from "./mission2/ZedConsole";
import { EnergyBarShape, PowerCellShape, ReactorDiscShape } from "./mission2/shapes";

type ShapeKind = "bar" | "disc" | "cell";

type BrokenItem = {
  id: string;
  name: string;
  shape: ShapeKind;
  initialPct: number;
  intro: string;
  repairHint: string;
  successLine: string;
};

const ITEMS: BrokenItem[] = [
  {
    id: "energy-bar",
    name: "Energy Bar",
    shape: "bar",
    initialPct: 22,
    intro: "Look! Two pieces! That means I made perfect halves, right?",
    repairHint: "Drag the thick line to make two fair halves.",
    successLine: "Whoa! Now both pieces are the EXACT same size. Halves must be equal!",
  },
  {
    id: "reactor",
    name: "Reactor Core",
    shape: "disc",
    initialPct: 78,
    intro: "I split the reactor core. Two slices means halves… right?",
    repairHint: "Slide the line until both slices match.",
    successLine: "Equal slices! So a half is one of TWO equal parts. Got it!",
  },
  {
    id: "disk",
    name: "Software Disk",
    shape: "disc",
    initialPct: 30,
    intro: "This disk is cut in two. That's halves by definition!",
    repairHint: "Adjust the line so the two parts are the same size.",
    successLine: "Two pieces AND equal — now it's really halves!",
  },
  {
    id: "powercell",
    name: "Power Cell",
    shape: "cell",
    initialPct: 70,
    intro: "Top piece, bottom piece. Two pieces = two halves, easy!",
    repairHint: "Drag the line until the top and bottom match.",
    successLine: "Both halves are equal now. The power cell is balanced!",
  },
];

const BLUE = "var(--color-brand-blue)";
const YELLOW = "var(--color-brand-yellow)";

export default function Mission2HalfRepairStation({ onExit }: { onExit: () => void }) {
  const [idx, setIdx] = useState(0);
  const item = ITEMS[idx];
  const [pct, setPct] = useState(item.initialPct);
  const [repaired, setRepaired] = useState(false);

  const dialogue = repaired ? item.successLine : item.intro;
  const dialogueKey = `${item.id}-${repaired ? "ok" : "err"}`;

  function handleSnap() {
    if (!repaired) setRepaired(true);
  }

  function nextItem() {
    if (idx + 1 < ITEMS.length) {
      const ni = idx + 1;
      setIdx(ni);
      setPct(ITEMS[ni].initialPct);
      setRepaired(false);
    }
  }

  function restart() {
    setIdx(0);
    setPct(ITEMS[0].initialPct);
    setRepaired(false);
  }

  const orientation = item.shape === "cell" ? "vertical" : "horizontal";
  const isFinal = idx + 1 >= ITEMS.length;

  const shapeNode = useMemo(() => {
    if (item.shape === "bar") return <EnergyBarShape pct={pct} repaired={repaired} />;
    if (item.shape === "disc") return <ReactorDiscShape pct={pct} repaired={repaired} />;
    return <PowerCellShape pct={pct} repaired={repaired} />;
  }, [item.shape, pct, repaired]);

  return (
    <div className="min-h-screen" style={{ background: "var(--color-bg-light)" }}>
      {/* Top bar */}
      <header className="border-b border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-3">
          <button
            onClick={onExit}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium text-slate-600 hover:bg-slate-100 transition"
          >
            <ArrowLeft className="w-4 h-4" /> Map
          </button>
          <div className="text-center">
            <div className="text-xs uppercase tracking-widest text-slate-400">Mission 2</div>
            <h1 className="text-lg sm:text-xl font-bold" style={{ color: BLUE }}>
              Half Repair Station
            </h1>
          </div>
          <div className="text-xs font-mono text-slate-500">
            Item {idx + 1} / {ITEMS.length}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 grid lg:grid-cols-5 gap-6">
        {/* Workshop */}
        <section className="lg:col-span-3">
          <div
            className="rounded-3xl bg-white p-6 sm:p-10 shadow-md border border-slate-200"
            style={{
              backgroundImage:
                "linear-gradient(rgba(30,41,59,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(30,41,59,0.05) 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          >
            <div className="flex items-center justify-between mb-6">
              <span className="text-xs uppercase tracking-widest text-slate-500">
                Workshop · {item.name}
              </span>
              <span
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
                style={{
                  background: repaired ? "#dcfce7" : "#fef3c7",
                  color: repaired ? "#15803d" : "#92400e",
                }}
              >
                <Wrench className="w-3.5 h-3.5" />
                {repaired ? "Repaired" : "Needs Repair"}
              </span>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35 }}
                className={
                  orientation === "horizontal"
                    ? "w-full max-w-xl mx-auto"
                    : "w-full max-w-[240px] mx-auto"
                }
              >
                <DragSlider
                  orientation={orientation}
                  value={pct}
                  onChange={setPct}
                  onSnap={handleSnap}
                  locked={repaired}
                  isRepaired={repaired}
                >
                  {shapeNode}
                </DragSlider>
              </motion.div>
            </AnimatePresence>

            <p className="mt-8 text-center text-sm text-slate-600 max-w-md mx-auto">
              {repaired ? "Perfectly equal. Both pieces match." : item.repairHint}
            </p>
          </div>
        </section>

        {/* Console */}
        <aside className="lg:col-span-2 flex flex-col gap-4">
          <ZedConsole
            dialogue={dialogue}
            dialogueKey={dialogueKey}
            repaired={repaired}
            itemName={item.name}
          />

          <AnimatePresence>
            {repaired && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
                transition={{ delay: 0.4, duration: 0.4 }}
              >
                {isFinal ? (
                  <div className="rounded-2xl border-2 border-green-400 bg-green-50 p-5 text-center">
                    <p className="text-sm font-semibold text-green-800 mb-3">
                      Mission complete! ZED-4 finally gets halves.
                    </p>
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={restart}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-700 font-semibold hover:bg-slate-50"
                      >
                        <RefreshCcw className="w-4 h-4" /> Replay
                      </button>
                      <button
                        onClick={onExit}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-white"
                        style={{ background: BLUE }}
                      >
                        Return to Map <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={nextItem}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold shadow-md transition hover:scale-[1.02]"
                    style={{ background: BLUE, color: YELLOW }}
                  >
                    Next Object <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </aside>
      </main>
    </div>
  );
}
