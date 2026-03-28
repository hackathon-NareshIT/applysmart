"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { Plus, Loader2, ArrowRight, Trash2, BarChart2 } from "lucide-react";
import PageShell from "@/components/PageShell";
import ConfirmModal from "@/components/ConfirmModal";
import { usePageSetup } from "@/lib/usePageSetup";
import useAppStore from "@/store/useAppStore";

function ScoreBadge({ score }) {
  const color =
    score >= 75
      ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/25"
      : score >= 50
      ? "bg-amber-500/15 text-amber-400 border-amber-500/25"
      : "bg-rose-500/15 text-rose-400 border-rose-500/25";
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${color}`}>
      {score}%
    </span>
  );
}

export default function DashboardPage() {
  const { mounted, isDark } = usePageSetup(true);
  const { user } = useAppStore();
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [confirmId, setConfirmId] = useState(null); // id pending delete confirmation

  useEffect(() => {
    if (!mounted) return;
    const token = localStorage.getItem("authToken");
    if (!token) return;

    fetch("/api/analysis", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((d) => setAnalyses(d.analyses || []))
      .catch(() => toast.error("Failed to load analyses"))
      .finally(() => setLoading(false));
  }, [mounted]);

  async function handleDelete(e, id) {
    e.preventDefault();
    e.stopPropagation();
    setConfirmId(id);
  }

  async function confirmDelete() {
    const id = confirmId;
    setConfirmId(null);
    setDeletingId(id);
    const token = localStorage.getItem("authToken");
    try {
      const res = await fetch(`/api/analysis/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Delete failed");
      setAnalyses((prev) => prev.filter((a) => a._id !== id));
      toast.success("Deleted");
    } catch {
      toast.error("Failed to delete");
    } finally {
      setDeletingId(null);
    }
  }

  if (!mounted) return null;

  return (
    <PageShell>
      <ConfirmModal
        open={!!confirmId}
        onConfirm={confirmDelete}
        onCancel={() => setConfirmId(null)}
        isDark={isDark}
        title="Delete this analysis?"
        message="This will permanently remove the analysis and cannot be undone."
        confirmLabel="Delete"
      />
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-8 sm:mb-10 flex-wrap">
        <div>
          <h1 className={`text-xl sm:text-2xl font-bold mb-1 ${isDark ? "text-white" : "text-gray-900"}`}>
            {user?.name ? `Welcome back, ${user.name.split(" ")[0]}` : "Dashboard"}
          </h1>
          <p className={`text-xs sm:text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
            {analyses.length > 0
              ? `${analyses.length} ${analyses.length === 1 ? "analysis" : "analyses"} saved`
              : "No analyses yet — start your first one"}
          </p>
        </div>
        <Link
          href="/analyze"
          className="flex items-center gap-2 px-3 sm:px-5 py-2.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 transition-all shrink-0"
        >
          <Plus size={16} />
          <span className="hidden sm:inline">New Analysis</span>
        </Link>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center h-48">
          <Loader2 size={28} className="animate-spin text-indigo-400" />
        </div>
      )}

      {/* Empty state */}
      {!loading && analyses.length === 0 && (
        <div className={`flex flex-col items-center justify-center gap-5 py-20 rounded-2xl border
          ${isDark ? "border-white/[0.06] bg-white/[0.02]" : "border-gray-200 bg-white shadow-sm"}`}>
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center
            ${isDark ? "bg-indigo-500/15" : "bg-indigo-50"}`}>
            <BarChart2 size={24} className={isDark ? "text-indigo-400" : "text-indigo-600"} />
          </div>
          <div className="text-center">
            <p className={`text-base font-semibold mb-1 ${isDark ? "text-white" : "text-gray-900"}`}>
              No analyses yet
            </p>
            <p className={`text-sm ${isDark ? "text-gray-500" : "text-gray-400"}`}>
              Upload your resume and a job description to get started.
            </p>
          </div>
          <Link
            href="/analyze"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 transition-all"
          >
            Create First Analysis <ArrowRight size={15} />
          </Link>
        </div>
      )}

      {/* Table */}
      {!loading && analyses.length > 0 && (
        <div className={`rounded-2xl border overflow-hidden
          ${isDark ? "border-white/[0.08] bg-white/[0.01]" : "border-gray-200 bg-white shadow-sm"}`}>

          {/* Desktop header — hidden on mobile */}
          <div className={`hidden sm:grid grid-cols-[minmax(0,1fr)_80px_110px_160px] items-center px-5 py-3 text-xs font-semibold uppercase tracking-widest
            ${isDark
              ? "bg-white/[0.03] text-gray-500 border-b border-white/[0.07]"
              : "bg-gray-50/80 text-gray-400 border-b border-gray-200"}`}>
            <span>Job Description</span>
            <span className="text-center">Score</span>
            <span className="text-right">Date</span>
            <span className="text-right">Actions</span>
          </div>

          {analyses.map((a, i) => (
            <div
              key={a._id}
              className={`group transition-colors
                ${i !== analyses.length - 1
                  ? isDark ? "border-b border-white/[0.05]" : "border-b border-gray-100"
                  : ""}
                ${isDark ? "hover:bg-white/[0.035]" : "hover:bg-slate-50"}`}
            >
              {/* Desktop row */}
              <div className="hidden sm:grid grid-cols-[minmax(0,1fr)_80px_110px_160px] items-center px-5 py-3.5">
                <Link href={`/analysis/${a._id}`} className="min-w-0 pr-4">
                  <p className={`text-sm truncate transition-colors
                    ${isDark
                      ? "text-gray-300 group-hover:text-white"
                      : "text-gray-700 group-hover:text-gray-900"}`}>
                    {a.jobDescription}
                  </p>
                </Link>
                <div className="flex justify-center">
                  <ScoreBadge score={a.matchScore} />
                </div>
                <span className={`text-xs text-right whitespace-nowrap tabular-nums
                  ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                  {new Date(a.createdAt).toLocaleDateString("en-US", {
                    month: "short", day: "numeric", year: "numeric",
                  })}
                </span>
                <div className="flex items-center justify-end gap-2">
                  <Link
                    href={`/analysis/${a._id}`}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all
                      ${isDark
                        ? "bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 border border-indigo-500/20"
                        : "bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border border-indigo-200"}`}
                  >
                    View <ArrowRight size={11} />
                  </Link>
                  <button
                    onClick={(e) => handleDelete(e, a._id)}
                    disabled={deletingId === a._id}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer
                      ${isDark
                        ? "bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20"
                        : "bg-red-50 text-red-500 hover:bg-red-100 border border-red-200"}`}
                  >
                    {deletingId === a._id
                      ? <Loader2 size={11} className="animate-spin" />
                      : <Trash2 size={11} />}
                  </button>
                </div>
              </div>

              {/* Mobile card */}
              <div className="sm:hidden px-4 py-3.5 flex flex-col gap-2">
                <Link href={`/analysis/${a._id}`} className="min-w-0">
                  <p className={`text-sm font-medium line-clamp-2 transition-colors
                    ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                    {a.jobDescription}
                  </p>
                </Link>
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <ScoreBadge score={a.matchScore} />
                    <span className={`text-xs tabular-nums ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                      {new Date(a.createdAt).toLocaleDateString("en-US", {
                        month: "short", day: "numeric", year: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/analysis/${a._id}`}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all
                        ${isDark
                          ? "bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 border border-indigo-500/20"
                          : "bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border border-indigo-200"}`}
                    >
                      View <ArrowRight size={11} />
                    </Link>
                    <button
                      onClick={(e) => handleDelete(e, a._id)}
                      disabled={deletingId === a._id}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer
                        ${isDark
                          ? "bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20"
                          : "bg-red-50 text-red-500 hover:bg-red-100 border border-red-200"}`}
                    >
                      {deletingId === a._id
                        ? <Loader2 size={11} className="animate-spin" />
                        : <Trash2 size={11} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </PageShell>
  );
}
