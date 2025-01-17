'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/components/auth/auth-context'
import { jwtDecode } from 'jwt-decode'
import { UserData, JWTPayload } from '@/types/auth'

export default function AuthCallback() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { setUserData } = useAuth()

  useEffect(() => {
    const handleCallback = () => {
      const token = searchParams.get('token')
      
      if (!token) {
        console.error('No token found in URL')
        router.push('/login')
        return
      }

      try {
        // Store the token
        localStorage.setItem('authToken', token)

        // Decode and set user data
        const decodedToken = jwtDecode<JWTPayload>(token)
        const userData: UserData = {
          id: decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'],
          email: decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'],
          role: decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'],
          firstName: decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname'],
          lastName: decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname'],
        }
        setUserData(userData)

        // Redirect to home page or dashboard
        router.push('/')
      } catch (error) {
        console.error('Error processing authentication callback:', error)
        router.push('/login')
      }
    }

    handleCallback()
  }, [router, searchParams, setUserData])

  // Show loading state while processing
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">Processing login...</h2>
        <p className="text-gray-600">Please wait while we complete your authentication.</p>
      </div>
    </div>
  )
}