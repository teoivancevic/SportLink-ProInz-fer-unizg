import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarIcon, MapPinIcon, DollarSignIcon, ActivityIcon } from 'lucide-react'
import NavMenu from "@/components/nav-org-profile";

interface Competition {
  id: number;
  name: string;
  description: string;
  timeFrom: string;
  timeTo: string;
  entryFee: string;
  location: string;
  sport: string;
}

// Mock data for competitions
const competitions = [
  {
    id: 1,
    name: "Ljetni Plivački Maraton",
    description: "Godišnje natjecanje u plivanju na duge staze",
    timeFrom: "2023-07-15T09:00:00",
    timeTo: "2023-07-15T17:00:00",
    entryFee: "150 kn",
    location: "Splitska riva",
    sport: "Plivanje"
  },
  {
    id: 2,
    name: "Planinski Biciklistički Izazov",
    description: "Ekstremna biciklistička utrka kroz planinske staze",
    timeFrom: "2023-08-20T07:00:00",
    timeTo: "2023-08-20T19:00:00",
    entryFee: "200 kn",
    location: "Planina Velebit",
    sport: "Biciklizam"
  },
  {
    id: 3,
    name: "Gradski Maraton",
    description: "Tradicionalni godišnji maraton kroz grad",
    timeFrom: "2023-09-10T08:00:00",
    timeTo: "2023-09-10T14:00:00",
    entryFee: "100 kn",
    location: "Centar grada",
    sport: "Trčanje"
  },
  {
    id: 4,
    name: "Odbojka na Pijesku",
    description: "Ljetni turnir u odbojci na pijesku",
    timeFrom: "2023-07-30T10:00:00",
    timeTo: "2023-07-31T18:00:00",
    entryFee: "250 kn po timu",
    location: "Gradska plaža",
    sport: "Odbojka"
  },
]

function CompetitionCard({ competition }: { competition: Competition }) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{competition.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">{competition.description}</p>
        <div className="space-y-2">
          <div className="flex items-center">
            <CalendarIcon className="mr-2 h-4 w-4" />
            <span className="text-sm">
              {new Date(competition.timeFrom).toLocaleString()} - {new Date(competition.timeTo).toLocaleString()}
            </span>
          </div>
          <div className="flex items-center">
            <MapPinIcon className="mr-2 h-4 w-4" />
            <span className="text-sm">{competition.location}</span>
          </div>
          <div className="flex items-center">
            <DollarSignIcon className="mr-2 h-4 w-4" />
            <span className="text-sm">{competition.entryFee}</span>
          </div>
          <div className="flex items-center">
            <ActivityIcon className="mr-2 h-4 w-4" />
            <span className="text-sm">{competition.sport}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function NatjecanjaContent() {
  return (
    <div className="container mx-auto p-4 space-y-8">
      <NavMenu></NavMenu>
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Natjecanja</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {competitions.map((competition) => (
          <CompetitionCard key={competition.id} competition={competition} />
        ))}
      </div>
    </div>
  )
}


 
 