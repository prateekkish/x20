import { WINNING_LINES, GAME_CONFIG } from "./constants";

type Player = "X" | "O";
type SquareValue = Player | null;

interface Move {
  player: Player;
  position: number;
  order: number;
}

function checkWin(squares: SquareValue[], player: Player): boolean {
  for (const [a, b, c] of WINNING_LINES) {
    if (squares[a] === player && squares[b] === player && squares[c] === player) {
      return true;
    }
  }
  return false;
}

export function getAIMove(squares: SquareValue[], moves: Move[]): number | null {
  const emptySquares = squares
    .map((v, i) => (v === null ? i : -1))
    .filter((i) => i !== -1);

  if (emptySquares.length === 0) return null;

  const oMoves = moves.filter((m) => m.player === "O").sort((a, b) => a.order - b.order);
  const xMoves = moves.filter((m) => m.player === "X").sort((a, b) => a.order - b.order);

  const simulateMove = (pos: number): SquareValue[] => {
    const simSquares = [...squares];
    if (oMoves.length >= GAME_CONFIG.MAX_SYMBOLS_PER_PLAYER) {
      simSquares[oMoves[0].position] = null;
    }
    simSquares[pos] = "O";
    return simSquares;
  };

  // 1. Try to win
  for (const pos of emptySquares) {
    if (checkWin(simulateMove(pos), "O")) {
      return pos;
    }
  }

  // 2. Block opponent's win
  for (const pos of emptySquares) {
    const simSquares = [...squares];
    if (xMoves.length >= GAME_CONFIG.MAX_SYMBOLS_PER_PLAYER) {
      simSquares[xMoves[0].position] = null;
    }
    simSquares[pos] = "X";
    if (checkWin(simSquares, "X")) {
      return pos;
    }
  }

  // 3. Take center if available
  if (squares[4] === null) return 4;

  // 4. Take a corner
  const corners = [0, 2, 6, 8].filter((i) => squares[i] === null);
  if (corners.length > 0) {
    return corners[Math.floor(Math.random() * corners.length)];
  }

  // 5. Take any available
  return emptySquares[Math.floor(Math.random() * emptySquares.length)];
}
