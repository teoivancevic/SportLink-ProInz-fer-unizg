'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CalendarIcon, MapPinIcon, ActivityIcon, EuroIcon, PlusIcon, XIcon, PencilIcon, Trash2Icon } from 'lucide-react'
import AddTournamentForm from './add-tournament-form'
import NavMenu from '@/components/nav-org-profile'
import { Tournament } from "./tournament"

// Mock data for competitions
const initialCompetitions = [
  {
    id: 1,
    name: "Ljetni Plivački Maraton",
    description: "Godišnje natjecanje u plivanju na duge staze",
    timeFrom: "2023-07-15T09:00:00",
    timeTo: "2023-07-15T17:00:00",
    entryFee: "150",
    location: "Splitska riva",
    sport: "Plivanje"
  },
  {
    id: 2,
    name: "Planinski Biciklistički Izazov",
    description: "Ekstremna biciklistička utrka kroz planinske staze",
    timeFrom: "2023-08-20T07:00:00",
    timeTo: "2023-08-20T19:00:00",
    entryFee: "200",
    location: "Planina Velebit",
    sport: "Biciklizam"
  },
  {
    id: 3,
    name: "Gradski Maraton",
    description: "Tradicionalni godišnji maraton kroz grad",
    timeFrom: "2023-09-10T08:00:00",
    timeTo: "2023-09-10T14:00:00",
    entryFee: "100",
    location: "Centar grada",
    sport: "Trčanje"
  },
  {
    id: 4,
    name: "Odbojka na Pijesku",
    description: "Ljetni turnir u odbojci na pijesku",
    timeFrom: "2023-07-30T10:00:00",
    timeTo: "2023-07-31T18:00:00",
    entryFee: "250",
    location: "Gradska plaža",
    sport: "Odbojka"
  },
]

function CompetitionCard({ competition, onEdit, onDelete, popupOpened }: { competition: Tournament; onEdit: (tournament: Tournament) => void; onDelete: (id: number) => void, popupOpened : boolean }) {
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
              {new Date(competition.timeFrom).toLocaleString('hr-HR', { dateStyle: 'short', timeStyle: 'short' })} - {new Date(competition.timeTo).toLocaleString('hr-HR', { dateStyle: 'short', timeStyle: 'short' })}
            </span>
          </div>
          <div className="flex items-center">
            <MapPinIcon className="mr-2 h-4 w-4" />
            <span className="text-sm">{competition.location}</span>
          </div>
          <div className="flex items-center">
            <EuroIcon className="mr-2 h-4 w-4" />
            <span className="text-sm">{competition.entryFee}</span>
          </div>
          <div className="flex items-center">
            <ActivityIcon className="mr-2 h-4 w-4" />
            <span className="text-sm">{competition.sport}</span>
          </div>
        </div>
        <div className="flex justify-end space-x-2 mt-4">
        <Button variant="outline" size="sm" onClick={() => onEdit(competition)} disabled={popupOpened}>
            <PencilIcon className="h-4 w-4 mr-2" />
            Uredi
          </Button>
          <Button variant="outline" size="sm" onClick={() => {
            if (confirm(`Jeste li sigurni da želite izbrisati natjecanje "${competition.name}"?`)) {
              onDelete(competition.id)
            }
          }} disabled={popupOpened}>
            <Trash2Icon className="h-4 w-4 mr-2" />
            Izbriši
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default function NatjecanjaContent() {
  const [isAddingTournament, setIsAddingTournament] = useState(false)
  const [competitions, setCompetitions] = useState<Tournament[]>(initialCompetitions)
  const [editingTournament, setEditingTournament] = useState<Tournament | null>(null)

  const toggleAddTournament = () => {
    setIsAddingTournament(!isAddingTournament)
    setEditingTournament(null)
  }

  const handleEditTournament = (tournament: Tournament) => {
    setEditingTournament(tournament)
    setIsAddingTournament(true)
  }

  const handleDeleteTournament = (id: number) => {
    setCompetitions(competitions.filter(c => c.id !== id))
  }

  const addNewTournament = (newTournament: Omit<Tournament, 'id'>) => {
    if (editingTournament) {
      setCompetitions(competitions.map(c =>
        c.id === editingTournament.id ? { ...newTournament, id: editingTournament.id } : c
      ))
    } else {
      const newId = Math.max(...competitions.map(c => c.id)) + 1
      setCompetitions([...competitions, { ...newTournament, id: newId }])
    }
    toggleAddTournament()
  }

  return (
    <div className="container mx-auto p-4 space-y-4">
      <NavMenu/>
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Natjecanja</h1>
        <Button onClick={toggleAddTournament}>
          {isAddingTournament ? (
            <>
              <XIcon className="mr-2 h-4 w-4" />
              Zatvori
            </>
          ) : (
            <>
              <PlusIcon className="mr-2 h-4 w-4" />
              Dodaj natjecanje
            </>
          )}
        </Button>
      </div>
      <div className={`flex ${isAddingTournament ? 'space-x-4' : ''}`}>
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${isAddingTournament ? 'w-2/3' : 'w-full'}`}>
          {competitions.map((competition) => (
            <CompetitionCard 
              key={competition.id} 
              competition={competition} 
              onEdit={handleEditTournament}
              onDelete={handleDeleteTournament}
              popupOpened = {isAddingTournament}
            />
          ))}
        </div>
        {isAddingTournament && (
          <>
            <div className="w-px bg-gray-200 self-stretch mx-2"></div>
            <div className="w-1/2">
              <AddTournamentForm 
                onClose={toggleAddTournament} 
                onSubmit={addNewTournament}
                initialData={editingTournament || undefined}
              />
            </div>
          </>
        )}
      </div>
    </div>
  )
}

