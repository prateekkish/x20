export const COLORS = {
  X: "#00d4ff",
  O: "#ff0055",
  X_FADED: "rgba(0,212,255,0.4)",
  O_FADED: "rgba(255,0,85,0.4)",
  X_GLOW: "rgba(0,212,255,0.8)",
  O_GLOW: "rgba(0,212,255,0.6)",
  O_GLOW_STRONG: "rgba(255,0,85,0.8)",
  O_GLOW_WEAK: "rgba(255,0,85,0.6)",
} as const;

export const WINNING_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
] as const;

export const GAME_CONFIG = {
  MAX_SYMBOLS_PER_PLAYER: 3,
  LIGHTNING_SEGMENTS: 8,
  LIGHTNING_JAG_MULTIPLIER: 6,
  PARTICLE_COUNT: 30,
} as const;
