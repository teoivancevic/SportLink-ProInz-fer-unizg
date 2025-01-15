'use client'

import { useState } from 'react'
import NavMenu from "@/components/nav-org-profile"
import { sportObjects as initialSportObjects, SportObject, SportCourt } from "./sportObjects"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusIcon, XIcon, PencilIcon, Trash2Icon } from 'lucide-react'
import AddSportObjectForm from './add-sport-object-form'

export default function SportCourtsContent() {
  const [isAddingOrEditing, setIsAddingOrEditing] = useState(false)
  const [sportObjects, setSportObjects] = useState<SportObject[]>(initialSportObjects)
  const [editingSportObject, setEditingSportObject] = useState<SportObject | null>(null)

  const formatWorkTimes = (workTimes: SportObject['workTimes']) => {
    return workTimes.map((wt, index) => (
      <p key={index}>{wt.day}: {wt.from} - {wt.to}</p>
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

  const handleSubmit = (updatedSportObject: Omit<SportObject, 'id'>) => {
    if (editingSportObject) {
      setSportObjects(sportObjects.map(obj =>
        obj.id === editingSportObject.id ? { ...updatedSportObject, id: editingSportObject.id } : obj
      ))
    } else {
      const newId = Math.max(...sportObjects.map(obj => obj.id)) + 1
      setSportObjects([...sportObjects, { ...updatedSportObject, id: newId }])
    }
    toggleAddOrEdit()
  }

  return (
    <div className="container mx-auto p-4 space-y-4">
      <NavMenu />
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Sportski Objekti i Tereni</h1>
        <Button onClick={toggleAddOrEdit}>
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
      </div>
      {/* <p className="text-xl">Pregledajte naše sportske objekte, dostupne terene i njihove rasporede.</p> */}
      
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
                      <span>{court.name} ({court.quantity}x)</span>
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
                  <Button variant="outline" size="sm" onClick={() => handleEdit(object)} disabled = {isAddingOrEditing}>
                    <PencilIcon className="h-4 w-4 mr-2" />
                    Uredi
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(object.id)} disabled = {isAddingOrEditing}>
                    <Trash2Icon className="h-4 w-4 mr-2" />
                    Izbriši
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
        {isAddingOrEditing && (
          <>
            <div className="w-px bg-gray-200 self-stretch mx-2"></div>
            <div className="w-1/3">
              <AddSportObjectForm 
                onClose={toggleAddOrEdit} 
                onSubmit={handleSubmit}
                initialData={editingSportObject || undefined}
              />
            </div>
          </>
        )}
      </div>
    </div>
  )
}

