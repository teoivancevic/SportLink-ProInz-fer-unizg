'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LogoutPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    try {
      localStorage.removeItem('authToken')
      router.push('/')
      router.refresh()
    } catch (error) {
      console.error('Error during logout:', error)
    } finally {
      setIsLoading(false)
    }
  }, [router])

  if (isLoading) {
    return <div>Logging out...</div>
  }

  return null
}