import confetti from "canvas-confetti";

export function celebrate() {
  if (typeof window === "undefined") return;
  const defaults = { spread: 70, ticks: 200, gravity: 0.9, scalar: 0.9, zIndex: 9999 };
  confetti({ ...defaults, particleCount: 80, origin: { x: 0.2, y: 0.7 } });
  confetti({ ...defaults, particleCount: 80, origin: { x: 0.8, y: 0.7 } });
  setTimeout(() => {
    confetti({ ...defaults, particleCount: 120, startVelocity: 45, origin: { x: 0.5, y: 0.6 } });
  }, 180);
}
