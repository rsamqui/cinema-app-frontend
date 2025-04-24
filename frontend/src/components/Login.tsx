import { useState } from "react"
import {
  Alert,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material"
import { Visibility, VisibilityOff } from "@mui/icons-material"
import type React from "react"

export interface LoginProps {
  onLogin?: (email: string, password: string) => Promise<void>
  isLoading?: boolean
  error?: string | null
}

export default function Login({ onLogin, isLoading = false, error = null }: LoginProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (onLogin) {
      await onLogin(email, password)
    }
  }

  return (
    <Paper elevation={3} className="w-full max-w-md p-8 mx-auto flex flex-col gap-4">
      <Typography variant="h5" component="h1" className="text-center mb-6 font-bold">
        Sign In
      </Typography>

      {error && (
        <Alert severity="error" className="mb-4">
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <TextField
          label="Email"
          type="email"
          fullWidth
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mb-6"
        />

        <TextField
          label="Password"
          type={showPassword ? "text" : "password"}
          fullWidth
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Button type="submit" variant="contained" color="primary" fullWidth disabled={isLoading} className="py-3 mt-4">
          {isLoading ? <CircularProgress size={24} /> : "Sign In"}
        </Button>
      </form>

      <Typography variant="body2" className="text-center mt-6">
        Don't have an account? <span className="text-blue-600 hover:text-blue-800 cursor-pointer">Sign up</span>
      </Typography>
    </Paper>
  )
}
