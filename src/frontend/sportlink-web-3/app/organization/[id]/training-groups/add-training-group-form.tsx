'use client'

import React, { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrainingGroup } from "@/types/training-groups"
import { Trash2Icon } from 'lucide-react'
import { SportService } from '@/lib/services/api'
import { getSportsResponse, Sport } from '@/types/sport'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Check, ChevronDown } from 'lucide-react'

interface AddTrainingGroupProps {
  group?: TrainingGroup
  onSubmit: (group: TrainingGroup) => void
  onCancel: () => void
  loading: boolean
}

const dayOfWeekMapping: Record<string, number> = {
  Ponedjeljak: 1,
  Utorak: 2,
  Srijeda: 3,
  Četvrtak: 4,
  Petak: 5,
  Subota: 6,
  Nedjelja: 7,
};

export const reverseDayOfWeekMapping: Record<number, string> = {
  1: "Ponedjeljak",
  2: "Utorak",
  3: "Srijeda",
  4: "Četvrtak",
  5: "Petak",
  6: "Subota",
  7: "Nedjelja",
};

export function AddTrainingGroup({ loading, group, onSubmit, onCancel }: AddTrainingGroupProps) {
  const [sports, setSports] = useState<Sport[]>([]);

  const fetchSports = async () => {
      try {
          const response: getSportsResponse = await SportService.getSports();
          setSports(response.data);
      } catch (error) {
          console.error('Error fetching sports:', error);
      }
  };

  useEffect(() => { fetchSports(); }, []);

  const [formData, setFormData] = React.useState<TrainingGroup>(
    group || {
      id: 0,
      name: "",
      ageFrom: 0,
      ageTo: 0,
      sex: 'Unisex',
      monthlyPrice: 0,
      description: '',
      organizationId: 0,
      sportId: 0,
      sportName: "",
      trainingSchedules: []
    }
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSportChange = (sportId: number) => {
    const selectedSport = sports.find(sport => sport.id === sportId);
    if (selectedSport) {
        setFormData(prevData => ({
            ...prevData,
            sportId: selectedSport.id,
            sportName: selectedSport.name,
        }));
    }
  };

  
  const handleDeleteSchedule = (index: number) => {
    setFormData(prev => ({
      ...prev,
      trainingSchedules: prev.trainingSchedules.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    if (!formData.sportId) {
      alert("Molimo odaberite sport prije dodavanja grupe za trening");
      return;
  }

    e.preventDefault()
    onSubmit(formData)
  }
  
  const handleScheduleChange = (index: number, field: string, value: string) => {
    setFormData((prev) => {
      const newSchedule = [...prev.trainingSchedules];
      if (field === "dayOfWeek") {
        newSchedule[index] = { ...newSchedule[index], [field]: dayOfWeekMapping[value] };
      } else {
        newSchedule[index] = { ...newSchedule[index], [field]: value };
      }
      return { ...prev, trainingSchedules: newSchedule };
    });
  };
  
  const getDayOfWeekOptionValue = (dayOfWeek: number) => {
    return reverseDayOfWeekMapping[dayOfWeek] || "";
  };

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
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full justify-between">
                        {formData.sportName || "Odaberite sport"}
                        <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                    {sports.map((sport) => (
                        <DropdownMenuItem
                            key={sport.id}
                            onSelect={() => handleSportChange(sport.id)}
                        >
                            {sport.name}
                            {sport.id === formData.sportId && <Check className="ml-auto h-4 w-4" />}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
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
              <option value="Unisex">Unisex</option>
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
            {formData.trainingSchedules.map((session, index) => (
              <div key={index} className="flex gap-2 mt-2 items-center">
                <select
                  value={getDayOfWeekOptionValue(session.dayOfWeek)}
                  onChange={(e) => handleScheduleChange(index, "dayOfWeek", e.target.value)}
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
                  value={session.startTime.slice(0, 5)}
                  type="time" 
                  onChange={(e) => handleScheduleChange(index, 'startTime', e.target.value)}
                  required
                />
                <Input
                  placeholder="Kraj"
                  value={session.endTime.slice(0, 5)}
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
              className="mt-2 bg-[#228be6] hover:bg-[#1c7ed6] text-white"
              onClick={() => setFormData(prev => ({ ...prev, trainingSchedules: [...prev.trainingSchedules, { id: 0, dayOfWeek: 1, startTime: '', endTime: '', trainingGroupId: 0}] }))}
            >
              Dodaj termin
            </Button>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className={`${loading ? 'bg-gray-400' : 'bg-[#228be6] hover:bg-[#1c7ed6]'} text-white`}
            >
              {loading ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

