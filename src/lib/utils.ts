/**
 * `cn(...)` — the standard shadcn/ui class-name helper. Merges conditional
 * class values (via clsx) and then de-duplicates conflicting Tailwind
 * utilities (via tailwind-merge) so the last one wins.
 */
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
