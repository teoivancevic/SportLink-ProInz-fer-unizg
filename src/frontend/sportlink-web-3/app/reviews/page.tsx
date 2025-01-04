'use client'
import { useRouter } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Star, ArrowLeft } from 'lucide-react'
import { Button } from "@/components/ui/button"

// Mock data for reviews
const reviews = [
  {
    id: 1,
    rating: 5,
    comment: "Izvrsna organizacija s vrhunskim trenerima i odličnim programima za sve uzraste!",
    author: "Ana K.",
    memberSince: "2 godine"
  },
  {
    id: 2,
    rating: 4,
    comment: "Odlični treninzi i prijateljska atmosfera. Preporučujem svima!",
    author: "Marko P.",
    memberSince: "1 godina"
  },
  {
    id: 3,
    rating: 5,
    comment: "Najbolji fitness centar u gradu. Stručno osoblje i moderna oprema.",
    author: "Ivana M.",
    memberSince: "6 mjeseci"
  },
  // Add more mock reviews as needed
]

export default function ReviewsPage() {
  const router = useRouter()
  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length

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
              <p className="text-sm text-gray-600">- {review.author}, član {review.memberSince}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

