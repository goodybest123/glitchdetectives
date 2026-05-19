import type { Glitch } from "@/lib/glitches";
import { GLITCHES } from "@/lib/glitches";
import {
  EnergyBarShape,
  ReactorDiscShape,
  PowerCellShape,
} from "@/components/mission2/shapes";

const pizza = GLITCHES.find((g) => g.id === "pizza")!;
const chocolate = GLITCHES.find((g) => g.id === "chocolate")!;
const battery = GLITCHES.find((g) => g.id === "battery")!;
const solar = GLITCHES.find((g) => g.id === "solar")!;
const fuelrod = GLITCHES.find((g) => g.id === "fuelrod")!;

/* ---------------- MISSION 2 — Half Repair Station (all halves, snap) ---------------- */

export const MISSION_2_GLITCHES: Glitch[] = [
  {
    id: "m2-energy-bar",
    name: "Energy Bar",
    robotLabel: "Sharing Machine #A1 — Energy Bar",
    parts: 2,
    mechanic: "snap",
    orientation: "horizontal",
    robotBriefing:
      "Detective! Sharing Machine A-1 just sliced an energy bar in two. The machine swears it made halves — tap Start Scanner so we can check it together.",
    robotInvestigate:
      "Look closely at the two pieces. One worker bot will get the left piece, the other the right. Are they really halves?",
    robotDetect:
      "I think you're right — the slice looks off. Tell me what you noticed. Why isn't this a true half?",
    robotExplainWrong:
      "Hmm, are you sure? Look again — one chunk is much bigger than the other. Tell me what makes two pieces real halves.",
    robotExplain:
      "We balanced it! Now teach me — why does sliding the laser to the middle make these into true halves?",
    robotRepair:
      "Drag the laser slider until both pieces are exactly the same size. It will snap when it's perfect.",
    robotSuccess: "Equal halves! That bar is fair to share now.",
    initialVals: [28],
    target: [50],
    tolerance: 2,
    render: (vals, repaired) => <EnergyBarShape pct={vals[0]} repaired={repaired} />,
  },
  {
    id: "m2-reactor-core",
    name: "Reactor Core",
    robotLabel: "Sharing Machine #B2 — Reactor Core",
    parts: 2,
    mechanic: "snap",
    orientation: "horizontal",
    robotBriefing:
      "The reactor core just got split into two wedges to power two stations. The machine swears it's a perfect half. Tap Start Scanner.",
    robotInvestigate:
      "One station will run on the small wedge, the other on the giant wedge. Does that look like a true half to you?",
    robotDetect:
      "I see it too — the wedges aren't matching. Explain why two pieces don't always make halves.",
    robotExplainWrong:
      "Really? One wedge is tiny and the other huge. Halves should look identical. Tell me what makes them equal.",
    robotExplain:
      "Beautiful! Now teach me — why does cutting straight through the middle give us true halves?",
    robotRepair:
      "Slide the laser until the two wedges look identical. It will snap when perfect.",
    robotSuccess: "Perfect halves! Both stations get equal power.",
    initialVals: [70],
    target: [50],
    tolerance: 2,
    render: (vals, repaired) => <ReactorDiscShape pct={vals[0]} repaired={repaired} />,
  },
  {
    id: "m2-power-cell",
    name: "Power Cell",
    robotLabel: "Sharing Machine #C3 — Power Cell",
    parts: 2,
    mechanic: "snap",
    orientation: "vertical",
    robotBriefing:
      "This power cell is supposed to be split into a top half and a bottom half. The machine sliced it lopsided. Tap Start Scanner.",
    robotInvestigate:
      "Top chamber, bottom chamber. The machine says these are halves. Does each chamber hold the same fuel?",
    robotDetect:
      "Right — one chamber dwarfs the other. Tell me what would have to be true for these to be real halves.",
    robotExplainWrong:
      "Are you sure? One chamber is huge, the other is tiny. Tell me again — what makes two pieces real halves?",
    robotExplain:
      "Balanced! Teach me — why does putting the cut right in the middle give us true halves?",
    robotRepair:
      "Drag the laser up or down until both chambers are exactly equal. It will snap when fair.",
    robotSuccess: "Two equal chambers — the cell is balanced!",
    initialVals: [22],
    target: [50],
    tolerance: 2,
    render: (vals, repaired) => <PowerCellShape pct={vals[0]} repaired={repaired} />,
  },
  {
    id: "m2-fuel-rod",
    name: "Fuel Rod",
    robotLabel: "Sharing Machine #D4 — Fuel Rod",
    parts: 2,
    mechanic: "snap",
    orientation: "horizontal",
    robotBriefing:
      "Last machine — sharing this fuel rod between two engines. The cut looks… questionable. Tap Start Scanner.",
    robotInvestigate:
      "Two engines, two pieces of rod. Does each engine get an equal share?",
    robotDetect:
      "Yep — totally unfair. Tell me why splitting it like this doesn't count as halves.",
    robotExplainWrong:
      "Really? Look at how skinny one side is. Tell me what 'halves' really has to mean.",
    robotExplain:
      "All fixed! Why does the middle cut always create true halves? Teach me!",
    robotRepair: "Drag the laser to the middle. It will snap when both pieces match.",
    robotSuccess: "Equal halves of fuel — both engines run fair!",
    initialVals: [78],
    target: [50],
    tolerance: 2,
    render: (vals, repaired) => <EnergyBarShape pct={vals[0]} repaired={repaired} />,
  },
];

