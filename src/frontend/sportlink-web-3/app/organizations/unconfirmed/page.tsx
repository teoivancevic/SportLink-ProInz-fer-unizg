'use client'

import { useEffect, useState } from 'react'
import { PageHeader } from "@/components/ui-custom/page-header"
import { OrganizationConfirmationCard } from "@/components/organization-confirmation-card"
import { orgService } from "@/lib/services/api"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { GetOrganizationResponse, Organization } from '@/types/org'


export default function UnconfirmedOrganizationsPage() {
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchOrganizations = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response: GetOrganizationResponse = await orgService.getOrganizations(false)
      console.log(response);

      setOrganizations(response.data)
    } catch (error) {
      console.error('Error fetching organizations:', error)
      setError('Došlo je do greške prilikom učitavanja organizacija.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchOrganizations()
  }, [])

  const handleConfirmationComplete = () => {
    fetchOrganizations()
  }

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <Skeleton key={n} className="h-[200px] w-full" />
          ))}
        </div>
      )
    }

    if (error) {
      return (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )
    }

    if (!organizations.length) {
      return (
        <Alert>
          <AlertDescription>
            Trenutno nema organizacija koje čekaju na potvrdu.
          </AlertDescription>
        </Alert>
      )
    }

    return organizations.map((org) => (
      <OrganizationConfirmationCard
        key={org.id}
        organization={org}
        onConfirmationComplete={handleConfirmationComplete}
      />
    ))
  }

  return (
    <PageHeader 
      title="Nepotvrđene organizacije"
      description="Pregled i upravljanje novim registracijama organizacija."
    >
      <div className="space-y-4">
        {renderContent()}
      </div>
    </PageHeader>
  )
}