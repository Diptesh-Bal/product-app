import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ProductList } from "@/components/product-list"

export default function Home() {
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
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Product Management Made Simple
                </h1>
                <p className="max-w-[700px] text-muted-foreground md:text-xl">
                  Easily manage your product inventory, track performance, and make data-driven decisions.
                </p>
              </div>
              <div className="space-x-4">
                <Link href="/products">
                  <Button size="lg">Browse Products</Button>
                </Link>
                <Link href="/register">
                  <Button variant="outline" size="lg">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl mb-8">Featured Products</h2>
            <ProductList featured={true} />
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
