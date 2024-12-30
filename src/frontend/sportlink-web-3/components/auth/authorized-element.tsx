// components/auth/authorized-element.tsx
'use client'
import { useEffect, useState } from 'react'
import { jwtDecode } from 'jwt-decode'
import { UserRole } from '@/types/roles'

interface UserData {
  id: string
  email: string
  role: UserRole
  firstName: string
  lastName: string
}

interface AuthorizedElementProps {
  children: (props: { userData: UserData }) => React.ReactNode
  roles?: UserRole[]
}

export default function AuthorizedElement({ 
  children, 
  roles 
}: AuthorizedElementProps) {
  const [userData, setUserData] = useState<UserData | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('authToken')
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token)
        const userData: UserData = {
          id: decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'],
          email: decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'],
          role: decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] as UserRole,
          firstName: decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname'],
          lastName: decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname'],
        }
        setUserData(userData)
      } catch (error) {
        console.error('Error decoding token:', error)
        localStorage.removeItem('authToken')
      }
    }
  }, [])

  // Server-side rendering safety
  if (typeof window === 'undefined') {
    return null
  }

  if (!userData) {
    return null
  }

  if (roles && !roles.includes(userData.role)) {
    return null
  }

  return <>{children({ userData })}</>
}