/* ---------------- MISSION 3 — Quarter Core Reactor (all quarters, range) ---------------- */
// All items have 4 equal parts. Reuse existing render functions.

export const MISSION_3_GLITCHES: Glitch[] = [
  {
    ...solar,
    id: "m3-solar",
    name: "Solar Array",
    robotLabel: "QUARTER PANEL #1",
    robotBriefing:
      "Detective! The Quarter Core Reactor needs four equal panels of sunlight. The machine cut it all wrong. Tap Start Scanner.",
    robotInvestigate:
      "Four panels — but are all four really quarters? Look at the sizes.",
    robotDetect:
      "Yes, they're uneven! Explain why these are not real quarters.",
    robotExplainWrong:
      "Hmm — one quarter is huge and another is tiny. Tell me what 'quarters' really means.",
    robotExplain:
      "Four matching quarters! Teach me — why must all four parts be the same size?",
    robotRepair:
      "Move both sliders so all four quarters match, then tap Check Repair.",
    robotSuccess: "Four equal quarters — the array is calibrated!",
    initialVals: [25, 75],
    target: [50, 50],
    tolerance: 5,
  },
  {
    ...chocolate,
    id: "m3-chocolate-bar",
    name: "Quarter Chocolate Bar",
    robotLabel: "4 CANDY PIECES",
    parts: 4,
    robotBriefing:
      "This candy bar must be split into four equal quarters for four friends. The cutter messed it up. Tap Start Scanner.",
    robotInvestigate:
      "Four pieces — but does every friend get the same? Check the widths.",
    robotDetect:
      "Tell me why these chunks aren't true quarters.",
    robotExplainWrong:
      "Really? One piece is way bigger. What has to be true for them to be quarters?",
    robotExplain:
      "Four matching pieces! Teach me — why do all four have to be equal to call them quarters?",
    robotRepair:
      "Move the three dividers until all four pieces are the same, then tap Check Repair.",
    robotSuccess: "Four equal quarters — fair candy for everyone!",
    initialVals: [10, 35, 60],
    target: [25, 50, 75],
    tolerance: 5,
    render: chocolate.render, // BarShape handles any vals length
  },
  {
    ...solar,
    id: "m3-window",
    name: "Window Quadrants",
    robotLabel: "GLASS QUARTERS",
    robotBriefing:
      "These windowpanes ship as four equal quarters. The machine sliced unevenly. Tap Start Scanner.",
    robotInvestigate:
      "Four panes — is each one a true quarter of the whole window?",
    robotDetect:
      "Right! Tell me why uneven panes can't be called quarters.",
    robotExplainWrong:
      "Look again — these panes are clearly different sizes. What does 'quarter' actually mean?",
    robotExplain:
      "All four panes match! Why must each quarter be exactly the same? Teach me.",
    robotRepair:
      "Drag both sliders to make all four panes equal, then Check Repair.",
    robotSuccess: "Four equal panes — perfect quarters!",
    initialVals: [70, 30],
    target: [50, 50],
    tolerance: 5,
  },
  {
    ...chocolate,
    id: "m3-shelf",
    name: "Cargo Shelf",
    robotLabel: "4 SHELF SECTIONS",
    parts: 4,
    robotBriefing:
      "The cargo shelf needs four equal slots. The dividers slipped! Tap Start Scanner.",
    robotInvestigate:
      "Four slots, four crates. But are all four slots really quarters?",
    robotDetect:
      "Exactly — uneven. Tell me what's wrong with calling these quarters.",
    robotExplainWrong:
      "Hmm — those widths are way off. Tell me again what 'quarter' really means.",
    robotExplain:
      "Four matching slots! Teach me — why must each slot be the same size?",
    robotRepair:
      "Adjust the three dividers until all four slots are equal, then Check Repair.",
    robotSuccess: "Four equal slots — cargo balanced!",
    initialVals: [40, 60, 85],
    target: [25, 50, 75],
    tolerance: 5,
    render: chocolate.render,
  },
];

