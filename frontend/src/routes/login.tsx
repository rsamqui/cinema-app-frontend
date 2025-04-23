import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"
import Login from "../components/Login"
import { setToken } from "../utils/auth"

// Define the route for TanStack Router
export const Route = createFileRoute("/login")({
  component: LoginPage,
})

function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (email: string, password: string, rememberMe: boolean) => {
    setIsLoading(true)
    setError(null)

    try {
      // Call the login API
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Login failed")
      }

      // Store the JWT token
      setToken(data.token)

      // Redirect to dashboard or home page
      // For TanStack Router, you would use:
      // router.navigate({ to: '/dashboard' })

      console.log("Login successful")
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred during login")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <Login onLogin={handleLogin} isLoading={isLoading} error={error} />
      </div>
    </div>
  )
}
