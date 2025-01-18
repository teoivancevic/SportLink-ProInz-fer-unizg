import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Distribution {
  oneStar: number
  twoStars: number
  threeStars: number
  fourStars: number
  fiveStars: number
}

interface ReviewsDistributionProps {
  distribution: Distribution
}

export function ReviewsDistribution({ distribution }: ReviewsDistributionProps) {
  const totalReviews = Object.values(distribution).reduce((sum, count) => sum + count, 0)

  const data = [
    { stars: 5, count: distribution.fiveStars },
    { stars: 4, count: distribution.fourStars },
    { stars: 3, count: distribution.threeStars },
    { stars: 2, count: distribution.twoStars },
    { stars: 1, count: distribution.oneStar },
  ]

  return (
    <Card className="w-full pt-8">
      <CardContent>
        <div className="space-y-2">
          {data.map(({ stars, count }) => (
            <div key={stars} className="flex items-center">
              <span className="w-8 text-sm font-medium">{stars}★</span>
              <Progress
                value={(count / totalReviews) * 100}
                className="h-2 flex-grow bg-blue-100"
                // indicatorClassName="bg-blue-500"
              />
              <span className="w-12 text-sm text-right">{count}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

