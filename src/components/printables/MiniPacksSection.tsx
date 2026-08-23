/**
 * "Glitch Detectives Mini Packs" section on `/printables`. Lists the free
 * short-format packs and links to their per-pack preview pages.
 */
import { Link } from "@tanstack/react-router";
import { ArrowRight, Download, FileText } from "lucide-react";
import { MINI_PACKS, type MiniPack } from "./miniPacks";

const BLUE = "var(--color-brand-blue)";
const YELLOW = "var(--color-brand-yellow)";
const MUTED = "color-mix(in oklab, var(--color-brand-blue) 70%, transparent)";

export function MiniPacksSection() {
  return (
    <section style={{ background: "var(--color-bg-mint)" }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 lg:py-24">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="label-eyebrow" style={{ color: BLUE }}>
            Mini Packs
          </span>
          <h2 className="heading-black uppercase text-3xl sm:text-4xl mt-3" style={{ color: BLUE }}>
            Glitch Detectives Mini Packs
          </h2>
          <p className="mt-4 text-base leading-relaxed" style={{ color: MUTED }}>
            Short, free, low-prep missions you can print in minutes — perfect for a single sitting.
          </p>
        </div>

        <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {MINI_PACKS.map((pack) => (
            <li key={pack.slug}>
              <MiniPackCard pack={pack} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function MiniPackCard({ pack }: { pack: MiniPack }) {
  return (
    <div className="h-full rounded-3xl border border-black/5 bg-white overflow-hidden flex flex-col hover:-translate-y-1 hover:shadow-md transition-transform">
      <div
        className="relative aspect-[4/3] flex items-center justify-center overflow-hidden"
        style={{ background: pack.tint }}
      >
        <img
          src={`/printables/mini-packs/${pack.slug}/page-1.jpg`}
          alt={`${pack.title} cover page`}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover object-top"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
        <div className="w-20 h-20 rounded-full bg-white/70 flex items-center justify-center">
          <FileText className="w-9 h-9" style={{ color: BLUE }} strokeWidth={2} />
        </div>
        <span
          className="absolute top-4 left-4 label-eyebrow px-2 py-1 rounded-full"
          style={{ background: YELLOW, color: BLUE }}
        >
          Free mini pack
        </span>
      </div>

      <div className="p-7 flex flex-col flex-1">
        <h3 className="text-xl font-black uppercase tracking-tight" style={{ color: BLUE }}>
          {pack.title}
        </h3>
        <p className="mt-3 text-sm leading-relaxed flex-1" style={{ color: MUTED }}>
          {pack.blurb}
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          {pack.badges.map((b) => (
            <span
              key={b}
              className="px-3 py-1 rounded-full text-xs font-semibold"
              style={{ background: "var(--color-bg-mint)", color: BLUE }}
            >
              {b}
            </span>
          ))}
        </div>

        <div className="mt-7 flex flex-wrap gap-3">
          <Link
            to="/printables/mini-packs/$slug"
            params={{ slug: pack.slug }}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full font-bold uppercase tracking-wider text-xs hover:scale-105 transition-transform"
            style={{ background: BLUE, color: "white" }}
          >
            View pack <ArrowRight className="w-4 h-4" />
          </Link>
          {pack.downloadUrl && (
            <a
              href={pack.downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full font-bold uppercase tracking-wider text-xs border hover:opacity-80 transition-opacity"
              style={{ borderColor: BLUE, color: BLUE }}
            >
              <Download className="w-4 h-4" /> Download
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
