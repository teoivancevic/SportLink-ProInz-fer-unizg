'use client'

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { MapPin, Mail, Phone } from 'lucide-react'
import { useState } from "react"

interface OrganizationConfirmationCardProps {
    key: number
    org: Organization
  }

  interface Organization {
    id: number
    name: string
    description: string
    location: string
    email: string
    phone: string
  }
  
  export function OrganizationConfirmationCard({ key, org }: OrganizationConfirmationCardProps) {
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
    )
  }