'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/auth/auth-context'
import { Card, CardContent } from '@/components/ui/card'

export default function LogoutPage() {
  const router = useRouter()
  const { logout } = useAuth()

  useEffect(() => {
    const performLogout = async () => {
      try {
        // Use the centralized logout function
        logout()
        
        // Force a complete page refresh to clear any cached state
        window.location.href = '/'
      } catch (error) {
        console.error('Error during logout:', error)
        // Fallback to simple redirect if something goes wrong
        router.push('/')
      }
    }

    performLogout()
  }, [logout, router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-8 h-8 border-4 border-t-primary animate-spin rounded-full" />
            <p className="text-lg">Logging out...</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}