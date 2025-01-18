// app/organizations/[id]/reviews/page.tsx
'use client'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import AuthorizedElement from '@/components/auth/authorized-element'
import { Star } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { UserRole } from '@/types/roles'
import { Review, CreateReviewRequest } from '@/types/review'
import { orgService, reviewService } from '@/lib/services/api'
import {  Organization } from '@/types/org'
import { RespondReviewRequest } from '@/types/review'
import { ReviewsDistribution } from '@/components/reviewDistribution';
import { Distribution, ApiDistribution } from '@/types/review'

function transformDistribution(apiDistribution: ApiDistribution): Distribution {
    return {
      oneStar: apiDistribution[1] || 0,
      twoStars: apiDistribution[2] || 0,
      threeStars: apiDistribution[3] || 0,
      fourStars: apiDistribution[4] || 0,
      fiveStars: apiDistribution[5] || 0,
    };
}

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
  const [organisationInfo, setOrganisationInfo] = useState<Organization | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [reviewDistribution, setReviewDistribution] = useState<Distribution | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reviewsResponse, averageRatingResponse, orgInfoResponse, distributionResponse] = await Promise.all([
          reviewService.getAllReviews(params.id, 0),
          reviewService.getReviewStats(params.id),
          orgService.getOrganization(params.id),
          reviewService.getReviewDistribution(params.id)
        ]);

        setReviews(reviewsResponse.data);
  
        const avgRating = averageRatingResponse.data.averageRating;
        setAverageRating(avgRating !== undefined ? avgRating : 0);
  
        const orgInfo = orgInfoResponse.data;
        setOrganisationInfo(orgInfo);

        const transformedDistribution = transformDistribution(distributionResponse.data);
        console.log("Transformed Distribution:", transformedDistribution);
        setReviewDistribution(transformedDistribution);
        console.log(distributionResponse.data)
        console.log(reviewDistribution)
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Došlo je do greške prilikom učitavanja podataka.');
      }
    };
  
    fetchData();
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
        organizationId: Number(params.id),
        rating: newReview.rating,
        description: newReview.comment
      }
      console.log("Ovo saljem:", data)
      const response = await reviewService.createReview(data);

      console.log('Review submitted successfully:', response)
      setNewReview({ rating: 0, comment: '' })
      const reviewsResponse = await reviewService.getAllReviews(Number(params.id), 0); //refresh all reviews
      setReviews(reviewsResponse.data);
    } catch (error) {
      console.error('Error submitting review:', error)
      setError('There was an error submitting your review. Please try again.')
    }
  };

  const handleResponseChange = (id: number, response: string) => {
    setTempResponses((prev) => ({ ...prev, [id]: response }))
  }

  const handleSubmitResponse = async (orgId: number, uId: number, reviewResponse: string, reviewId: number) => {
    if (reviewResponse === "") return;

    try {
      const data: RespondReviewRequest = {
        organizationId: orgId,
        userId: uId,
        response: encodeURIComponent(reviewResponse),
      };
      console.log("Sending data:", data);
      const response = await reviewService.respondReview(data);
      console.log("Response submitted successfully:", response);
      setShowResponseInput((prev) => ({ ...prev, [reviewId]: false }));

      const reviewsResponse = await reviewService.getAllReviews(orgId, 0); //refresh reviews
      setReviews(reviewsResponse.data);
    } catch (error) {
      console.error("Error submitting response:", error);
      setError('There was an error submitting your response. Please try again.');
    }
  };

  const handleDeleteReview = async () => {
    try {
      await reviewService.deleteReview(params.id);
      // setReviews(reviews.filter(review => review.id !== reviewId));
      const reviewsResponse = await reviewService.getAllReviews(Number(params.id), 0); //refresh all reviews
      setReviews(reviewsResponse.data);
    } catch (error) {
      console.error('Error deleting review:', error);
      setError('There was an error deleting the review. Please try again.');
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
      <h1 className="text-3xl font-bold mb-6">Recenzije za {(organisationInfo === null) ? "..." : organisationInfo.name}</h1>
      <div className="flex flex-col gap-6 mb-6 md:flex-row">
        <div className="flex-1 p-4 bg-primary/10 rounded-lg">
          <p className="text-lg font-semibold">
            Prosječna ocjena: {averageRating !== null ? averageRating.toFixed(1) : Number(0.0)} / 5.0
          </p>
          <div className="flex items-center mt-2">
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
          <div className="flex-1 mt-2">
          {reviewDistribution && <ReviewsDistribution distribution={reviewDistribution} />}
        </div>
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
              
              {review.response && (
                <div className="bg-secondary/10 p-2 rounded-md text-sm mt-4">
                  <p className="font-semibold mb-1">Odgovor organizacije:</p>
                  <p>{review.response}</p>
                </div>
              )}
              <AuthorizedElement 
                roles={[UserRole.OrganizationOwner]} 
                requireOrganizationEdit={true} 
                orgOwnerUserId={(organisationInfo === null) ? "0" : organisationInfo.owner.id.toString()}>
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
                              onClick={() => handleSubmitResponse(params.id, review.userId, tempResponses[reviews.indexOf(review)], reviews.indexOf(review))}
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
              <AuthorizedElement roles={[UserRole.User, UserRole.OrganizationOwner]}>
                {({ userData }) => 
                  (Number(userData.id) == Number(review.userId) && (
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    className="mt-4"
                    onClick={() => handleDeleteReview()}
                  >
                    Izbriši
                  </Button>
                  )
                )}
              </AuthorizedElement>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
