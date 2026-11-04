// Keep page controls locked until both typography and ASCII have settled.
export const isMythTransition = (from: number, to: number) => Math.min(from, to) >= 1 && Math.abs(from - to) === 1
export const homeTransitionDuration = (compact: boolean, from = 0, to = 0) =>
  isMythTransition(from, to) ? (compact ? 2 : 2.6) : (compact ? 1.15 : 1.45)
