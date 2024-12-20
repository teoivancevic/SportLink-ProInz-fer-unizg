// components/auth/unauthorized-element.tsx
'use client'
import { useEffect, useState } from 'react'

export default function UnauthorizedElement({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  const [isUnauthorized, setIsUnauthorized] = useState(false)

  useEffect(() => {
    setIsUnauthorized(!localStorage.getItem('authToken'))
  }, [])

  // Server-side rendering safety
  if (typeof window === 'undefined') {
    return null
  }

  return isUnauthorized ? <>{children}</> : null
}