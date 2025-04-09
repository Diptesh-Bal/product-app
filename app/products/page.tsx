import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ProductList } from "@/components/product-list"

export default function ProductsPage() {
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
      <main className="flex-1">
        <section className="w-full py-12">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-start gap-4 md:flex-row md:justify-between md:items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold tracking-tighter">All Products</h1>
                <p className="text-muted-foreground">Browse our complete product catalog</p>
              </div>
              <Link href="/dashboard">
                <Button>Manage Products</Button>
              </Link>
            </div>
            <ProductList />
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-8">
        <div className="container flex flex-col items-center justify-center gap-4 px-4 md:px-6 text-center">
          <p className="text-sm text-muted-foreground">© 2023 ProductHub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
