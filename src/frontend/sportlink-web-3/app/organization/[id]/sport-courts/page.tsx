'use client'

import { useEffect, useState } from 'react'
import NavMenu from "@/components/nav-org-profile"
import { sportObjectsMOCK as initialSportObjects, SportObject, SportCourt } from "../../../../types/sport-courtes"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusIcon, XIcon, PencilIcon, Trash2Icon } from 'lucide-react'
import AddSportObjectForm from './add-sport-object-form'
import { sportsObjectService } from '@/lib/services/api'
import { useToast } from "@/hooks/use-toast"
import AuthorizedElement from '@/components/auth/authorized-element'
import { UserRole } from '@/types/roles'

const allDaysOfWeek = new Map<number, string>([
  [1, 'Ponedjeljak'],
  [2, 'Utorak'],
  [3, 'Srijeda'],
  [4, 'Četvrtak'],
  [5, 'Petak'],
  [6, 'Subota'],
  [7, 'Nedjelja']
]);

export default function SportCourtsContent({ params }: { params: { id: number } }) {
  const [isAddingOrEditing, setIsAddingOrEditing] = useState(false)
  // const [sportObjects, setSportObjects] = useState<SportObject[]>(initialSportObjects)
  const [sportObjects, setSportObjects] = useState<SportObject[]>([])
  const [editingSportObject, setEditingSportObject] = useState<SportObject | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const { toast } = useToast()

  

  useEffect(() => {
    fetchSportObjects()
  }, [params.id])

  const fetchSportObjects = async () => {
    setIsFetching(true)
    //setError(null)

    // const response = await sportsObjectService.getSportObjectDetailedById(params.id)
    // console.log(response);
    try {
      const response = await sportsObjectService.getSportObjectDetailedById(params.id)
      setSportObjects(response.data)
    } catch (error) {
      console.error('Error fetching sport objects:', error)
      //setError('Failed to load sport objects')
      toast({
        title: "Error",
        description: "Failed to load sport objects",
        variant: "destructive",
      })
    } finally {
      setIsFetching(false)
    }
  }


  const formatWorkTimes = (workTimes: SportObject['workTimes']) => {
    return workTimes.map((wt, index) => (
      <p key={index}>{allDaysOfWeek.get(wt.dayOfWeek)}: {formatTime(wt.openFrom)} - {formatTime(wt.openTo)}</p>
    ))
  }

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  }

  const formatPriceRange = (court: SportCourt) => {
    return `Maks cijena ${court.maxHourlyPrice} €/h`
  }

  const toggleAddOrEdit = () => {
    setIsAddingOrEditing(!isAddingOrEditing)
    setEditingSportObject(null)
  }

  const handleEdit = (sportObject: SportObject) => {
    setEditingSportObject(sportObject)
    setIsAddingOrEditing(true)
  }

  const handleDelete = (id: number) => {
    if (confirm("Jeste li sigurni da želite izbrisati taj sportski objekt?")) {
      setSportObjects(sportObjects.filter(obj => obj.id !== id))
    }
  }

  // In the handleSubmit function of SportCourtsContent:
  const handleSubmit = async (sportObjectData: Omit<SportObject, 'id'>) => {
    setIsLoading(true)
    try {
      // Format the data according to the API requirements
      const formatTimeForApi = (time: string) => {
        // If the time already includes seconds/milliseconds, return as is
        if (time.includes('.')) return time;
        // If the time already has seconds but no milliseconds, add them
        if (time.includes(':00')) return `${time}.0000000`;
        // Otherwise, add both seconds and milliseconds
        return `${time}:00.0000000`;
      }
      
      const formattedObject: SportObject = {
        ...sportObjectData,
        id: editingSportObject?.id || 0,
        organizationId: params.id,
        workTimes: sportObjectData.workTimes.map(wt => ({
          ...wt,
          id: wt.id || 0,
          dayOfWeek: Number(wt.dayOfWeek),
          isWorking: true,
          sportsObjectId: editingSportObject?.id || 0,
          openFrom: formatTimeForApi(wt.openFrom),
          openTo: formatTimeForApi(wt.openTo)
        })),
        sportCourts: sportObjectData.sportCourts.map(sc => ({
          ...sc,
          id: sc.id || 0
        }))
      }
  
      let response;
      if (editingSportObject) {
        // Update existing sport object
        console.log("update object:", formattedObject);
        response = await sportsObjectService.updateSportObjectDetailed(formattedObject, params.id)
        if (response) {
          toast({
            title: "Success",
            description: "Sportski objekt uspješno ažuriran",
          })
          // Update the local state by replacing the edited object
          setSportObjects(prev => prev.map(obj => 
            obj.id === editingSportObject.id ? formattedObject : obj
          ))
        }
      } else {
        // Create new sport object
        response = await sportsObjectService.createSportObjectDetailed(formattedObject, params.id)
        if (response) {
          toast({
            title: "Success",
            description: "Sportski objekt uspješno dodan",
          })
          setSportObjects(prev => [...prev, formattedObject])
        }
      }
      
      toggleAddOrEdit() // Close the form
      await fetchSportObjects() // Refresh the list to get updated data from server
    } catch (error) {
      console.error('Error saving sport object:', error)
      toast({
        title: "Error",
        description: `Došlo je do greške prilikom ${editingSportObject ? 'ažuriranja' : 'dodavanja'} sportskog objekta`,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-4 space-y-4">
      <NavMenu orgId={params.id}/>
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Sportski Objekti i Tereni</h1>
        <AuthorizedElement 
              roles={[UserRole.OrganizationOwner, UserRole.AppAdmin]}
              requireOrganizationEdit={false} // teo: wtf tu false a na org profile page stranici je true???
              orgOwnerUserId={params.id.toString()}
            >
              {({ userData }) => (
               <>
               {/* <p>{params.id}</p> */}
              <Button onClick={toggleAddOrEdit} disabled={isLoading}>
                {isAddingOrEditing ? (
                  <>
                    <XIcon className="mr-2 h-4 w-4" />
                    Zatvori
                  </>
                ) : (
                  <>
                    <PlusIcon className="mr-2 h-4 w-4" />
                    Dodaj sportski objekt
                  </>
                )}
              </Button>
              </> 
              )}
        </AuthorizedElement>
      </div>
      
      <div className={`flex ${isAddingOrEditing ? 'space-x-4' : ''}`}>
        <div className={`flex flex-wrap gap-6 ${isAddingOrEditing ? 'w-2/3' : 'w-full'}`}>
          {sportObjects.map((object) => (
            <Card key={object.id} className="flex flex-col min-w-[550px] max-w-[750px]">
              <CardHeader>
                <CardTitle>{object.name}</CardTitle>
                <CardDescription>{object.location}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4">{object.description}</p>
                <div className="mt-2 text-sm">
                  {formatWorkTimes(object.workTimes)}
                </div>
              </CardContent>
              
              
              
              
              <CardFooter className="flex-col items-start">
                {object.sportCourts.length > 0 ? (
                  <>
                    <h3 className="font-semibold mb-2">Dostupni tereni:</h3>
                    <ul className="space-y-2 w-full">
                      {object.sportCourts.map((court) => (
                        <li key={court.id} className="flex justify-between items-center">
                          <span>{court.name} ({court.availableCourts}x)</span>
                          <div className="text-sm">
                            <span className="bg-gray-200 text-gray-800 px-2 py-1 rounded-full mr-2">
                              {court.sport}
                            </span>
                            <span className="border border-gray-300 text-gray-600 px-2 py-1 rounded-full">
                              {formatPriceRange(court)}
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : null}
                
                <div className="flex justify-end space-x-2 mt-4 w-full">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleEdit(object)} 
                    disabled={isLoading || isAddingOrEditing}
                  >
                    <PencilIcon className="h-4 w-4 mr-2" />
                    Uredi
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleDelete(object.id)} 
                    disabled={isLoading || isAddingOrEditing}
                  >
                    <Trash2Icon className="h-4 w-4 mr-2" />
                    Izbriši
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
        <AuthorizedElement 
              roles={[UserRole.OrganizationOwner, UserRole.AppAdmin]}
              requireOrganizationEdit={false} // teo: wtf tu false a na org profile page stranici je true???
              orgOwnerUserId={params.id.toString()}
            >
              {({ userData }) => (
                <>
        {isAddingOrEditing && (
          <>
            <div className="w-px bg-gray-200 self-stretch mx-2"></div>
            <div className="w-1/3">
              <AddSportObjectForm 
                onClose={toggleAddOrEdit} 
                onSubmit={handleSubmit}
                initialData={editingSportObject || undefined}
                isLoading={isLoading}
              />
            </div>
          </>
        )}
        </>

      )}
      </AuthorizedElement>
      </div>
    </div>
  )
}