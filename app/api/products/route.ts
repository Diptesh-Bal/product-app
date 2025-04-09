import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { z } from "zod";

const productSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(10),
  category: z.string().min(1),
  price: z.number().positive(),
  rating: z.number().min(0).max(5),
  image: z.string().optional(),
});

// Helper function to get products collection
const productsCollection = async () => {
  const client = await clientPromise;
  return client.db("Mydatabase").collection("products");
};

export async function GET(request: Request) {
  try {
    const products = await productsCollection();
    const result = await products.find({}).toArray();

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = productSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { message: "Invalid input data", errors: result.error.errors },
        { status: 400 }
      );
    }

    const products = await productsCollection();
    const insertResult = await products.insertOne(result.data);
    const insertedProduct = await products.findOne({
      _id: insertResult.insertedId,
    });

    return NextResponse.json(insertedProduct);
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
