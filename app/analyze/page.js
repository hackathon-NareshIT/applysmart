"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { FileText, Upload, X, Search, Loader2 } from "lucide-react";
import useAppStore from "@/store/useAppStore";
import PageShell from "@/components/PageShell";
import StatusMessages from "@/components/StatusMessages";
import { usePageSetup } from "@/lib/usePageSetup";
import { parseFile } from "@/lib/fileParser";

const ANALYZE_MESSAGES = [
  "Analyzing your resume…",
  "Matching keywords to job description…",
  "Scoring your qualifications…",
];

export default function AnalyzePage() {
  const router = useRouter();
  const { mounted, isDark, theme } = usePageSetup(true);

  const {
    resume, jobDescription, resumeFileName,
    setResume, setJobDescription, setResumeFileName,
    setResult, token,
  } = useAppStore();

  const [parsing, setParsing] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const fileRef = useRef(null);

  if (!mounted) return null;

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setParsing(true);
    try {
      const text = await parseFile(file);
      setResume(text);
      setResumeFileName(file.name);
      toast.success(`Parsed: ${file.name}`);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setParsing(false);
      e.target.value = "";
    }
  }

  function clearResume() {
    setResume("");
    setResumeFileName("");
    if (fileRef.current) fileRef.current.value = "";
  }

  async function handleAnalyze() {
    if (!resume.trim() || !jobDescription.trim()) {
      toast.error("Please fill in both fields.");
      return;
    }
    setAnalyzing(true);
    const tid = toast.loading("Analyzing your resume…");
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume, jobDescription }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Analysis failed.");
      setResult(data);
      toast.dismiss(tid);
      toast.success("Analysis complete!");
      router.push("/analyze/results");
    } catch (err) {
      toast.dismiss(tid);
      toast.error(err.message);
    } finally {
      setAnalyzing(false);
    }
  }

  const busy = parsing || analyzing;

  const inputCls = `w-full rounded-xl border p-4 text-sm outline-none resize-none transition-all
    ${isDark
      ? "bg-white/[0.04] border-white/[0.08] text-gray-200 placeholder:text-gray-600 focus:border-indigo-500/50 focus:bg-white/[0.06]"
      : "bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-indigo-400 shadow-sm"}
    disabled:opacity-40`;

  return (
    <PageShell>
      <div className="mb-4">
        <h1 className={`text-xl font-bold mb-0.5 ${isDark ? "text-white" : "text-gray-900"}`}>
          New Analysis
        </h1>
        <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
          Paste your resume and the job description, then run the AI analysis.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-3 md:items-stretch">
        <div className="flex flex-col gap-2">
          {/* Label row + upload button + filename chip — all inline */}
          <div className="flex items-center justify-between gap-2 h-7">
            <label className={`flex items-center gap-2 text-xs font-semibold uppercase tracking-wider shrink-0 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
              <FileText size={13} className={isDark ? "text-indigo-400" : "text-indigo-600"} />
              Your Resume
            </label>
            <div className="flex items-center gap-2 min-w-0">
              {resumeFileName && (
                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium min-w-0
                  ${isDark ? "bg-emerald-500/10 border border-emerald-500/25 text-emerald-300" : "bg-emerald-50 border border-emerald-200 text-emerald-700"}`}>
                  <span className="truncate max-w-[120px]">✓ {resumeFileName}</span>
                  <button onClick={clearResume} className="shrink-0 hover:opacity-70 transition-opacity cursor-pointer">
                    <X size={11} />
                  </button>
                </div>
              )}
              <label className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all border shrink-0
                ${isDark
                  ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/20"
                  : "bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100"}`}>
                {parsing ? <Loader2 size={12} className="animate-spin" /> : <Upload size={12} />}
                {parsing ? "Parsing…" : "Upload"}
                <input ref={fileRef} type="file" accept=".pdf,.docx,.txt" onChange={handleFile} disabled={busy} className="hidden" />
              </label>
            </div>
          </div>

          <textarea
            value={resume}
            onChange={(e) => setResume(e.target.value)}
            placeholder="Or paste your resume text here…"
            rows={14}
            disabled={busy}
            className={`flex-1 ${inputCls}`}
          />
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center h-7">
            <label className={`flex items-center gap-2 text-xs font-semibold uppercase tracking-wider ${isDark ? "text-gray-400" : "text-gray-500"}`}>
              <Search size={13} className={isDark ? "text-violet-400" : "text-violet-600"} />
              Job Description
            </label>
          </div>

          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the job description here…"
            rows={14}
            disabled={busy}
            className={`flex-1 ${inputCls}`}
          />
        </div>
      </div>

      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-2xl border
        ${isDark ? "bg-white/[0.02] border-white/[0.06]" : "bg-white border-gray-200 shadow-sm"}`}>
        <p className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}>
          Supports PDF, DOCX, and TXT files
        </p>
        <div className="flex flex-col sm:flex-row sm:items-center justify-end gap-2">
          <StatusMessages active={analyzing} messages={ANALYZE_MESSAGES} isDark={isDark} />
          <button
            onClick={handleAnalyze}
            disabled={busy || !resume.trim() || !jobDescription.trim()}
            className={`w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white transition-all
              bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500
              disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer`}
          >
            {analyzing ? <Loader2 size={15} className="animate-spin" /> : <Search size={15} />}
            {analyzing ? "Analyzing…" : "Analyze Match"}
          </button>
        </div>
      </div>
    </PageShell>
  );
}
