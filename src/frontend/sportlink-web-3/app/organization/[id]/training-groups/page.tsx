'use client'

import * as React from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CalendarDays, Clock, Plus, PencilIcon, Trash2Icon } from 'lucide-react'
import { AddTrainingGroup } from './add-training-group-form'
import { TrainingGroup } from "../../../../types/training-groups"
import NavMenu from "@/components/nav-org-profile"

const initialTrainingGroups: TrainingGroup[] = [
  {
    id: 1,
    name: "Junior Soccer",
    ageFrom: 8,
    ageTo: 12,
    sex: 'Any',
    monthlyPrice: 100,
    description: "Introductory soccer training for kids",
    sport: "Soccer",
    schedule: [
      { day: "Monday", startTime: "16:00", endTime: "17:30" },
      { day: "Wednesday", startTime: "16:00", endTime: "17:30" },
    ]
  },
  {
    id: 2,
    name: "Teen Basketball",
    ageFrom: 13,
    ageTo: 17,
    sex: 'Any',
    monthlyPrice: 120,
    description: "Competitive basketball training for teenagers",
    sport: "Basketball",
    schedule: [
      { day: "Tuesday", startTime: "17:00", endTime: "19:00" },
      { day: "Thursday", startTime: "17:00", endTime: "19:00" },
      { day: "Saturday", startTime: "10:00", endTime: "12:00" },
    ]
  },
  {
    id: 3,
    name: "Women's Volleyball",
    ageFrom: 18,
    ageTo: 30,
    sex: 'Female',
    monthlyPrice: 80,
    description: "Recreational volleyball for adult women",
    sport: "Volleyball",
    schedule: [
      { day: "Monday", startTime: "19:00", endTime: "21:00" },
      { day: "Friday", startTime: "18:00", endTime: "20:00" },
    ]
  },
]

export default function TrainingGroups({ params }: { params: { id: number } }) {
  const [groups, setGroups] = React.useState<TrainingGroup[]>(initialTrainingGroups)
  const [showForm, setShowForm] = React.useState(false)
  const [editingGroup, setEditingGroup] = React.useState<TrainingGroup | undefined>(undefined)

  const handleSubmit = (group: TrainingGroup) => {
    if (editingGroup) {
      setGroups(prev => prev.map(g => g.id === group.id ? group : g))
    } else {
      setGroups(prev => [...prev, { ...group, id: prev.length + 1 }])
    }
    setShowForm(false)
    setEditingGroup(undefined)
  }

  const handleDelete = (id: number) => {
    if (window.confirm('Jesteli sigurni da želite izbrisati ovu grupu za trening?')) {
      setGroups(prev => prev.filter(group => group.id !== id))
    }
  }

  const handleEdit = (group: TrainingGroup) => {
    setEditingGroup(group)
    setShowForm(true)
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingGroup(undefined)
  }

  return (
    <div className="container mx-auto p-4 space-y-4">
      <NavMenu orgId={params.id}/>
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Grupe za trening</h1>
        <Button 
          onClick={() => setShowForm(true)} 
          disabled={showForm}
          className="bg-blue-500 hover:bg-blue-600 text-white"
        >
          <Plus className="mr-2 h-4 w-4" /> Dodaj grupu za trening
        </Button>
      </div>
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 flex-grow">
          {groups.map((group) => (
            <Card key={group.id} className="flex flex-col max-h-[400px] overflow-y-auto">
              <CardHeader>
                <CardTitle>{group.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{group.sport}</p>
              </CardHeader>
              <CardContent className="flex-grow overflow-y-auto">
                <p className="text-sm text-muted-foreground mb-2">{group.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="text-sm bg-gray-100 px-2 py-1 rounded">Dob: {group.ageFrom}-{group.ageTo}</span>
                  <span className="text-sm bg-gray-100 px-2 py-1 rounded">Spol: {group.sex}</span>
                  <span className="text-sm bg-gray-100 px-2 py-1 rounded">€{group.monthlyPrice}/mjesec</span>
                </div>
                <div className="space-y-2">
                  {group.schedule.map((session, index) => (
                    <div key={index} className="flex items-center text-sm">
                      <CalendarDays className="mr-2 h-4 w-4" />
                      <span className="mr-2">{session.day}:</span>
                      <Clock className="mr-2 h-4 w-4" />
                      <span>{session.startTime} - {session.endTime}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <div className="flex justify-end space-x-2 mt-4 w-full">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(group)} disabled={showForm}>
                    <PencilIcon className="h-4 w-4 mr-2" />
                    Uredi
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(group.id)} disabled={showForm}>
                    <Trash2Icon className="h-4 w-4 mr-2" />
                    Izbriši
                  </Button>
                </div>
              </CardFooter>
              
            </Card>
          ))}
        </div>
        {showForm && (
          <div className="w-full lg:w-1/3 lg:min-w-[300px]">
            <AddTrainingGroup
              group={editingGroup}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
            />
          </div>
        )}
      </div>
    </div>
  )
}
