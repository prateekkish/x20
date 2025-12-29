"use client";

import { Particles } from "./Particles";

interface MultiplayerLobbyProps {
  onCreateGame: () => void;
  onJoinGame: () => void;
  onBack: () => void;
}

export function MultiplayerLobby({ onCreateGame, onJoinGame, onBack }: MultiplayerLobbyProps) {
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
          <p className="text-sm text-purple-400 uppercase tracking-widest">Multiplayer</p>
        </div>

        <div className="w-full flex flex-col gap-3">
          <button
            onClick={onCreateGame}
            className="w-full py-4 text-lg uppercase tracking-widest font-semibold
              border-2 border-cyan-400 rounded-lg
              bg-cyan-950/20 text-cyan-400
              hover:bg-cyan-400 hover:text-black
              transition-all duration-300"
          >
            Create Game
          </button>
          <button
            onClick={onJoinGame}
            className="w-full py-4 text-lg uppercase tracking-widest font-semibold
              border-2 border-pink-500 rounded-lg
              bg-pink-950/20 text-pink-500
              hover:bg-pink-500 hover:text-black
              transition-all duration-300"
          >
            Join Game
          </button>
          <button
            onClick={onBack}
            className="w-full py-3 text-sm uppercase tracking-widest
              border border-gray-700 rounded-lg
              bg-transparent text-gray-500
              hover:bg-gray-900 hover:border-gray-600 hover:text-gray-400
              transition-all duration-300 mt-2"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}
