import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { SportObject, WorkTime, SportCourt } from "./sportObjects"
import { Trash2Icon } from 'lucide-react'
import { LocationInput } from '@/components/location-input' 

interface AddSportObjectFormProps {
  onClose: () => void;
  onSubmit: (newSportObject: Omit<SportObject, 'id'>) => void;
  initialData?: SportObject;
}

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function AddSportObjectForm({ onClose, onSubmit, initialData }: AddSportObjectFormProps) {
  const [formData, setFormData] = useState<Omit<SportObject, 'id'>>(
    initialData || {
      name: '',
      description: '',
      location: '',
      workTimes: [],
      sportCourts: [],
    }
  )
  const [showWorkTimeForm, setShowWorkTimeForm] = useState(false)
  const [showSportCourtForm, setShowSportCourtForm] = useState(false)
  const [currentWorkTime, setCurrentWorkTime] = useState<WorkTime>({ day: 'Monday', from: '', to: '' })
  const [currentSportCourt, setCurrentSportCourt] = useState<Omit<SportCourt, 'id'>>({ name: '', maxHourlyPrice: 0, quantity: 1, sport: '' })

  useEffect(() => {
    if (initialData) {
      setFormData(initialData)
    }
  }, [initialData])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prevData => ({ ...prevData, [name]: value }))
  }

  const handleLocationChange = (value: string) => {
    setFormData(prevData => ({ ...prevData, location: value }))  
  }   

  const handleWorkTimeChange = (field: keyof WorkTime, value: string) => {
    setCurrentWorkTime(prev => ({ ...prev, [field]: value }))
  }

  const handleSportCourtChange = (field: keyof Omit<SportCourt, 'id'>, value: string | number) => {
    setCurrentSportCourt(prev => ({ ...prev, [field]: field === 'maxHourlyPrice' || field === 'quantity' ? Number(value) : value }))
  }

  const addWorkTime = () => {
    setFormData(prevData => ({
      ...prevData,
      workTimes: [...prevData.workTimes, currentWorkTime]
    }))
    setCurrentWorkTime({ day: 'Monday', from: '', to: '' })
    setShowWorkTimeForm(false)
  }

  const addSportCourt = () => {
    setFormData(prevData => ({
      ...prevData,
      sportCourts: [...prevData.sportCourts, { ...currentSportCourt, id: prevData.sportCourts.length + 1 }]
    }))
    setCurrentSportCourt({ name: '', maxHourlyPrice: 0, quantity: 1, sport: '' })
    setShowSportCourtForm(false)
  }

  const deleteWorkTime = (index: number) => {
    setFormData(prevData => ({
      ...prevData,
      workTimes: prevData.workTimes.filter((_, i) => i !== index)
    }))
  }

  const deleteSportCourt = (id: number) => {
    setFormData(prevData => ({
      ...prevData,
      sportCourts: prevData.sportCourts.filter(sc => sc.id !== id)
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-card p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">{initialData ? 'Uredi sportski objekt' : 'Dodaj novi sportski objekt'}</h2>
      
      <div>
        <Label htmlFor="name">Ime</Label>
        <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
      </div>
      
      <div>
        <Label htmlFor="description">Opis</Label>
        <Textarea id="description" name="description" value={formData.description} onChange={handleChange} required />
      </div>
      
      <div>
        <LocationInput
            value={formData.location}
            onChange={handleLocationChange}
        />
      </div>
      
      <div>
        <div><Label>Radno vrijeme</Label></div>
        {formData.workTimes.map((wt, index) => (
          <div key={index} className="flex justify-between items-center mt-2">
            <span>{wt.day}: {wt.from} - {wt.to}</span>
            <Button type="button" variant="ghost" size="sm" onClick={() => deleteWorkTime(index)}>
              <Trash2Icon className="h-4 w-4" />
            </Button>
          </div>
        ))}
        {showWorkTimeForm ? (
          <div className="flex space-x-2 mt-2">
            <select
              value={currentWorkTime.day}
              onChange={(e) => handleWorkTimeChange('day', e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {daysOfWeek.map((day) => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>
            <Input 
              type="time" 
              value={currentWorkTime.from} 
              onChange={(e) => handleWorkTimeChange('from', e.target.value)} 
            />
            <Input 
              type="time" 
              value={currentWorkTime.to} 
              onChange={(e) => handleWorkTimeChange('to', e.target.value)} 
            />
            <Button type="button" onClick={addWorkTime}>Dodaj</Button>
          </div>
        ) : (
          <Button type="button" onClick={() => setShowWorkTimeForm(true)} className="mt-2">Dodaj radno vrijeme</Button>
        )}
      </div>
      
      <div>
        <div><Label>Sportski tereni</Label></div>
        {formData.sportCourts.map((sc) => (
          <div key={sc.id} className="flex justify-between items-center mt-2">
            <span>{sc.name} ({sc.quantity}x) - {sc.sport} (max {sc.maxHourlyPrice} €/h)</span>
            <Button type="button" variant="ghost" size="sm" onClick={() => deleteSportCourt(sc.id)}>
              <Trash2Icon className="h-4 w-4" />
            </Button>
          </div>
        ))}
        {showSportCourtForm ? (
          <div className="grid grid-cols-2 gap-2 mt-2">
            <Input 
              placeholder="Ime terena"
              value={currentSportCourt.name} 
              onChange={(e) => handleSportCourtChange('name', e.target.value)} 
            />
            <Input 
              placeholder="Sport"
              value={currentSportCourt.sport} 
              onChange={(e) => handleSportCourtChange('sport', e.target.value)} 
            />
            <Input 
              type="number" 
              placeholder="Max cijena/h"
              value={currentSportCourt.maxHourlyPrice} 
              onChange={(e) => handleSportCourtChange('maxHourlyPrice', e.target.value)} 
            />
            <Input 
              type="number" 
              placeholder="Količina"
              value={currentSportCourt.quantity} 
              onChange={(e) => handleSportCourtChange('quantity', e.target.value)} 
            />
            <Button type="button" onClick={addSportCourt} className="col-span-2">Dodaj sportski teren</Button>
          </div>
        ) : (
          <Button type="button" onClick={() => setShowSportCourtForm(true)} className="mt-2">Dodaj sportski teren</Button>
        )}
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onClose}>Odustani</Button>
        <Button type="submit">{initialData ? 'Spremi promjene' : 'Dodaj sportski objekt'}</Button>
      </div>
    </form>
  )
}

