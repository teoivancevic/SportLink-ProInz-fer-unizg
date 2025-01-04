import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MapPin, Mail, Phone } from 'lucide-react'
import { orgService } from "@/lib/services/api"

interface Organization {
  id: number
  name: string
  description: string
  location: string
  contactEmail: string
  contactPhoneNumber: string
}

interface OrganizationConfirmationCardProps {
  organization: Organization
  onConfirmationComplete?: () => void
}

// Add this type to handle the loading state
interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean
}

// Update the Button component to handle loading state
const LoadingButton = ({ loading, children, disabled, ...props }: LoadingButtonProps) => (
  <Button 
    disabled={loading || disabled} 
    {...props}
  >
    {loading ? (
      <div className="flex items-center gap-2">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        Loading...
      </div>
    ) : children}
  </Button>
)

export function OrganizationConfirmationCard({ 
  organization, 
  onConfirmationComplete 
}: OrganizationConfirmationCardProps) {
  const [showDenyReason, setShowDenyReason] = useState(false)
  const [denyReason, setDenyReason] = useState("")
  const [isAccepting, setIsAccepting] = useState(false)
  const [isDenying, setIsDenying] = useState(false)

  const handleAccept = async () => {
    setIsAccepting(true)
    try {
      await orgService.acceptOrganization(organization.id)
      onConfirmationComplete?.()
    } catch (error) {
      console.error('Error accepting organization:', error)
    } finally {
      setIsAccepting(false)
    }
  }

  const handleDeny = async () => {
    if (!showDenyReason) {
      setShowDenyReason(true)
      return
    }

    if (!denyReason.trim()) {
      return // Don't proceed if no reason is provided
    }

    setIsDenying(true)
    try {
      await orgService.rejectOrganization(organization.id, denyReason)
      onConfirmationComplete?.()
    } catch (error) {
      console.error('Error denying organization:', error)
    } finally {
      setIsDenying(false)
      setShowDenyReason(false)
      setDenyReason("")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{organization.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          {organization.description}
        </p>
        <div className="text-sm flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span>{organization.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span>{organization.contactEmail}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span>{organization.contactPhoneNumber}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-stretch gap-2">
        <div className="flex gap-2">
          <LoadingButton 
            className="flex-1 border-2 border-destructive bg-transparent hover:bg-destructive text-destructive hover:text-destructive-foreground"
            onClick={handleDeny}
            disabled={isAccepting || (showDenyReason && !denyReason.trim())}
            loading={isDenying}
          >
            {showDenyReason ? "Confirm Deny" : "Deny"}
          </LoadingButton>
          <LoadingButton 
            className="flex-1" 
            onClick={handleAccept}
            disabled={isDenying || showDenyReason}
            loading={isAccepting}
          >
            Accept
          </LoadingButton>
        </div>
        {showDenyReason && (
          <Input
            placeholder="Enter reason for denial"
            value={denyReason}
            onChange={(e) => setDenyReason(e.target.value)}
            disabled={isDenying}
          />
        )}
      </CardFooter>
    </Card>
  )
}