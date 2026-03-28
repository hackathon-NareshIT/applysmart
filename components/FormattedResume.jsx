"use client";

import { Download, Clipboard, ClipboardCheck } from "lucide-react";
import { useRef, useState } from "react";

export default function FormattedResume({ resumeText, isDark, onDownload }) {
  const resumeRef = useRef(null);
  const [copied, setCopied] = useState(false);

  // Parse markdown headers and format the resume
  const parseResume = (text) => {
    const lines = text.split("\n");
    let nameRendered = false;
    // Track whether we're still in the contact/header block (before first section)
    let inContactBlock = false;
    let firstSectionSeen = false;

    return lines.map((line, idx) => {
      // First # header = candidate name — render as large title
      if (line.startsWith("# ") && !nameRendered) {
        nameRendered = true;
        inContactBlock = true;
        const name = line.slice(2).trim();
        return (
          <div
            key={idx}
            className="mb-1 mt-0 text-center"
            style={{
              fontSize: "26px",
              fontWeight: "800",
              letterSpacing: "0.01em",
              lineHeight: "1.2",
              color: isDark ? "#f1f5f9" : "#0f172a",
            }}
          >
            {name}
          </div>
        );
      }

      // Subsequent # headers = section headers (end of contact block)
      if (line.startsWith("# ")) {
        inContactBlock = false;
        firstSectionSeen = true;
        const title = line.slice(2).trim();
        return (
          <div
            key={idx}
            className="mb-4 mt-6"
            style={{
              fontSize: "13px",
              fontWeight: "700",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              borderBottom: isDark
                ? "1px solid rgba(148,163,184,0.2)"
                : "1px solid rgba(15,23,42,0.15)",
              paddingBottom: "6px",
              color: isDark ? "#94a3b8" : "#475569",
            }}
          >
            {title}
          </div>
        );
      }

      // Subsection header (## Subsection) — also ends contact block
      if (line.startsWith("## ")) {
        inContactBlock = false;
        firstSectionSeen = true;
        const title = line.slice(3).trim();
        return (
          <div
            key={idx}
            className="mb-2 mt-3"
            style={{
              fontSize: "14px",
              fontWeight: "bold",
            }}
          >
            {title}
          </div>
        );
      }

      // Contact block: center non-bullet text lines before first section
      if (inContactBlock && !firstSectionSeen && line.trim() && !line.trim().startsWith("-")) {
        return (
          <div
            key={idx}
            className="mb-0.5 text-center"
            style={{ fontSize: "13px", lineHeight: "1.5", color: isDark ? "#94a3b8" : "#475569" }}
          >
            {line}
          </div>
        );
      }

      // Bullet points
      if (line.trim().startsWith("-")) {
        const content = line.trim().slice(1).trim();
        return (
          <div key={idx} className="mb-1 ml-4" style={{ fontSize: "14px" }}>
            <span>• {content}</span>
          </div>
        );
      }

      // Regular text
      if (line.trim()) {
        return (
          <div
            key={idx}
            className="mb-1"
            style={{ fontSize: "14px", lineHeight: "1.5" }}
          >
            {line}
          </div>
        );
      }

      // Empty lines — smaller gap in contact block
      if (inContactBlock && !firstSectionSeen) {
        return <div key={idx} className="mb-1" />;
      }

      return <div key={idx} className="mb-2" />;
    });
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(resumeText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end gap-2 flex-wrap">
        {/* <div>
        <h2 className="text-xl font-bold">Improved Resume</h2>

        </div> */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all cursor-pointer ${
              isDark
                ? "bg-white/[0.06] hover:bg-white/[0.12]"
                : "bg-gray-900/[0.06] hover:bg-gray-900/[0.12]"
            }`}
          >
            {copied ? (
              <>
                <ClipboardCheck size={16} className="text-emerald-400" /> Copied!
              </>
            ) : (
              <>
                <Clipboard size={16} /> Copy
              </>
            )}
          </button>
          <button
            onClick={onDownload}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all cursor-pointer ${
              isDark
                ? "bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600/30"
                : "bg-emerald-600/20 text-emerald-700 hover:bg-emerald-600/30"
            }`}
          >
            <Download size={16} />
            Download PDF
          </button>
        </div>
      </div>

      <div
        ref={resumeRef}
        className={`rounded-2xl border ${
          isDark
            ? "border-white/[0.08] bg-white/[0.03]"
            : "border-gray-900/[0.08] bg-gray-900/[0.03]"
        } p-4 sm:p-8`}
        style={{
          fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
          lineHeight: "1.6",
          color: isDark ? "#e5e7eb" : "#1f2937",
          backgroundColor: isDark ? "#0f172a" : "#ffffff",
        }}
      >
        {parseResume(resumeText)}
      </div>
    </div>
  );
}
