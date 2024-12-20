'use client'

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MapPin, Mail, Phone } from 'lucide-react'
import { useState } from "react"
import { PageHeader } from "@/components/ui-custom/page-header"

interface Organization {
  id: number
  name: string
  description: string
  location: string
  email: string
  phone: string
}

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
  const [showDenyReason, setShowDenyReason] = useState<{ [key: number]: boolean }>({})
  const [denyReason, setDenyReason] = useState<{ [key: number]: string }>({})
  const [loading, setLoading] = useState<{ [key: number]: 'accept' | 'deny' | null }>({})

  const handleAccept = async (id: number) => {
    setLoading({ ...loading, [id]: 'accept' })
    try {
      // Simulating an API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      console.log(`Accepted organization with id: ${id}`)
      // Implement actual accept logic here
    } catch (error) {
      console.error(`Error accepting organization with id: ${id}`, error)
    } finally {
      setLoading({ ...loading, [id]: null })
    }
  }

  const handleDeny = async (id: number) => {
    if (showDenyReason[id] && denyReason[id]) {
      setLoading({ ...loading, [id]: 'deny' })
      try {
        // Simulating an API call
        await new Promise(resolve => setTimeout(resolve, 2000))
        console.log(`Denied organization with id: ${id}. Reason: ${denyReason[id]}`)
        // Implement actual deny logic here
      } catch (error) {
        console.error(`Error denying organization with id: ${id}`, error)
      } finally {
        setLoading({ ...loading, [id]: null })
        setShowDenyReason({ ...showDenyReason, [id]: false })
        setDenyReason({ ...denyReason, [id]: '' })
      }
    } else {
      setShowDenyReason({ ...showDenyReason, [id]: true })
    }
  }

  return (
    <PageHeader 
            title="Nepotrvđene organizacije"
            description="Pregled i upravljanje novim registracijama organizacija."
        >
            {organizations.map((org) => (
          <Card key={org.id}>
            <CardHeader>
              <CardTitle>{org.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">{org.description}</p>
              <div className="text-sm flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{org.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{org.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{org.phone}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col items-stretch gap-2">
              <div className="flex gap-2">
                <Button 
                  className="flex-1 border-2 border-destructive bg-transparent hover:bg-destructive text-destructive hover:text-destructive-foreground"
                  variant="outline"
                  onClick={() => {
                    if (!showDenyReason[org.id]) {
                      setShowDenyReason(prev => ({...prev, [org.id]: true}));
                    } else if (denyReason[org.id]?.trim()) {  // Only allow confirmation if reason is provided
                      handleDeny(org.id);
                    }
                  }}
                >
                  {showDenyReason[org.id] ? "Confirm Deny" : "Deny"}
                </Button>
                <Button className="flex-1" onClick={() => handleAccept(org.id)}>Accept</Button>
              </div>
              {showDenyReason[org.id] && (
                <Input
                  placeholder="Enter reason for denial"
                  value={denyReason[org.id] || ""}
                  onChange={(e) => setDenyReason({ ...denyReason, [org.id]: e.target.value })}
                />
              )}
            </CardFooter>
          </Card>
        ))}
        </PageHeader>
    
  )
}

