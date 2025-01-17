'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CalendarIcon, MapPinIcon, ActivityIcon, EuroIcon, PlusIcon, XIcon, PencilIcon, Trash2Icon } from 'lucide-react'
import AddTournamentForm from './add-tournament-form'
import NavMenu from '@/components/nav-org-profile'
import { getTournamentsResponse, Tournament } from "@/types/tournaments"
import { tournamentService } from '@/lib/services/api'

// Mock data for competitions
const initialCompetitions: Tournament[] = [];

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
            <span className="text-sm">{competition.sportName}</span>
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

export default function NatjecanjaContent({ params }: { params: { id: number } }) {
  const [isAddingTournament, setIsAddingTournament] = useState(false)
  const [competitions, setCompetitions] = useState<Tournament[]>(initialCompetitions)
  const [editingTournament, setEditingTournament] = useState<Tournament | null>(null)  
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTournaments = async () => {
        try {
          setIsLoading(true)
          setError(null)
          const response: getTournamentsResponse = await tournamentService.getTournaments(params.id)
          console.log(response);
          setCompetitions(response.data)
        } catch (error) {
          console.error('Error fetching tournaments:', error)
          setError('Došlo je do greške prilikom učitavanja tournamenta.')
        } finally {
          setIsLoading(false)
        }
    }
    useEffect(() => { fetchTournaments() }, [])

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
      <NavMenu orgId={params.id}/>
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

