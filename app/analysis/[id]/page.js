"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { ArrowLeft, Loader2, Trash2, Clipboard, ClipboardCheck } from "lucide-react";
import useAppStore from "@/store/useAppStore";
import PageShell from "@/components/PageShell";
import ScoreCard from "@/components/ScoreCard";
import ResultCards from "@/components/ResultCards";
import FormattedResume from "@/components/FormattedResume";
import ConfirmModal from "@/components/ConfirmModal";
import { usePageSetup } from "@/lib/usePageSetup";
import { downloadResumeAsPdf } from "@/lib/downloadPdf";

const TABS = ["Overview", "Improved Resume"];

export default function AnalysisDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { mounted, isDark, theme } = usePageSetup(true);
  const { isAuthenticated } = useAppStore();

  const [analysis, setAnalysis] = useState(null);
  const [fetching, setFetching] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [copiedJD, setCopiedJD] = useState(false);

  useEffect(() => {
    if (!mounted || !isAuthenticated) return;
    const token = localStorage.getItem("authToken");
    if (!token) { router.push("/login"); return; }

    fetch(`/api/analysis/${params.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setAnalysis(data);
      })
      .catch((err) => {
        toast.error(err.message || "Failed to load analysis");
        router.push("/dashboard");
      })
      .finally(() => setFetching(false));
  }, [mounted, isAuthenticated, params.id, router]);

  async function handleDelete() {
    setDeleting(true);
    const token = localStorage.getItem("authToken");
    try {
      const res = await fetch(`/api/analysis/${params.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Delete failed");
      toast.success("Analysis deleted");
      router.push("/dashboard");
    } catch {
      toast.error("Failed to delete");
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  }

  async function handleCopyJD() {
    await navigator.clipboard.writeText(analysis.jobDescription);
    setCopiedJD(true);
    setTimeout(() => setCopiedJD(false), 2000);
  }

  async function handleDownload() {
    try {
      await downloadResumeAsPdf(analysis.improvedResume);
      toast.success("Downloaded!");
    } catch {
      toast.error("Download failed.");
    }
  }

  if (!mounted || fetching) {
    return (
      <PageShell>
        <div className="flex items-center justify-center h-64">
          <Loader2 size={28} className="animate-spin text-indigo-400" />
        </div>
      </PageShell>
    );
  }

  if (!analysis) return null;

  const hasImproved = !!analysis.improvedResume;

  const tabCls = (i) =>
    `cursor-pointer px-4 py-2 rounded-lg text-sm font-medium transition-all ${
      activeTab === i
        ? isDark
          ? "bg-white/[0.10] text-white shadow-sm"
          : "bg-white text-gray-900 shadow-sm"
        : isDark
        ? "text-gray-500 hover:text-gray-300"
        : "text-gray-500 hover:text-gray-700"
    }`;

  return (
    <PageShell>
      <ConfirmModal
        open={showDeleteModal}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
        isDark={isDark}
        title="Delete this analysis?"
        message="This will permanently remove the analysis and cannot be undone."
        confirmLabel={deleting ? "Deleting…" : "Delete"}
      />

      {/* Back Button */}
      <Link
        href="/dashboard"
        className={`inline-flex items-center gap-2 text-sm font-medium mb-6 transition-opacity hover:opacity-70 ${
          isDark ? "text-gray-400" : "text-gray-500"
        }`}
      >
        <ArrowLeft size={16} />
        Back to Dashboard
      </Link>

      <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
        <div>
          <h1 className={`text-lg sm:text-xl font-bold mb-0.5 ${isDark ? "text-white" : "text-gray-900"}`}>
            Analysis Details
          </h1>
          <p className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}>
            {new Date(analysis.createdAt).toLocaleDateString("en-US", {
              year: "numeric", month: "long", day: "numeric",
            })}
            {" · "}
            {new Date(analysis.createdAt).toLocaleTimeString("en-US", {
              hour: "2-digit", minute: "2-digit",
            })}
          </p>
        </div>
        <button
          onClick={() => setShowDeleteModal(true)}
          className={`cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border
            ${isDark
              ? "bg-red-500/10 text-red-400 hover:bg-red-500/20 border-red-500/20"
              : "bg-red-50 text-red-500 hover:bg-red-100 border-red-200"}`}
        >
          {deleting ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
          Delete
        </button>
      </div>

      <div className={`flex flex-col sm:flex-row gap-4 items-stretch mb-6 p-4 rounded-2xl border
        ${isDark ? "bg-white/[0.02] border-white/[0.06]" : "bg-white border-gray-200 shadow-sm"}`}>

        <div className="flex flex-col justify-center items-start gap-4 sm:w-1/2 min-w-0">
          {hasImproved ? (
            <div
              className={`flex gap-1 p-1 rounded-xl w-fit ${
                isDark
                  ? "bg-white/[0.04] border border-white/[0.06]"
                  : "bg-gray-100 border border-gray-200"
              }`}
            >
              {TABS.map((tab, i) => (
                <button key={tab} onClick={() => setActiveTab(i)} className={tabCls(i)}>
                  {tab}
                </button>
              ))}
            </div>
          ) : (
            <p className={`text-xs ${isDark ? "text-gray-600" : "text-gray-400"}`}>
              No improved resume saved for this analysis.
            </p>
          )}
        </div>

        {/* Divider */}
        <div className={`hidden sm:block w-px self-stretch ${isDark ? "bg-white/[0.06]" : "bg-gray-200"}`} />

        <div className="w-full sm:w-1/2 shrink-0">
          <ScoreCard score={analysis.matchScore} theme={theme} />
        </div>
      </div>

      {activeTab === 0 && (
        <div className="space-y-6">
          <ResultCards result={analysis} theme={theme} />

          <div className={`rounded-2xl border p-5 ${
            isDark ? "border-white/[0.06] bg-white/[0.02]" : "border-gray-200 bg-white shadow-sm"
          }`}>
            <div className="flex items-center justify-between gap-2 mb-3">
              <p className={`text-xs font-semibold uppercase tracking-wider ${
                isDark ? "text-gray-500" : "text-gray-400"
              }`}>
                Job Description
              </p>
              <button
                onClick={handleCopyJD}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  isDark
                    ? "bg-white/[0.05] hover:bg-white/[0.10] text-gray-400 hover:text-gray-200"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700"
                }`}
              >
                {copiedJD ? (
                  <><ClipboardCheck size={12} className="text-emerald-400" /> Copied</>
                ) : (
                  <><Clipboard size={12} /> Copy</>
                )}
              </button>
            </div>
            <p className={`text-sm leading-relaxed whitespace-pre-wrap ${
              isDark ? "text-gray-300" : "text-gray-700"
            }`}>
              {analysis.jobDescription}
            </p>
          </div>
        </div>
      )}

      {activeTab === 1 && hasImproved && (
        <FormattedResume
          resumeText={analysis.improvedResume}
          isDark={isDark}
          onDownload={handleDownload}
        />
      )}
    </PageShell>
  );
}
