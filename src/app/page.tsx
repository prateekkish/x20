"use client";

import { useState } from "react";
import { LandingPage, GamePage, RulesModal } from "./components";

type GameState = "landing" | "playing";
export type GameMode = "two-player" | "lonely";

export default function Home() {
  const [gameState, setGameState] = useState<GameState>("landing");
  const [gameMode, setGameMode] = useState<GameMode>("two-player");
  const [showRules, setShowRules] = useState(false);

  const handleStart = (mode: GameMode) => {
    setGameMode(mode);
    setGameState("playing");
  };

  return (
    <>
      {gameState === "landing" && (
        <LandingPage onStart={handleStart} />
      )}
      {gameState === "playing" && (
        <GamePage
          mode={gameMode}
          onReset={() => setGameState("landing")}
          onShowRules={() => setShowRules(true)}
        />
      )}
      {showRules && <RulesModal onClose={() => setShowRules(false)} />}
    </>
  );
}
