'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { jwtDecode } from 'jwt-decode'
import { UserData, JWTPayload } from '@/types/auth'

interface AuthContextType {
  userData: UserData | null
  setUserData: (userData: UserData | null) => void
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Move token retrieval to useEffect to avoid hydration mismatch
    const initializeAuth = () => {
      const token = localStorage.getItem('authToken')
      if (token) {
        try {
          const decodedToken = jwtDecode<JWTPayload>(token)
          const userData: UserData = {
            id: decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'],
            email: decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'],
            role: decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'],
            firstName: decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname'],
            lastName: decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname'],
          }
          setUserData(userData)
        } catch (error) {
          console.error('Error decoding token:', error)
          localStorage.removeItem('authToken')
          setUserData(null)
        }
      }
      setIsLoading(false)
    }

    initializeAuth()
  }, [])

  const logout = () => {
    localStorage.removeItem('authToken')
    setUserData(null)
  }

  // Don't render children until authentication is initialized
  if (isLoading) {
    return null // Or a loading spinner
  }

  return (
    <AuthContext.Provider value={{ userData, setUserData, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}