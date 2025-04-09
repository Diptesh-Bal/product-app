import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { z } from "zod";
import bcrypt from "bcryptjs";

const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const usersCollection = async () => {
  const client = await clientPromise;
  return client.db("Mydatabase").collection("users"); // lowercase!
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = userSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { message: "Invalid input data", errors: result.error.errors },
        { status: 400 }
      );
    }

    const users = await usersCollection();
    const existingUser = await users.findOne({ email: result.data.email });

    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      );
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(result.data.password, 10);

    const userToInsert = {
      email: result.data.email,
      password: hashedPassword,
    };

    const insertResult = await users.insertOne(userToInsert);

    // Fetch and return the inserted user (without password)
    const insertedUser = await users.findOne({ _id: insertResult.insertedId });

    if (insertedUser) {
      delete insertedUser.password;
    }

    return NextResponse.json(insertedUser);
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
