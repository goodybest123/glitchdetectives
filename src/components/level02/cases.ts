/**
 * LEVEL 02 — NAMING THE PIECES.
 *
 * Core idea: a fraction tells us how many equal parts we are considering out
 * of the equal parts that make up the whole.
 *
 * The four cases follow the level arc: discover → transfer → represent →
 * reason. The formal words (numerator / denominator) are only named after
 * the child has repaired the model and said what each number does.
 */
import type { CaseDefinition } from "@/components/investigation/types";

export type Level02CaseId = "tray" | "squares" | "wall" | "mystery";

export const LEVEL_02_ORDER: Level02CaseId[] = ["tray", "squares", "wall", "mystery"];

const LEVEL = {
  levelId: "level-02",
  levelTitle: "Naming the Pieces",
  concept: "Naming the Pieces",
} as const;

export const LEVEL_02_CASES: Record<Level02CaseId, CaseDefinition> = {
  /* ------------------------------------------------ 02.01 · DISCOVER */
  tray: {
    ...LEVEL,
    caseId: "case-02.01",
    number: "02.01",
    title: "The Cookie Tray",
    shortTitle: "Cookie Tray",
    subtitle: "Two numbers. Two different jobs.",
    missionTitle: "THE MIXED-UP NUMBERS GLITCH",
    progression: "discover",
    emoji: "🍪",
    story:
      "Maya baked one tray of cookies and cut it into 4 equal cookies. She asked ZED-4 for 3 out of the 4 cookies — that is 3/4. ZED-4 handed her the whole tray and read the two numbers the wrong way round.",
    chatEndpoint: "/api/chat/case-02-tray",
    chatId: "case-02-tray",
    welcomeText:
      "You rebuilt my tray. Can you tell me what the bottom number is counting, and what the top number is counting?",
    zedClaim: {
      heading: "He gave Maya 4 cookies and said the tray only had 3.",
      lines: [
        "Maya asked me for 3/4 of the tray.",
        "I said the tray is made of 3 equal cookies.",
        "Then I gave her 4 cookies.",
        "So the job is done!",
      ],
      isCorrect: false,
      errorType: "swapped the jobs of the two numbers",
    },
    model: {
      shape: "tray",
      unitLabel: "cookie",
      totalParts: 4,
      selectedParts: 4,
      repair: {
        adjustableTotal: { min: 2, max: 8 },
        targetTotal: 4,
        targetSelected: 3,
        instruction: "Make the tray show 3 cookies chosen out of 4.",
      },
    },
    investigate: {
      title: "First question: how many cookies is the whole tray cut into?",
      text: "Count every cookie on the tray, even the ones nobody has taken.",
      boardTitle: "Now tap cookies to take some, and watch the two numbers.",
      boardText:
        "The bottom number never changes — it counts every cookie on the tray. Only the top number changes when you take some.",
      observations: [
        "The whole tray is cut into 4 equal cookies.",
        "ZED-4 said the tray had only 3 cookies.",
        "The cookies are all the same size.",
        "Taking more cookies only changes the top number.",
      ],
    },
    hints: [
      "Count all the cookies on the tray. How many are there altogether?",
      "The tray has 4 cookies, but ZED-4 said 3. Which number should the 4 be — top or bottom?",
      "Point at each cookie and count out loud. All the cookies go on the bottom. The ones Maya takes go on top.",
    ],
    detect: {
      question: "What did ZED-4 mix up?",
      choices: [
        "The colour of the cookies",
        "He swapped what the two numbers count",
        "The number of people",
        "The tray is the wrong shape",
      ],
      correctIndex: 1,
      nudge:
        "One number counts all the cookies on the tray. The other counts the ones Maya takes. Did ZED-4 use them that way?",
      evidence: {
        prompt: "Count the tray and show what each number should be counting.",
        actionLabel: "COUNT THE WHOLE TRAY",
        doneLabel: "TRAY COUNTED ✓",
        question: "How many equal cookies make the whole tray?",
        choices: [
          { label: "3 equal cookies", correct: false },
          { label: "4 equal cookies", correct: true },
        ],
        retry: "Let's count again. Touch every cookie on the tray, including the ones left behind.",
        type: "part count",
      },
    },
    repair: {
      title: "Rebuild the tray so it really shows 3/4.",
      text: "Set the tray to 4 equal cookies, then choose the 3 cookies Maya takes.",
      successText: "That is 3 cookies chosen out of 4. The tray now matches the fraction.",
      confirm: {
        question: "Does your tray show 3/4?",
        yes: "YES — 4 cookies on the tray, 3 of them chosen.",
        no: "NO — something still looks off.",
        yesReply:
          "Exactly. The bottom number counts all the cookies. The top number counts the ones we take.",
        noReply: "No problem. Keep adjusting until the tray matches the fraction.",
      },
    },

    vocabulary: {
      title: "NOW THE DETECTIVE WORDS",
      lines: [
        "The bottom number has a name: denominator. It counts the equal parts in the whole.",
        "The top number has a name: numerator. It counts the parts being considered.",
      ],
    },
    explain: {
      title: "Tell ZED-4 what each number does.",
      text: "Build your answer, speak it, or write it. You do not need a blank page.",
      slots: [
        {
          prompt: "The bottom number tells me…",
          options: [
            "how many equal parts make the whole",
            "how many parts are being shared",
            "how many people are eating",
            "how big the tray is",
          ],
        },
        {
          prompt: "The top number tells me…",
          options: [
            "how many of those parts I have",
            "how many parts make the whole",
            "how many cookies are left over",
            "how many cuts ZED-4 made",
          ],
        },
      ],
      sentence: (a) => `The bottom number tells me ${a[0]}. The top number tells me ${a[1]}.`,
    },
    detectiveSkill: "Give each number a job.",
    apply:
      "Find something at home that is already cut into equal parts — a chocolate bar, a pizza, an ice tray. Ask: how many equal parts make the whole? Then take some and say the fraction out loud.",
    reportModelLabel: "cookie tray parts",
    whatHappened: "ZED-4 read 3/4 and swapped what the top and bottom numbers count.",
  },

  /* ------------------------------------------------ 02.02 · TRANSFER */
  squares: {
    ...LEVEL,
    caseId: "case-02.02",
    number: "02.02",
    title: "The Chocolate Squares",
    shortTitle: "Chocolate Squares",
    subtitle: "What is the bottom number really counting?",
    missionTitle: "THE SIX-PIECES GLITCH",
    progression: "transfer",
    emoji: "🍫",
    story:
      "Leo has one chocolate bar broken into equal squares. ZED-4 wrote 2/6 and explained what the 6 means. He sounds sure — but check him anyway.",
    chatEndpoint: "/api/chat/case-02-squares",
    chatId: "case-02-squares",
    welcomeText:
      "You fixed my chocolate bar. What is the 6 actually counting — and what is the 2 counting?",
    zedClaim: {
      heading: "Six pieces of chocolate. Two taken.",
      lines: [
        "The fraction is 2/6.",
        "The 6 means we have 6 pieces of chocolate.",
        "So the 6 is how much chocolate we took.",
        "Simple!",
      ],
      isCorrect: false,
      errorType: "treated the denominator as the amount taken",
    },
    model: {
      shape: "bar",
      unitLabel: "square",
      totalParts: 6,
      selectedParts: 6,
      repair: {
        adjustableTotal: { min: 3, max: 9 },
        targetTotal: 6,
        targetSelected: 2,
        instruction: "Build 2/6 on the chocolate bar.",
      },
    },
    investigate: {
      title: "Look closely. Check ZED-4's chocolate bar.",
      text: "Tap squares to take some. Watch what changes and what stays the same.",
      boardTitle: "Take some squares and watch the two numbers.",
      boardText: "Does the bottom number change when you take more squares? Try it.",
      observations: [
        "The bar has 6 equal squares.",
        "The bottom number stays at 6 whatever I take.",
        "The top number changes when I take squares.",
        "ZED-4 said the 6 was what we took.",
      ],
    },
    hints: [
      "Look closely at the chocolate bar. What does not change when you take squares?",
      "Take 2 squares. Which number moved — the top or the bottom?",
      "Say it out loud: 2 squares out of 6 equal squares. Which number is the whole bar?",
    ],
    detect: {
      question: "What did ZED-4 get wrong about the 6?",
      choices: [
        "The 6 counts the squares taken, not the whole bar",
        "The bar has 7 squares",
        "The chocolate is the wrong flavour",
        "The 2 counts the whole bar",
      ],
      correctIndex: 0,
      nudge: "Take a few squares and watch the bottom number. Does it move? What does that tell you?",
      evidence: {
        prompt: "Show what the 6 is counting by looking at the whole bar.",
        actionLabel: "COUNT THE WHOLE BAR",
        doneLabel: "BAR COUNTED ✓",
        question: "What is the 6 counting?",
        choices: [
          { label: "The squares we took", correct: false },
          { label: "All the equal squares in the whole bar", correct: true },
        ],
        retry: "Let's look again. Count every square in the bar, taken or not.",
        type: "whole-versus-part check",
      },
    },
    repair: {
      title: "Rebuild the bar so it really shows 2/6.",
      text: "Set the number of equal squares in the whole, then take the squares being considered.",
      successText: "That is 2 out of 6 equal squares. The bar now matches the fraction.",
      confirm: {
        question: "Does your bar show 2/6?",
        yes: "YES — 6 equal squares, 2 of them taken.",
        no: "NO — something still looks off.",
        yesReply: "Exactly. The bottom number names the whole bar; the top number is what we took.",
        noReply: "That is fine. Adjust the bar until it matches.",
      },
    },
    vocabulary: {
      title: "THE DETECTIVE WORDS AGAIN",
      lines: [
        "Denominator (bottom): how many equal parts make the whole.",
        "Numerator (top): how many of those parts we are considering.",
      ],
    },
    explain: {
      title: "Tell ZED-4 what the numbers are telling him.",
      text: "Build it, say it, or write it — your choice.",
      slots: [
        {
          prompt: "The denominator tells me…",
          options: [
            "how many equal squares make the whole bar",
            "how many squares we took",
            "how many bars there are",
            "how sweet the chocolate is",
          ],
        },
        {
          prompt: "The numerator tells me…",
          options: [
            "how many squares we are considering",
            "how many equal squares are in the whole",
            "how many squares are left in the box",
            "how many people want chocolate",
          ],
        },
      ],
      sentence: (a) => `The denominator tells me ${a[0]}. The numerator tells me ${a[1]}.`,
    },
    detectiveSkill: "Know what the numbers are telling you.",
    apply:
      "Break a snack into equal pieces with someone at home. Take a few. Say the fraction out loud and say what each number counts.",
    reportModelLabel: "chocolate squares",
    whatHappened: "ZED-4 said the 6 in 2/6 was the amount of chocolate taken.",
  },

  /* ----------------------------------------------- 02.03 · REPRESENT */
  wall: {
    ...LEVEL,
    caseId: "case-02.03",
    number: "02.03",
    title: "The Painted Wall",
    shortTitle: "Painted Wall",
    subtitle: "Build what the symbols say.",
    missionTitle: "THE UPSIDE-DOWN GLITCH",
    progression: "represent",
    emoji: "🎨",
    story:
      "The painters asked ZED-4 to paint 2/5 of a wall. ZED-4 read the numbers, then painted his model the other way round: 5 painted sections out of 2. Your job is to build what 2/5 really looks like.",
    chatEndpoint: "/api/chat/case-02-wall",
    chatId: "case-02-wall",
    welcomeText:
      "I built my wall from the numbers. Why can't I just swap the top number and the bottom number?",
    zedClaim: {
      heading: "Five painted sections. Two in the whole.",
      lines: [
        "The order does not matter to me.",
        "2/5 and 5/2 look the same to a robot.",
        "So I painted 5 sections.",
        "Done and dusted!",
      ],
      isCorrect: false,
      errorType: "swapped numerator and denominator in the model",
    },
    model: {
      shape: "wall",
      unitLabel: "section",
      totalParts: 5,
      selectedParts: 5,
      repair: {
        adjustableTotal: { min: 2, max: 8 },
        targetTotal: 5,
        targetSelected: 2,
        instruction: "Build 2/5 on the wall.",
      },
    },
    investigate: {
      title: "Look closely. Does the wall match 2/5?",
      text: "Paint sections yourself and watch how the two numbers move.",
      boardTitle: "Paint some sections and read the fraction.",
      boardText: "Try to make the top number bigger than the bottom one. What would that even mean?",
      observations: [
        "ZED-4 painted every section.",
        "The top number can never be more than the bottom number here.",
        "The wall has 5 equal sections.",
        "Swapping the numbers changes the picture completely.",
      ],
    },
    hints: [
      "Look closely at the wall. How many sections are painted, and how many are there in total?",
      "2/5 means 2 out of 5. Which number should be bigger?",
      "Paint exactly 2 sections and leave 3 plain. Compare that with ZED-4's wall.",
    ],
    detect: {
      question: "What did ZED-4 get wrong?",
      choices: [
        "He used the wrong colour of paint",
        "He swapped the top and bottom numbers when he built the model",
        "The wall has too many sections to paint",
        "He painted the sections in the wrong order",
      ],
      correctIndex: 1,
      nudge: "Read the fraction out loud: 2 out of 5. Now look at how many sections ZED-4 painted.",
      evidence: {
        prompt: "Show how many sections 2/5 should paint.",
        actionLabel: "CHECK THE WALL",
        doneLabel: "WALL CHECKED ✓",
        question: "For 2/5, how many of the 5 sections should be painted?",
        choices: [
          { label: "5 sections", correct: false },
          { label: "2 sections", correct: true },
        ],
        retry: "Let's read it again: two out of five. Which number is the painted amount?",
        type: "symbol-to-model match",
      },
    },
    repair: {
      title: "Build the wall the symbols actually describe.",
      text: "Set the number of equal sections, then paint the right amount.",
      successText: "That is 2 painted out of 5 equal sections. The wall matches 2/5.",
      confirm: {
        question: "Does your wall show 2/5?",
        yes: "YES — 5 equal sections, 2 painted.",
        no: "NO — I want to change it.",
        yesReply: "Exactly. The picture and the symbols now say the same thing.",
        noReply: "Take your time. Adjust the sections until it matches.",
      },
    },
    vocabulary: {
      title: "WHY THE ORDER MATTERS",
      lines: [
        "The denominator (bottom) names how the whole was cut.",
        "The numerator (top) counts what we took from it.",
        "Swap them and you are describing a completely different picture.",
      ],
    },
    explain: {
      title: "Tell ZED-4 why he cannot swap the numbers.",
      text: "Build it, say it, or write it.",
      slots: [
        {
          prompt: "2/5 means…",
          options: [
            "2 painted sections out of 5 equal sections",
            "5 painted sections out of 2",
            "2 walls and 5 painters",
            "5 sections painted twice",
          ],
        },
        {
          prompt: "The numbers cannot be swapped because…",
          options: [
            "each number has a different job",
            "robots are not allowed to paint",
            "5 is bigger than 2",
            "the wall is too wide",
          ],
        },
      ],
      sentence: (a) => `2/5 means ${a[0]}. The numbers cannot be swapped because ${a[1]}.`,
    },
    detectiveSkill: "Connect symbols to what you see.",
    apply:
      "Draw a rectangle at home and split it into 6 equal parts. Colour 4 of them. Now say the fraction out loud, and say what each number counts.",
    reportModelLabel: "wall sections",
    whatHappened: "ZED-4 built his wall model with the numerator and denominator swapped.",
  },

  /* --------------------------------------------------- 02.04 · REASON */
  mystery: {
    ...LEVEL,
    caseId: "case-02.04",
    number: "02.04",
    title: "The Mystery Fraction",
    shortTitle: "Mystery Fraction",
    subtitle: "Does the picture match the description?",
    missionTitle: "THE UNCHECKED CLAIM",
    progression: "reason",
    emoji: "🔍",
    story:
      "There is no finished picture this time — only ZED-4's description. He says he found a fraction with a denominator of 5 and a numerator of 2, and that he drew it correctly. Investigate whether his strip really matches.",
    chatEndpoint: "/api/chat/case-02-mystery",
    chatId: "case-02-mystery",
    welcomeText:
      "I described my fraction and I drew it. Which part of my drawing did not match my own description?",
    zedClaim: {
      heading: "Denominator 5. Numerator 2. Drawing done.",
      lines: [
        "The denominator is 5, so I drew five pieces.",
        "The numerator is 2.",
        "I shaded one piece.",
        "I checked the numbers. Looks right to me.",
      ],
      isCorrect: false,
      errorType: "model does not match his own description",
    },
    model: {
      shape: "strip",
      unitLabel: "piece",
      totalParts: 5,
      selectedParts: 1,
      repair: {
        adjustableTotal: { min: 2, max: 8 },
        targetTotal: 5,
        targetSelected: 2,
        instruction: "Make the strip match ZED-4's own description.",
      },
    },
    investigate: {
      title: "Investigate the claim before you decide.",
      text: "ZED-4 might be right. Test his drawing against his own words, piece by piece.",
      boardTitle: "Shade pieces and test his description.",
      boardText:
        "His description says denominator 5, numerator 2. Build that, then compare it with his drawing.",
      observations: [
        "His strip has 5 pieces — that part matches.",
        "Only 1 piece is shaded.",
        "His numerator was 2, not 1.",
        "Part of his claim is right and part is wrong.",
      ],
    },
    hints: [
      "Look closely. Check each part of ZED-4's description one at a time.",
      "The number of pieces is one claim. The number shaded is a different claim. Test both.",
      "Count the shaded pieces on his strip, then read his numerator again.",
    ],
    detect: {
      question: "Where exactly did ZED-4's reasoning stop matching?",
      choices: [
        "The number of pieces in the whole is wrong",
        "The number of shaded pieces does not match his numerator",
        "Everything he said matches his drawing",
        "A denominator of 5 is not allowed",
      ],
      correctIndex: 1,
      nudge:
        "Careful — one part of his claim really is correct. Which part? Now check the other part.",
      evidence: {
        prompt: "Count the shaded pieces on ZED-4's strip and compare with his numerator.",
        actionLabel: "COUNT THE SHADED PIECES",
        doneLabel: "PIECES COUNTED ✓",
        question: "How many pieces did ZED-4 shade, and how many should he have shaded?",
        choices: [
          { label: "He shaded 1, but the numerator says 2", correct: true },
          { label: "He shaded 2, and the numerator says 2", correct: false },
        ],
        retry: "Look once more at his strip. Count the shaded pieces carefully.",
        type: "claim-against-model check",
      },
    },
    repair: {
      title: "Make the strip match the description.",
      text: "Keep the 5 equal pieces and shade the amount his numerator asks for.",
      successText: "That is 2 shaded out of 5 equal pieces. The drawing now matches the words.",
      confirm: {
        question: "Does the strip now match 'denominator 5, numerator 2'?",
        yes: "YES — 5 equal pieces, 2 shaded.",
        no: "NO — I want to check again.",
        yesReply: "Exactly. You proved it instead of guessing it.",
        noReply: "Good detective instinct. Check the pieces once more.",
      },
    },
    explain: {
      title: "Tell ZED-4 how you tested his claim.",
      text: "Build it, say it, or write it.",
      slots: [
        {
          prompt: "The denominator should tell us…",
          options: [
            "how many equal pieces the whole has",
            "how many pieces are shaded",
            "how many strips there are",
            "which colour to use",
          ],
        },
        {
          prompt: "ZED-4's drawing did not match because…",
          options: [
            "he shaded 1 piece when his numerator said 2",
            "he drew 5 pieces",
            "he used a strip instead of a circle",
            "he described the fraction out loud",
          ],
        },
      ],
      sentence: (a) => `The denominator should tell us ${a[0]}. ZED-4's drawing did not match because ${a[1]}.`,
    },
    detectiveSkill: "Check the symbols against the model.",
    apply:
      "Ask someone at home to describe a fraction out loud without drawing it. Draw what they said, then check together whether your drawing really matches their words.",
    reportModelLabel: "fraction strip pieces",
    whatHappened:
      "ZED-4 described a fraction with denominator 5 and numerator 2, then shaded only one piece.",
  },
};
