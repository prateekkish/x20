"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Particles } from "./Particles";

interface JoinGameProps {
  onGameStart: (gameId: string) => void;
  onBack: () => void;
}

export function JoinGame({ onGameStart, onBack }: JoinGameProps) {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [joining, setJoining] = useState(false);

  const handleJoin = async () => {
    if (code.length !== 6) {
      setError("Code must be 6 characters");
      return;
    }

    setJoining(true);
    setError(null);

    const { data: game, error: fetchError } = await supabase
      .from("games")
      .select()
      .eq("code", code.toUpperCase())
      .single();

    if (fetchError || !game) {
      setError("Game not found");
      setJoining(false);
      return;
    }

    if (game.status !== "waiting") {
      setError("Game already started or finished");
      setJoining(false);
      return;
    }

    const { error: updateError } = await supabase
      .from("games")
      .update({ status: "playing" })
      .eq("id", game.id);

    if (updateError) {
      setError("Failed to join game");
      setJoining(false);
      return;
    }

    onGameStart(game.id);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
    if (value.length <= 6) {
      setCode(value);
      setError(null);
    }
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
          <p className="text-sm text-purple-400 uppercase tracking-widest">Join Game</p>
        </div>

        <div className="w-full bg-[#0a0a12] border border-pink-900/30 rounded-lg p-6">
          <p className="text-gray-400 text-sm mb-4 text-center">Enter the game code:</p>
          <input
            type="text"
            value={code}
            onChange={handleInputChange}
            placeholder="ABC123"
            className="w-full text-center text-3xl font-mono font-bold tracking-[0.3em]
              bg-transparent border-2 border-pink-900/50 rounded-lg py-3
              text-pink-400 placeholder-gray-700
              focus:border-pink-500 focus:outline-none
              transition-colors"
            maxLength={6}
            autoFocus
          />
          {error && (
            <p className="text-red-400 text-sm mt-3 text-center">{error}</p>
          )}
          <button
            onClick={handleJoin}
            disabled={code.length !== 6 || joining}
            className="w-full mt-4 py-3 text-lg uppercase tracking-widest font-semibold
              border-2 border-pink-500 rounded-lg
              bg-pink-950/20 text-pink-500
              hover:bg-pink-500 hover:text-black
              disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-pink-950/20 disabled:hover:text-pink-500
              transition-all duration-300"
          >
            {joining ? "Joining..." : "Join"}
          </button>
        </div>

        <button
          onClick={onBack}
          className="px-6 py-2 text-sm uppercase tracking-widest
            border border-gray-700 rounded
            bg-transparent text-gray-500
            hover:bg-gray-900 hover:border-gray-600 hover:text-gray-400
            transition-all duration-300"
        >
          Back
        </button>
      </div>
    </div>
  );
}
