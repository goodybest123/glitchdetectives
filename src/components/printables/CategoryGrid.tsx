import { CircleDot, Layers, PieChart, Plus, Shapes, type LucideIcon } from "lucide-react";

const BLUE = "var(--color-brand-blue)";

type Category = {
  title: string;
  desc: string;
  count: string;
  bg: string;
  icon: LucideIcon;
  live?: boolean;
};

const CATEGORIES: Category[] = [
  { title: "Fractions", desc: "Equal parts, halves, quarters, and equivalence.", count: "8 printables", bg: "#e8f9f5", icon: PieChart, live: true },
  { title: "Addition", desc: "Number bonds, regrouping, and gentle word problems.", count: "Coming soon", bg: "#fff4d6", icon: Plus },
  { title: "Geometry", desc: "Shapes, symmetry, angles, and spatial reasoning.", count: "Coming soon", bg: "#ece8ff", icon: Shapes },
  { title: "Decimals", desc: "Tenths, hundredths, and place value across the dot.", count: "Coming soon", bg: "#e3f1ff", icon: CircleDot },
  { title: "Place Value", desc: "Ones, tens, hundreds — building and breaking numbers.", count: "Coming soon", bg: "#ffe8ee", icon: Layers },
];

export function CategoryGrid() {
  return (
    <section className="bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 lg:py-24">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="label-eyebrow" style={{ color: BLUE }}>Browse by Topic</span>
          <h2 className="heading-black uppercase text-3xl sm:text-4xl mt-3" style={{ color: BLUE }}>
            Choose a maths world
          </h2>
          <p
            className="mt-4 text-base leading-relaxed"
            style={{ color: "color-mix(in oklab, var(--color-brand-blue) 70%, transparent)" }}
          >
            Each topic opens into a calm collection of detective-style sheets.
          </p>
        </div>

        <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {CATEGORIES.map((c) => {
            const Icon = c.icon;
            return (
              <li key={c.title}>
                <div
                  className="group h-full rounded-3xl p-7 sm:p-8 border border-black/5 transition-transform hover:-translate-y-1 hover:shadow-md cursor-pointer"
                  style={{ background: c.bg }}
                  role="link"
                  tabIndex={0}
                >
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center bg-white/70 backdrop-blur-sm"
                  >
                    <Icon className="w-7 h-7" style={{ color: BLUE }} strokeWidth={2} />
                  </div>
                  <h3
                    className="mt-6 text-2xl font-black uppercase tracking-tight"
                    style={{ color: BLUE }}
                  >
                    {c.title}
                  </h3>
                  <p
                    className="mt-2 text-sm leading-relaxed"
                    style={{ color: "color-mix(in oklab, var(--color-brand-blue) 70%, transparent)" }}
                  >
                    {c.desc}
                  </p>
                  <div className="mt-6">
                    <span
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-white/80"
                      style={{ color: BLUE }}
                    >
                      {c.live ? c.count : "Coming soon"}
                    </span>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
