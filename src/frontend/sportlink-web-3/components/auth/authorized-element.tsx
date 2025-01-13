'use client'

import { UserRole } from '@/types/roles'
import { useAuth } from './auth-context'
import { UserData } from '@/types/auth'

interface AuthorizedElementProps {
  children: (props: { userData: UserData }) => React.ReactNode
  roles?: UserRole[]
}

export default function AuthorizedElement({ 
  children, 
  roles 
}: AuthorizedElementProps) {
  const { userData } = useAuth()

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