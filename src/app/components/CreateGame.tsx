"use client";

import { useState, useEffect } from "react";
import { customAlphabet } from "nanoid";
import { supabase, GameRow } from "@/lib/supabase";
import { Particles } from "./Particles";

const generateCode = customAlphabet("ABCDEFGHJKLMNPQRSTUVWXYZ23456789", 6);

interface CreateGameProps {
  onGameStart: (gameId: string) => void;
  onBack: () => void;
}

export function CreateGame({ onGameStart, onBack }: CreateGameProps) {
  const [code, setCode] = useState<string | null>(null);
  const [gameId, setGameId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function createGame() {
      const newCode = generateCode();
      const { data, error } = await supabase
        .from("games")
        .insert({
          code: newCode,
          board: Array(9).fill(null),
          x_moves: [],
          o_moves: [],
          current_player: "X",
          status: "waiting",
          x_score: 0,
          o_score: 0,
        })
        .select()
        .single();

      if (error) {
        setError("Failed to create game. Please try again.");
        return;
      }

      setCode(newCode);
      setGameId(data.id);
    }

    createGame();
  }, []);

  useEffect(() => {
    if (!gameId) return;

    const channel = supabase
      .channel(`game-${gameId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "games",
          filter: `id=eq.${gameId}`,
        },
        (payload) => {
          const game = payload.new as GameRow;
          if (game.status === "playing") {
            onGameStart(gameId);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [gameId, onGameStart]);

  const copyCode = async () => {
    if (!code) return;
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative flex h-[100dvh] flex-col items-center justify-center gap-8 bg-[#0a0a0f] overflow-hidden px-6">
      <Particles />

      <div className="relative z-10 flex flex-col items-center gap-8 max-w-md w-full">
        <div className="text-center">
          <h1 className="text-5xl sm:text-6xl font-bold tracking-wider mb-2">
            <span className="text-cyan-400">X</span>
            <span className="text-pink-500">2</span>
            <span className="text-cyan-400">O</span>
          </h1>
          <p className="text-sm text-purple-400 uppercase tracking-widest">Create Game</p>
        </div>

        {error ? (
          <div className="text-red-400 text-center">{error}</div>
        ) : code ? (
          <div className="w-full bg-[#0a0a12] border border-cyan-900/30 rounded-lg p-6 text-center">
            <p className="text-gray-400 text-sm mb-4">Share this code with your friend:</p>
            <button
              onClick={copyCode}
              className="text-4xl font-mono font-bold tracking-[0.3em] text-cyan-400
                hover:text-cyan-300 transition-colors cursor-pointer"
            >
              {code}
            </button>
            <p className="text-gray-500 text-xs mt-2">
              {copied ? "Copied!" : "Click to copy"}
            </p>
            <div className="mt-6 flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
              <p className="text-gray-400 text-sm">Waiting for opponent...</p>
            </div>
          </div>
        ) : (
          <div className="text-gray-400">Creating game...</div>
        )}

        <button
          onClick={onBack}
          className="px-6 py-2 text-sm uppercase tracking-widest
            border border-gray-700 rounded
            bg-transparent text-gray-500
            hover:bg-gray-900 hover:border-gray-600 hover:text-gray-400
            transition-all duration-300"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