/* ---------------- MISSION 4 — Share Builder Challenge (mix of halves + quarters) ---------------- */

export const MISSION_4_GLITCHES: Glitch[] = [
  {
    ...pizza,
    id: "m4-pizza-halves",
    name: "Pizza Halves",
    robotLabel: "2 PIZZA HALVES",
    robotBriefing:
      "Final challenge, Detective! First up — pizza for two. The machine claims halves. Tap Start Scanner.",
    robotInvestigate:
      "Two slices for two friends. Are these really halves?",
    robotDetect:
      "Tell me why this cut isn't real halves.",
    robotExplainWrong:
      "Hmm, one slice is huge. Tell me what 'half' really has to mean.",
    robotExplain:
      "Equal slices! Teach me — why must halves be the same size?",
    robotRepair: "Slide the divider so both halves match. Then Check Repair.",
    robotSuccess: "Two equal halves — fair pizza!",
  },
  {
    ...solar,
    id: "m4-solar-quarters",
    name: "Solar Quarters",
    robotLabel: "4 SOLAR QUARTERS",
    robotBriefing:
      "Next — solar panel split into four. The machine says quarters. Tap Start Scanner.",
    robotInvestigate:
      "Four panels. Are all four really quarters?",
    robotDetect: "Right! Tell me why these are not real quarters.",
    robotExplainWrong:
      "Look again — panels are uneven. What does 'quarter' have to mean?",
    robotExplain:
      "Four matching panels! Why must every quarter be the same? Teach me.",
    robotRepair:
      "Move both sliders to make all four equal, then Check Repair.",
    robotSuccess: "Four equal quarters — sunshine balanced!",
  },
  {
    ...battery,
    id: "m4-battery-halves",
    name: "Battery Halves",
    robotLabel: "BATTERY HALVES",
    robotBriefing:
      "Halfway done! This battery must be split into a top half and bottom half. Tap Start Scanner.",
    robotInvestigate: "Top vs bottom — are these halves?",
    robotDetect: "Tell me why this split isn't real halves.",
    robotExplainWrong:
      "Hmm — one side dwarfs the other. What makes a true half?",
    robotExplain:
      "Balanced! Teach me — why does the middle cut create halves?",
    robotRepair: "Drag the slider to the middle, then Check Repair.",
    robotSuccess: "Equal halves — battery balanced!",
  },
  {
    ...chocolate,
    id: "m4-chocolate-quarters",
    name: "Chocolate Quarters",
    robotLabel: "4 CANDY PIECES",
    parts: 4,
    robotBriefing:
      "Last item! Chocolate split into four for four friends. Machine claims quarters. Tap Start Scanner.",
    robotInvestigate:
      "Four pieces. Does every friend get a true quarter?",
    robotDetect: "Tell me why these aren't real quarters.",
    robotExplainWrong:
      "Sizes look way off. What does 'quarter' actually mean?",
    robotExplain:
      "Four matching pieces! Why must every quarter be the same? Teach me.",
    robotRepair:
      "Drag the three dividers until all four pieces match, then Check Repair.",
    robotSuccess: "Four equal quarters — fair shares for all!",
    initialVals: [15, 40, 65],
    target: [25, 50, 75],
    tolerance: 5,
    render: chocolate.render,
  },
];
