export async function exportToPDF(element, fileName = "resume.pdf") {
  try {
    // Dynamically import html2pdf
    const html2pdf = (await import("html2pdf.js")).default;

    const options = {
      margin: 10,
      filename: fileName,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { orientation: "portrait", unit: "mm", format: "a4" },
    };

    html2pdf().set(options).from(element).save();
  } catch (err) {
    console.error("Error exporting to PDF:", err);
    throw new Error("Failed to export PDF");
  }
}
