/**
 * LEVEL 03 — THE SHAPE SHIFTERS.
 *
 * Core idea: equivalent fractions show the SAME AMOUNT of the SAME WHOLE,
 * even when the pieces — and therefore the numbers — are different.
 *
 * Deliberately NOT in this level:
 *  - the "multiply the top and the bottom by the same number" rule. The child
 *    discovers the invariant visually first; the notation can describe it
 *    later.
 *  - simplifying fractions. That is a different reasoning move and belongs
 *    after "I can make a fraction look different without changing its value".
 *
 * The arc is the shared one: discover → transfer → represent → reason.
 */
import type { CaseDefinition } from "@/components/investigation/types";

export type Level03CaseId = "bars" | "pizza" | "factory" | "forensics";

export const LEVEL_03_ORDER: Level03CaseId[] = ["bars", "pizza", "factory", "forensics"];

const LEVEL = {
  levelId: "level-03",
  levelTitle: "The Shape Shifters",
  concept: "Equivalent Fractions",
} as const;

export const LEVEL_03_CASES: Record<Level03CaseId, CaseDefinition> = {
  /* ------------------------------------------------ 03.01 · DISCOVER */
  bars: {
    ...LEVEL,
    caseId: "case-03.01",
    number: "03.01",
    title: "The Shape Shifters",
    shortTitle: "Shape Shifters",
    subtitle: "Can two fractions look different but show the same amount?",
    missionTitle: "THE DIFFERENT-NUMBERS GLITCH",
    progression: "discover",
    emoji: "🍫",
    story:
      "ZED-4 has two identical chocolate bars. Bar A is cut into 2 equal parts with 1 part shaded — 1/2. Bar B is cut into 4 equal parts with 2 parts shaded — 2/4. ZED-4 says they cannot possibly be the same.",
    chatEndpoint: "/api/chat/case-03-bars",
    chatId: "case-03-bars",
    welcomeText:
      "You lined my bars up. Tell me — how can 1/2 and 2/4 be the same amount when the numbers are different?",
    zedClaim: {
      heading: '"These cannot be the same."',
      lines: [
        "One says 1/2 and the other says 2/4.",
        "1 and 2 are different numbers.",
        "2 and 4 are different numbers.",
        "Different numbers mean different amounts!",
      ],
      isCorrect: false,
      errorType: "compared the numbers instead of the amounts",
    },
    model: {
      render: "model",
      shape: "bar",
      unitLabel: "piece",
      totalParts: 4,
      selectedParts: 2,
      repair: {
        targetTotal: 4,
        targetSelected: 2,
        startTotal: 4,
        startSelected: 0,
        instruction: "Make the second bar show exactly the same amount as 1/2.",
        howTo:
          "Tap a piece to shade it or unshade it. The bar is already cut into 4 equal pieces. How many of those pieces cover the same amount as one half?",
      },
    },
    investigate: {
      title: "Wait. Don't trust the claim yet.",
      text: "Investigate the two chocolate bars before you decide anything.",
      boardTitle: "Shade pieces of Bar B and watch the amount.",
      boardText:
        "Bar B is cut into 4 equal pieces. Try shading different numbers of pieces and see how much of the bar is covered.",
      observations: [
        "The bars are the same size.",
        "One bar has more pieces.",
        "Both show the same amount shaded.",
        "The pieces are different sizes.",
        "The numbers are different.",
      ],
      compare: {
        title: "Put the bars next to each other.",
        text: "Line them up and look at the shaded amounts, not the numbers.",
        left: {
          label: "Chocolate Bar A",
          render: "model",
          shape: "bar",
          unitLabel: "piece",
          total: 2,
          selected: 1,
          fraction: "1/2",
          split: {
            into: 2,
            label: "SPLIT EACH PIECE IN 2",
            resultFraction: "2/4",
            caption: "The amount didn't change. The pieces changed.",
          },
        },
        right: {
          label: "Chocolate Bar B",
          render: "model",
          shape: "bar",
          unitLabel: "piece",
          total: 4,
          selected: 2,
          fraction: "2/4",
        },
        alignedText: "The shaded amounts reach exactly the same place. 1/2 = 2/4.",
        overlayText: "Same amount. Different pieces.",
      },
    },
    hints: [
      "Look at the shaded part of each bar. How far along the bar does it reach?",
      "The bars are the same size. Does the shaded chocolate cover the same amount?",
      "Split the one half into 2 smaller equal pieces. What fraction do you see now?",
    ],
    detect: {
      question: "What's the glitch?",
      choices: [
        "ZED-4 only looked at the numbers.",
        "ZED-4 forgot to compare the amounts.",
        "ZED-4 forgot to count the pieces.",
        "The chocolate bars are different sizes.",
      ],
      correctIndex: 1,
      nudge:
        "ZED-4 looked at 1, 2 and 4. What did he never actually look at on the bars themselves?",
      evidence: {
        prompt: "Prove it. Line the bars up and compare the shaded amounts.",
        actionLabel: "COMPARE THE SHADED AMOUNTS",
        doneLabel: "AMOUNTS COMPARED ✓",
        question: "When the bars are lined up, how much chocolate is shaded?",
        choices: [
          { label: "Bar B has more shaded", correct: false },
          { label: "Both bars have the same amount shaded", correct: true },
          { label: "Bar A has more shaded", correct: false },
        ],
        retry: "Look again at how far the shading reaches along each bar.",
        type: "same-amount check",
      },
    },
    repair: {
      title: "Make the second bar match 1/2.",
      text: "Bar B is cut into 4 equal pieces. Shade the same amount as one half.",
      checkText: "Not the same amount yet. How far along does 1/2 reach?",
      successText: "You built 2/4 — the same amount as 1/2, in smaller pieces.",
      confirm: {
        question: "Does your bar show the same amount as 1/2?",
        yes: "YES — 2 out of 4 covers one half.",
        no: "NO — it still looks different.",
        yesReply: "1/2 = 2/4. Different pieces, different numbers, same amount.",
        noReply: "That's fine. Keep shading until it reaches the same place as 1/2.",
      },
      followUp: {
        question: "Why are 1/2 and 2/4 equivalent?",
        choices: [
          "They have the same numbers.",
          "They show the same amount.",
          "They have the same number of pieces.",
          "2 is bigger than 1.",
        ],
        correctIndex: 1,
        retry: "Look at the bars, not the numbers. What is the same about them?",
        reply: "Yes — the amount is the same. Only the pieces changed.",
      },
    },
    explain: {
      title: "Tell ZED-4 what you found.",
      text: "Build your answer, speak it, or write it. You do not need a blank page.",
      slots: [
        {
          prompt: "1/2 and 2/4 are different fraction names for…",
          options: [
            "the same amount",
            "different amounts",
            "different sized bars",
            "bigger numbers",
          ],
        },
        {
          prompt: "That works because when we split each piece in two…",
          options: [
            "the pieces got smaller but the amount stayed the same",
            "the bar got bigger",
            "we added more chocolate",
            "the amount got smaller",
          ],
        },
      ],
      sentence: (a) => `1/2 and 2/4 are different fraction names for ${a[0]}, because ${a[1]}.`,
      detectiveNote:
        "Same amount, different pieces, different numbers. Compare the amount, not just the numerals.",
    },
    zedResponse:
      "I see it now! I was comparing the numbers instead of comparing what the fractions showed. The pieces changed, but the amount stayed the same.",
    detectiveSkill: "Compare the amount, not just the numbers.",
    apply:
      "Fold a piece of paper in half and colour one half. Now fold it again to make 4 parts. How many parts are coloured? Did the coloured amount change?",
    reportModelLabel: "chocolate bar pieces",
    whatHappened:
      "ZED-4 claimed 1/2 and 2/4 must be different because the numbers are different.",
  },

  /* ------------------------------------------------ 03.02 · TRANSFER */
  pizza: {
    ...LEVEL,
    caseId: "case-03.02",
    number: "03.02",
    title: "The Pizza Twins",
    shortTitle: "Pizza Twins",
    subtitle: "Can the same amount have another fraction name?",
    missionTitle: "THE MORE-PIECES GLITCH",
    progression: "transfer",
    emoji: "🍕",
    story:
      "Two identical pizzas are on the counter. Pizza A is cut into 2 equal slices with 1 shaded — 1/2. Pizza B is cut into 6 equal slices with 3 shaded — 3/6. ZED-4 is counting slices again.",
    chatEndpoint: "/api/chat/case-03-pizza",
    chatId: "case-03-pizza",
    welcomeText:
      "You matched my pizzas. How can 3 slices be the same amount of pizza as 1 slice?",
    zedClaim: {
      heading: '"Six pieces must mean more pizza!"',
      lines: [
        "I don't believe these are the same.",
        "This pizza has 2 pieces.",
        "That pizza has 6.",
        "So the second one must be more pizza.",
      ],
      isCorrect: false,
      errorType: "counted pieces instead of checking how much of the whole they cover",
    },
    model: {
      render: "model",
      shape: "pizza",
      unitLabel: "slice",
      totalParts: 6,
      selectedParts: 3,
      repair: {
        targetTotal: 6,
        targetSelected: 3,
        startTotal: 6,
        startSelected: 0,
        instruction: "Make the second pizza show the same amount as 1/2.",
        howTo:
          "Tap a slice to shade it or unshade it. The pizza is cut into 6 equal slices. How many of those slices cover the same amount as one half?",
      },
    },
    investigate: {
      title: "Compare the pizzas.",
      text: "Don't count only the pieces. Look at how much of each pizza is covered.",
      boardTitle: "Shade slices of Pizza B and watch how much is covered.",
      boardText: "Six slices are smaller than two slices. Try shading different amounts.",
      observations: [
        "The pizzas are the same size.",
        "Pizza B has more slices.",
        "Pizza B's slices are smaller.",
        "The same amount of pizza looks shaded on both.",
        "The numbers 1/2 and 3/6 are different.",
      ],
      compare: {
        title: "Put the pizzas together.",
        text: "Line them up and check how much of each pizza is shaded.",
        left: {
          label: "Pizza A",
          render: "model",
          shape: "pizza",
          unitLabel: "slice",
          total: 2,
          selected: 1,
          fraction: "1/2",
          split: {
            into: 3,
            label: "SPLIT EACH SLICE IN 3",
            resultFraction: "3/6",
            caption: "Same pizza. Smaller slices. Same amount shaded.",
          },
        },
        right: {
          label: "Pizza B",
          render: "model",
          shape: "pizza",
          unitLabel: "slice",
          total: 6,
          selected: 3,
          fraction: "3/6",
        },
        alignedText: "The three sixths cover exactly the same amount as one half. 1/2 = 3/6.",
        overlayText: "Three small slices cover exactly one half. Same amount, another name.",
      },
    },
    hints: [
      "How much of Pizza A is shaded? Half of it, or less?",
      "Now look at Pizza B. Do the 3 shaded slices cover half of the pizza too?",
      "Cutting a pizza into more slices doesn't add pizza. It just makes the slices smaller.",
    ],
    detect: {
      question: "What's wrong with ZED-4's reasoning?",
      choices: [
        "He counted the slices without checking how much of the pizza they cover.",
        "He counted the slices incorrectly.",
        "The pizzas are different sizes.",
        "Nothing is wrong — 6 is more than 2.",
      ],
      correctIndex: 0,
      nudge: "More slices means smaller slices. Did ZED-4 check how much pizza was shaded?",
      evidence: {
        prompt: "Show your evidence. Match the shaded slices against the half.",
        actionLabel: "MATCH THE SHADED SLICES",
        doneLabel: "SLICES MATCHED ✓",
        question: "How much of each pizza is shaded?",
        choices: [
          { label: "Pizza B has more shaded", correct: false },
          { label: "Half of each pizza is shaded", correct: true },
          { label: "Pizza A has more shaded", correct: false },
        ],
        retry: "Slide the three sixths next to the half. Do they cover the same amount?",
        type: "same-amount check",
      },
      followUp: {
        question: "Which one is more pizza?",
        choices: ["1/2", "3/6", "They are the same amount"],
        correctIndex: 2,
        retry: "Look at the shaded pizza, not the slice count.",
        reply: "Right — the same amount, with a different name.",
      },
    },
    repair: {
      title: "Make the second pizza show the same amount.",
      text: "Pizza B is cut into 6 equal slices. Shade the same amount as 1/2.",
      checkText: "Not quite the same amount yet. Half the pizza — how many sixths is that?",
      successText: "You built 3/6 — the same amount of pizza as 1/2.",
      confirm: {
        question: "Does your pizza show the same amount as 1/2?",
        yes: "YES — 3 out of 6 covers one half.",
        no: "NO — it still looks different.",
        yesReply: "1/2 = 3/6. More pieces doesn't mean more pizza.",
        noReply: "No problem. Keep shading until half the pizza is covered.",
      },
    },
    explain: {
      title: "Tell ZED-4 why 3/6 can be the same as 1/2.",
      text: "Build your answer, speak it, or write it.",
      slots: [
        {
          prompt: "3/6 is the same amount as 1/2 because…",
          options: [
            "the three sixths cover the same amount as one half",
            "6 is bigger than 2",
            "there are more slices",
            "the pizzas are different",
          ],
        },
        {
          prompt: "More slices means…",
          options: [
            "the slices are smaller",
            "there is more pizza",
            "the pizza gets bigger",
            "the amount changes",
          ],
        },
      ],
      sentence: (a) => `3/6 is the same amount as 1/2 because ${a[0]}, and more slices means ${a[1]}.`,
      detectiveNote:
        "More pieces does not mean more pizza. The slices got smaller, so the amount stayed the same.",
    },
    zedResponse:
      "So more pieces doesn't always mean more pizza. I have to check how much of the whole those pieces cover.",
    detectiveSkill: "Same amount can have different names.",
    apply:
      "Next time you share food, cut one portion into more pieces than the other but keep the amounts the same. Ask someone which is more — then show them the evidence.",
    reportModelLabel: "pizza slices",
    whatHappened: "ZED-4 claimed 3/6 was more pizza than 1/2 because it had more slices.",
  },

  /* ----------------------------------------------- 03.03 · REPRESENT */
  factory: {
    ...LEVEL,
    caseId: "case-03.03",
    number: "03.03",
    title: "The Fraction Factory",
    shortTitle: "Fraction Factory",
    subtitle: "What changes, and what stays the same?",
    missionTitle: "THE SPLITTING MACHINE GLITCH",
    progression: "represent",
    emoji: "🏭",
    story:
      "ZED-4 is running the Fraction Factory. He starts with a panel showing 1/3, then the machine splits every piece into 2 smaller equal pieces. Now ZED-4 is confused about what he is looking at.",
    chatEndpoint: "/api/chat/case-03-factory",
    chatId: "case-03-factory",
    welcomeText:
      "The factory split every piece in two. What happened to the shaded amount, and what happened to the pieces?",
    zedClaim: {
      heading: '"I think I have 1/6 now!"',
      lines: [
        "I started with 1/3.",
        "Now there are 6 pieces.",
        "So the shaded part must be 1/6.",
        "Wait... maybe 2/6? Detective, the factory is glitching!",
      ],
      isCorrect: false,
      errorType: "changed the whole but forgot the shaded part was split too",
    },
    model: {
      render: "model",
      shape: "panel",
      unitLabel: "section",
      totalParts: 6,
      selectedParts: 2,
      repair: {
        adjustableTotal: { min: 3, max: 8 },
        targetTotal: 6,
        targetSelected: 4,
        startTotal: 3,
        startSelected: 2,
        instruction:
          "This time start with 2/3. The factory splits every piece into 2. Build what shows the same amount.",
        howTo:
          "Use + and − to change how many equal pieces the panel has. Tap a piece to shade it. Splitting each of 3 pieces into 2 gives 6 pieces — and each shaded piece becomes 2 shaded pieces.",
      },
    },
    investigate: {
      title: "What changed, and what stayed the same?",
      text: "Watch the factory split each third into two smaller equal pieces.",
      boardTitle: "Shade sections and see what each fraction covers.",
      boardText: "The panel is the same size all the way through. Only the cuts change.",
      observations: [
        "The panel stayed the same size.",
        "There are more pieces now.",
        "Each piece is smaller than before.",
        "The shaded piece got split into 2 shaded pieces.",
        "The shaded amount did not change.",
      ],
      compare: {
        title: "Before the factory and after the factory.",
        text: "Split the first panel and watch what happens to the shaded amount.",
        left: {
          label: "Before: 1/3",
          render: "model",
          shape: "panel",
          unitLabel: "section",
          total: 3,
          selected: 1,
          fraction: "1/3",
          split: {
            into: 2,
            label: "RUN THE FACTORY (SPLIT EACH PIECE IN 2)",
            resultFraction: "2/6",
            caption: "The factory didn't add anything. It only cut smaller. 1/3 = 2/6.",
          },
        },
        right: {
          label: "After: 2/6",
          render: "model",
          shape: "panel",
          unitLabel: "section",
          total: 6,
          selected: 2,
          fraction: "2/6",
        },
        alignedText: "The shaded amount lines up exactly. 1/3 = 2/6.",
        overlayText: "The factory only cut smaller. The shaded amount never moved.",
      },
    },
    hints: [
      "Look at the shaded strip before and after. Does it cover more of the panel now?",
      "When the machine cut each third in two, what happened to the shaded third?",
      "One shaded piece became two shaded pieces. So how many out of 6 are shaded?",
    ],
    detect: {
      question: "What's the glitch?",
      choices: [
        "The whole was divided into more pieces, but the shaded amount was split too.",
        "The factory made the panel bigger.",
        "There are only 3 pieces.",
        "Nothing is wrong — it is 1/6.",
      ],
      correctIndex: 0,
      nudge: "ZED-4 changed the bottom number but forgot the shaded piece was cut as well.",
      evidence: {
        prompt: "Show your evidence. Lay the old shaded third over the new panel.",
        actionLabel: "OVERLAY THE SHADED THIRD",
        doneLabel: "OVERLAY CHECKED ✓",
        question: "How many of the 6 new pieces does the old shaded third cover?",
        choices: [
          { label: "1 piece", correct: false },
          { label: "2 pieces", correct: true },
          { label: "3 pieces", correct: false },
        ],
        retry: "Count the small pieces sitting inside the old shaded third.",
        type: "what-changed check",
      },
    },
    repair: {
      title: "Now run the factory on 2/3.",
      text: "Start with 2 shaded out of 3. The machine splits every piece into 2. Build the fraction that shows the same amount.",
      checkText: "Keep going. Splitting each piece in two doubles the pieces AND the shaded ones.",
      successText: "You built 4/6 — the same amount as 2/3.",
      confirm: {
        question: "Does your panel show the same amount as 2/3?",
        yes: "YES — 4 out of 6 covers the same amount.",
        no: "NO — something still looks off.",
        yesReply: "2/3 = 4/6. The pieces got smaller; the amount stayed the same.",
        noReply: "That's fine. Each of the 3 pieces becomes 2 — try again.",
      },
      followUp: {
        question: "Why is 2/3 still the same amount as 4/6?",
        choices: [
          "Because the same amount is shaded.",
          "Because 4 is bigger than 2.",
          "Because there are more pieces.",
          "Because 6 is double 3.",
        ],
        correctIndex: 0,
        retry: "Look at how much of the panel is coloured, not at the numbers.",
        reply: "Exactly — the same amount is shaded, just in smaller pieces.",
      },
    },
    explain: {
      title: "Tell ZED-4 what the factory really did.",
      text: "Build your answer, speak it, or write it.",
      slots: [
        {
          prompt: "The whole was…",
          options: [
            "split into more equal pieces",
            "made bigger",
            "made smaller",
            "given more paint",
          ],
        },
        {
          prompt: "…and the shaded part…",
          options: [
            "was split into more pieces too, so the amount stayed the same",
            "got bigger",
            "got smaller",
            "disappeared",
          ],
        },
      ],
      sentence: (a) => `The whole was ${a[0]}, and the shaded part ${a[1]}.`,
      detectiveNote:
        "Splitting the whole also splits the shaded part. The pieces change; the amount does not.",
    },
    zedResponse:
      "Aha! The factory didn't make more panel. It just cut the same panel into smaller pieces — and the shaded part got cut into smaller pieces too.",
    detectiveSkill: "Track what changes — and what stays the same.",
    apply:
      "Draw a rectangle, split it into 3 and colour 1 part. Now cut each part in half with a pencil line. Count the coloured pieces and the total pieces. What fraction do you have now?",
    reportModelLabel: "factory panel sections",
    whatHappened:
      "ZED-4 split each third into two and thought the shaded amount had become 1/6.",
  },

  /* --------------------------------------------------- 03.04 · REASON */
  forensics: {
    ...LEVEL,
    caseId: "case-03.04",
    number: "03.04",
    title: "Fraction Forensics",
    shortTitle: "Fraction Forensics",
    subtitle: "Prove it with evidence.",
    missionTitle: "THE CONFIDENT CLAIM",
    progression: "reason",
    emoji: "🔎",
    story:
      "ZED-4 has filed a full investigation report. He compared 3/6 and 2/4 and says he has the evidence right there. He sounds extremely sure of himself.",
    chatEndpoint: "/api/chat/case-03-forensics",
    chatId: "case-03-forensics",
    welcomeText:
      "You proved me wrong. Tell me how you knew 3/6 and 2/4 were the same — what evidence did you use?",
    zedClaim: {
      heading: '"3/6 is bigger because 3 is bigger than 2."',
      lines: [
        "I investigated these fractions.",
        "3/6 has a 3 on top. 2/4 only has a 2.",
        "3 is bigger than 2, so 3/6 must be bigger.",
        "I've got the evidence right here. Case closed.",
      ],
      isCorrect: false,
      errorType: "compared the numerators instead of the amounts",
    },
    model: {
      render: "model",
      shape: "panel",
      unitLabel: "section",
      totalParts: 6,
      selectedParts: 3,
      repair: {
        adjustableTotal: { min: 2, max: 8 },
        targetTotal: 4,
        targetSelected: 2,
        startTotal: 6,
        startSelected: 3,
        instruction: "You start with 3/6. Build an equivalent fraction using fourths.",
        howTo:
          "Use + and − to change the panel to 4 equal pieces, then tap to shade. How many fourths cover the same amount as 3/6?",
      },
    },
    investigate: {
      title: "Something doesn't look right.",
      text: "Can you prove ZED-4 wrong? Gather your evidence first.",
      boardTitle: "Explore 3/6 on the panel.",
      boardText: "Shade and unshade pieces. How much of the panel does 3 out of 6 cover?",
      observations: [
        "Both wholes are the same size.",
        "3/6 covers half of the panel.",
        "2/4 covers half of the panel.",
        "The numbers are different.",
        "The shaded areas match.",
      ],
      compare: {
        title: "Model A and Model B.",
        text: "Both wholes are identical. Line them up and compare the shaded areas.",
        left: {
          label: "Model A — 3/6",
          render: "model",
          shape: "panel",
          unitLabel: "section",
          total: 6,
          selected: 3,
          fraction: "3/6",
        },
        right: {
          label: "Model B — 2/4",
          render: "model",
          shape: "panel",
          unitLabel: "section",
          total: 4,
          selected: 2,
          fraction: "2/4",
        },
        alignedText: "The shaded areas match exactly. 3/6 = 2/4.",
        overlayText: "The shaded areas match exactly. 3 is bigger than 2, but the amounts are equal.",

      },
      numberLine: {
        title: "Second piece of evidence: the number line.",
        text: "Pick a fraction, then tap the point where it belongs between 0 and 1.",
        steps: 12,
        marks: [
          { label: "3/6", numerator: 3, denominator: 6 },
          { label: "2/4", numerator: 2, denominator: 4 },
        ],
        retry: "Not that point. How far along the line to 1 does that fraction reach?",
        doneText: "Both fractions land on exactly the same point. That is strong evidence.",
      },
    },
    hints: [
      "How much of Model A is shaded? And Model B?",
      "Both are half of the whole. Does a bigger top number always mean a bigger amount?",
      "Place both fractions on the number line. Where do they land?",
    ],
    detect: {
      question: "Is ZED-4's claim correct?",
      choices: ["Yes", "No"],
      correctIndex: 1,
      nudge: "Check the models and the number line before you answer.",
      evidence: {
        prompt: "What's your evidence?",
        actionLabel: "PRESENT MY EVIDENCE",
        doneLabel: "EVIDENCE PRESENTED ✓",
        question: "Which of these is real evidence that 3/6 and 2/4 are the same?",
        choices: [
          { label: "They land at the same point on the number line.", correct: true },
          { label: "3 is bigger than 2.", correct: false },
          { label: "6 is bigger than 4.", correct: false },
        ],
        retry: "Evidence has to show the AMOUNT. Which choice does that?",
        type: "evidence-based comparison",
      },
      followUp: {
        question: "And what did the two models show?",
        choices: [
          "The shaded areas match.",
          "Model A had more shaded.",
          "The wholes were different sizes.",
        ],
        correctIndex: 0,
        retry: "Line the models up again and look at the shaded areas.",
        reply: "Two pieces of evidence agree: the models and the number line.",
      },
    },
    repair: {
      title: "Repair ZED-4's investigation.",
      text: "You have 3/6. Build an equivalent fraction using fourths.",
      checkText: "Keep adjusting. You need 4 equal pieces, shading the same amount as 3/6.",
      successText: "You built 2/4 — the same amount as 3/6.",
      confirm: {
        question: "Does your panel show the same amount as 3/6?",
        yes: "YES — 2 out of 4 covers the same amount.",
        no: "NO — it still looks different.",
        yesReply: "3/6 = 2/4. You proved it with models and with the number line.",
        noReply: "No problem. Try 4 equal pieces and shade until it matches.",
      },
    },
    explain: {
      title: "File your detective report.",
      text: "Build your answer, speak it, or write it.",
      slots: [
        {
          prompt: "3/6 and 2/4 are equivalent because…",
          options: [
            "they represent the same amount",
            "3 is bigger than 2",
            "they have the same numbers",
            "6 is double 3",
          ],
        },
        {
          prompt: "I proved it by…",
          options: [
            "comparing the models and using the number line",
            "guessing from the bottom number",
            "comparing the numbers",
            "asking ZED-4",
          ],
        },
      ],
      sentence: (a) => `3/6 and 2/4 are equivalent because ${a[0]}. I proved it by ${a[1]}.`,
      detectiveNote:
        "A bigger numerator does not always mean a bigger amount. Evidence from the model and number line beats the numbers alone.",
    },
    zedResponse:
      "You caught me, Detective. I compared the numbers instead of comparing the fractions. 3 is bigger than 2, but that doesn't make 3/6 bigger than 2/4. The models and the number line show they are the same amount. I need evidence before I make my claim.",
    detectiveSkill: "Prove it with evidence.",
    apply:
      "Next time someone sounds very sure about an answer, ask them: what is your evidence? Then check it yourself with a picture or a line.",
    reportModelLabel: "panel sections and a number line",
    whatHappened:
      "ZED-4 claimed 3/6 was bigger than 2/4 because 3 is bigger than 2.",
  },
};
