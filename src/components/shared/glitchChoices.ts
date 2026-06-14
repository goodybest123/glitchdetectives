import type { GlitchChoice } from "./WorkbookActivity";

const CHOICES: Record<string, GlitchChoice[]> = {
  "case-01:pizza": [{ label: "The four slices are different sizes", correct: true }, { label: "There are four slices", correct: false }, { label: "The pizza is round", correct: false }, { label: "Each robot gets a slice", correct: false }],
  "case-01:chocolate": [{ label: "The three pieces are different sizes", correct: true }, { label: "There are three pieces", correct: false }, { label: "The bar is a rectangle", correct: false }, { label: "The chocolate has lines", correct: false }],
  "case-01:canvas": [{ label: "The dividing line is not in the middle", correct: true }, { label: "One side is painted", correct: false }, { label: "The canvas has two sides", correct: false }, { label: "The canvas is rectangular", correct: false }],
  "case-02:bar": [{ label: "The bottom number counts only blank blocks", correct: true }, { label: "Three blocks are painted", correct: false }, { label: "The bar has five blocks", correct: false }, { label: "The top number is 3", correct: false }],
  "case-02:crate": [{ label: "The top and bottom numbers are swapped", correct: true }, { label: "There is one battery", correct: false }, { label: "The crate has four slots", correct: false }, { label: "One slot is filled", correct: false }],
  "case-02:panels": [{ label: "The top number counts dark panels", correct: true }, { label: "There are six panels", correct: false }, { label: "Two panels are dark", correct: false }, { label: "The bottom number is 6", correct: false }],
  "case-03:tanks": [{ label: "The comparison symbol says one tank has more", correct: true }, { label: "Tank B has four sections", correct: false }, { label: "Tank A has two sections", correct: false }, { label: "Both tanks contain fuel", correct: false }],
  "case-03:garden": [{ label: "The comparison symbol says the areas differ", correct: true }, { label: "One bed has six rows", correct: false }, { label: "The beds are green", correct: false }, { label: "One bed has three rows", correct: false }],
  "case-03:disks": [{ label: "The comparison symbol says the data amounts differ", correct: true }, { label: "One disk has eight slices", correct: false }, { label: "The disks are round", correct: false }, { label: "Six slices are shaded", correct: false }],
  "case-04:cargo": [{ label: "The comparison symbol points to the smaller fraction", correct: true }, { label: "Both top numbers are 1", correct: false }, { label: "One block is divided into eighths", correct: false }, { label: "The blocks sit on a scale", correct: false }],
  "case-04:coolant": [{ label: "The comparison symbol says 2/3 is smaller", correct: true }, { label: "Both top numbers are 2", correct: false }, { label: "The tubes use different sections", correct: false }, { label: "Both tubes hold coolant", correct: false }],
  "case-04:beams": [{ label: "The comparison symbol says 3/4 is shorter", correct: true }, { label: "Both top numbers are 3", correct: false }, { label: "One beam has eighths", correct: false }, { label: "The beams have equal widths", correct: false }],
  "case-05:conveyor": [{ label: "The result’s bottom number was added", correct: true }, { label: "The top numbers were added", correct: false }, { label: "The pieces are fifths", correct: false }, { label: "The result’s top number is 3", correct: false }],
  "case-05:coolant": [{ label: "The result’s bottom number was subtracted", correct: true }, { label: "Two eighths were drained", correct: false }, { label: "The top answer is 3", correct: false }, { label: "The tank has eight sections", correct: false }],
  "case-05:assembly": [{ label: "The result’s bottom number was added", correct: true }, { label: "The chips were combined", correct: false }, { label: "The board has sixths", correct: false }, { label: "The result’s top number is 5", correct: false }],
  "case-06:blueprint": [{ label: "Different-sized pieces were added directly", correct: true }, { label: "The top numbers were added", correct: false }, { label: "The equation uses addition", correct: false }, { label: "One piece is a fourth", correct: false }],
  "case-06:paint": [{ label: "Different measuring grids were added directly", correct: true }, { label: "Both vats contain paint", correct: false }, { label: "The top numbers were added", correct: false }, { label: "One vat uses sixths", correct: false }],
  "case-06:circuit": [{ label: "Different-sized pieces were subtracted directly", correct: true }, { label: "The equation uses subtraction", correct: false }, { label: "One piece is an eighth", correct: false }, { label: "The top numbers were subtracted", correct: false }],
};

export function getGlitchChoices(caseNumber: string, subCase: string) {
  return CHOICES[`${caseNumber}:${subCase}`] ?? [];
}