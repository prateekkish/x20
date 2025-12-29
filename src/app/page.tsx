"use client";

import { useState } from "react";
import {
  LandingPage,
  GamePage,
  RulesModal,
  MultiplayerLobby,
  CreateGame,
  JoinGame,
  MultiplayerGame,
} from "./components";

type GameState =
  | "landing"
  | "playing"
  | "multiplayer-lobby"
  | "multiplayer-create"
  | "multiplayer-join"
  | "multiplayer-playing";

export type GameMode = "two-player" | "lonely" | "multiplayer";
export type MultiplayerRole = "host" | "guest";

export default function Home() {
  const [gameState, setGameState] = useState<GameState>("landing");
  const [gameMode, setGameMode] = useState<GameMode>("two-player");
  const [showRules, setShowRules] = useState(false);
  const [multiplayerGameId, setMultiplayerGameId] = useState<string | null>(null);
  const [multiplayerRole, setMultiplayerRole] = useState<MultiplayerRole>("host");

  const handleStart = (mode: GameMode) => {
    setGameMode(mode);
    if (mode === "multiplayer") {
      setGameState("multiplayer-lobby");
    } else {
      setGameState("playing");
    }
  };

  const handleMultiplayerGameStart = (gameId: string, role: MultiplayerRole) => {
    setMultiplayerGameId(gameId);
    setMultiplayerRole(role);
    setGameState("multiplayer-playing");
  };

  const handleReset = () => {
    setGameState("landing");
    setMultiplayerGameId(null);
  };

  return (
    <>
      {gameState === "landing" && <LandingPage onStart={handleStart} />}

      {gameState === "playing" && (
        <GamePage
          mode={gameMode}
          onReset={handleReset}
          onShowRules={() => setShowRules(true)}
        />
      )}

      {gameState === "multiplayer-lobby" && (
        <MultiplayerLobby
          onCreateGame={() => setGameState("multiplayer-create")}
          onJoinGame={() => setGameState("multiplayer-join")}
          onBack={handleReset}
        />
      )}

      {gameState === "multiplayer-create" && (
        <CreateGame
          onGameStart={(gameId) => handleMultiplayerGameStart(gameId, "host")}
          onBack={() => setGameState("multiplayer-lobby")}
        />
      )}

      {gameState === "multiplayer-join" && (
        <JoinGame
          onGameStart={(gameId) => handleMultiplayerGameStart(gameId, "guest")}
          onBack={() => setGameState("multiplayer-lobby")}
        />
      )}

      {gameState === "multiplayer-playing" && multiplayerGameId && (
        <MultiplayerGame
          gameId={multiplayerGameId}
          playerRole={multiplayerRole}
          onReset={handleReset}
          onShowRules={() => setShowRules(true)}
        />
      )}

      {showRules && <RulesModal onClose={() => setShowRules(false)} />}
    </>
  );
}
