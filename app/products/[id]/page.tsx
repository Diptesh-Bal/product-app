"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import type { Product } from "@/lib/types"
import { fetchProducts } from "@/lib/api"

export default function ProductDetailPage() {
  const params = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getProduct = async () => {
      try {
        const products = await fetchProducts()
        const foundProduct = products.find((p) => p.id === params.id)
        setProduct(foundProduct || null)
        setLoading(false)
      } catch (error) {
        console.error("Failed to fetch product:", error)
        setLoading(false)
      }
    }

    getProduct()
  }, [params.id])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading product details...</p>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Product Not Found</h1>
        <p>The product you're looking for doesn't exist or has been removed.</p>
        <Link href="/products">
          <Button>Back to Products</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white border-b">
        <div className="container flex items-center justify-between h-16 px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
            <span className="font-bold">ProductHub</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="outline">Login</Button>
            </Link>
            <Link href="/register">
              <Button>Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1 container py-8 px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="flex items-center justify-center bg-muted rounded-lg overflow-hidden">
            {product.image ? (
              <img
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                className="object-contain max-h-[400px] w-full"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-[400px] bg-secondary text-secondary-foreground">
                No Image Available
              </div>
            )}
          </div>
          <div className="flex flex-col gap-4">
            <div>
              <h1 className="text-3xl font-bold">{product.name}</h1>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-gray-300 fill-current"
                      }`}
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">{product.rating.toFixed(1)} out of 5</span>
              </div>
            </div>
            <div className="text-3xl font-bold">${product.price.toFixed(2)}</div>
            <div>
              <span className="inline-block px-3 py-1 text-sm font-medium bg-secondary text-secondary-foreground rounded-full">
                {product.category}
              </span>
            </div>
            <Separator />
            <div>
              <h2 className="text-lg font-semibold mb-2">Description</h2>
              <p className="text-muted-foreground">{product.description}</p>
            </div>
            <div className="flex gap-4 mt-4">
              <Button size="lg" className="flex-1">
                Add to Cart
              </Button>
              <Button variant="outline" size="lg" className="flex-1">
                Add to Wishlist
              </Button>
            </div>
          </div>
        </div>
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Related Products</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* This would be populated with actual related products in a real app */}
            <Card>
              <CardContent className="p-0">
                <div className="aspect-square w-full bg-muted"></div>
                <div className="p-4">
                  <h3 className="font-semibold">Related Product</h3>
                  <p className="text-sm text-muted-foreground">Product description</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-0">
                <div className="aspect-square w-full bg-muted"></div>
                <div className="p-4">
                  <h3 className="font-semibold">Related Product</h3>
                  <p className="text-sm text-muted-foreground">Product description</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <footer className="border-t py-6 md:py-8">
        <div className="container flex flex-col items-center justify-center gap-4 px-4 md:px-6 text-center">
          <p className="text-sm text-muted-foreground">© 2023 ProductHub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
