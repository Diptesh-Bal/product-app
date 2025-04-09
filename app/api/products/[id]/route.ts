import { NextResponse } from "next/server"
import { z } from "zod"
import { headers } from "next/headers"
import { verify } from "jsonwebtoken"

// This would be imported from a shared file in a real app
let PRODUCTS = [
  {
    id: "1",
    name: "Smartphone X",
    description: "Latest smartphone with advanced features",
    category: "electronics",
    price: 799.99,
    rating: 4.5,
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: "2",
    name: "Laptop Pro",
    description: "High-performance laptop for professionals",
    category: "electronics",
    price: 1299.99,
    rating: 4.8,
    image: "/placeholder.svg?height=200&width=200",
  },
  // ... other products
]

const productUpdateSchema = z.object({
  name: z.string().min(2).optional(),
  description: z.string().min(10).optional(),
  category: z.string().min(1).optional(),
  price: z.number().positive().optional(),
  rating: z.number().min(0).max(5).optional(),
  image: z.string().optional(),
})

// Helper function to verify JWT token
function verifyToken(authHeader: string | null) {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Unauthorized")
  }

  const token = authHeader.split(" ")[1]

  try {
    // In a real app, use a proper secret from environment variables
    return verify(token, "your-secret-key")
  } catch (error) {
    throw new Error("Unauthorized")
  }
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const product = PRODUCTS.find((p) => p.id === params.id)

  if (!product) {
    return NextResponse.json({ message: "Product not found" }, { status: 404 })
  }

  return NextResponse.json(product)
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const headersList = headers()
    const authorization = headersList.get("authorization")

    // Verify token
    try {
      verifyToken(authorization)
    } catch (error) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const productIndex = PRODUCTS.findIndex((p) => p.id === params.id)

    if (productIndex === -1) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 })
    }

    const body = await request.json()
    const result = productUpdateSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json({ message: "Invalid input data", errors: result.error.errors }, { status: 400 })
    }

    // Update product
    const updatedProduct = {
      ...PRODUCTS[productIndex],
      ...result.data,
    }

    // In a real app, you would update in a database
    PRODUCTS[productIndex] = updatedProduct

    return NextResponse.json(updatedProduct)
  } catch (error) {
    console.error("Update product error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const headersList = headers()
    const authorization = headersList.get("authorization")

    // Verify token
    try {
      verifyToken(authorization)
    } catch (error) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const productIndex = PRODUCTS.findIndex((p) => p.id === params.id)

    if (productIndex === -1) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 })
    }

    // In a real app, you would delete from a database
    PRODUCTS = PRODUCTS.filter((p) => p.id !== params.id)

    return NextResponse.json({ message: "Product deleted successfully" })
  } catch (error) {
    console.error("Delete product error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
