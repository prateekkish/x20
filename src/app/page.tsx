"use client";

import { useState } from "react";
import { LandingPage, GamePage, RulesModal } from "./components";

type GameState = "landing" | "playing";

export default function Home() {
  const [gameState, setGameState] = useState<GameState>("landing");
  const [showRules, setShowRules] = useState(false);

  return (
    <>
      {gameState === "landing" && (
        <LandingPage onStart={() => setGameState("playing")} />
      )}
      {gameState === "playing" && (
        <GamePage
          onReset={() => setGameState("landing")}
          onShowRules={() => setShowRules(true)}
        />
      )}
      {showRules && <RulesModal onClose={() => setShowRules(false)} />}
    </>
  );
}
