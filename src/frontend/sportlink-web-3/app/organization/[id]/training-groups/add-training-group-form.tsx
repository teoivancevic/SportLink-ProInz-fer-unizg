'use client'

import React from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrainingGroup } from "../../../../types/training-groups"
import { Trash2Icon } from 'lucide-react'

interface AddTrainingGroupProps {
  group?: TrainingGroup
  onSubmit: (group: TrainingGroup) => void
  onCancel: () => void
}

export function AddTrainingGroup({ group, onSubmit, onCancel }: AddTrainingGroupProps) {
  const [formData, setFormData] = React.useState<TrainingGroup>(
    group || {
      id: 0,
      name: '',
      ageFrom: 0,
      ageTo: 0,
      sex: 'Any',
      monthlyPrice: 0,
      description: '',
      sport: '',
      schedule: [{ day: 'Ponedjeljak', startTime: '', endTime: '' }]
    }
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleScheduleChange = (index: number, field: string, value: string) => {
    setFormData(prev => {
      const newSchedule = [...prev.schedule]
      newSchedule[index] = { ...newSchedule[index], [field]: value }
      return { ...prev, schedule: newSchedule }
    })
  }

  const handleDeleteSchedule = (index: number) => {
    setFormData(prev => ({
      ...prev,
      schedule: prev.schedule.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{group ? 'Edit Training Group' : 'Add New Training Group'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Ime grupe</Label>
            <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required />
          </div>
          <div>
            <Label htmlFor="sport">Sport</Label>
            <Input id="sport" name="sport" value={formData.sport} onChange={handleInputChange} required />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="ageFrom">Donja dobna granica</Label>
              <Input id="ageFrom" name="ageFrom" type="number" value={formData.ageFrom} onChange={handleInputChange} required />
            </div>
            <div className="flex-1">
              <Label htmlFor="ageTo">Gornja dobna granica</Label>
              <Input id="ageTo" name="ageTo" type="number" value={formData.ageTo} onChange={handleInputChange} required />
            </div>
          </div>
          <div>
            <Label htmlFor="sex">Spol</Label>
            <select
              id="sex"
              name="sex"
              value={formData.sex}
              onChange={handleInputChange}
              className="w-full border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              required
            >
              <option value="Any">Any</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
          <div>
            <Label htmlFor="monthlyPrice">Mjesečna cijena (€/mjesec)</Label>
            <Input id="monthlyPrice" name="monthlyPrice" type="number" value={formData.monthlyPrice} onChange={handleInputChange} required />
          </div>
          <div>
            <Label htmlFor="description">Opis</Label>
            <Textarea id="description" name="description" value={formData.description} onChange={handleInputChange} required />
          </div>
           <div><Label>Termini</Label></div>
            {formData.schedule.map((session, index) => (
              <div key={index} className="flex gap-2 mt-2 items-center">
                <select
                  value={session.day}
                  onChange={(e) => handleScheduleChange(index, 'day', e.target.value)}
                  className="w-full border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="Ponedjeljak">Ponedjeljak</option>
                  <option value="Utorak">Utorak</option>
                  <option value="Srijeda">Srijeda</option>
                  <option value="Četvrtak">Četvrtak</option>
                  <option value="Petak">Petak</option>
                  <option value="Subota">Subota</option>
                  <option value="Nedjelja">Nedjelja</option>
                </select>
                <Input
                  placeholder="Početak"
                  value={session.startTime}
                  type="time" 
                  onChange={(e) => handleScheduleChange(index, 'startTime', e.target.value)}
                  required
                />
                <Input
                  placeholder="Kraj"
                  value={session.endTime}
                  type="time" 
                  onChange={(e) => handleScheduleChange(index, 'endTime', e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteSchedule(index)}
                >
                  <Trash2Icon className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="default"
              size="sm"
              className="mt-2 bg-blue-500 hover:bg-blue-600 text-white"
              onClick={() => setFormData(prev => ({ ...prev, schedule: [...prev.schedule, { day: '', startTime: '', endTime: '' }] }))}
            >
              Dodaj termin
            </Button>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">{group ? 'Update' : 'Submit'}</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

