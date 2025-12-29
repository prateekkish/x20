"use client";

import { Particles } from "./Particles";
import { RulesList } from "./RulesList";
import type { GameMode } from "../page";

interface LandingPageProps {
  onStart: (mode: GameMode) => void;
}

export function LandingPage({ onStart }: LandingPageProps) {
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
          <p className="text-sm text-gray-400 mb-1">Tic Tac Toe with a twist</p>
          <p className="text-xs text-gray-600 uppercase tracking-[0.3em]">Infinite Mode</p>
        </div>

        <div className="w-full bg-[#0a0a12] border border-cyan-900/30 rounded-lg p-6">
          <RulesList variant="numbered" />
        </div>

        <div className="w-full flex flex-col gap-3">
          <button
            onClick={() => onStart("two-player")}
            className="w-full py-4 text-lg uppercase tracking-widest font-semibold
              border-2 border-cyan-400 rounded-lg
              bg-cyan-950/20 text-cyan-400
              hover:bg-cyan-400 hover:text-black
              transition-all duration-300"
          >
            Two Players
          </button>
          <button
            onClick={() => onStart("lonely")}
            className="w-full py-4 text-lg uppercase tracking-widest font-semibold
              border-2 border-pink-500 rounded-lg
              bg-pink-950/20 text-pink-500
              hover:bg-pink-500 hover:text-black
              transition-all duration-300"
          >
            Lonely Mode
          </button>
        </div>
      </div>
    </div>
  );
}
