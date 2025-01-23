import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import VerificationQueueWidget from "./components/VerificationQueueWidget"
import PlatformActivityWidget from "./components/PlatformActivityWidget"
import SportsFacilityDistributionWidget from "./components/SportsFacilityDistributionWidget"
import UserGrowthWidget from "./components/UserGrowthWidget"
import { PageHeader } from "@/components/ui-custom/page-header"

export default function AdminDashboard() {
  return (
    <div className="pl-8 pr-8">
      <h1 className="text-3xl font-bold mb-6">Admin - Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <VerificationQueueWidget />
        <PlatformActivityWidget />
        <SportsFacilityDistributionWidget />
        <UserGrowthWidget />
      </div>
    </div>

  )
}

