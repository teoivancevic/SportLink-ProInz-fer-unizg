'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { FcGoogle } from 'react-icons/fc'
import { authService } from '@/lib/services/api'
import type { RegistrationRequest } from '@/types/auth'
import { useToast } from "@/hooks/use-toast"
import { Eye, EyeOff } from "lucide-react"

interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

interface GoogleAuthError {
  message: string;
  code?: string;
  status?: number;
}

export default function SignupForm() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)

    try {
      const registrationData: RegistrationRequest = {
        firstName,
        lastName,
        email,
        password,
      }

      const response = await authService.register(registrationData)
      console.log(response)
      // Type guard to ensure response has the expected shape
      if (!response || typeof response.id !== 'number') {
        throw new Error('Invalid registration response')
      }

      // Redirect to OTP verification page with ID
      router.push(`/signup/otp?id=${response.id}`)
    } catch (error: unknown) {
      console.error('Registration error:', error);
      let errorMessage = "An error occurred during registration. Please try again.";
      
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'object' && error !== null && 'message' in error) {
        errorMessage = (error as ApiError).message;
      }
      
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleGoogleSignup = async () => {
    try {
      await authService.loginGoogle();
    } catch (error: unknown) {
      console.error('Google signup error:', error);
      let errorMessage = "Could not sign up with Google. Please try again.";
      
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'object' && error !== null && 'message' in error) {
        errorMessage = (error as GoogleAuthError).message;
      }
      
      toast({
        variant: "destructive",
        title: "Google signup failed",
        description: errorMessage,
      });
    }
  };

  return (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle className="text-2xl">Registriraj se</CardTitle>
        <CardDescription>Napravi novi SportLink račun</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid w-full items-center gap-4">
            <div className="flex space-x-4">
              <div className="flex flex-col space-y-1.5 flex-1">
                <Label htmlFor="firstName">Ime</Label>
                <Input 
                  id="firstName" 
                  value={firstName}
                  placeholder='Ime'
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="flex flex-col space-y-1.5 flex-1">
                <Label htmlFor="lastName">Prezime</Label>
                <Input 
                  id="lastName" 
                  value={lastName}
                  placeholder='Prezime'
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="npr. marko@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="password">Lozinka</Label>
              <div className="relative">
                <Input 
                  id="password" 
                  type={showPassword ? "text" : "password"}
                  placeholder='Lozinka'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className='pr-8'
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>
          </div>
          <Button 
            className="w-full mt-6" 
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Registracija..." : "Registriraj se"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col">
        <Button 
          variant="outline" 
          className="w-full" 
          onClick={handleGoogleSignup}
          disabled={isLoading}
        >
          <FcGoogle className="mr-2" />
          <span>Registracija Google računom</span>
        </Button>
        <p className="mt-4 text-sm text-center">
          Već imaš račun?{" "}
          <Link href="/login" className="text-primary hover:underline">
            Prijavi se
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}