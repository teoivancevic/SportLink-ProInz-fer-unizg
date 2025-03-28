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
import { Eye, EyeOff } from "lucide-react"
import { useAuth } from '@/components/auth/auth-context'
import { jwtDecode } from 'jwt-decode'
import { JWTPayload, UserData } from '@/types/auth'

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const { setUserData } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const response = await authService.login({ email, password })
      // @ts-expect-error unsure if response will be changed in api controller
      if (response?.data && typeof response.data === 'string') {
        // @ts-expect-error unsure if response will be changed in api controller
        const token = response.data
        
        // Store token
        localStorage.setItem('authToken', token)
        
        // Decode token and update user data in context
        const decodedToken = jwtDecode<JWTPayload>(token)
        const userData: UserData = {
          id: decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'],
          email: decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'],
          role: decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'],
          firstName: decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname'],
          lastName: decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname'],
        }
        
        // Update auth context
        setUserData(userData)
        
        // Navigate home
        router.push('/')
      } else {
        throw new Error('Invalid token received')
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
      setError('Failed to login with Google')
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Prijavi se</CardTitle>
          <CardDescription>
            Unesi podatke svog SportLink računa
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
                  placeholder="Email"
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
                  <Label htmlFor="password">Lozinka</Label>
                </div>
                <div className="relative">
                  <Input 
                    id="password" 
                    type={showPassword ? "text" : "password"}
                    placeholder="Lozinka"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      setError(null)
                    }}
                    required 
                    className='pr-8'
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
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
                {isLoading ? "Prijava..." : "Prijavi se"}
              </Button>
              <Button 
                type="button"
                variant="outline" 
                className="w-full"
                onClick={handleGoogleLogin}
                disabled={isLoading}
              >
                <FcGoogle className="mr-2" />
                <span>Prijava Google računom</span>
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Nemaš račun?{" "}
              <Link href="/signup" className="hover:underline text-blue-500">
                Registriraj se
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}