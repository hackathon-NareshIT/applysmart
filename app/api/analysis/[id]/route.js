import { connectDB } from "@/lib/db";
import Analysis from "@/models/Analysis";
import { getTokenFromRequest, verifyToken } from "@/lib/auth";

export async function GET(req, { params }) {
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

    const { id } = await params;

    if (!id) {
      return Response.json(
        { error: "Invalid analysis ID" },
        { status: 400 }
      );
    }

    const analysis = await Analysis.findById(id).lean();

    if (!analysis) {
      return Response.json(
        { error: "Analysis not found" },
        { status: 404 }
      );
    }

    // Check if user owns this analysis
    const analysisUserId = analysis.userId.toString ? analysis.userId.toString() : analysis.userId;
    if (analysisUserId !== decoded.userId.toString()) {
      return Response.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    return Response.json(analysis);
  } catch (error) {
    console.error("Analysis get error:", error);
    return Response.json(
      { error: "Failed to fetch analysis" },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectDB();

    const token = getTokenFromRequest(req);
    if (!token) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = verifyToken(token);
    if (!decoded) return Response.json({ error: "Invalid token" }, { status: 401 });

    const { id } = await params;
    const analysis = await Analysis.findById(id);

    if (!analysis) return Response.json({ error: "Analysis not found" }, { status: 404 });

    if (analysis.userId.toString() !== decoded.userId.toString()) {
      return Response.json({ error: "Unauthorized" }, { status: 403 });
    }

    await Analysis.findByIdAndDelete(id);
    return Response.json({ message: "Deleted" });
  } catch (error) {
    console.error("Analysis delete error:", error);
    return Response.json({ error: "Failed to delete analysis" }, { status: 500 });
  }
}
