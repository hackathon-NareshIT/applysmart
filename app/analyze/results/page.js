"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { ArrowLeft, Sparkles, Save, Loader2 } from "lucide-react";
import useAppStore from "@/store/useAppStore";
import PageShell from "@/components/PageShell";
import ScoreCard from "@/components/ScoreCard";
import ResultCards from "@/components/ResultCards";
import { usePageSetup } from "@/lib/usePageSetup";
import { clearAnalysisState } from "@/lib/analysisStorage";

export default function ResultsPage() {
  const router = useRouter();
  const { mounted, isDark, theme } = usePageSetup(true);

  const { result, resume, jobDescription, improvedResume, token, clearAnalysis } = useAppStore();
  const [saving, setSaving] = useState(false);
  const [savedId, setSavedId] = useState(null);

  useEffect(() => {
    if (mounted && !result) {
      router.replace("/analyze");
    }
  }, [mounted, result, router]);

  if (!mounted || !result) return null;

  async function handleSave() {
    if (!token) { toast.error("Please log in to save."); return; }
    setSaving(true);
    try {
      const res = await fetch("/api/analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          resumeText: resume,
          jobDescription,
          matchScore: result.matchScore,
          strengths: result.strengths || [],
          missingSkills: result.missingSkills || [],
          suggestions: result.suggestions || [],
          improvedResume: improvedResume || "",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed.");
      setSavedId(data.id);
      toast.success("Analysis saved!");
      // Clear analysis state so the next session starts fresh
      clearAnalysisState({ clearAnalysis });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <PageShell>
      {/* Back link */}
      <div className="mb-4">
        <Link
          href="/analyze"
          className={`inline-flex items-center gap-2 text-sm font-medium transition-opacity hover:opacity-70
            ${isDark ? "text-gray-400" : "text-gray-500"}`}
        >
          <ArrowLeft size={15} />
          Back
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-stretch gap-4 mb-5">
        <div className="flex flex-col justify-between gap-3 flex-1">
          <div>
            <h1 className={`text-xl font-bold leading-tight ${isDark ? "text-white" : "text-gray-900"}`}>
              Analysis Results
            </h1>
            <p className={`text-xs mt-0.5 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
              How your resume matches the job description
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {savedId ? (
              <Link
                href={`/analysis/${savedId}`}
                className={`cursor-pointer text-xs font-medium px-3 py-1.5 rounded-lg transition-all
                  ${isDark ? "bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25" : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"}`}
              >
                View Saved →
              </Link>
            ) : (
              <div className="relative group">
                <button
                  onClick={handleSave}
                  disabled={saving || !improvedResume}
                  title={!improvedResume ? "Generate an improved resume first" : undefined}
                  className={`cursor-pointer flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-all
                    ${isDark ? "bg-white/[0.06] text-gray-300 hover:bg-white/[0.10] border border-white/[0.08]" : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 shadow-sm"}
                    disabled:opacity-40 disabled:cursor-not-allowed`}
                >
                  {saving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
                  {saving ? "Saving…" : "Save Analysis"}
                </button>
                {!improvedResume && (
                  <span className={`pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 whitespace-nowrap rounded-lg px-2.5 py-1.5 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity z-10
                    ${isDark ? "bg-gray-800 text-gray-200 border border-white/[0.08]" : "bg-gray-900 text-white"}`}>
                    Generate improved resume first
                  </span>
                )}
              </div>
            )}
            <button
              onClick={() => router.push("/analyze/improve")}
              className="cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold text-xs text-white transition-all bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500"
            >
              <Sparkles size={13} />
              {improvedResume ? "View Improved" : "Improve Resume"}
            </button>
          </div>
        </div>

        <div className="w-full sm:w-72 shrink-0">
          <ScoreCard score={result.matchScore} theme={theme} />
        </div>
      </div>

      <ResultCards result={result} theme={theme} />
    </PageShell>
  );
}
