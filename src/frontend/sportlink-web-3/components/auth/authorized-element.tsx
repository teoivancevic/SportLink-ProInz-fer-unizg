'use client'

import { UserRole } from '@/types/roles'
import { useAuth } from './auth-context'
import { UserData } from '@/types/auth'

interface AuthorizedElementProps {
  children: (props: { userData: UserData }) => React.ReactNode
  roles?: UserRole[]
  orgOwnerUserId?: string // Optional organization Owner User ID to check permissions against
  requireOrganizationEdit?: boolean // Flag to indicate if organization edit permission is required
}

export default function AuthorizedElement({ 
  children, 
  roles,
  orgOwnerUserId,
  requireOrganizationEdit = false
}: AuthorizedElementProps) {
  const { userData, isLoading } = useAuth()

  // Don't render anything while authentication is being initialized
  if (isLoading) {
    return null
  }

  if (!userData) {
    return null
  }

  if (roles && !roles.includes(userData.role)) {
    return null
  }

  // Only perform organization edit check if explicitly required AND orgOwnerUserId is provided
  if (requireOrganizationEdit === true) {
    // If requireOrganizationEdit is true but no orgOwnerUserId is provided, don't render
    if (!orgOwnerUserId) {
      return null
    }

    const canEditOrganization = 
      userData.role === UserRole.AppAdmin || 
      (userData.role === UserRole.OrganizationOwner && userData.id === orgOwnerUserId);

    if (!canEditOrganization) {
      return null
    }
  }

  return <>{children({ userData })}</>
}