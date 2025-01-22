'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { platformActivity } from "../mockData"
import { Trophy, Users, Dumbbell, TrendingUp, TrendingDown } from "lucide-react"

export default function PlatformActivityWidget() {
  // Calculate percentage changes (assuming these are now included in your mockData)
  const stats = [
    {
      title: "Total Organizations",
      value: platformActivity.totalOrganizations,
      change: platformActivity.organizationGrowth || 12.5, // Fallback value if not in mockData
      icon: Users,
      description: "Active organizations on the platform"
    },
    {
      title: "Active Sports",
      value: platformActivity.activeSports,
      change: platformActivity.sportsGrowth || 5.2,
      icon: Dumbbell,
      description: "Different sports being played"
    },
    {
      title: "Upcoming Tournaments",
      value: platformActivity.upcomingTournaments,
      change: platformActivity.tournamentGrowth || -2.4,
      icon: Trophy,
      description: "Tournaments in next 30 days"
    }
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Platform Activity Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {stats.map((stat) => (
            <div
              key={stat.title}
              className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm transition-all hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <stat.icon className="h-8 w-8 text-muted-foreground opacity-75" />
                <div className={`flex items-center gap-1 text-sm ${
                  stat.change > 0 ? 'text-green-500' : 'text-red-500'
                }`}>
                  {stat.change > 0 ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                  <span>{Math.abs(stat.change)}%</span>
                </div>
              </div>
              
              <div className="mt-3">
                <h3 className="text-3xl font-bold">{stat.value}</h3>
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </p>
                <p className="mt-1 text-xs text-muted-foreground/75">
                  {stat.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}