import { NextResponse } from "next/server";
import { z } from "zod";
import { sign } from "jsonwebtoken";
import clientPromise from "@/lib/mongodb"; // your MongoDB connection

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

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

    const { email, password } = result.data;

    const client = await clientPromise;
    const db = client.db("yourDatabaseName"); // Replace with your DB name
    const usersCollection = db.collection("users");

    const user = await usersCollection.findOne({ email });

    if (!user || user.password !== password) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    const token = sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "your-secret-key", // store this in .env
      { expiresIn: "1h" }
    );

    // Remove password before sending user back
    const { password: _pw, ...userWithoutPassword } = user;

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
