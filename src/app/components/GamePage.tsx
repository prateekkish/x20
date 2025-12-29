"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { Square } from "./Square";
import { LightningLine } from "./LightningLine";
import { Particles } from "./Particles";
import { WINNING_LINES, GAME_CONFIG } from "../constants";
import { getAIMove } from "../ai";
import type { GameMode } from "../page";

type Player = "X" | "O";
type SquareValue = Player | null;

interface Move {
  player: Player;
  position: number;
  order: number;
}

interface GamePageProps {
  mode: GameMode;
  onReset: () => void;
  onShowRules: () => void;
}

function calculateWinner(squares: SquareValue[]): { winner: Player | null; line: number[] | null } {
  for (const [a, b, c] of WINNING_LINES) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: [a, b, c] };
    }
  }
  return { winner: null, line: null };
}

function InfoIcon({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-8 h-8 rounded-full border border-cyan-900/50 flex items-center justify-center
        text-cyan-400 hover:bg-cyan-950/30 hover:border-cyan-400/50 transition-all duration-300"
      aria-label="Show rules"
    >
      <span className="text-sm font-semibold">i</span>
    </button>
  );
}

export function GamePage({ mode, onReset, onShowRules }: GamePageProps) {
  const [moves, setMoves] = useState<Move[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<Player>("X");
  const [moveCounter, setMoveCounter] = useState(0);

  const squares = useMemo(() => {
    const arr: SquareValue[] = Array(9).fill(null);
    moves.forEach((move) => {
      arr[move.position] = move.player;
    });
    return arr;
  }, [moves]);

  const { winner, line: winningLine } = useMemo(() => calculateWinner(squares), [squares]);

  const xMoves = useMemo(
    () => moves.filter((m) => m.player === "X").sort((a, b) => a.order - b.order),
    [moves]
  );

  const oMoves = useMemo(
    () => moves.filter((m) => m.player === "O").sort((a, b) => a.order - b.order),
    [moves]
  );

  const deletingPosition = useMemo(() => {
    if (winner) return null;
    const playerMoves = currentPlayer === "X" ? xMoves : oMoves;
    if (playerMoves.length >= GAME_CONFIG.MAX_SYMBOLS_PER_PLAYER) {
      return playerMoves[0].position;
    }
    return null;
  }, [winner, currentPlayer, xMoves, oMoves]);

  const handleClick = useCallback((position: number) => {
    if (winner) return;
    if (squares[position] !== null) return;

    setMoves(prev => {
      const playerMoves = prev.filter(m => m.player === currentPlayer).sort((a, b) => a.order - b.order);
      let newMoves = [...prev];

      if (playerMoves.length >= GAME_CONFIG.MAX_SYMBOLS_PER_PLAYER) {
        const oldestMove = playerMoves[0];
        const idx = newMoves.findIndex(
          (m) => m.player === oldestMove.player && m.position === oldestMove.position
        );
        if (idx !== -1) {
          newMoves.splice(idx, 1);
        }
      }

      newMoves.push({
        player: currentPlayer,
        position,
        order: moveCounter,
      });

      return newMoves;
    });

    setMoveCounter(c => c + 1);
    setCurrentPlayer(p => p === "X" ? "O" : "X");
  }, [winner, squares, currentPlayer, moveCounter]);

  // AI move effect
  useEffect(() => {
    if (mode !== "lonely") return;
    if (currentPlayer !== "O") return;
    if (winner) return;

    const timeout = setTimeout(() => {
      const aiPosition = getAIMove(squares, moves);
      if (aiPosition !== null) {
        handleClick(aiPosition);
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [mode, currentPlayer, winner, squares, moves, handleClick]);

  const resetGame = useCallback(() => {
    setMoves([]);
    setCurrentPlayer("X");
    setMoveCounter(0);
  }, []);

  const status = winner ? (
    <span className={winner === "X" ? "text-cyan-400" : "text-pink-500"}>
      {winner === "X" ? "✕" : <span className="text-4xl align-middle">○</span>} WINS!
    </span>
  ) : (
    <span className={currentPlayer === "X" ? "text-cyan-400" : "text-pink-500"}>
      {currentPlayer === "X" ? "✕" : <span className="text-4xl align-middle">○</span>}&apos;s turn
    </span>
  );

  return (
    <div className="relative flex h-[100dvh] flex-col items-center justify-center bg-[#0a0a0f] overflow-hidden p-4">
      <Particles />

      <div className="relative z-10 flex flex-col items-center gap-3 w-full max-w-md">
        <div className="w-full flex justify-between items-center">
          <div className="w-8" />
          <h1 className="text-xl font-bold tracking-wider">
            <span className="text-cyan-400">X</span>
            <span className="text-pink-500">2</span>
            <span className="text-cyan-400">O</span>
          </h1>
          <InfoIcon onClick={onShowRules} />
        </div>

        <div className="h-12 flex items-center justify-center text-2xl font-semibold tracking-wide" aria-live="polite">
          {status}
        </div>

        <div className="flex gap-8 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-cyan-400">✕</span>
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    i < xMoves.length ? "bg-cyan-400" : "bg-gray-700"
                  }`}
                />
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-pink-500 text-lg">○</span>
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    i < oMoves.length ? "bg-pink-500" : "bg-gray-700"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        <div
          className="relative game-grid grid grid-cols-3 gap-1 p-3 rounded-lg bg-[#0a0a12] border border-cyan-900/30 w-full max-w-[320px]"
          role="grid"
          aria-label="Tic Tac Toe game board"
        >
          {squares.map((value, i) => (
            <Square
              key={i}
              value={value}
              isDeleting={deletingPosition === i}
              isWinning={winningLine?.includes(i) ?? false}
              onClick={() => handleClick(i)}
              disabled={!!winner || squares[i] !== null || (mode === "lonely" && currentPlayer === "O")}
            />
          ))}
          {winner && winningLine && (
            <LightningLine line={winningLine} winner={winner} />
          )}
        </div>

        <div className="flex gap-4 mt-2">
          {winner && (
            <button
              onClick={resetGame}
              className="px-6 py-2 text-sm uppercase tracking-widest
                border border-cyan-400 rounded
                bg-cyan-950/20 text-cyan-400
                hover:bg-cyan-400 hover:text-black
                transition-all duration-300"
            >
              Play Again
            </button>
          )}
          <button
            onClick={onReset}
            className="px-6 py-2 text-sm uppercase tracking-widest
              border border-gray-700 rounded
              bg-transparent text-gray-500
              hover:bg-gray-900 hover:border-gray-600 hover:text-gray-400
              transition-all duration-300"
          >
            Menu
          </button>
        </div>
      </div>
    </div>
  );
}
