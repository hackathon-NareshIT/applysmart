import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { getTokenFromRequest, verifyToken } from "@/lib/auth";

export async function GET(req) {
  try {
    await connectDB();

    const token = getTokenFromRequest(req);

    if (!token) {
      return Response.json(
        { error: "No token provided" },
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

    const user = await User.findById(decoded.userId);

    if (!user) {
      return Response.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return Response.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Auth check error:", error);
    return Response.json(
      { error: "Failed to verify user" },
      { status: 500 }
    );
  }
}
