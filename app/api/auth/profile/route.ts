// MultipleFiles/route.ts
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb"; // Import the MongoDB connection
import { z } from "zod";
import { sign } from "jsonwebtoken";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

// Helper function to get users collection
const usersCollection = async () => {
  const client = await clientPromise;
  return client.db("Mydatabase").collection("users");
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = loginSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { message: "Invalid input data", errors: result.error.errors },
        { status: 400 }
      );
    }

    // In a real app, you would verify against a database
    const users = await usersCollection();
    const user = await users.findOne({
      email: body.email,
      password: body.password,
    });

    if (!user) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Create JWT token
    // In a real app, use a proper secret from environment variables
    const token = sign(
      { userId: user._id, email: user.email, role: user.role },
      "your-secret-key",
      { expiresIn: "1h" }
    );

    // Don't include password in the response
    const { password, ...userWithoutPassword } = user;

    return NextResponse.json({
      token,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
