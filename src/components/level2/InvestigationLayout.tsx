import { motion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Investigation Workspace shell.
 * - Persistent LEFT case file (passed as `caseFile`).
 * - Dynamic RIGHT workspace that swaps per phase (passed as `workspace`).
 * - Persistent BOTTOM dialogue dock (passed as `dock`).
 * - Persistent TOP bar (passed as `topBar`).
 *
 * The left pane NEVER unmounts as long as the same case is active.
 */
export function InvestigationLayout({
  topBar,
  caseFile,
  workspace,
  dock,
}: {
  topBar: ReactNode;
  caseFile: ReactNode;
  workspace: ReactNode;
  dock: ReactNode;
}) {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background:
          "radial-gradient(ellipse at top, #0b1f3d 0%, #050d24 60%, #02060f 100%)",
      }}
    >
      {topBar}
      <main
        className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 grid gap-4"
        style={{ gridTemplateRows: "1fr auto" }}
      >
        <div className="grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-4">
          {/* LEFT: persistent case file */}
          <div className="min-h-[460px]">{caseFile}</div>

          {/* RIGHT: dynamic workspace */}
          <motion.section
            layout
            className="rounded-3xl border p-5 sm:p-6 min-h-[460px]"
            style={{
              background:
                "linear-gradient(180deg, rgba(12,28,58,0.85) 0%, rgba(8,20,42,0.75) 100%)",
              borderColor: "color-mix(in oklab, #5fd0ff 22%, transparent)",
              backdropFilter: "blur(6px)",
            }}
          >
            {workspace}
          </motion.section>
        </div>

        {dock}
      </main>
    </div>
  );
}
