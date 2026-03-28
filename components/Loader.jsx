export default function Loader({ label = "Thinking…", theme = "dark" }) {
  const isDark = theme === "dark";

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12">
      {/* This is a spinning ring loader */}
      <div className="relative w-12 h-12">
        <span className={`absolute inset-0 rounded-full border-2 ${isDark ? "border-white/10" : "border-gray-900/10"}`} />
        <span className={`absolute inset-0 rounded-full border-2 ${isDark ? "border-t-indigo-400 border-r-violet-400 border-b-transparent border-l-transparent" : "border-t-indigo-600 border-r-violet-600 border-b-transparent border-l-transparent"} animate-spin`} />
      </div>
      <p className={`text-xs font-medium tracking-widest uppercase animate-pulse ${isDark ? "text-gray-500" : "text-gray-600"}`}>
        {label}
      </p>
    </div>
  );
}
