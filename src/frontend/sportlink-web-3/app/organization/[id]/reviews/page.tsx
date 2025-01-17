// app/organizations/[id]/reviews/page.tsx
'use client'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import AuthorizedElement from '@/components/auth/authorized-element'
import { Star, ArrowLeft } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { UserRole } from '@/types/roles'
import { Review, GetReviewsResponse, ReviewStatsResponse, CreateReviewRequest } from '@/types/review'
import { orgService, reviewService } from '@/lib/services/api'
import { GetOrganisationInfoResponse, Organization } from '@/types/org'
import { RespondReviewRequest } from '@/types/review'

export default function OrganizationReviewsPage({ params }: { params: { id: number } }) {
  const router = useRouter()
  const [reviews, setReviews] = useState<Review[]>([])
  const [newReview, setNewReview] = useState({ rating: 0, comment: '' })
  const [responses, setResponses] = useState<{ [key: number]: string }>(
    reviews.reduce((acc, review) => ({ ...acc, [reviews.indexOf(review)]: review.response }), {})
  )
  const [tempResponses, setTempResponses] = useState<{ [key: number]: string }>({})
  const [showResponseInput, setShowResponseInput] = useState<{ [key: number]: boolean }>({})
  const [averageRating, setAverageRating] = useState<number | 0>(0)
  const [organisationName, setOrganisationName] = useState<string>("")
  const [error, setError] = useState<string | null>(null)
  const [isOrgOwner, setIsOrgOwner] = useState<boolean>() 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reviewsResponse, averageRatingResponse, orgNameResponse] = await Promise.all([
          reviewService.getAllReviews(params.id, 0),
          reviewService.getReviewStats(params.id),
          orgService.getOrganization(params.id)
        ]);

        setReviews(reviewsResponse.data);
  
        const avgRating = averageRatingResponse.data.averageRating;
        setAverageRating(avgRating !== undefined ? avgRating : 0);
  
        const orgName = orgNameResponse.data.name;
        setOrganisationName(orgName !== undefined ? orgName : "...");
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Došlo je do greške prilikom učitavanja podataka.');
      }
    };
  
    fetchData();
  }, [params.id]);

  //to do this probably shouldnt be called every time, maybe to check in advance if user is with role orgOwner 
  useEffect(() => {
    const fetchMyOrganisations = async () => {
      try{
        const myOrgResponse = await orgService.getMyOrganizations()
        const userOrgs = myOrgResponse.data;
        setIsOrgOwner(userOrgs.some(org => org.id == params.id));
        console.log(userOrgs)
        console.log("This is org:", params.id)
        console.log(isOrgOwner)
      } catch(error){
        console.error(error)
      }

    };
    fetchMyOrganisations();
  }, [params.id]);

  const handleStarClick = (rating: number) => {
    setNewReview((prev) => ({ ...prev, rating }))
  }

  const handleCommentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewReview((prev) => ({ ...prev, comment: event.target.value }))
  }

  const handleSubmitReview = async () => {
    try {
      const data: CreateReviewRequest = {
        organizationId: params.id,
        rating: newReview.rating,
        description: newReview.comment
      }
      const response = await reviewService.createReview(data);

      console.log('Review submitted successfully:', response)
      setNewReview({ rating: 0, comment: '' })
      // you can refresh the reviews list here
      //await fetchData();
    } catch (error) {
      console.error('Error submitting review:', error)
    }
  };

  const handleResponseChange = (id: number, response: string) => {
    setTempResponses((prev) => ({ ...prev, [id]: response }))
  }

  const handleSubmitResponse = async (orgId: number, userId: number, reviewResponse: string, reviewId: number) => {
    if (reviewResponse === "") return;
    
    try {
      const data: RespondReviewRequest = {
        organizationId: orgId,
        userId: userId,
        response: reviewResponse,
      };
      const response = await reviewService.respondReview(data);
      console.log("Response submitted successfully:", response);
  
      // Update state after a successful response
      setResponses((prev) => ({ ...prev, [reviewId]: reviewResponse }));
      setTempResponses((prev) => ({ ...prev, [reviewId]: '' }));
      setShowResponseInput((prev) => ({ ...prev, [reviewId]: false }));
    } catch (error) {
      console.error("Error submitting response:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* <Button 
        variant="ghost" 
        className="mb-4" 
        onClick={() => router.back()}
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Natrag
      </Button> */}
      <h1 className="text-3xl font-bold mb-6">Recenzije za {organisationName}</h1>
      <div className="bg-primary/10 p-4 rounded-lg mb-6">
        <p className="text-lg font-semibold">Prosječna ocjena: {averageRating !== null ? averageRating.toFixed(1) : Number(0.0)} / 5.0</p>
        <div className="flex items-center mt-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star 
              key={star} 
              className={`w-6 h-6 ${star <= Math.round(averageRating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
            />
          ))}
        </div>
      </div>
      <AuthorizedElement roles={[UserRole.User]}>
        {({ userData }) => (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Dodajte Vašu Recenziju</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center mb-4">
              <p className="mr-2">Vaša ocjena:</p>
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star} 
                  className={`w-6 h-6 cursor-pointer ${star <= newReview.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                  onClick={() => handleStarClick(star)}
                />
              ))}
            </div>
            <Textarea
              placeholder="Napišite vašu recenziju ovdje..."
              className="mb-4"
              value={newReview.comment}
              onChange={handleCommentChange}
            />
            <Button 
              onClick={() => handleSubmitReview()} 
              disabled={newReview.rating === 0 || newReview.comment.trim() === ''}
            >
              Pošalji Recenziju
            </Button>
          </CardContent>
        </Card>
      )}
      </AuthorizedElement>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {reviews.map((review) => (
          <Card key={reviews.indexOf(review)} className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star} 
                      className={`w-5 h-5 ${star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                    />
                  ))}
                </div>
                <span className="text-lg font-semibold">{review.rating} / 5</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <blockquote className="italic border-l-4 border-gray-300 pl-4 py-2 mb-4">
                &ldquo;{review.description}&rdquo;
              </blockquote>
              <p className="text-sm text-gray-600 mb-4">- {review.userFirstName}, član </p>
              
              {responses[reviews.indexOf(review)] && (
                <div className="bg-secondary/10 p-2 rounded-md text-sm mt-4">
                  <p className="font-semibold mb-1">Odgovor organizacije:</p>
                  <p>{responses[reviews.indexOf(review)]}</p>
                </div>
              )}
              {isOrgOwner && (
              <AuthorizedElement roles={[UserRole.OrganizationOwner]}>
                {({ userData }) => (
                  <div className="mt-4">
                    {!responses[reviews.indexOf(review)] && (
                      showResponseInput[reviews.indexOf(review)] ? (
                        <>
                          <Textarea
                            placeholder="Napišite odgovor na recenziju..."
                            className="mb-2 text-sm"
                            value={tempResponses[reviews.indexOf(review)] || ''}
                            onChange={(e) => handleResponseChange(reviews.indexOf(review), e.target.value)}
                          />
                          <div className="flex justify-end space-x-2">
                            <Button 
                              onClick={() => setShowResponseInput((prev) => ({ ...prev, [reviews.indexOf(review)]: false }))}
                              variant="outline"
                              size="sm"
                            >
                              Odustani
                            </Button>
                            <Button 
                              onClick={() => handleSubmitResponse(params.id, Number(userData.id), tempResponses[reviews.indexOf(review)], reviews.indexOf(review))}
                              disabled={!tempResponses[reviews.indexOf(review)]?.trim()}
                              size="sm"
                            >
                              Pošalji
                            </Button>
                          </div>
                        </>
                      ) : (
                        <Button 
                          onClick={() => setShowResponseInput((prev) => ({ ...prev, [reviews.indexOf(review)]: true }))}
                          variant="outline"
                          size="sm"
                        >
                          Odgovori
                        </Button>
                      )
                    )}
                  </div>
                )}
              </AuthorizedElement>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
