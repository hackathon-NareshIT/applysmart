export async function downloadResumeAsPdf(resumeText, filename = "improved-resume.pdf") {
  const html2pdf = (await import("html2pdf.js")).default;

  const cleanDiv = document.createElement("div");
  cleanDiv.style.cssText = `
    font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
    line-height: 1.6;
    color: #1f2937;
    background-color: #ffffff;
    padding: 40px 48px;
    max-width: 8.5in;
  `;

  const lines = resumeText.split("\n");
  let nameRendered = false;
  let inContactBlock = false;
  let firstSectionSeen = false;

  const htmlLines = lines.map((line) => {
    // First # = candidate name, centered large
    if (line.startsWith("# ") && !nameRendered) {
      nameRendered = true;
      inContactBlock = true;
      const t = line.slice(2).trim();
      return `<div style="font-size:26px;font-weight:800;letter-spacing:0.01em;line-height:1.2;color:#0f172a;text-align:center;margin-bottom:4px;">${t}</div>`;
    }

    // Subsequent # = section headers
    if (line.startsWith("# ")) {
      inContactBlock = false;
      firstSectionSeen = true;
      const t = line.slice(2).trim();
      return `<div style="font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;border-bottom:1px solid rgba(15,23,42,0.15);padding-bottom:6px;color:#475569;margin-top:24px;margin-bottom:16px;">${t}</div>`;
    }

    // ## = subsection headers
    if (line.startsWith("## ")) {
      inContactBlock = false;
      firstSectionSeen = true;
      const t = line.slice(3).trim();
      return `<div style="font-size:14px;font-weight:700;margin-top:12px;margin-bottom:6px;color:#1f2937;">${t}</div>`;
    }

    // Contact block lines — centered, muted
    if (inContactBlock && !firstSectionSeen && line.trim() && !line.trim().startsWith("-")) {
      return `<div style="font-size:13px;line-height:1.5;color:#475569;text-align:center;margin-bottom:2px;">${line}</div>`;
    }

    // Bullet points
    if (line.trim().startsWith("-")) {
      const t = line.trim().slice(1).trim();
      return `<div style="margin-left:16px;margin-bottom:4px;font-size:14px;color:#1f2937;">• ${t}</div>`;
    }

    // Regular text
    if (line.trim()) {
      return `<div style="font-size:14px;line-height:1.5;margin-bottom:4px;color:#1f2937;">${line}</div>`;
    }

    // Empty lines — smaller gap in contact block
    if (inContactBlock && !firstSectionSeen) {
      return `<div style="margin-bottom:4px;"></div>`;
    }

    return `<div style="margin-bottom:8px;"></div>`;
  });

  cleanDiv.innerHTML = htmlLines.join("");

  await html2pdf()
    .set({
      margin: [10, 10, 10, 10],
      filename,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, backgroundColor: "#ffffff", useCORS: true },
      jsPDF: { orientation: "portrait", unit: "mm", format: "a4" },
    })
    .from(cleanDiv)
    .save();
}
