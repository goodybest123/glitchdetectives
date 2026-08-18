import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/landing/Navbar";
import { WaveDivider } from "@/components/landing/WaveDivider";
import {
  Hero,
  ProblemSection,
  HowItWorks,
  WorldsSection,
  RoleReversal,
  Printables,
  Neurodivergent,
  Benefits,
  Testimonials,
  FinalCTA,
  Footer,
} from "@/components/landing/sections";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Glitch Detectives — Reasoning-First Maths for K-6" },
      {
        name: "description",
        content:
          "A reasoning-first maths platform where children investigate AI mistakes, repair them, and teach the robot why. Built for the AI era.",
      },
      { property: "og:title", content: "Glitch Detectives — Reasoning-First Maths for K-6" },
      {
        property: "og:description",
        content:
          "Don't solve. Investigate. Detect. Repair. A calm, neurodivergent-inclusive maths platform for K-6 learners.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

const BLUE = "#1e293b";
const BG_LIGHT = "#f8f9fa";
const WHITE = "#ffffff";
const BG_MINT = "#e8f9f5";
const YELLOW = "#ffde59";

function Landing() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <Hero />
        <WaveDivider fromColor={BLUE} toColor={BG_LIGHT} />
        <ProblemSection />
        <HowItWorks />
        <WaveDivider fromColor={BG_LIGHT} toColor={WHITE} />
        <WorldsSection />
        <WaveDivider fromColor={WHITE} toColor="#FFFBE5" />
        <RoleReversal />
        <WaveDivider fromColor="#FFFBE5" toColor={BG_MINT} />
        <Printables />
        <WaveDivider fromColor={BG_MINT} toColor={BLUE} />
        <Neurodivergent />
        <WaveDivider fromColor={BLUE} toColor={WHITE} />
        <Benefits />
        <WaveDivider fromColor={WHITE} toColor={BG_MINT} />
        <Testimonials />
        <WaveDivider fromColor={BG_MINT} toColor={YELLOW} />
        <FinalCTA />
        <WaveDivider fromColor={YELLOW} toColor={BLUE} />
        <Footer />
      </main>
    </div>
  );
}
