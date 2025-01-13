'use client'

import { useAuth } from './auth-context'

export default function UnauthorizedElement({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  const { userData, isLoading } = useAuth()

  // Don't render anything while authentication is being initialized
  if (isLoading) {
    return null
  }

  return !userData ? <>{children}</> : null
}