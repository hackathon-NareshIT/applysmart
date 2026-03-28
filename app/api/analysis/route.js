import { connectDB } from "@/lib/db";
import Analysis from "@/models/Analysis";
import { getTokenFromRequest, verifyToken } from "@/lib/auth";

export async function POST(req) {
  try {
    await connectDB();

    // Verify token
    const token = getTokenFromRequest(req);
    if (!token) {
      return Response.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return Response.json(
        { error: "Invalid token" },
        { status: 401 }
      );
    }

    const { resumeText, jobDescription, matchScore, strengths, missingSkills, suggestions, improvedResume } =
      await req.json();

    if (!resumeText || !jobDescription || matchScore === undefined) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const analysis = new Analysis({
      userId: decoded.userId,
      resumeText,
      jobDescription,
      matchScore,
      strengths: strengths || [],
      missingSkills: missingSkills || [],
      suggestions: suggestions || [],
      improvedResume: improvedResume || "",
    });

    await analysis.save();

    return Response.json(
      {
        id: analysis._id,
        matchScore: analysis.matchScore,
        createdAt: analysis.createdAt,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Analysis create error:", error);
    return Response.json(
      { error: "Failed to save analysis" },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    await connectDB();

    // Verify token
    const token = getTokenFromRequest(req);
    if (!token) {
      return Response.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return Response.json(
        { error: "Invalid token" },
        { status: 401 }
      );
    }

    // Get all analyses for this user
    const analyses = await Analysis.find({ userId: decoded.userId })
      .select("-resumeText -improvedResume")
      .sort({ createdAt: -1 });

    return Response.json({
      analyses,
    });
  } catch (error) {
    console.error("Analysis fetch error:", error);
    return Response.json(
      { error: "Failed to fetch analyses" },
      { status: 500 }
    );
  }
}
