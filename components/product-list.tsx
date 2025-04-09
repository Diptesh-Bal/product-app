"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import type { Product } from "@/lib/types"
import { fetchProducts } from "@/lib/api"

interface ProductListProps {
  featured?: boolean
}

export function ProductList({ featured = false }: ProductListProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [category, setCategory] = useState("all")
  const [priceRange, setPriceRange] = useState([0, 1000])
  const [minRating, setMinRating] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getProducts = async () => {
      try {
        const data = await fetchProducts()
        setProducts(data)
        setFilteredProducts(featured ? data.slice(0, 4) : data)
        setLoading(false)
      } catch (error) {
        console.error("Failed to fetch products:", error)
        setLoading(false)
      }
    }

    getProducts()
  }, [featured])

  useEffect(() => {
    if (!featured) {
      let result = [...products]

      // Filter by search term
      if (searchTerm) {
        result = result.filter(
          (product) =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description.toLowerCase().includes(searchTerm.toLowerCase()),
        )
      }

      // Filter by category
      if (category !== "all") {
        result = result.filter((product) => product.category === category)
      }

      // Filter by price range
      result = result.filter((product) => product.price >= priceRange[0] && product.price <= priceRange[1])

      // Filter by rating
      result = result.filter((product) => product.rating >= minRating)

      setFilteredProducts(result)
    }
  }, [searchTerm, category, priceRange, minRating, products, featured])

  if (loading) {
    return <div className="flex justify-center p-8">Loading products...</div>
  }

  if (!featured && filteredProducts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <p className="text-xl mb-4">No products found matching your criteria.</p>
        <Button
          onClick={() => {
            setSearchTerm("")
            setCategory("all")
            setPriceRange([0, 1000])
            setMinRating(0)
          }}
        >
          Reset Filters
        </Button>
      </div>
    )
  }

  return (
    <div>
      {!featured && (
        <div className="mb-8 grid gap-6 md:grid-cols-4">
          <div>
            <h3 className="mb-2 font-medium">Search</h3>
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <h3 className="mb-2 font-medium">Category</h3>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="electronics">Electronics</SelectItem>
                <SelectItem value="clothing">Clothing</SelectItem>
                <SelectItem value="home">Home & Kitchen</SelectItem>
                <SelectItem value="books">Books</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <h3 className="mb-2 font-medium">
              Price Range: ${priceRange[0]} - ${priceRange[1]}
            </h3>
            <Slider
              defaultValue={[0, 1000]}
              max={1000}
              step={10}
              value={priceRange}
              onValueChange={setPriceRange}
              className="py-4"
            />
          </div>
          <div>
            <h3 className="mb-2 font-medium">Minimum Rating: {minRating}</h3>
            <Slider
              defaultValue={[0]}
              max={5}
              step={0.5}
              value={[minRating]}
              onValueChange={(value) => setMinRating(value[0])}
              className="py-4"
            />
          </div>
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="overflow-hidden">
            <CardHeader className="p-0">
              <div className="aspect-square w-full bg-muted">
                {product.image ? (
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full bg-secondary text-secondary-foreground">
                    No Image
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <CardTitle className="line-clamp-1">{product.name}</CardTitle>
              <div className="mt-2 flex items-center text-sm">
                <span className="font-medium">${product.price.toFixed(2)}</span>
                <span className="ml-auto flex items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-gray-300 fill-current"
                      }`}
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                  <span className="ml-1">{product.rating.toFixed(1)}</span>
                </span>
              </div>
              <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{product.description}</p>
              <div className="mt-2">
                <span className="inline-block px-2 py-1 text-xs font-medium bg-secondary text-secondary-foreground rounded-full">
                  {product.category}
                </span>
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Link href={`/products/${product.id}`} className="w-full">
                <Button variant="outline" className="w-full">
                  View Details
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
