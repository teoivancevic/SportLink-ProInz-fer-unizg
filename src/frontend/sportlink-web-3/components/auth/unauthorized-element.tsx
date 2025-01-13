'use client'

import { useAuth } from './auth-context'

export default function UnauthorizedElement({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  const { userData } = useAuth()

  // Server-side rendering safety
  if (typeof window === 'undefined') {
    return null
  }

  // Show children only when there is no user data (user is unauthorized)
  return !userData ? <>{children}</> : null
}