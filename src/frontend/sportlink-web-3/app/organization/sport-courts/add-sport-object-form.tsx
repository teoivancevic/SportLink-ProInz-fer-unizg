import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SportObject, WorkTime, SportCourt } from "./sportObjects"
import { Trash2Icon, PencilIcon } from 'lucide-react'
import { LocationInput } from '@/components/location-input' 

interface AddSportObjectFormProps {
  onClose: () => void;
  onSubmit: (newSportObject: Omit<SportObject, 'id'>) => void;
  initialData?: SportObject;
}

const allDaysOfWeek = ['Ponedjeljak', 'Utorak', 'Srijeda', 'Četvrtak', 'Petak', 'Subota', 'Nedjelja'];

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
  const [showSportCourtForm, setShowSportCourtForm] = useState(false)
  const [currentSportCourt, setCurrentSportCourt] = useState<Omit<SportCourt, 'id'>>({ name: '', maxHourlyPrice: 0, quantity: 1, sport: '' })
  const [editingSportCourtId, setEditingSportCourtId] = useState<number | null>(null);

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

  const handleWorkTimeChange = (index: number, field: keyof WorkTime, value: string) => {
    setFormData(prevData => {
      const newWorkTimes = [...prevData.workTimes]
      newWorkTimes[index] = { ...newWorkTimes[index], [field]: value }
      return { ...prevData, workTimes: newWorkTimes }
    })
  }

  const handleDeleteWorkTime = (index: number) => {
    setFormData(prevData => ({
      ...prevData,
      workTimes: prevData.workTimes.filter((_, i) => i !== index)
    }))
  }

  const handleSportCourtChange = (field: keyof Omit<SportCourt, 'id'>, value: string | number) => {
    setCurrentSportCourt(prev => ({ ...prev, [field]: field === 'maxHourlyPrice' || field === 'quantity' ? Number(value) : value }))
  }

  const handleEditSportCourt = (id: number) => {
    const sportCourtToEdit = formData.sportCourts.find(sc => sc.id === id);
    if (sportCourtToEdit) {
      setCurrentSportCourt({ ...sportCourtToEdit });
      setEditingSportCourtId(id);
      setShowSportCourtForm(true);
    }
  };

  const addSportCourt = () => {
    setFormData(prevData => {
      if (editingSportCourtId) {
        return {
          ...prevData,
          sportCourts: prevData.sportCourts.map(sc =>
            sc.id === editingSportCourtId ? { ...currentSportCourt, id: sc.id } : sc
          )
        };
      } else {
        return {
          ...prevData,
          sportCourts: [...prevData.sportCourts, { ...currentSportCourt, id: prevData.sportCourts.length + 1 }]
        };
      }
    });
    setCurrentSportCourt({ name: '', maxHourlyPrice: 0, quantity: 1, sport: '' });
    setShowSportCourtForm(false);
    setEditingSportCourtId(null);
  };

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

  const availableDays = allDaysOfWeek.filter(day => !formData.workTimes.some(wt => wt.day === day));

  return (
    <Card>
      <CardHeader>
        <CardTitle>{initialData ? 'Uredi sportski objekt' : 'Dodaj novi sportski objekt'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
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
              <div key={index} className="flex gap-2 mt-2 items-center">
                <select
                  value={wt.day}
                  onChange={(e) => handleWorkTimeChange(index, 'day', e.target.value)}
                  className="w-full border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {availableDays.concat(wt.day).map((day) => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
                <Input
                  type="time" 
                  value={wt.from}
                  onChange={(e) => handleWorkTimeChange(index, 'from', e.target.value)}
                  required
                />
                <Input
                  type="time" 
                  value={wt.to}
                  onChange={(e) => handleWorkTimeChange(index, 'to', e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteWorkTime(index)}
                >
                  <Trash2Icon className="h-4 w-4" />
                </Button>
              </div>
            ))}
            {availableDays.length > 0 && (
              <Button
                type="button"
                variant="default"
                size="sm"
                className="mt-2 bg-blue-500 hover:bg-blue-600 text-white"
                onClick={() => setFormData(prev => ({ 
                  ...prev, 
                  workTimes: [...prev.workTimes, { day: availableDays[0], from: '', to: '' }] 
                }))}
              >
                Dodaj radno vrijeme
              </Button>
            )}
          </div>
          
          <div>
            <div><Label>Sportski tereni</Label></div>
            {formData.sportCourts.map((sc) => (
              <div key={sc.id} className="flex flex-wrap justify-between items-start mt-2 gap-2">
                <span className="flex-grow max-w-[calc(100%-100px)] break-words">{sc.name} ({sc.quantity}x) - {sc.sport} (max {sc.maxHourlyPrice} €/h)</span>
                <div className="flex-shrink-0 ml-auto">
                  <Button type="button" variant="ghost" size="sm" onClick={() => handleEditSportCourt(sc.id)}>
                    <PencilIcon className="h-4 w-4" />
                  </Button>
                  <Button type="button" variant="ghost" size="sm" onClick={() => deleteSportCourt(sc.id)}>
                    <Trash2Icon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            {showSportCourtForm ? (
              <div className="grid grid-cols-1 gap-2 mt-2">
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
                <div>
                  <Label htmlFor="maxHourlyPrice">Max cijena €/h</Label>
                  <Input 
                    id="maxHourlyPrice"
                    type="number" 
                    value={currentSportCourt.maxHourlyPrice} 
                    onChange={(e) => handleSportCourtChange('maxHourlyPrice', e.target.value)} 
                  />
                </div>
                <div>
                  <Label htmlFor="quantity">Broj terena</Label>
                  <Input 
                    id="quantity"
                    type="number" 
                    value={currentSportCourt.quantity} 
                    onChange={(e) => handleSportCourtChange('quantity', e.target.value)} 
                  />
                </div>
                <Button type="button" onClick={addSportCourt}>
                  {editingSportCourtId ? 'Spremi promjene' : 'Dodaj sportski teren'}
                </Button>
              </div>
            ) : (
              <Button type="button" onClick={() => setShowSportCourtForm(true)} className="mt-2">
                Dodaj sportski teren
              </Button>
            )}
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>Odustani</Button>
            <Button type="submit">{initialData ? 'Spremi promjene' : 'Dodaj sportski objekt'}</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

