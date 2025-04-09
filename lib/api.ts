import type { Product, User, AuthResponse } from "./types";

// Base URL for API
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

// Helper function to handle API responses
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "An error occurred");
  }
  return response.json();
}

// Helper function to get auth headers
function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
}

// Auth API calls
export async function registerUser(
  email: string,
  password: string
): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return handleResponse<AuthResponse>(response);
}

export async function loginUser(
  email: string,
  password: string
): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await handleResponse<AuthResponse>(response);
  localStorage.setItem("token", data.token);
  return data;
}

export async function logout(): Promise<void> {
  localStorage.removeItem("token");
}

export async function getUserProfile(): Promise<User> {
  const response = await fetch(`${API_URL}/auth/profile`, {
    headers: getAuthHeaders(),
  });
  return handleResponse<User>(response);
}

// Product API calls
export async function fetchProducts(): Promise<Product[]> {
  // For demo purposes, return mock data
  // In a real app, you would fetch from the API
  return [
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
    {
      id: "3",
      name: "Casual T-Shirt",
      description: "Comfortable cotton t-shirt for everyday wear",
      category: "clothing",
      price: 24.99,
      rating: 4.2,
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      id: "4",
      name: "Coffee Maker",
      description: "Automatic coffee maker with timer",
      category: "home",
      price: 89.99,
      rating: 4.0,
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      id: "5",
      name: "Wireless Headphones",
      description: "Noise-cancelling wireless headphones",
      category: "electronics",
      price: 149.99,
      rating: 4.7,
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      id: "6",
      name: "Bestselling Novel",
      description: "Award-winning fiction novel",
      category: "books",
      price: 19.99,
      rating: 4.9,
      image: "/placeholder.svg?height=200&width=200",
    },
  ];
}

export async function createProduct(
  product: Omit<Product, "id">
): Promise<Product> {
  const response = await fetch(`${API_URL}/products`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(product),
  });
  return handleResponse<Product>(response);
}

export async function updateProduct(
  id: string,
  product: Partial<Product>
): Promise<Product> {
  const response = await fetch(`${API_URL}/products/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(product),
  });
  return handleResponse<Product>(response);
}

export async function deleteProduct(id: string): Promise<void> {
  const response = await fetch(`${API_URL}/products/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  return handleResponse<void>(response);
}
