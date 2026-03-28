"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { ArrowLeft, Sparkles, Loader2, Save } from "lucide-react";
import useAppStore from "@/store/useAppStore";
import PageShell from "@/components/PageShell";
import FormattedResume from "@/components/FormattedResume";
import StatusMessages from "@/components/StatusMessages";
import { usePageSetup } from "@/lib/usePageSetup";
import { downloadResumeAsPdf } from "@/lib/downloadPdf";
import { clearAnalysisState } from "@/lib/analysisStorage";

const IMPROVE_MESSAGES = [
  "Rewriting your resume…",
  "Optimizing keywords…",
  "Tailoring to the job description…",
];

export default function ImprovePage() {
  const router = useRouter();
  const { mounted, isDark, theme } = usePageSetup(true);

  const { resume, jobDescription, improvedResume, setImprovedResume, result, token, clearAnalysis } = useAppStore();
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedId, setSavedId] = useState(null);

  // If no resume/job in store, redirect back
  useEffect(() => {
    if (mounted && (!resume.trim() || !jobDescription.trim())) {
      router.replace("/analyze");
    }
  }, [mounted, resume, jobDescription, router]);

  if (!mounted) return null;

  async function handleGenerate() {
    setGenerating(true);
    const tid = toast.loading("Generating improved resume…");
    try {
      const res = await fetch("/api/improve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume, jobDescription }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed.");
      setImprovedResume(data.improvedResume);
      toast.dismiss(tid);
      toast.success("Improved resume ready!");
    } catch (err) {
      toast.dismiss(tid);
      toast.error(err.message);
    } finally {
      setGenerating(false);
    }
  }

  async function handleDownload() {
    try {
      await downloadResumeAsPdf(improvedResume);
      toast.success("Downloaded!");
    } catch {
      toast.error("Download failed.");
    }
  }

  async function handleSave() {
    if (!token) { toast.error("Please log in to save."); return; }
    if (!result) { toast.error("No analysis result to save."); return; }
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
          improvedResume,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed.");
      setSavedId(data.id);
      toast.success("Analysis saved!");
      clearAnalysisState({ clearAnalysis });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <PageShell>
      {/* Nav */}
      <div className="flex items-center mb-6">
        <Link
          href={result ? "/analyze/results" : "/analyze"}
          className={`flex items-center gap-2 text-sm font-medium transition-opacity hover:opacity-70
            ${isDark ? "text-gray-400" : "text-gray-500"}`}
        >
          <ArrowLeft size={16} />
          {result ? "Back to Results" : "Back to Input"}
        </Link>
      </div>

      {/* Page title */}
      <div className="mb-8">
        <h1 className={`text-2xl font-bold mb-1 ${isDark ? "text-white" : "text-gray-900"}`}>
          Improved Resume
        </h1>
        <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
          AI-optimized version of your resume, tailored to the job description.
        </p>
      </div>

      {/* Generate button or resume */}
      {!improvedResume ? (
        <div className={`flex flex-col items-center justify-center gap-6 py-24 rounded-2xl border
          ${isDark ? "border-white/[0.06] bg-white/[0.02]" : "border-gray-200 bg-white shadow-sm"}`}>
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center
            ${isDark ? "bg-violet-500/15" : "bg-violet-50"}`}>
            <Sparkles size={28} className={isDark ? "text-violet-400" : "text-violet-600"} />
          </div>
          <div className="text-center">
            <p className={`text-base font-semibold mb-1 ${isDark ? "text-white" : "text-gray-900"}`}>
              Ready to improve your resume?
            </p>
            <p className={`text-sm ${isDark ? "text-gray-500" : "text-gray-400"}`}>
              AI will rewrite it to better match the job description.
            </p>
          </div>
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="cursor-pointer flex items-center gap-2 px-7 py-3 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 transition-all disabled:opacity-50"
          >
            {generating ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
            {generating ? "Generating…" : "Generate Improved Resume"}
          </button>
          <StatusMessages active={generating} messages={IMPROVE_MESSAGES} isDark={isDark} size="md" />
        </div>
      ) : (
        <div className="space-y-6">
          <FormattedResume
            resumeText={improvedResume}
            isDark={isDark}
            onDownload={handleDownload}
          />

          {/* This is Bottom bar: save and regenerate */}
          <div className={`flex items-center justify-between gap-4 p-4 rounded-2xl border
            ${isDark ? "bg-white/[0.02] border-white/[0.06]" : "bg-white border-gray-200 shadow-sm"}`}>
            <p className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}>
              Not satisfied? Generate a new version.
            </p>
            <div className="flex items-center gap-2">
              {savedId ? (
                <Link
                  href={`/analysis/${savedId}`}
                  className={`cursor-pointer text-xs font-medium px-3 py-1.5 rounded-lg transition-all
                    ${isDark ? "bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25 border border-emerald-500/25" : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"}`}
                >
                  View Saved →
                </Link>
              ) : (
                <button
                  onClick={handleSave}
                  disabled={saving || generating}
                  className={`cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all
                    ${isDark ? "bg-white/[0.06] text-gray-300 hover:bg-white/[0.10] border border-white/[0.08]" : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 shadow-sm"}
                    disabled:opacity-40 disabled:cursor-not-allowed`}
                >
                  {saving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
                  {saving ? "Saving…" : "Save Analysis"}
                </button>
              )}
              <button
                onClick={handleGenerate}
                disabled={generating || saving}
                className={`cursor-pointer flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all
                  ${isDark ? "bg-violet-500/15 text-violet-300 hover:bg-violet-500/25 border border-violet-500/25" : "bg-violet-50 text-violet-700 hover:bg-violet-100 border border-violet-200"}
                  disabled:opacity-40 disabled:cursor-not-allowed`}
              >
                {generating ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                {generating ? "Generating…" : "Regenerate"}
              </button>
            </div>
          </div>
        </div>
      )}
    </PageShell>
  );
}
