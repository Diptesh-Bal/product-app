export interface User {
  id: string
  email: string
  role: "user" | "admin"
}

export interface Product {
  id: string
  name: string
  description: string
  category: string
  price: number
  rating: number
  image?: string
}

export interface AuthResponse {
  token: string
  user: User
}
