import { NextResponse } from "next/server";
import { callGemini, extractJson } from "@/lib/gemini";

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

    const prompt = `You are an expert recruiter.
Compare the resume and job description below.
Return ONLY valid JSON — no markdown, no explanation, no extra text.

Resume:
${resume}

Job Description:
${jobDescription}

Return ONLY this JSON format:
{
  "matchScore": number (0-100),
  "missingSkills": [string],
  "strengths": [string],
  "suggestions": [string]
}`;

    const raw = await callGemini(prompt);

    let parsed;
    try {
      parsed = extractJson(raw);
    } catch {
      return NextResponse.json(
        { error: "Failed to parse AI response. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json(parsed);
  } catch (err) {
    console.error("[analyze] Error:", err);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
