'use client'

import { useEffect, useState } from 'react'
import NavMenu from "@/components/nav-org-profile"
import { SportObject, SportCourt } from "../../../../types/sportObject"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusIcon, XIcon, PencilIcon, Trash2Icon } from 'lucide-react'
import AddSportObjectForm from './add-sport-object-form'
import { sportsObjectService } from '@/lib/services/api'
import { useToast } from "@/hooks/use-toast"
import AuthorizedElement from '@/components/auth/authorized-element'
import { UserRole } from '@/types/roles'
import { ResponseCookies } from 'next/dist/compiled/@edge-runtime/cookies'

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
  const [sportObjects, setSportObjects] = useState<SportObject[]>([]);
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
      console.log("fetch sports objects response:", response);
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
      <p key={index}>{allDaysOfWeek.get(wt.dayOfWeek)}: {wt.openFrom.slice(0, 5)} - {wt.openTo.slice(0, 5)}</p>
    ))
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

  const handleDelete = async (id: number) => {
    if (confirm("Jeste li sigurni da želite izbrisati taj sportski objekt?")) {
      try {
        // Call the API to delete the object
        await sportsObjectService.deleteSportObjectDetailed(id);
        
        // Update the UI
        setSportObjects(sportObjects.filter(obj => obj.id !== id));
        
        // Show success message
        toast({
          title: "Success",
          description: "Sportski objekt uspješno izbrisan",
        });
      } catch (error) {
        console.error('Error deleting sport object:', error);
        toast({
          title: "Error",
          description: "Došlo je do greške prilikom brisanja sportskog objekta",
          variant: "destructive",
        });
      }
    }
  }

  // In the handleSubmit function of SportCourtsContent:
  const handleSubmit = async (sportObjectData: Omit<SportObject, 'id'>) => {
    setIsLoading(true)
    try {
      
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
          openFrom: wt.openFrom,
          openTo: wt.openTo,
        })),
        sportCourts: sportObjectData.sportCourts.map(sc => ({
          ...sc,
          id: sc.id || 0
        }))
      }
  
      let response;
      if (editingSportObject) {
        console.log("update object:", formattedObject);
        response = await sportsObjectService.updateSportObjectDetailed(formattedObject)
        if (response) {
          toast({
            title: "Success",
            description: "Sportski objekt uspješno ažuriran",
          })
          setSportObjects(prev => prev.map(obj => 
            obj.id === editingSportObject.id ? formattedObject : obj
          ))
        }
      } else {
        response = await sportsObjectService.createSportObjectDetailed(formattedObject, params.id)
        if (response) {
          toast({
            title: "Success",
            description: "Sportski objekt uspješno dodan",
          })
          setSportObjects(prev => [...prev, formattedObject])
        }
      }
      
      toggleAddOrEdit() 
      await fetchSportObjects() 
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
              requireOrganizationEdit={false} 
              orgOwnerUserId={params.id.toString()}
            >
              {({ userData }) => (
               <>
               <Button
                  onClick={toggleAddOrEdit}
                  disabled={isLoading}
                  className="bg-[#228be6] hover:bg-[#1e7bbf] text-white"
                >
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
          {sportObjects.length === 0 ? (
            <p className="text-lg text-gray-500">Nema dostupnih sportskih terena unutar ove organizacije.</p>
          ) : (
            sportObjects.map((object) => (
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
                            <span>Tereni ({court.availableCourts}x)</span>
                            <div className="text-sm">
                              <span className="bg-gray-200 text-gray-800 px-2 py-1 rounded-full mr-2">
                                {court.sportName ? court.sportName : "placeholderSportName"}
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

                    <AuthorizedElement 
                        roles={[UserRole.OrganizationOwner, UserRole.AppAdmin]}
                        requireOrganizationEdit={false}
                        orgOwnerUserId={params.id.toString()}
                      >
                        {({ userData }) => (
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
                        )}
                  </AuthorizedElement>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
        <AuthorizedElement 
              roles={[UserRole.OrganizationOwner, UserRole.AppAdmin]}
              requireOrganizationEdit={false} 
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