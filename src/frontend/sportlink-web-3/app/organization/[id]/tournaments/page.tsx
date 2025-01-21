'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CalendarIcon, MapPinIcon, ActivityIcon, EuroIcon, PlusIcon, XIcon, PencilIcon, Trash2Icon } from 'lucide-react'
import AddTournamentForm from './add-tournament-form'
import NavMenu from '@/components/nav-org-profile'
import { getTournamentsResponse, Tournament} from "@/types/tournaments"
import { tournamentService } from '@/lib/services/api'
import AuthorizedElement from '@/components/auth/authorized-element'
import { UserRole } from '@/types/roles'

// Mock data for competitions
const initialCompetitions: Tournament[] = [];

function CompetitionCard({ orgId, competition, onEdit, onDelete, popupOpened }: { orgId: number; competition: Tournament; onEdit: (tournament: Tournament) => void; onDelete: (id: number) => void, popupOpened : boolean }) {
  return (
    <Card className="max-h-[320px] min-w-[200px]">
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

        <AuthorizedElement 
            roles={[UserRole.OrganizationOwner, UserRole.AppAdmin]}
            requireOrganizationEdit = {false}
            orgOwnerUserId={orgId.toString()}
          >
            {(userData) => (
              <>
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
              </>

            )}
          </AuthorizedElement>


        </div>
      </CardContent>
    </Card>
  )
}

export default function NatjecanjaContent({ params }: { params: { id: number } }) {
  const [isAddingTournament, setIsAddingTournament] = useState(false)
  const [competitions, setCompetitions] = useState<Tournament[]>(initialCompetitions)
  const [editingTournament, setEditingTournament] = useState<Tournament | null>(null)  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchTournaments = async () => {
      try {
        const response: getTournamentsResponse = await tournamentService.getTournaments(params.id)
        console.log(response);
        setCompetitions(response.data)
      } catch (error) {
        console.error('Error fetching tournaments:', error)
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

  const handleDeleteTournament = async (id: number) => {
    try {
      const response: boolean = await tournamentService.deleteTournament(id);
      if (response) {
        setCompetitions((prevCompetitions) => prevCompetitions.filter((comp) => comp.id !== id));
      } else {
        console.error('Failed to delete the tournament.');
      }
    } catch (error) {
      console.error('Error deleting tournament:', error);
    }
  };

  const addNewTournament = async (newTournament: Tournament) => {
    setIsSubmitting(true); 
    if (editingTournament) {
      try {
        const response: boolean = await tournamentService.updateTournament(newTournament, newTournament.id);
        console.log(response);
        const tournaments: getTournamentsResponse = await tournamentService.getTournaments(params.id)
        console.log(tournaments)
        setCompetitions(tournaments.data)
      } catch (error){
        console.error('Error adding new tournament:', error)
        console.log('Adding failed')
      }
    } else {
      try {
        newTournament.organizationId = Number(params.id);
        const response: boolean = await tournamentService.createTournament(newTournament, params.id);
        console.log(response);
        const tournaments: getTournamentsResponse = await tournamentService.getTournaments(params.id)
        console.log(tournaments)
        setCompetitions(tournaments.data)
      } catch (error){
        console.error('Error adding new tournament:', error)
        console.log('Adding failed')
      }
    }
    toggleAddTournament()
    setIsSubmitting(false); 
  }

  return (
    <div className="container mx-auto p-4 space-y-4">
      <NavMenu orgId={params.id}/>
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Natjecanja</h1>

        <AuthorizedElement 
            roles={[UserRole.OrganizationOwner, UserRole.AppAdmin]}
            requireOrganizationEdit = {false}
            orgOwnerUserId={params.id.toString()}
          >
            {(userData) => (
              <Button onClick={toggleAddTournament} className="bg-[#228be6] hover:bg-[#1e7bbf] text-white">
              {isAddingTournament ? (
                <><XIcon className="mr-2 h-4 w-4" />Zatvori</>) 
                : (<><PlusIcon className="mr-2 h-4 w-4" /> Dodaj natjecanje</>)}
              </Button>
            )}
          </AuthorizedElement>

      </div>
      <div className={`flex ${isAddingTournament ? 'space-x-4' : ''}`}>
      <div className={`flex flex-wrap gap-6 ${isAddingTournament ? 'w-2/3' : 'w-full'}`}>
          {competitions.map((competition) => (
            <CompetitionCard 
              key={competition.id} 
              orgId={params.id}
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
                loading={isSubmitting} 
              />
            </div>
          </>
        )}
      </div>
    </div>
  )
}

