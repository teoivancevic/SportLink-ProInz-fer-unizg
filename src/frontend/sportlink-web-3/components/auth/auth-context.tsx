'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { jwtDecode } from 'jwt-decode'
import { UserData, JWTPayload } from '@/types/auth'

interface AuthContextType {
  userData: UserData | null
  setUserData: (userData: UserData | null) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userData, setUserData] = useState<UserData | null>(null)

  useEffect(() => {
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
  }, [])

  const logout = () => {
    localStorage.removeItem('authToken')
    setUserData(null)
  }

  return (
    <AuthContext.Provider value={{ userData, setUserData, logout }}>
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