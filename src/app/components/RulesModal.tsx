"use client";

import { useEffect, useCallback } from "react";
import { RulesList } from "./RulesList";

interface RulesModalProps {
  onClose: () => void;
}

export function RulesModal({ onClose }: RulesModalProps) {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") onClose();
  }, [onClose]);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="rules-title"
    >
      <div
        className="bg-[#0a0a12] border border-cyan-900/50 rounded-lg p-6 max-w-sm w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="rules-title" className="text-xl font-bold mb-4 text-center">
          <span className="text-cyan-400">RULES</span>
        </h2>
        <RulesList variant="bulleted" />
        <button
          onClick={onClose}
          className="mt-6 w-full py-2 text-sm uppercase tracking-widest
            border border-cyan-900/50 rounded
            bg-transparent text-cyan-400
            hover:bg-cyan-950/30 hover:border-cyan-400/50
            transition-all duration-300"
        >
          Got it
        </button>
      </div>
    </div>
  );
}
