export const PUBLIC_CASE_NUMBERS = [1, 2, 3] as const;

export function isPubliclyAvailableCase(caseNumber: number): boolean {
  return PUBLIC_CASE_NUMBERS.some((publicCase) => publicCase === caseNumber);
}
