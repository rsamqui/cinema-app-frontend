import {  createContext, useContext, useEffect, useState } from "react"
import {  getUser, isAuthenticated, removeToken } from "../utils/auth"
import type {User} from "../utils/auth";
import type {ReactNode} from "react";

interface AuthContextType {
  user: User | null
  isLoggedIn: boolean
  loading: boolean
  logout: () => void
  refreshUser: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loading, setLoading] = useState(true)

  const refreshUser = () => {
    if (isAuthenticated()) {
      setUser(getUser())
      setIsLoggedIn(true)
    } else {
      setUser(null)
      setIsLoggedIn(false)
    }
  }

  const logout = () => {
    removeToken()
    setUser(null)
    setIsLoggedIn(false)
  }

  useEffect(() => {
    // Check authentication status on mount
    refreshUser()
    setLoading(false)
  }, [])

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, loading, logout, refreshUser }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
