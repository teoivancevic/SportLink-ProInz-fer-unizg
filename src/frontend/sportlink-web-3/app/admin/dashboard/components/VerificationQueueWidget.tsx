import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { verificationQueue } from "../mockData"

export default function VerificationQueueWidget() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Organization Verification Queue</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-4xl font-bold">{verificationQueue.length}</p>
        <p className="text-sm text-muted-foreground">Organizations pending verification</p>
        <ul className="mt-4 space-y-2">
          {verificationQueue.map((org) => (
            <li key={org.id} className="text-sm">
              {org.name}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

