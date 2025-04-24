import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import {
  Alert,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from '@mui/material'
import { setToken } from '../utils/auth'
import type { SubmitHandler } from 'react-hook-form'

const registerSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  email: z
    .string()
    .min(1, { message: 'Email is required' })
    .email({ message: 'Invalid email address' }),
  password: z.string().min(1, { message: 'Password is required' }),
  confirmPassword: z
    .string()
    .min(1, { message: 'Please confirm your password' }),
})

type RegisterFormData = z.infer<typeof registerSchema>

export const Route = createFileRoute('/register')({
  component: RegisterPage,
})

function RegisterPage() {
  const [isApiLoading, setIsApiLoading] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const navigate = useNavigate() // Use navigate for redirection after login

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const onSubmit: SubmitHandler<RegisterFormData> = async (data) => {
    setIsApiLoading(true)
    setApiError(null)

    try {
      console.log(data)
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const responseData = await response.json()

      if (!response.ok) {
        throw new Error(responseData.error || "Registration failed")
      }

      setToken(responseData.token)
      console.log("Register successful")
      navigate({ to: "/login" })
    } catch (err) {
      setApiError(
        err instanceof Error ? err.message : "An error occurred during registration",
      )
    } finally {
      setIsApiLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <Paper elevation={3} className="w-full max-w-md p-8 mx-auto gap-4">
          <Typography
            variant="h5"
            component="h1"
            className="text-center font-bold"
          >
            Register
          </Typography>

          {/* Display API errors */}
          {apiError && (
            <Alert severity="error" className="mb-4">
              {apiError}
            </Alert>
          )}

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4 mt-4"
          >
            <Controller
              name="name"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="Name"
                  type="name"
                  fullWidth
                  variant="outlined"
                  error={!!error}
                  helperText={error?.message} // Display validation error message
                  className="mb-6"
                />
              )}
            />

            <Controller
              name="email"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="Email"
                  type="email"
                  fullWidth
                  variant="outlined"
                  error={!!error}
                  helperText={error?.message} // Display validation error message
                  className="mb-6"
                />
              )}
            />

            <Controller
              name="password"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  fullWidth
                  variant="outlined"
                  error={!!error}
                  helperText={error?.message}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />

            <Controller
              name="confirmPassword"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="Confirm Password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  fullWidth
                  variant="outlined"
                  error={!!error}
                  helperText={error?.message}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          edge="end"
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={isSubmitting || isApiLoading}
              className="py-3 mt-4" // Adjusted margin if needed
            >
              {isSubmitting || isApiLoading ? (
                <CircularProgress size={24} />
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          <Typography variant="body2" className="text-center mt-6">
            Don't have an account?{' '}
            <span className="text-blue-600 hover:text-blue-800 cursor-pointer">
              Sign up
            </span>
          </Typography>
        </Paper>
      </div>
    </div>
  )
}
