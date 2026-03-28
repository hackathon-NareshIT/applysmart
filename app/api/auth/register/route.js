import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { generateToken } from "@/lib/auth";

export async function POST(req) {
  try {
    await connectDB();

    const { email, password, name } = await req.json();

    if (!email || !password) {
      return Response.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    if (typeof email !== "string" || typeof password !== "string") {
      return Response.json({ error: "Invalid input." }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return Response.json({ error: "Invalid email address." }, { status: 400 });
    }

    if (password.length < 8) {
      return Response.json(
        { error: "Password must be at least 8 characters." },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return Response.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    if (!name) {
      return Response.json(
        { error: "Name is required for registration" },
        { status: 400 }
      );
    }

    // Create new user
    const user = new User({
      name,
      email,
      password,
    });

    await user.save();

    const token = generateToken(user._id);

    return Response.json(
      {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
        token,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Register error:", error);
    return Response.json(
      { error: "Failed to register user" },
      { status: 500 }
    );
  }
}
