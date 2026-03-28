// Client-side only file parser
export async function parseFile(file) {
  const fileName = file.name;
  const fileType = fileName.split(".").pop().toLowerCase();

  try {
    if (fileType === "pdf") {
      return await parsePDF(file);
    } else if (fileType === "docx") {
      return await parseDOCX(file);
    } else if (fileType === "txt") {
      return await parseTXT(file);
    } else {
      throw new Error("Unsupported file format. Please use PDF, DOCX, or TXT files.");
    }
  } catch (err) {
    throw new Error(`Error parsing file: ${err.message}`);
  }
}

async function parsePDF(file) {
  const arrayBuffer = await file.arrayBuffer();
  const pdfjsLib = await import("pdfjs-dist");

  // Use the worker file copied to public/
  pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.mjs";

  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let text = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    text += textContent.items.map((item) => item.str).join(" ") + "\n";
  }

  return text.trim();
}

async function parseDOCX(file) {
  const mammoth = await import("mammoth");
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value.trim();
}

async function parseTXT(file) {
  const text = await file.text();
  return text.trim();
}
