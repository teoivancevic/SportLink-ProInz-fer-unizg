'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import AuthorizedElement from '@/components/auth/authorized-element'
import { Star, ArrowLeft, User } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { UserRole } from '@/types/roles'

// Mock data for reviews
const reviews = [
  {
    id: 1,
    rating: 5,
    comment: "Izvrsna organizacija s vrhunskim trenerima i odličnim programima za sve uzraste!",
    author: "Ana K.",
    memberSince: "2 godine",
    response: "Hvala vam na lijepim riječima, Ana! Drago nam je što ste zadovoljni našim programima."
  },
  {
    id: 2,
    rating: 4,
    comment: "Odlični treninzi i prijateljska atmosfera. Preporučujem svima!",
    author: "Marko P.",
    memberSince: "1 godina",
    response: ""
  },
  {
    id: 3,
    rating: 5,
    comment: "Najbolji fitness centar u gradu. Stručno osoblje i moderna oprema.",
    author: "Ivana M.",
    memberSince: "6 mjeseci",
    response: "Hvala, Ivana! Trudimo se pružiti najbolje iskustvo našim članovima."
  },
  {
    id: 4,
    rating: 3,
    comment: "Dobri programi, ali ponekad je gužva u večernjim satima.",
    author: "Tomislav R.",
    memberSince: "3 mjeseca",
    response: "Hvala na povratnoj informaciji, Tomislave. Radimo na optimizaciji rasporeda kako bismo smanjili gužve."
  },
  {
    id: 5,
    rating: 5,
    comment: "Nevjerojatno motivirajuće okruženje. Postigla sam ciljeve koje nisam mislila da su mogući!",
    author: "Maja Š.",
    memberSince: "1 godina",
    response: ""
  },
  {
    id: 6,
    rating: 4,
    comment: "Kvalitetna oprema i čisti prostori. Jedina zamjerka je manjak parkirnih mjesta.",
    author: "Davor B.",
    memberSince: "8 mjeseci",
    response: "Hvala na pohvalama, Davore. Trenutno radimo na rješavanju problema s parkingom."
  },
  {
    id: 7,
    rating: 5,
    comment: "Obožavam grupne treninge! Instruktori su energični i pažljivi prema svima.",
    author: "Petra L.",
    memberSince: "4 mjeseca",
    response: ""
  },
  {
    id: 8,
    rating: 4,
    comment: "Fleksibilno radno vrijeme i širok izbor opreme. Ponekad nedostaje osobniji pristup.",
    author: "Igor M.",
    memberSince: "2 godine",
    response: "Hvala na povratnoj informaciji, Igor. Radimo na poboljšanju osobnog pristupa našim članovima."
  },
]

export default function ReviewsPage() {
  const router = useRouter()
  const [newReview, setNewReview] = useState({ rating: 0, comment: '' })
  const [responses, setResponses] = useState<{ [key: number]: string }>(
    reviews.reduce((acc, review) => ({ ...acc, [review.id]: review.response }), {})
  )
  const [showResponseInput, setShowResponseInput] = useState<{ [key: number]: boolean }>({})
  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length

  const handleStarClick = (rating: number) => {
    setNewReview(prev => ({ ...prev, rating }))
  }

  // TO DO: fix comment shouldnt change until "posalji" button is pressed
  const handleCommentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewReview(prev => ({ ...prev, comment: event.target.value }))
  }

  const handleSubmitReview = () => {
    // TODO : send review to backend
    console.log('Submitting review:', newReview)
    setNewReview({ rating: 0, comment: '' })
  }

  const handleResponseChange = (id: number, response: string) => {
    setResponses(prev => ({ ...prev, [id]: response }))
  }

  const handleSubmitResponse = (id: number) => {
    // TODO : send response to backend
    console.log('Submitting response for review', id, ':', responses[id])
    setShowResponseInput(prev => ({ ...prev, [id]: false }))
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button 
        variant="ghost" 
        className="mb-4" 
        onClick={() => router.back()}
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Natrag
      </Button>
      <h1 className="text-3xl font-bold mb-6">Recenzije za Našu Organizaciju</h1>
      <div className="bg-primary/10 p-4 rounded-lg mb-6">
        <p className="text-lg font-semibold">Prosječna ocjena: {averageRating.toFixed(1)} / 5</p>
        <div className="flex items-center mt-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star 
              key={star} 
              className={`w-6 h-6 ${star <= Math.round(averageRating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
            />
          ))}
        </div>
      </div>
      <AuthorizedElement roles={[UserRole.OrganizationOwner, UserRole.User]}>
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
            <Button onClick={handleSubmitReview} disabled={newReview.rating === 0 || newReview.comment.trim() === ''}>
              Pošalji Recenziju
            </Button>
          </CardContent>
        </Card>
      )}
      </AuthorizedElement>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {reviews.map((review) => (
          <Card key={review.id} className="h-full">
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
                "{review.comment}"
              </blockquote>
              <p className="text-sm text-gray-600 mb-4">- {review.author}, član {review.memberSince}</p>
              
              {responses[review.id] && (
                <div className="bg-secondary/10 p-2 rounded-md text-sm mt-4">
                  <p className="font-semibold mb-1">Odgovor organizacije:</p>
                  <p>{responses[review.id]}</p>
                </div>
              )}
              
              <AuthorizedElement roles={[UserRole.OrganizationOwner]}>
                {() => (
                  <div className="mt-4">
                    {!responses[review.id] && (
                      showResponseInput[review.id] ? (
                        <>
                          <Textarea
                            placeholder="Napišite odgovor na recenziju..."
                            className="mb-2 text-sm"
                            value={responses[review.id] || ''}
                            onChange={(e) => handleResponseChange(review.id, e.target.value)}
                          />
                          <div className="flex justify-end space-x-2">
                            <Button 
                              onClick={() => setShowResponseInput(prev => ({ ...prev, [review.id]: false }))}
                              variant="outline"
                              size="sm"
                            >
                              Odustani
                            </Button>
                            <Button 
                              onClick={() => handleSubmitResponse(review.id)}
                              disabled={!responses[review.id]?.trim()}
                              size="sm"
                            >
                              Pošalji
                            </Button>
                          </div>
                        </>
                      ) : (
                        <Button 
                          onClick={() => setShowResponseInput(prev => ({ ...prev, [review.id]: true }))}
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
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

