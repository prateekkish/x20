"use client";

import { useState, useEffect } from "react";
import { GAME_CONFIG } from "../constants";

interface Particle {
  id: number;
  left: number;
  delay: number;
}

export function Particles() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const p = Array.from({ length: GAME_CONFIG.PARTICLE_COUNT }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 15,
    }));
    setParticles(p);
  }, []);

  return (
    <div className="particles-bg" aria-hidden="true">
      {particles.map((p) => (
        <div
          key={p.id}
          className="particle"
          style={{
            left: `${p.left}%`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
