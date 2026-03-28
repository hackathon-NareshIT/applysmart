import { NextResponse } from "next/server";
import { callGemini } from "@/lib/gemini";

const MAX_RESUME_LENGTH = 15000;
const MAX_JD_LENGTH = 10000;

export async function POST(request) {
  try {
    const body = await request.json();
    const { resume, jobDescription } = body;

    if (!resume || !jobDescription) {
      return NextResponse.json(
        { error: "Resume and job description are required." },
        { status: 400 }
      );
    }

    if (typeof resume !== "string" || typeof jobDescription !== "string") {
      return NextResponse.json({ error: "Invalid input." }, { status: 400 });
    }

    if (resume.length > MAX_RESUME_LENGTH) {
      return NextResponse.json(
        { error: `Resume must be under ${MAX_RESUME_LENGTH} characters.` },
        { status: 400 }
      );
    }

    if (jobDescription.length > MAX_JD_LENGTH) {
      return NextResponse.json(
        { error: `Job description must be under ${MAX_JD_LENGTH} characters.` },
        { status: 400 }
      );
    }

    const prompt = `You are a professional resume writer and ATS optimization expert. Rewrite the resume below to better match the job description, following every rule strictly.

═══════════════════════════════════════
HEADER PRESERVATION (CRITICAL)
═══════════════════════════════════════
- The very first line of the output MUST be the candidate's full name, formatted as a # header (e.g., # John Smith).
- The name MUST be rendered as the largest, boldest element — treat it as the main document title.
- Immediately after the name, include all available contact details on one or two lines:
  email, phone, LinkedIn, GitHub, portfolio, location — exactly as they appear in the original.
- NEVER start the resume from "Summary", "Objective", or any section header other than the name.
- Do not invent or modify any contact details.

═══════════════════════════════════════
CONTENT INTEGRITY (CRITICAL)
═══════════════════════════════════════
- Do NOT fabricate, invent, or hallucinate any work experience, project names, company names, roles, or dates.
- Keep all original employers, job titles, project names, and dates exactly as they are.
- You MAY rephrase bullet points to be stronger, more impactful, and keyword-rich.
- You MAY add measurable impact (e.g., "reduced load time by ~30%") only if it is a reasonable inference from the existing content — never invent specific numbers from thin air.
- You MAY add skills to the Skills section only if they are directly relevant to the job description AND realistically implied by the candidate's existing experience.

═══════════════════════════════════════
ATS OPTIMIZATION
═══════════════════════════════════════
- Enhance the Summary with strong, keyword-rich phrasing aligned to the job description.
- Improve the Skills section by incorporating relevant missing keywords from the job description.
- Strengthen Work Experience bullets with action verbs and job-relevant keywords — without changing facts.
- Ensure section headers use standard ATS-readable labels (SUMMARY, SKILLS, EXPERIENCE, EDUCATION, PROJECTS).

═══════════════════════════════════════
FORMATTING RULES
═══════════════════════════════════════
- Use # for top-level section headers (e.g., # SUMMARY, # EXPERIENCE, # SKILLS, # EDUCATION, # PROJECTS).
- Use ## for subsection headers (e.g., ## Job Title | Company Name).
- Use - for bullet points.
- Leave one blank line between sections.
- Do NOT use colored elements, decorative bars, or any visual styling.
- If separators are needed, use plain text dashes only (e.g., ---).
- Keep formatting clean, minimal, and ATS-friendly throughout.

═══════════════════════════════════════
SECTION ORDER
═══════════════════════════════════════
Header → Summary → Skills → Experience → Projects → Education → (any remaining sections)

═══════════════════════════════════════
OUTPUT CONSTRAINTS
═══════════════════════════════════════
- Return ONLY the improved resume text. No explanations, no notes, no commentary.
- Do not wrap output in markdown code fences.
- Do not add a title like "Improved Resume" at the top.

---

ORIGINAL RESUME:
${resume}

---

JOB DESCRIPTION:
${jobDescription}`;

    const improved = await callGemini(prompt);

    return NextResponse.json({ improvedResume: improved.trim() });
  } catch (err) {
    console.error("[improve] Error:", err);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
