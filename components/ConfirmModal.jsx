"use client";

import { Trash2, X } from "lucide-react";


export default function ConfirmModal({
  open,
  onConfirm,
  onCancel,
  isDark = false,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmLabel = "Delete",
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onCancel}
    >
      <div className={`absolute inset-0 ${isDark ? "bg-black/60" : "bg-black/30"} backdrop-blur-sm`} />

      <div
        className={`relative w-full max-w-sm rounded-2xl border p-6 shadow-2xl
          ${isDark ? "bg-[#0f172a] border-white/[0.10]" : "bg-white border-gray-200"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onCancel}
          className={`absolute top-4 right-4 p-1 rounded-lg transition-colors cursor-pointer
            ${isDark ? "text-gray-500 hover:text-gray-300 hover:bg-white/[0.06]" : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"}`}
        >
          <X size={15} />
        </button>

        <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4
          ${isDark ? "bg-red-500/15" : "bg-red-50"}`}>
          <Trash2 size={18} className={isDark ? "text-red-400" : "text-red-500"} />
        </div>

        <h3 className={`text-base font-semibold mb-1 ${isDark ? "text-white" : "text-gray-900"}`}>
          {title}
        </h3>
        <p className={`text-sm mb-6 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
          {message}
        </p>

        <div className="flex items-center gap-3 justify-end">
          <button
            onClick={onCancel}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer
              ${isDark ? "bg-white/[0.06] text-gray-300 hover:bg-white/[0.10] border border-white/[0.08]" : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"}`}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-red-500 hover:bg-red-600 transition-all cursor-pointer"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
