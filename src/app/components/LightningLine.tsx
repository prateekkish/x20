"use client";

import { useState, useEffect, useCallback } from "react";
import { COLORS, GAME_CONFIG } from "../constants";

type Player = "X" | "O";

interface LightningLineProps {
  line: number[];
  winner: Player;
}

export function LightningLine({ line, winner }: LightningLineProps) {
  const color = winner === "X" ? COLORS.X : COLORS.O;

  const getCenter = useCallback((pos: number) => {
    const row = Math.floor(pos / 3);
    const col = pos % 3;
    const x = (col + 0.5) * 33.33;
    const y = (row + 0.5) * 33.33;
    return { x, y };
  }, []);

  const generateLightningPath = useCallback(() => {
    const start = getCenter(line[0]);
    const end = getCenter(line[2]);
    const points: { x: number; y: number }[] = [start];
    const segments = GAME_CONFIG.LIGHTNING_SEGMENTS;
    const dx = (end.x - start.x) / segments;
    const dy = (end.y - start.y) / segments;

    const len = Math.sqrt(dx * dx + dy * dy);
    const perpX = len > 0 ? -dy / len : 0;
    const perpY = len > 0 ? dx / len : 0;

    for (let i = 1; i < segments; i++) {
      const jag = (Math.random() - 0.5) * GAME_CONFIG.LIGHTNING_JAG_MULTIPLIER;
      points.push({
        x: start.x + dx * i + perpX * jag,
        y: start.y + dy * i + perpY * jag,
      });
    }
    points.push(end);

    return points.map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(" ");
  }, [line, getCenter]);

  const [path, setPath] = useState(generateLightningPath());

  useEffect(() => {
    const interval = setInterval(() => {
      setPath(generateLightningPath());
    }, 100);
    return () => clearInterval(interval);
  }, [generateLightningPath]);

  return (
    <svg
      className="absolute inset-0 pointer-events-none z-20 w-full h-full"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <filter id={`lightning-glow-${winner}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <path
        d={path}
        stroke={color}
        strokeWidth="3"
        fill="none"
        opacity="0.3"
        filter={`url(#lightning-glow-${winner})`}
        vectorEffect="non-scaling-stroke"
      />
      <path
        d={path}
        stroke={color}
        strokeWidth="1.5"
        fill="none"
        opacity="0.6"
        filter={`url(#lightning-glow-${winner})`}
        vectorEffect="non-scaling-stroke"
      />
      <path
        d={path}
        stroke="#ffffff"
        strokeWidth="0.8"
        fill="none"
        filter={`url(#lightning-glow-${winner})`}
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
