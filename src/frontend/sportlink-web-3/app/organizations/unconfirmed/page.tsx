'use client'

import { PageHeader } from "@/components/ui-custom/page-header"
import { OrganizationConfirmationCard } from "@/components/organization-confirmation-card"

interface Organization {
  id: number
  name: string
  description: string
  location: string
  email: string
  phone: string
}

// admin authorized page
const organizations: Organization[] = [
  {
    id: 1,
    name: "Tech Innovators Inc.",
    description: "A cutting-edge technology company focused on AI and machine learning solutions.",
    location: "San Francisco, CA",
    email: "info@techinnovators.com",
    phone: "+1 (415) 555-1234"
  },
  {
    id: 2,
    name: "Green Earth Initiatives",
    description: "Non-profit organization dedicated to environmental conservation and sustainability.",
    location: "Portland, OR",
    email: "contact@greenearth.org",
    phone: "+1 (503) 555-5678"
  },
  {
    id: 3,
    name: "Global Health Solutions",
    description: "Healthcare company specializing in telemedicine and remote patient monitoring.",
    location: "Boston, MA",
    email: "info@globalhealthsolutions.com",
    phone: "+1 (617) 555-9012"
  }
]

export default function UnconfirmedOrganizationsPage() {
  

  return (
    <PageHeader 
            title="Nepotrvđene organizacije"
            description="Pregled i upravljanje novim registracijama organizacija."
        >
            {organizations.map((org) => (
              <OrganizationConfirmationCard key={org.id} org={org} />
        ))}
        </PageHeader>
    
  )
}

