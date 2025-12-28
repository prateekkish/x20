"use client";

interface RulesListProps {
  variant: "numbered" | "bulleted";
}

const RULES = [
  {
    numbered: <>Place <span className="text-cyan-400">✕</span> and <span className="text-pink-500">○</span> on the grid to get three in a row</>,
    bulleted: <>Place <span className="text-cyan-400">✕</span> and <span className="text-pink-500">○</span> on the grid</>,
  },
  {
    numbered: <>You can only have <span className="text-white font-bold">3 symbols</span> on the board at a time</>,
    bulleted: <>Max <span className="text-white font-bold">3 symbols</span> per player at a time</>,
  },
  {
    numbered: <>When you place a 4th, your <span className="text-white font-bold">oldest symbol vanishes</span></>,
    bulleted: <>4th placement removes your <span className="text-white font-bold">oldest</span> symbol</>,
  },
  {
    numbered: null,
    bulleted: <>Get <span className="text-white font-bold">three in a row</span> to win</>,
  },
];

export function RulesList({ variant }: RulesListProps) {
  const filteredRules = variant === "numbered"
    ? RULES.filter(r => r.numbered !== null)
    : RULES;

  return (
    <ul className={`text-sm text-gray-300 ${variant === "numbered" ? "space-y-4" : "space-y-3"}`}>
      {filteredRules.map((rule, index) => (
        <li key={index} className={`flex ${variant === "numbered" ? "gap-3" : "gap-2"} items-start`}>
          <span className={`text-cyan-400 ${variant === "numbered" ? "mt-0.5" : ""}`}>
            {variant === "numbered" ? `0${index + 1}` : "•"}
          </span>
          <span>{variant === "numbered" ? rule.numbered : rule.bulleted}</span>
        </li>
      ))}
    </ul>
  );
}
