'use client'
import { Star, Edit, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import EditProfilePopup from '../../../components/EditProfilePopup'
import { useRouter } from 'next/navigation'
import NavMenu from "@/components/nav-org-profile"
import { GetOrganisationInfoResponse, Organization } from '@/types/org'
import { orgService } from "@/lib/services/api"
import { useEffect, useState, useCallback } from 'react'
import { Alert, AlertDescription } from "@/components/ui/alert"
import AuthorizedElement from '@/components/auth/authorized-element'
import { UserRole } from '@/types/roles'
import Image from 'next/image'
import { reviewService } from '@/lib/services/api'
import { Review } from '@/types/review'

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
  const [mapImageUrl, setMapImageUrl] = useState<string | null>(null)

  const [reviews, setReviews] = useState<Review[]>([])
  const [averageRating, setAverageRating] = useState<number | 0>(0)
  const [reviewCount, setReviewCount] = useState<number | 0>(0)

  const createMapUrl = useCallback((location: string) => {
    const locationEncoded = encodeURIComponent(location)
    return `https://maps.googleapis.com/maps/api/staticmap?center=${locationEncoded}&zoom=15&size=600x300&maptype=roadmap&markers=color:red%7C${locationEncoded}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
  }, [])

  const fetchOrganizationData = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response: GetOrganisationInfoResponse = await orgService.getOrganization(params.id)
      setOrgInfo(response.data)
      setMapImageUrl(createMapUrl(response.data.location))
    } catch (error) {
      console.error('Error fetching organization:', error)
      setError('Došlo je do greške prilikom učitavanja organizacije.')
    } finally {
      setIsLoading(false)
    }
  }, [params.id, createMapUrl])

  useEffect(() => {
    fetchOrganizationData()
  }, [fetchOrganizationData])

  useEffect(() => {
      const fetchData = async () => {
        try {
          const [reviewsResponse, reviewStats] = await Promise.all([
            reviewService.getAllReviews(params.id, 0),
            reviewService.getReviewStats(params.id)]);
          setReviews(reviewsResponse.data);
          const avgRating = reviewStats.data.averageRating;
          setAverageRating(avgRating !== undefined ? avgRating : 0);
          const reviewCounter = reviewStats.data.reviewCount;
          setReviewCount(reviewCounter !== undefined ? reviewCounter : 0);
        } catch (error) {
          console.error('Error fetching data:', error);
          setError('Došlo je do greške prilikom učitavanja podataka.');
        }
      };
      fetchData();
    }, [params.id]);

  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false)

  const handleEditSubmit = async (newInfo: Organization) => {
    try {
      await orgService.updateOrganization(newInfo)
      await fetchOrganizationData()
    } catch (error) {
      console.error('Error updating org data:', error)
    }
    setIsEditPopupOpen(false)
  }

  const router = useRouter()
  const handleReviewClick = () => {
    router.push(`/organization/${params.id}/reviews`)
  }

  if (isLoading) {
    return <div className="container mx-auto p-4" />
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
      <NavMenu orgId={params.id} />
      <h1 className="text-3xl font-bold mb-6">Informacije</h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>O nama</CardTitle>
            <AuthorizedElement 
              roles={[UserRole.OrganizationOwner, UserRole.AppAdmin]}
              requireOrganizationEdit={true}
              orgOwnerUserId={orgInfo.owner.id.toString()}
            >
              {({ userData }) => (
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
            <div>
              <p><strong>Lokacija:</strong> {orgInfo.location}</p>
            </div>
            {/* <div className="flex space-x-4" >
              <a href="#" className="text-blue-600 hover:underline">Facebook</a>
              <a href="#" className="text-blue-400 hover:underline">Twitter</a>
              <a href="#" className="text-pink-600 hover:underline">Instagram</a>
            </div> */}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4"> 
            {mapImageUrl && (
              <div className="w-full h-full p-4"> 
                <Image 
                  src={mapImageUrl}
                  alt="Map Preview"
                  layout="responsive"
                  width={600} 
                  height={300} 
                  className="object-cover w-full h-full rounded-md"  
                  unoptimized
                />
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
          {(reviews.length !== 0) ? (
            <CardContent>
              <div className="flex items-center mb-4">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                    key={star}
                    className={`w-6 h-6 ${
                      star <= Math.round(averageRating || 0)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                    />
                  ))}
                </div>
                <span className="ml-2 text-lg font-semibold">{averageRating.toFixed(1)} / 5</span>
                <span className="ml-2 text-lg font-light italic text-gray-400">{reviewCount} ljudi je komentiralo</span>
              </div>
              <blockquote className="italic border-l-4 border-gray-300 pl-4 py-2 mb-4">
                &ldquo;{reviews[0].description}&rdquo;
              </blockquote>
              <p className="text-sm text-gray-600">{reviews[0].userFirstName}, član</p>
            </CardContent>
           ) : (
            <CardContent>
            <div className="flex items-center mb-4">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                  key={star}
                  className={`w-6 h-6 ${
                    star <= Math.round(0)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                  />
                ))}
              </div>
              <span className="ml-2 text-lg font-semibold">0 / 5</span>
            </div>
            <blockquote className="italic border-l-4 border-gray-300 pl-4 py-2 mb-4">
              Za sada nema recenzija. Budite prvi i ostavite svoju klikom ovdje!
            </blockquote>
          </CardContent>
           )
          }
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
