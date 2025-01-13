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

// Constants for organization-related storage keys
const STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  ACTIVE_ORG: 'activeOrganizationId',
  ORG_CACHE: 'cachedOrganizations',
  ORG_CACHE_TIMESTAMP: 'organizationsCacheTimestamp'
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initializeAuth = () => {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)
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
          localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN)
          setUserData(null)
        }
      }
      setIsLoading(false)
    }

    initializeAuth()
  }, [])

  const logout = () => {
    // Clear auth token and user data
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN)
    setUserData(null)

    // Clear all organization-related data
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_ORG)
    localStorage.removeItem(STORAGE_KEYS.ORG_CACHE)
    localStorage.removeItem(STORAGE_KEYS.ORG_CACHE_TIMESTAMP)
  }

  if (isLoading) {
    return null
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