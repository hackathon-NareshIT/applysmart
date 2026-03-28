"use client";

import Navbar from "@/components/Navbar";
import useAppStore from "@/store/useAppStore";

export default function PageShell({ children }) {
  const { theme } = useAppStore();
  const isDark = theme === "dark";

  return (
    <main className={`min-h-screen ${isDark ? "bg-[#0b0f1a] text-white" : "bg-[#f8fafc] text-[#0f172a]"}`}>
      <Navbar />

      <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
        <div className={`absolute -top-60 -left-60 w-[700px] h-[700px] rounded-full blur-[140px] ${isDark ? "bg-indigo-600/8" : "bg-indigo-400/10"}`} />
        <div className={`absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[120px] ${isDark ? "bg-violet-600/8" : "bg-violet-400/8"}`} />
        <div className={`absolute bottom-0 left-1/2 w-[400px] h-[400px] rounded-full blur-[100px] ${isDark ? "bg-purple-600/5" : "bg-purple-400/6"}`} />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-6">
        {children}
      </div>
    </main>
  );
}
