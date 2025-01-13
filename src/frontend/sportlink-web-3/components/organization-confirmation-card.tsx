import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MapPin, Mail, Phone } from 'lucide-react'
import { orgService } from "@/lib/services/api"
import { useRouter } from 'next/navigation'
import { UserInfo, UserInfoProps } from "@/components/ui-custom/user-info" // Updated import

interface Organization {
  id: number
  name: string
  description: string
  location: string
  contactEmail: string
  contactPhoneNumber: string
}

interface OrganizationCardProps {
  organization: Organization
  isConfirmed: boolean
  onConfirmationComplete?: () => void
}

interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean
}

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

export function OrganizationCard({ 
  organization, 
  isConfirmed,
  onConfirmationComplete
}: OrganizationCardProps) {
  const [showDenyReason, setShowDenyReason] = useState(false)
  const [denyReason, setDenyReason] = useState("")
  const [isAccepting, setIsAccepting] = useState(false)
  const [isDenying, setIsDenying] = useState(false)
  const router = useRouter()

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

  const handleViewDetails = () => {
    router.push(`/organizations/${organization.id}`)
  }

  return (
    <Card className={`${isConfirmed ? "cursor-pointer hover:shadow-md transition-shadow" : ""} relative`} onClick={isConfirmed ? handleViewDetails : undefined}>
      <div className="absolute top-2 right-2 z-10">
        <UserInfo 
          user={{
            firstName: "ime",
            lastName: "vlasnika",
            email: "mail vlasnika org.",
            avatar: ""
          }} 
          className="bg-background/80 backdrop-blur-sm rounded-lg shadow-sm"
          avatarClassName="h-8 w-8"
          size="sm"
        />
      </div>
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
      {!isConfirmed && (
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
      )}
    </Card>
  )
}

export function OrganizationConfirmationCard(props: Omit<OrganizationCardProps, 'isConfirmed'>) {
  return <OrganizationCard {...props} isConfirmed={false} />
}

export function ConfirmedOrganizationCard(props: Omit<OrganizationCardProps, 'isConfirmed'>) {
  return <OrganizationCard {...props} isConfirmed={true} />
}

