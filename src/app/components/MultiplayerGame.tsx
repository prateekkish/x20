"use client";

import { useState, useEffect } from "react";
import { supabase, GameRow } from "@/lib/supabase";
import { Square } from "./Square";
import { LightningLine } from "./LightningLine";
import { Particles } from "./Particles";
import { WINNING_LINES, GAME_CONFIG } from "../constants";

type Player = "X" | "O";
type SquareValue = Player | null;

interface MultiplayerGameProps {
  gameId: string;
  playerRole: "host" | "guest"; // host = X, guest = O
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

export function MultiplayerGame({ gameId, playerRole, onReset, onShowRules }: MultiplayerGameProps) {
  const [game, setGame] = useState<GameRow | null>(null);
  const [loading, setLoading] = useState(true);

  const myPlayer: Player = playerRole === "host" ? "X" : "O";

  // Fetch initial game state
  useEffect(() => {
    async function fetchGame() {
      const { data, error } = await supabase
        .from("games")
        .select()
        .eq("id", gameId)
        .single();

      if (!error && data) {
        setGame(data as GameRow);
      }
      setLoading(false);
    }
    fetchGame();
  }, [gameId]);

  // Subscribe to realtime updates
  useEffect(() => {
    const channel = supabase
      .channel(`game-play-${gameId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "games",
          filter: `id=eq.${gameId}`,
        },
        (payload) => {
          setGame(payload.new as GameRow);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [gameId]);

  const squares: SquareValue[] = game?.board ?? Array(9).fill(null);
  const xMoves: number[] = game?.x_moves ?? [];
  const oMoves: number[] = game?.o_moves ?? [];
  const xScore: number = game?.x_score ?? 0;
  const oScore: number = game?.o_score ?? 0;
  const currentPlayer = (game?.current_player ?? "X") as Player;
  const { winner, line: winningLine } = calculateWinner(squares);

  const deletingPosition = (() => {
    if (winner) return null;
    const playerMoves = currentPlayer === "X" ? xMoves : oMoves;
    if (playerMoves.length >= GAME_CONFIG.MAX_SYMBOLS_PER_PLAYER) {
      return playerMoves[0];
    }
    return null;
  })();

  const isMyTurn = currentPlayer === myPlayer && !winner;

  const handleClick = async (position: number) => {
    if (!game) return;
    if (winner) return;
    if (currentPlayer !== myPlayer) return;
    if (squares[position] !== null) return;

    const playerMoves = currentPlayer === "X" ? [...xMoves] : [...oMoves];
    const newBoard = [...squares];

    // Remove oldest if at max
    if (playerMoves.length >= GAME_CONFIG.MAX_SYMBOLS_PER_PLAYER) {
      const oldestPos = playerMoves.shift()!;
      newBoard[oldestPos] = null;
    }

    // Add new move
    playerMoves.push(position);
    newBoard[position] = currentPlayer;

    const newXMoves = currentPlayer === "X" ? playerMoves : xMoves;
    const newOMoves = currentPlayer === "O" ? playerMoves : oMoves;
    const nextPlayer = currentPlayer === "X" ? "O" : "X";

    // Check for winner
    const { winner: newWinner } = calculateWinner(newBoard);

    const updateData: Record<string, unknown> = {
      board: newBoard,
      x_moves: newXMoves,
      o_moves: newOMoves,
      current_player: nextPlayer,
      status: newWinner ? "won" : "playing",
      winner: newWinner,
    };

    if (newWinner === "X") {
      updateData.x_score = xScore + 1;
    } else if (newWinner === "O") {
      updateData.o_score = oScore + 1;
    }

    await supabase.from("games").update(updateData).eq("id", gameId);
  };

  const handlePlayAgain = async () => {
    await supabase
      .from("games")
      .update({
        board: Array(9).fill(null),
        x_moves: [],
        o_moves: [],
        current_player: "X",
        status: "playing",
        winner: null,
      })
      .eq("id", gameId);
  };

  if (loading) {
    return (
      <div className="relative flex h-[100dvh] flex-col items-center justify-center bg-[#0a0a0f]">
        <Particles />
        <p className="text-gray-400 relative z-10">Loading game...</p>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="relative flex h-[100dvh] flex-col items-center justify-center bg-[#0a0a0f]">
        <Particles />
        <p className="text-red-400 relative z-10">Game not found</p>
        <button onClick={onReset} className="mt-4 text-gray-400 hover:text-white relative z-10">
          Back to menu
        </button>
      </div>
    );
  }

  const status = winner ? (
    <span className={winner === "X" ? "text-cyan-400" : "text-pink-500"}>
      {winner === myPlayer ? "You win!" : "You lose!"}
    </span>
  ) : (
    <span className={currentPlayer === "X" ? "text-cyan-400" : "text-pink-500"}>
      {isMyTurn ? "Your turn" : "Opponent's turn"}
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

        <div className="text-xs text-purple-400 uppercase tracking-widest">
          You are <span className={myPlayer === "X" ? "text-cyan-400" : "text-pink-500"}>
            {myPlayer === "X" ? "✕" : "○"}
          </span>
        </div>

        <div className="flex items-center gap-6 text-lg font-bold">
          <span className="text-cyan-400">{xScore}</span>
          <span className="text-gray-600">-</span>
          <span className="text-pink-500">{oScore}</span>
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
              disabled={!!winner || squares[i] !== null || !isMyTurn}
            />
          ))}
          {winner && winningLine && (
            <LightningLine line={winningLine} winner={winner} />
          )}
        </div>

        <div className="flex gap-4 mt-2">
          {winner && (
            <button
              onClick={handlePlayAgain}
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
            Leave
          </button>
        </div>
      </div>
    </div>
  );
}
