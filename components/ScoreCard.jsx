"use client";

export default function ScoreCard({ score, theme = "dark" }) {
  const isDark = theme === "dark";

  const getColor = (s) => {
    if (s >= 75) return "text-emerald-400";
    if (s >= 50) return "text-amber-400";
    return "text-rose-400";
  };

  const getLabel = (s) => {
    if (s >= 75) return { text: "Great Match", emoji: "🎯" };
    if (s >= 50) return { text: "Moderate Match", emoji: "📊" };
    return { text: "Low Match", emoji: "⚠️" };
  };

  const circumference = 2 * Math.PI * 36;
  const offset = circumference - (score / 100) * circumference;
  const { text, emoji } = getLabel(score);

  return (
    <div
      className={`flex items-center gap-4 rounded-2xl px-5 py-4 shadow-lg ${
        isDark ? "bg-white/[0.04] border border-white/[0.08]" : "bg-white border border-gray-200"
      }`}
    >
      <div className="relative w-20 h-20 shrink-0">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
          <defs>
            <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={isDark ? "#818cf8" : "#4f46e5"} />
              <stop offset="100%" stopColor={isDark ? "#a78bfa" : "#6d28d9"} />
            </linearGradient>
          </defs>
          <circle
            cx="40" cy="40" r="36"
            fill="none"
            stroke={isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.07)"}
            strokeWidth="3"
          />
          <circle
            cx="40" cy="40" r="36"
            fill="none"
            stroke="url(#scoreGrad)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-xl font-bold tabular-nums leading-none ${getColor(score)}`}>
            {score}
          </span>
          <span className={`text-[10px] font-medium ${isDark ? "text-gray-600" : "text-gray-400"}`}>/ 100</span>
        </div>
      </div>

      <div className="flex flex-col gap-2 min-w-0 flex-1">
        <p className={`text-[11px] font-semibold uppercase tracking-widest ${isDark ? "text-gray-500" : "text-gray-400"}`}>
          Match Score
        </p>
        <div className="flex items-center gap-1.5">
          <span className="text-sm">{emoji}</span>
          <span className={`text-sm font-semibold ${getColor(score)}`}>{text}</span>
        </div>
        {/* Progress bar, can be made longer if needed...... */}
        <div className={`h-1 w-full rounded-full overflow-hidden ${isDark ? "bg-white/[0.06]" : "bg-gray-100"}`}>
          <div
            className={`h-full rounded-full transition-all duration-1000 ease-out ${
              isDark
                ? "bg-gradient-to-r from-indigo-400 to-violet-400"
                : "bg-gradient-to-r from-indigo-600 to-violet-600"
            }`}
            style={{ width: `${score}%` }}
          />
        </div>
      </div>
    </div>
  );
}
