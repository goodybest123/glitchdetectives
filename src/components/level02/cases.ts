/**
 * LEVEL 02 — NAMING THE PIECES.
 *
 * Core idea: a fraction has two numbers, and each number has its own job.
 * The bottom number counts the equal parts that make the whole. The top
 * number counts how many of those parts we are considering.
 *
 * The four cases follow the level arc: discover → transfer → represent →
 * reason. The formal words (numerator / denominator) are only named after
 * the child has repaired the model and said what each number does — the goal
 * is never "top = numerator", it is "I know what each number is counting".
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
    missionTitle: "THE MIXED-UP JOBS GLITCH",
    progression: "discover",
    emoji: "🍪",
    story:
      "ZED-4 is preparing a tray of cookies for the detective team. He divided one tray into 4 equal pieces and put a little detective stamp on 3 of them. Then he wrote 3/4 — and told everyone what the two numbers mean.",
    chatEndpoint: "/api/chat/case-02-tray",
    chatId: "case-02-tray",
    welcomeText:
      "You rebuilt my tray. Can you tell me what job the bottom number has, and what job the top number has?",
    zedClaim: {
      heading: "He gave each number the wrong job.",
      lines: [
        "Easy! The fraction is 3/4.",
        "The 3 tells me there are 3 pieces in the whole.",
        "The 4 tells me we're looking at 4 pieces.",
        "Case closed, I'd say.",
      ],
      isCorrect: false,
      errorType: "switched what the two numbers are telling us",
    },
    model: {
      shape: "tray",
      unitLabel: "cookie",
      totalParts: 4,
      selectedParts: 3,
      repair: {
        adjustableTotal: { min: 2, max: 8 },
        targetTotal: 4,
        targetSelected: 3,
        // Start from a blank tray so the child builds 3/4 themselves.
        startTotal: 2,
        startSelected: 0,
        instruction: "Build what 3/4 tells us: 4 equal pieces, 3 of them chosen.",
        howTo:
          "Tap a cookie to choose it or put it back. Use + and − to cut the tray. The bottom number (denominator) 4 counts all the equal pieces. The top number (numerator) 3 counts the ones you chose.",
      },
    },
    investigate: {
      title: "Look closely at the tray. What is each number telling you?",
      text: "Don't answer yet. Count the whole tray, then count the stamped pieces.",
      boardTitle: "Tap the cookies and watch the two numbers.",
      boardText:
        "The bottom number counts every piece on the tray. The top number counts the ones we are considering.",
      observations: [
        "The whole tray is cut into 4 equal pieces.",
        "3 pieces have a detective stamp.",
        "ZED-4 said the 3 was the number of pieces in the whole.",
        "Taking more pieces only changes the top number.",
      ],
      evidenceSort: {
        title: "Give each number a job.",
        text: "Put each number of 3/4 into the evidence area it belongs to.",
        wholeLabel: "How many equal pieces make up the whole?",
        partLabel: "How many pieces are we considering?",
        items: [
          { value: "4", area: "whole" },
          { value: "3", area: "part" },
        ],
        retry: "Hmm — count the tray again. Which number counts EVERY piece?",
        doneText: "4 counts the equal pieces in the whole. 3 counts the pieces we're considering.",
      },
    },
    hints: [
      "Count all the pieces on the tray. How many are there altogether?",
      "The tray has 4 pieces, but ZED-4 said the whole had 3. Which number counts every piece?",
      "Point at each piece and count out loud. All the pieces go with the bottom number. The stamped ones go with the top.",
    ],
    detect: {
      question: "What's wrong with ZED-4's reasoning?",
      choices: [
        "He counted the pieces incorrectly.",
        "He switched what the two numbers are telling us.",
        "The cookie tray should have 3 pieces.",
        "Nothing is wrong.",
      ],
      correctIndex: 1,
      nudge:
        "One number counts all the pieces on the tray. The other counts the stamped ones. Did ZED-4 use them that way?",
      evidence: {
        prompt: "Show me your evidence. Count the tray.",
        actionLabel: "COUNT THE WHOLE TRAY",
        doneLabel: "TRAY COUNTED ✓",
        question: "How many equal pieces make the whole tray?",
        choices: [
          { label: "3 equal pieces", correct: false },
          { label: "4 equal pieces", correct: true },
        ],
        retry: "Let's count again. Touch every piece on the tray, stamped or not.",
        type: "whole-versus-part check",
      },
      followUp: {
        question: "And what is the 3 telling us?",
        choices: [
          "How many pieces make the whole tray",
          "How many pieces we're considering",
          "How many detectives there are",
        ],
        correctIndex: 1,
        retry: "Look at the stamped pieces. How many of them are there?",
        reply: "Yes. 4 pieces in the whole, and 3 of them are the ones we're considering.",
      },
    },
    repair: {
      title: "Build what 3/4 tells us.",
      text: "Divide the whole into 4 equal pieces, then choose 3 of them.",
      checkText: "Check the two numbers again. What job does each one have?",
      successText: "You built 3/4 — 3 pieces chosen out of 4 equal pieces.",
      confirm: {
        question: "Does your tray show 3/4?",
        yes: "YES — 4 equal pieces, 3 of them chosen.",
        no: "NO — something still looks off.",
        yesReply:
          "Exactly. 4 = the equal parts in the whole. 3 = the parts we're considering.",
        noReply: "No problem. Keep adjusting until the tray matches the fraction.",
      },
    },
    vocabulary: {
      title: "NOW THE DETECTIVE WORDS",
      lines: [
        "4 = denominator — the equal parts in the whole.",
        "3 = numerator — the parts we're considering.",
        "Don't just remember the names. Remember what they are counting.",
      ],
    },
    explain: {
      title: "Tell ZED-4 what each number does.",
      text: "Build your answer, speak it, or write it. You do not need a blank page.",
      slots: [
        {
          prompt: "In 3/4, the 4 tells me…",
          options: [
            "how many equal parts make the whole",
            "how many parts are shaded",
            "how many people are sharing",
            "how big the whole is",
          ],
        },
        {
          prompt: "…and the 3 tells me…",
          options: [
            "how many parts we're considering",
            "how many equal parts make the whole",
            "how big the whole is",
            "how many cuts ZED-4 made",
          ],
        },
      ],
      sentence: (a) => `In 3/4, the 4 tells me ${a[0]} and the 3 tells me ${a[1]}.`,
    },
    zedResponse:
      "Oh! I gave the numbers the wrong jobs. The 4 tells us how many equal pieces make the whole, while the 3 tells us how many of those pieces we're considering.",
    detectiveSkill: "Give each number a job.",
    apply:
      "Find something at home that is already cut into equal parts — a chocolate bar, a pizza, an ice tray. Ask: how many equal parts make the whole? Then take some and say the fraction out loud.",
    reportModelLabel: "cookie tray pieces",
    whatHappened: "ZED-4 read 3/4 and switched what the top and bottom numbers count.",
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
      "ZED-4 has a chocolate bar divided into 6 equal squares. He gives 2 squares to Maya and writes 2/6. Then he explains what the 6 means — and he sounds very sure.",
    chatEndpoint: "/api/chat/case-02-squares",
    chatId: "case-02-squares",
    welcomeText:
      "You fixed my chocolate bar. What is the 6 actually counting — and what is the 2 counting?",
    zedClaim: {
      heading: "\"Maya got 6 pieces of chocolate!\"",
      lines: [
        "The fraction is 2/6.",
        "The 6 means Maya got 6 pieces of chocolate,",
        "because I can see six squares!",
        "Simple maths, really.",
      ],
      isCorrect: false,
      errorType: "treated the denominator as the amount given away",
    },
    model: {
      shape: "bar",
      unitLabel: "square",
      totalParts: 6,
      // The investigation picture is honest: 2 highlighted out of 6, like 2/6.
      selectedParts: 2,
      repair: {
        adjustableTotal: { min: 3, max: 9 },
        targetTotal: 6,
        targetSelected: 2,
        // The repair starts from ZED-4's wrong picture: 3 squares highlighted.
        startSelected: 3,
        instruction: "ZED-4's picture shows 3 squares chosen. Fix the bar so the picture matches 2/6.",
        howTo:
          "Tap a square to choose it or put it back. The bottom number (denominator) 6 counts all the equal squares in the bar — that stays. The top number (numerator) 2 counts the squares you chose — make it 2.",
      },
    },
    investigate: {
      title: "ZED-4 says the 6 tells us how many pieces Maya got. Investigate his claim.",
      text: "Count all six squares. Then count the highlighted ones. Watch what changes.",
      boardTitle: "Take squares and watch the two numbers.",
      boardText: "Does the bottom number change when you take more squares? Try it.",
      observations: [
        "The bar has 6 equal squares.",
        "The bottom number stays at 6 whatever I take.",
        "The top number changes when I take squares.",
        "ZED-4 said the 6 was what Maya got.",
      ],
      evidenceSort: {
        title: "Sort the numbers of 2/6.",
        text: "Which number counts all the equal pieces, and which counts the pieces we're considering?",
        wholeLabel: "ALL THE EQUAL PIECES",
        partLabel: "THE PIECES WE'RE CONSIDERING",
        items: [
          { value: "6", area: "whole" },
          { value: "2", area: "part" },
        ],
        retry: "Count every square in the bar, taken or not. Which number matches that count?",
        doneText: "6 counts all the equal squares. 2 counts the squares Maya got.",
      },
    },
    hints: [
      "Look closely at the chocolate bar. What does not change when you take squares?",
      "Take 2 squares. Which number moved — the top or the bottom?",
      "Say it out loud: 2 squares out of 6 equal squares. Which number is the whole bar?",
    ],
    detect: {
      question: "What is the 6 really counting?",
      choices: [
        "The number of people",
        "The number of equal parts in the whole",
        "The number of shaded pieces",
        "The amount Maya ate",
      ],
      correctIndex: 1,
      nudge: "Take a few squares and watch the bottom number. Does it move? What does that tell you?",
      evidence: {
        prompt: "Show what the 6 is counting by looking at the whole bar.",
        actionLabel: "COUNT THE WHOLE BAR",
        doneLabel: "BAR COUNTED ✓",
        question: "How many equal squares make the whole bar?",
        choices: [
          { label: "2 equal squares", correct: false },
          { label: "6 equal squares", correct: true },
        ],
        retry: "Let's look again. Count every square in the bar, taken or not.",
        type: "whole-versus-part check",
      },
      followUp: {
        question: "And what is the 2 counting?",
        choices: [
          "The number of equal parts we're considering",
          "The number of equal parts in the whole",
          "How many bars there are",
        ],
        correctIndex: 0,
        retry: "Maya's share is the part we're considering. How many squares is that?",
        reply: "Right. 6 is about the whole bar; 2 is Maya's share.",
      },
    },
    repair: {
      title: "Repair ZED-4's chocolate bar so the picture matches 2/6.",
      text: "He highlighted 3 squares. Change the highlighted amount so the picture is honest.",
      checkText: "Check the two numbers again. What job does each one have?",
      successText: "That is 2 out of 6 equal squares. The bar now matches the fraction.",
      confirm: {
        question: "Does your bar show 2/6?",
        yes: "YES — 6 equal squares, 2 of them highlighted.",
        no: "NO — something still looks off.",
        yesReply: "Exactly. The bottom number names the whole bar; the top number is Maya's share.",
        noReply: "That is fine. Adjust the bar until it matches.",
      },
      followUp: {
        question: "Did we change the whole?",
        choices: [
          "No — there are still 6 equal parts",
          "Yes — the whole got smaller",
        ],
        correctIndex: 0,
        retry: "Count the squares in the bar again. Is it still six equal squares?",
        reply: "Yes — the whole stayed the same. Only the parts we're considering changed.",
      },
    },
    vocabulary: {
      title: "THE DETECTIVE WORDS",
      lines: [
        "The bottom number is called the denominator: how many equal parts make the whole.",
        "The top number is called the numerator: how many of those parts we're considering.",
      ],
    },
    explain: {
      title: "Why doesn't the 6 mean that Maya got 6 pieces?",
      text: "Build it, say it, or write it — your choice.",
      slots: [
        {
          prompt: "The 6 doesn't mean Maya got 6 pieces because…",
          options: [
            "6 is counting all the equal parts in the whole",
            "6 is always the bottom number",
            "2 is smaller than 6",
            "Maya doesn't like chocolate",
          ],
        },
        {
          prompt: "The numerator tells me…",
          options: [
            "how many squares we're considering",
            "how many equal squares are in the whole",
            "how many squares are left in the box",
            "how many people want chocolate",
          ],
        },
      ],
      sentence: (a) => `The 6 doesn't mean Maya got 6 pieces because ${a[0]}. The numerator tells me ${a[1]}.`,
    },
    zedResponse:
      "I see it now. I was looking at the number 6 without asking what it was counting. Six tells us about the whole chocolate bar, not Maya's share.",
    detectiveSkill: "Ask what the number is counting.",
    apply:
      "Break a snack into equal pieces with someone at home. Take a few. Say the fraction out loud and say what each number counts.",
    reportModelLabel: "chocolate squares",
    whatHappened: "ZED-4 said the 6 in 2/6 was the amount of chocolate Maya received.",
  },

  /* ----------------------------------------------- 02.03 · REPRESENT */
  wall: {
    ...LEVEL,
    caseId: "case-02.03",
    number: "02.03",
    title: "The Painted Wall",
    shortTitle: "Painted Wall",
    subtitle: "Build what the symbols say.",
    missionTitle: "THE UPSIDE-DOWN BUILD",
    progression: "represent",
    emoji: "🎨",
    story:
      "A giant wall in Detective Headquarters needs painting. The architect gives ZED-4 the fraction 4/5. ZED-4 makes a wall with 4 equal sections, then paints all 4 of them.",
    chatEndpoint: "/api/chat/case-02-wall",
    chatId: "case-02-wall",
    welcomeText:
      "I built my wall straight from the numbers. Which number should have told me how to cut the wall?",
    zedClaim: {
      heading: "\"Done! Four pieces, five painted!\"",
      lines: [
        "I saw the 4 on top, so I made 4 pieces.",
        "And I saw the 5 underneath,",
        "so I painted 5 pieces!",
        "The wall is finished.",
      ],
      isCorrect: false,
      errorType: "built the model with the two numbers' jobs swapped",
    },
    model: {
      shape: "wall",
      unitLabel: "section",
      totalParts: 4,
      selectedParts: 4,
      repair: {
        adjustableTotal: { min: 2, max: 8 },
        targetTotal: 5,
        targetSelected: 4,
        // Start from a blank wall: this case is about constructing the model.
        startTotal: 2,
        startSelected: 0,
        instruction: "Build 4/5 on the wall.",
        howTo:
          "Use + and − to cut the wall into 5 equal sections, then tap a section to paint it. The bottom number (denominator) 5 says how many equal parts the whole needs. The top number (numerator) 4 says how many to paint.",
      },
    },
    investigate: {
      title: "The symbols are giving us instructions. What should the wall look like?",
      text: "Investigate what each number of 4/5 means before you build anything.",
      boardTitle: "Cut the wall and paint sections. Watch the fraction.",
      boardText: "Change how many equal sections the wall has, then paint some. What matches 4/5?",
      observations: [
        "ZED-4's wall only has 4 sections.",
        "Every section is painted.",
        "4/5 needs a whole made of 5 equal parts.",
        "Swapping the numbers changes the picture completely.",
      ],
      evidenceSort: {
        title: "Give each number of 4/5 a job.",
        text: "One number says how to cut the wall. The other says how much to paint.",
        wholeLabel: "Equal parts in the whole wall",
        partLabel: "Parts we're painting",
        items: [
          { value: "5", area: "whole" },
          { value: "4", area: "part" },
        ],
        retry: "The bottom number always tells us how the whole was cut. Try again.",
        doneText: "5 equal sections in the whole, and 4 of them painted.",
      },
    },
    hints: [
      "Check each number against the picture, one at a time.",
      "Does ZED-4's whole have 5 equal parts? Count them.",
      "Cut the wall into 5 equal sections first, then paint 4.",
    ],
    detect: {
      question: "Does ZED-4's picture match 4/5?",
      choices: [
        "Yes — there are 4 painted sections.",
        "No — the whole does not have 5 equal parts.",
        "Yes — the numbers are both there.",
        "No — the wall is the wrong colour.",
      ],
      correctIndex: 1,
      nudge: "Check each number against the picture. Start with the whole: how many equal parts?",
      evidence: {
        prompt: "Check the whole against the bottom number.",
        actionLabel: "COUNT THE SECTIONS",
        doneLabel: "SECTIONS COUNTED ✓",
        question: "For 4/5, how many equal parts should the whole wall have?",
        choices: [
          { label: "4 equal parts", correct: false },
          { label: "5 equal parts", correct: true },
        ],
        retry: "The bottom number tells us how the whole is cut. Read it again.",
        type: "symbol-to-model match",
      },
      followUp: {
        question: "And how many of those parts should be painted?",
        choices: ["5 parts", "4 parts", "All of them"],
        correctIndex: 1,
        retry: "The top number counts the parts we're considering. What is it?",
        reply: "Yes — 5 equal parts in the whole, and 4 of them painted.",
      },
    },
    repair: {
      title: "Build the wall the symbols actually describe.",
      text: "Divide the wall into 5 equal parts, then paint 4 of them.",
      checkText: "Check the two numbers again. Which one says how to cut the wall?",
      successText: "That is 4 painted out of 5 equal sections. The wall matches 4/5.",
      confirm: {
        question: "Does your wall show 4/5?",
        yes: "YES — 5 equal sections, 4 painted.",
        no: "NO — I want to change it.",
        yesReply: "Exactly. The picture and the symbols now say the same thing.",
        noReply: "Take your time. Adjust the sections until it matches.",
      },
    },
    vocabulary: {
      title: "THE DETECTIVE WORDS AGAIN",
      lines: [
        "5 = denominator — how many equal parts the whole needs.",
        "4 = numerator — how many of those parts we're considering.",
      ],
    },
    explain: {
      title: "How did you know how to build 4/5?",
      text: "Build it, say it, or write it.",
      slots: [
        {
          prompt: "The bottom number tells me…",
          options: [
            "how many equal parts make the whole",
            "how many parts to paint",
            "how many walls there are",
            "which colour to use",
          ],
        },
        {
          prompt: "…and the top number tells me…",
          options: [
            "how many parts I'm considering",
            "how many equal parts make the whole",
            "how wide the wall is",
            "how long it takes to paint",
          ],
        },
      ],
      sentence: (a) => `The bottom number tells me ${a[0]}, and the top number tells me ${a[1]}.`,
    },
    zedResponse:
      "I built the picture from the numbers, but I gave them the wrong jobs. The bottom number tells me how many equal parts the whole needs.",
    detectiveSkill: "Connect symbols to what you see.",
    apply:
      "Draw a rectangle at home and split it into 6 equal parts. Colour 4 of them. Now say the fraction out loud, and say what each number counts.",
    reportModelLabel: "wall sections",
    whatHappened: "ZED-4 built a 4-section wall for 4/5 and painted all of it.",
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
      "ZED-4 found a mysterious fraction card. The card says 3/5. Beside it is a picture with 5 equal sections — and 2 of them highlighted. ZED-4 says the picture matches.",
    chatEndpoint: "/api/chat/case-02-mystery",
    chatId: "case-02-mystery",
    welcomeText:
      "I checked the whole and said the picture matched. Which part of the picture did I forget to check?",
    zedClaim: {
      heading: "\"The picture matches!\"",
      lines: [
        "The card says 3/5.",
        "I can see five pieces in the picture,",
        "and three is the top number.",
        "So the picture matches. Obviously.",
      ],
      isCorrect: false,
      errorType: "checked the whole but never checked the selected parts",
    },
    model: {
      shape: "strip",
      unitLabel: "section",
      totalParts: 5,
      selectedParts: 2,
      repair: {
        adjustableTotal: { min: 2, max: 8 },
        targetTotal: 5,
        targetSelected: 3,
        instruction: "Repair the picture so it really represents 3/5.",
        howTo:
          "Tap one more section to highlight it. The bottom number (denominator) 5 already counts the equal parts — keep it. The top number (numerator) 3 counts the highlighted ones — make it 3.",
      },
    },
    investigate: {
      title: "Don't trust the label yet. Investigate the picture.",
      text: "Count the equal parts. Then count the highlighted parts. Compare both with the card.",
      boardTitle: "Highlight parts and compare with the card.",
      boardText: "The card says 3/5. Build that, then hold it up against ZED-4's picture.",
      observations: [
        "The picture has 5 equal sections — that part matches.",
        "Only 2 sections are highlighted.",
        "The card's top number is 3, not 2.",
        "Part of ZED-4's claim is right and part is wrong.",
      ],
      evidenceSort: {
        title: "Match each number to what it counts.",
        text: "Take the numbers from the card 3/5 and give each one its job.",
        wholeLabel: "Equal parts in the whole",
        partLabel: "Parts being considered",
        items: [
          { value: "5", area: "whole" },
          { value: "3", area: "part" },
        ],
        retry: "Read the card again. The bottom number always counts the whole.",
        doneText: "5 equal parts in the whole, and 3 parts being considered.",
      },
    },
    hints: [
      "Check each part of the card against the picture, one at a time.",
      "The number of pieces is one claim. The number highlighted is a different claim.",
      "Count the highlighted sections in the picture, then read the top number again.",
    ],
    detect: {
      question: "Does the picture really show 3/5?",
      choices: [
        "Yes, because there are 5 pieces.",
        "Yes, because 3 is the top number.",
        "No, because only 2 of the 5 parts are highlighted.",
        "No, because the pieces are too small.",
      ],
      correctIndex: 2,
      nudge: "Careful — one part of his claim really is correct. Which part? Now check the other.",
      evidence: {
        prompt: "Count the highlighted parts and compare with the top number.",
        actionLabel: "COUNT THE HIGHLIGHTED PARTS",
        doneLabel: "PARTS COUNTED ✓",
        question: "How many parts are highlighted, and how many should be?",
        choices: [
          { label: "2 are highlighted, but the card says 3", correct: true },
          { label: "3 are highlighted, and the card says 3", correct: false },
        ],
        retry: "Look once more at the picture. Count the highlighted sections carefully.",
        type: "claim-against-model check",
      },
      followUp: {
        question: "What fraction does ZED-4's picture actually show?",
        choices: ["3/5", "2/5", "5/2"],
        correctIndex: 1,
        retry: "5 equal parts, and 2 of them highlighted. Which fraction is that?",
        reply: "Exactly — the picture shows 2/5, not 3/5.",
      },
    },
    repair: {
      title: "Repair the picture so it really represents 3/5.",
      text: "Keep the 5 equal parts and highlight one more section.",
      checkText: "Check both numbers again. How many parts should be highlighted?",
      successText: "That is 3 highlighted out of 5 equal parts. The picture now matches the card.",
      confirm: {
        question: "Does the picture now show 3/5?",
        yes: "YES — 5 equal parts, 3 highlighted.",
        no: "NO — I want to check again.",
        yesReply: "Exactly. You proved it instead of guessing it.",
        noReply: "Good detective instinct. Check the parts once more.",
      },
    },
    vocabulary: {
      title: "TWO NUMBERS. TWO JOBS.",
      lines: [
        "Denominator (bottom): how many equal parts make the whole.",
        "Numerator (top): how many of those parts we're considering.",
        "Always check both against the picture.",
      ],
    },
    explain: {
      title: "Why was ZED-4's picture not 3/5?",
      text: "Build it, say it, or write it.",
      slots: [
        {
          prompt: "ZED-4's picture was not 3/5 because…",
          options: [
            "there were 5 equal parts, but only 2 were highlighted",
            "the denominator was wrong",
            "the picture had too many pieces",
            "the numerator is always bigger",
          ],
        },
        {
          prompt: "I know it is 3/5 because…",
          options: [
            "there are 5 equal parts and 3 of them are highlighted",
            "the card said so",
            "3 comes before 5",
            "ZED-4 told me",
          ],
        },
      ],
      sentence: (a) => `ZED-4's picture was not 3/5 because ${a[0]}. I know it is 3/5 because ${a[1]}.`,
    },
    zedResponse:
      "I checked the whole, but I forgot to check the part we were looking at. Five equal pieces wasn't enough evidence. I needed to check both numbers.",
    detectiveSkill: "Check the symbols against the model.",
    apply:
      "Ask someone at home to describe a fraction out loud without drawing it. Draw what they said, then check together whether your drawing really matches their words.",
    reportModelLabel: "fraction strip sections",
    whatHappened:
      "ZED-4 said a picture with 2 of 5 parts highlighted matched a card reading 3/5.",
  },
};
