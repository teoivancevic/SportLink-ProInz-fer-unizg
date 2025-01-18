'use client'

import { useState } from 'react'
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

export default function SportCourtsContent({ params }: { params: { id: number } }) {
  const [isAddingOrEditing, setIsAddingOrEditing] = useState(false)
  const [sportObjects, setSportObjects] = useState<SportObject[]>(initialSportObjects)
  const [editingSportObject, setEditingSportObject] = useState<SportObject | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const formatWorkTimes = (workTimes: SportObject['workTimes']) => {
    return workTimes.map((wt, index) => (
      <p key={index}>{wt.dayOfWeek}: {wt.openFrom} - {wt.openTo}</p>
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

  const handleDelete = (id: number) => {
    if (confirm("Jeste li sigurni da želite izbrisati taj sportski objekt?")) {
      setSportObjects(sportObjects.filter(obj => obj.id !== id))
    }
  }

  // In the handleSubmit function of SportCourtsContent:
const handleSubmit = async (sportObjectData: Omit<SportObject, 'id'>) => {
  setIsLoading(true)
  try {
    if (!editingSportObject) {
      // Format the data according to the API requirements
      const formattedObject: SportObject = {
        ...sportObjectData,
        id: 0, // API expects 0 for new objects
        workTimes: sportObjectData.workTimes.map(wt => ({
          id: 0, // API expects 0 for new workTimes
          dayOfWeek: Number(wt.dayOfWeek), // Convert to number
          isWorking: true, // Add required field
          openFrom: wt.openFrom,
          openTo: wt.openTo
        })),
        sportCourts: sportObjectData.sportCourts.map(sc => ({
          ...sc,
          id: 0 // API expects 0 for new sportCourts
        }))
      }

      console.log('Sending formatted object:', formattedObject);
      const response = await sportsObjectService.createSportObjectDetailed(formattedObject, params.id)
      
      if (response) {
        toast({
          title: "Success",
          description: "Sportski objekt uspješno dodan",
        })
        setSportObjects(prev => [...prev, formattedObject])
        toggleAddOrEdit()
      }
    } else {
      // Handle editing case later
      setSportObjects(sportObjects.map(obj =>
        obj.id === editingSportObject.id ? { ...sportObjectData, id: editingSportObject.id } : obj
      ))
      toggleAddOrEdit()
    }
  } catch (error) {
    console.error('Error creating sport object:', error)
    toast({
      title: "Error",
      description: "Došlo je do greške prilikom dodavanja sportskog objekta",
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