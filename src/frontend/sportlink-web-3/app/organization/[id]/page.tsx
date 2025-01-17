// app/organizations/[id]/page.tsx

'use client'
import { Star, Edit, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import EditProfilePopup from '../../../components/EditProfilePopup'
import { useRouter} from 'next/navigation'
import NavMenu from "@/components/nav-org-profile";
import { GetOrganisationInfoResponse, Organization } from '@/types/org'
import { orgService } from "@/lib/services/api"
import { useEffect, useState } from 'react'
import { Alert, AlertDescription } from "@/components/ui/alert"
import AuthorizedElement from '@/components/auth/authorized-element'
import { UserRole } from '@/types/roles'

export default function OrganizationPage({ params }: { params: { id: number } }) {

  const initialData: Organization = {
    id: params.id,
    name: "",
    description: "",
    contactEmail: "",
    contactPhoneNumber: "",
    location: "",
    rating: 0,
    owner: {
      id: 0,
      firstName: "",
      lastName: "",
      email: ""
    },
    socialNetworks: []
  }

  const [orgInfo, setOrgInfo] = useState<Organization>(initialData)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchOrganizationData = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const response: GetOrganisationInfoResponse = await orgService.getOrganization(params.id)
        console.log(response);
        setOrgInfo(response.data)
      } catch (error) {
        console.error('Error fetching organization:', error)
        setError('Došlo je do greške prilikom učitavanja organizacije.')
      } finally {
        setIsLoading(false)
      }
  }
  useEffect(() => { fetchOrganizationData() }, [])

  const [mapImageUrl, setMapImageUrl] = useState<string | null>(() => {
    const locationEncoded = encodeURIComponent(initialData.location)
    return `https://maps.googleapis.com/maps/api/staticmap?center=${locationEncoded}&zoom=15&size=600x300&maptype=roadmap&markers=color:red%7C${locationEncoded}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
  })

  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false)

  const handleEditSubmit = async (newInfo: Organization) => {
    try {
      const response: GetOrganisationInfoResponse = await orgService.updateOrganization(newInfo)
      console.log(response)
      const org: GetOrganisationInfoResponse = await orgService.getOrganization(params.id);
      setOrgInfo(org.data)
      const locationEncoded = encodeURIComponent(newInfo.location)
      const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${locationEncoded}&zoom=15&size=600x300&maptype=roadmap&markers=color:red%7C${locationEncoded}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
      setMapImageUrl(mapUrl)
    } catch (error){
      console.error('Error updating org data:', error)
      console.log('Update failed')
    }

    setIsEditPopupOpen(false)
  }

  const router = useRouter()
  const handleReviewClick = () => {
    router.push( `/organization/${params.id}/reviews`)
  }

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="">
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

    return (
      <div className="container mx-auto p-4 space-y-4">
        <NavMenu orgId={params.id}></NavMenu>
        <h1 className="text-3xl font-bold mb-6">Informacije</h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>O nama</CardTitle>
              <AuthorizedElement 
                roles={[UserRole.OrganizationOwner, UserRole.AppAdmin]}
                requireOrganizationEdit = {false}
                orgOwnerUserId={params.id.toString()}
              >
                {(userData) => (
                  <Button variant="outline" size="sm" onClick={() => setIsEditPopupOpen(true)}>
                    <Edit className="w-4 h-4 mr-2" />
                    Uredi
                  </Button>
                )}
                
              </AuthorizedElement>
              
            </CardHeader>
            <CardContent className="space-y-4">
              <h2 className="text-xl font-semibold">{orgInfo.name}</h2>
              <p>{orgInfo.description}</p>
              <div>
                <p><strong>Email:</strong> {orgInfo.contactEmail}</p>
                <p><strong>Telefon:</strong> {orgInfo.contactPhoneNumber}</p>
              </div>
              <div className="flex space-x-4">
                <a href="#" className="text-blue-600 hover:underline">Facebook</a>
                <a href="#" className="text-blue-400 hover:underline">Twitter</a>
                <a href="#" className="text-pink-600 hover:underline">Instagram</a>
              </div>
            </CardContent>
          </Card>
  
          <Card>
            <CardHeader>
              <CardTitle>Lokacija</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">{orgInfo.location}</p>
              {mapImageUrl && (
                <div className="mt-4">
                  <img src={mapImageUrl} alt="Map Preview" className="w-300px h-200px"/>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
  
        <div onClick={handleReviewClick} className="cursor-pointer">
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Recenzije</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center mb-4">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="ml-2 text-lg font-semibold">4.8 / 5</span>
              </div>
              <blockquote className="italic border-l-4 border-gray-300 pl-4 py-2 mb-4">
                "Izvrsna organizacija s vrhunskim trenerima i odličnim programima za sve uzraste!"
              </blockquote>
              <p className="text-sm text-gray-600">- Ana K., član 2 godine</p>
            </CardContent>
          </Card>
        </div>
                  
        <EditProfilePopup
          isOpen={isEditPopupOpen}
          onClose={() => setIsEditPopupOpen(false)}
          onSubmit={handleEditSubmit}
          initialData={orgInfo}
        />
      </div>
    )
  }
  return renderContent();
}

