/**
 * `/printables` — Printables Library landing. Lists the maths "worlds"
 * (Fractions live; others "coming soon") and links into per-topic pages
 * such as `/printables/fractions-l1`.
 */
import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/sections";
import { PrintablesHero } from "@/components/printables/Hero";
import { CategoryGrid } from "@/components/printables/CategoryGrid";
import { BenefitsRow } from "@/components/printables/BenefitsRow";

export const Route = createFileRoute("/printables/")({
  head: () => ({
    meta: [
      { title: "Printables Library — Glitch Detectives" },
      { name: "description", content: "Calm, hands-on, off-screen maths reasoning printables for K–6. Investigate, detect, and repair — together, away from the screen." },
      { property: "og:title", content: "The Glitch Detective Printables Library" },
      { property: "og:description", content: "Low-stimulation, neuro-inclusive maths printables for K–6 families who love screen-free learning." },
    ],
  }),
  component: PrintablesPage,
});

function PrintablesPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <PrintablesHero />
        <CategoryGrid />
        <BenefitsRow />
        <Footer />
      </main>
    </div>
  );
}
