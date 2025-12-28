"use client";

import { COLORS } from "../constants";

type Player = "X" | "O";
type SquareValue = Player | null;

interface SquareProps {
  value: SquareValue;
  isDeleting: boolean;
  isWinning: boolean;
  onClick: () => void;
  disabled: boolean;
}

export function Square({ value, isDeleting, isWinning, onClick, disabled }: SquareProps) {
  const winningClass = isWinning ? "win-cell" : "";

  return (
    <button
      className={`relative flex items-center justify-center w-[30vw] h-[30vw] max-w-28 max-h-28
        bg-[#0d0d15] border border-cyan-900/50
        ${disabled ? "cursor-not-allowed" : "cursor-pointer hover:bg-cyan-950/30"}
        ${winningClass}`}
      onClick={onClick}
      disabled={disabled}
      aria-label={value ? `Square with ${value}` : "Empty square"}
    >
      {value && (
        <span
          className="font-bold select-none"
          style={{
            fontSize: value === "X" ? "12vw" : "16vw",
            maxWidth: value === "X" ? "3.5rem" : "4.5rem",
            color: isDeleting
              ? (value === "X" ? COLORS.X_FADED : COLORS.O_FADED)
              : (value === "X" ? COLORS.X : COLORS.O),
            filter: isDeleting
              ? "none"
              : `drop-shadow(0 0 10px ${value === "X" ? COLORS.X_GLOW : COLORS.O_GLOW_STRONG}) drop-shadow(0 0 20px ${value === "X" ? COLORS.O_GLOW : COLORS.O_GLOW_WEAK})`,
            opacity: isDeleting ? 0.6 : 1,
            transition: "all 0.6s ease-in-out",
            lineHeight: 1,
          }}
        >
          {value === "X" ? "✕" : "○"}
        </span>
      )}
    </button>
  );
}
