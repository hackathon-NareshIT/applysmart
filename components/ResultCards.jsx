"use client";

const CARD_CONFIG = [
  {
    key: "strengths",
    label: "Strengths",
    emoji: "✅",
    bg: "from-emerald-500/10 to-emerald-500/5",
    border: "border-emerald-500/20",
    badge: "bg-emerald-500/15 text-emerald-300 border border-emerald-500/20",
    dot: "bg-emerald-400",
    hover: "hover:border-emerald-500/35",
  },
  {
    key: "missingSkills",
    label: "Missing Skills",
    emoji: "⚠️",
    bg: "from-rose-500/10 to-rose-500/5",
    border: "border-rose-500/20",
    badge: "bg-rose-500/15 text-rose-300 border border-rose-500/20",
    dot: "bg-rose-400",
    hover: "hover:border-rose-500/35",
  },
  {
    key: "suggestions",
    label: "Suggestions",
    emoji: "💡",
    bg: "from-amber-500/10 to-amber-500/5",
    border: "border-amber-500/20",
    badge: "bg-amber-500/15 text-amber-300 border border-amber-500/20",
    dot: "bg-amber-400",
    hover: "hover:border-amber-500/35",
  },
];

export default function ResultCards({ result, theme = "dark" }) {
  const isDark = theme === "dark";

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {CARD_CONFIG.map(({ key, label, emoji, bg, border, badge, dot, hover }) => {
        const items = result[key] ?? [];
        return (
          <div
            key={key}
            className={`rounded-2xl border ${hover} bg-gradient-to-br ${bg} p-5 flex flex-col gap-4 transition-colors duration-200 ${isDark ? `${border}` : "border-gray-900/[0.08]"}`}
          >
            {/* Header */}
            <div className="flex items-center justify-between gap-2">
              <h3 className={`font-semibold text-sm ${isDark ? "text-white" : "text-gray-900"}`}>{label}</h3>
              <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-0.5 rounded-full ${isDark ? badge : "bg-gray-900/10 text-gray-900 border border-gray-900/20"}`}>
                {emoji}
                <span>{items.length}</span>
              </span>
            </div>

            {/* Divider */}
            <div className={`h-px ${isDark ? "bg-white/[0.06]" : "bg-gray-900/[0.06]"}`} />

            <ul className="flex flex-col gap-2.5">
              {items.length === 0 ? (
                <li className={`text-xs italic ${isDark ? "text-gray-600" : "text-gray-500"}`}>None found</li>
              ) : (
                items.map((item, i) => (
                  <li key={i} className={`flex items-start gap-2.5 text-sm leading-snug ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                    <span className={`mt-[6px] w-1.5 h-1.5 rounded-full flex-shrink-0 ${dot}`} />
                    {item}
                  </li>
                ))
              )}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
