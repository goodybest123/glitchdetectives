/**
 * Browser-side fallback for the shared-passcode gate.
 *
 * Some browsers (and embedded preview frames) drop the cross-site session
 * cookie the gate normally uses. After a correct passcode the server hands
 * back an opaque token which we keep here and replay on later visits.
 */
const KEY = "gd:play:token";

export function readPlayToken(): string {
  if (typeof window === "undefined") return "";
  try {
    return window.localStorage.getItem(KEY) ?? "";
  } catch {
    return "";
  }
}

export function savePlayToken(token: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, token);
  } catch {
    /* storage unavailable — cookie path still works */
  }
}

export function clearPlayToken(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}
