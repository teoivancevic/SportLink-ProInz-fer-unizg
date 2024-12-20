'use client'

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FcGoogle } from 'react-icons/fc'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { authService } from '@/lib/services/api'
import type { LoginRequest } from '@/types/auth'

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const token = await authService.login({ email, password })
      console.log('Received token type:', typeof token) // For debugging
      console.log('Token format:', token.substring(0, 10) + '...') // Show start of token
      
      if (token) {
        localStorage.setItem('authToken', token)
        router.push('/')
        router.refresh()
      } else {
        throw new Error('No token received')
      }
    } catch (error) {
      console.error('Login error:', error)
      setError('Invalid login credentials')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    try {
      await authService.loginGoogle()
    } catch (error) {
      console.error('Google login error:', error)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    setError(null)
                  }}
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    setError(null)
                  }}
                  required 
                />
              </div>
              {error && (
                <p className="text-sm text-red-500 text-center">
                  {error}
                </p>
              )}
              <Button 
                type="submit" 
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Login"}
              </Button>
              <Button 
                type="button"
                variant="outline" 
                className="w-full"
                onClick={handleGoogleLogin}
                disabled={isLoading}
              >
                <FcGoogle className="mr-2" />
                <span>Login with Google</span>
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="underline underline-offset-4">
                Sign up
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}