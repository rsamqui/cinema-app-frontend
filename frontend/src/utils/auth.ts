import { jwtDecode } from "jwt-decode"

// Types for JWT token and user
export interface JWTPayload {
  sub: string
  email: string
  name?: string
  role?: string
  iat: number
  exp: number
}

export interface User {
  id: string
  email: string
  name?: string
  role?: string
}

// Store JWT token in localStorage
export const setToken = (token: string): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem("auth_token", token)
  }
}

// Get JWT token from localStorage
export const getToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("auth_token")
  }
  return null
}

// Remove JWT token from localStorage
export const removeToken = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("auth_token")
  }
}

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  const token = getToken()
  if (!token) return false

  try {
    const decoded = jwtDecode<JWTPayload>(token)
    const currentTime = Date.now() / 1000

    // Check if token is expired
    return decoded.exp > currentTime
  } catch (error) {
    console.error("Error decoding token:", error)
    return false
  }
}

// Get user from token
export const getUser = (): User | null => {
  const token = getToken()
  if (!token) return null

  try {
    const decoded = jwtDecode<JWTPayload>(token)
    return {
      id: decoded.sub,
      email: decoded.email,
      name: decoded.name,
      role: decoded.role,
    }
  } catch (error) {
    console.error("Error decoding token:", error)
    return null
  }
}

// Helper to create Authorization header
export const getAuthHeader = (): { Authorization: string } | {} => {
  const token = getToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}
