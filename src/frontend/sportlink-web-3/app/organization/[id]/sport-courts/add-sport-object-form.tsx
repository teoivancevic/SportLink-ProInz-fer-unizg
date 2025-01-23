import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SportObject, WorkTime, SportCourt } from "../../../../types/sport-courtes"
import { Trash2Icon, PencilIcon, Check, ChevronDown } from 'lucide-react'
import { LocationInput } from '@/components/location-input' 
import { getSportsResponse, Sport } from '@/types/sport'
import { SportService } from '@/lib/services/api'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

interface AddSportObjectFormProps {
  onClose: () => void;
  onSubmit: (newSportObject: Omit<SportObject, 'id'>) => void;
  initialData?: SportObject;
  isLoading?: boolean;
}

const allDaysOfWeek: Record<number, string> = {
  1: 'Ponedjeljak',
  2: 'Utorak',
  3: 'Srijeda',
  4: 'Četvrtak',
  5: 'Petak',
  6: 'Subota',
  7: 'Nedjelja'
};

const formatTime = (time: string) => {
  const [hours, minutes] = time.split(':');
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

export default function AddSportObjectForm({ onClose, onSubmit, initialData, isLoading = false }: AddSportObjectFormProps) {
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
  const [currentSportCourt, setCurrentSportCourt] = useState<Omit<SportCourt, 'id'>>({ name: '', maxHourlyPrice: 0, availableCourts: 1, sportName: '' })
  const [editingSportCourtId, setEditingSportCourtId] = useState<number | null>(null);
  const [sports, setSports] = useState<Sport[]>([]);

  const fetchSports = async () => {
      try {
          const response: getSportsResponse = await SportService.getSports();
          console.log(response.data);
          setSports(response.data);
      } catch (error) {
          console.error('Error fetching sports:', error);
      }
  };

  useEffect(() => { fetchSports(); }, []);

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

  // In AddSportObjectForm, modify the handleWorkTimeChange function:
const handleWorkTimeChange = (index: number, field: keyof WorkTime, value: string | number) => {
  setFormData(prevData => {
    const newWorkTimes = [...prevData.workTimes]
    newWorkTimes[index] = { 
      ...newWorkTimes[index], 
      [field]: field === 'dayOfWeek' ? Number(value) : value 
    }
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
    setCurrentSportCourt(prev => ({ ...prev, [field]: field === 'maxHourlyPrice' || field === 'availableCourts' ? Number(value) : value }))
  }

  const handleSportSelection = (sportId: number) => {
    const selectedSport = sports.find(sport => sport.id === sportId)
    if (selectedSport) {
      setCurrentSportCourt(prev => ({
        ...prev,
        sportId: sportId,
        sportName: selectedSport.name
      }))
      console.log("FORM:", formData);
    }
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
    if (!currentSportCourt.sportId || !currentSportCourt.sportName) {
      alert('Molimo odaberite sport prije dodavanja sportskog terena');
      return;
    }

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
          sportCourts: [...prevData.sportCourts, { ...currentSportCourt, id: 0}]
        };
      }
    });
    setCurrentSportCourt({ name: '', maxHourlyPrice: 0, availableCourts: 1, sportName: '' });
    setShowSportCourtForm(false);
    setEditingSportCourtId(null);
  };

  const deleteSportCourt = (id: number) => {
    setFormData(prevData => ({
      ...prevData,
      sportCourts: prevData.sportCourts.filter(sc => sc.id !== id)
    }))
  }

  // const availableDays = Object.values(allDaysOfWeek).filter(day => !formData.workTimes.some(wt => wt.dayOfWeek === day));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isLoading) {
      onSubmit(formData)
    }
  }

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
      value={wt.dayOfWeek}
      onChange={(e) => handleWorkTimeChange(index, 'dayOfWeek', e.target.value)}
      className="w-full border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {Object.entries(allDaysOfWeek)
        .filter(([id, name]) => !formData.workTimes.some(wt => wt.dayOfWeek === Number(id)) || wt.dayOfWeek === Number(id))
        .map(([id, name]) => (
          <option key={id} value={id}>{name}</option>
        ))}
    </select>
    <Input
      type="time" 
      value={formatTime(wt.openFrom)}
      onChange={(e) => handleWorkTimeChange(index, 'openFrom', e.target.value)}
      required
    />
    <Input
      type="time" 
      value={formatTime(wt.openTo)}
      onChange={(e) => handleWorkTimeChange(index, 'openTo', e.target.value)}
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
{Object.keys(allDaysOfWeek).length > formData.workTimes.length && (
  <Button
    type="button"
    variant="default"
    size="sm"
    className="mt-2 bg-[#228be6] hover:bg-[#1e7bbf] text-white"
    onClick={() => {
      const availableId = Object.keys(allDaysOfWeek).find(
        id => !formData.workTimes.some(wt => wt.dayOfWeek === Number(id))
      ) || '1';
      setFormData(prev => ({ 
        ...prev, 
        workTimes: [...prev.workTimes, { dayOfWeek: Number(availableId), openFrom: '', openTo: '' }] 
      }))
    }}
  >
    Dodaj radno vrijeme
  </Button>
)}
          </div>
          
          <div>
            <div><Label>Sportski tereni</Label></div>
            {formData.sportCourts.map((sc) => (
              <div key={sc.id} className="flex flex-wrap justify-between items-start mt-2 gap-2">
                <span className="flex-grow max-w-[calc(100%-100px)] break-words">{sc.name} ({sc.availableCourts}x) - {sc.sportName} (max {sc.maxHourlyPrice} €/h)</span>
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
                  required
                />
                <div>
                  <Label htmlFor="sport">Sport</Label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="w-full justify-between">
                        {currentSportCourt.sportName || "Odaberite sport"}
                        <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                      {sports.map((sport) => (
                        <DropdownMenuItem
                          key={sport.id}
                          onSelect={() => handleSportSelection(sport.id)}
                        >
                          {sport.name}
                          {sport.id === currentSportCourt.sportId && <Check className="ml-auto h-4 w-4" />}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div>
                  <Label htmlFor="maxHourlyPrice">Max cijena €/h</Label>
                  <Input 
                    id="maxHourlyPrice"
                    type="number" 
                    value={currentSportCourt.maxHourlyPrice} 
                    onChange={(e) => handleSportCourtChange('maxHourlyPrice', e.target.value)} 
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="quantity">Broj terena</Label>
                  <Input 
                    id="quantity"
                    type="number" 
                    value={currentSportCourt.availableCourts} 
                    onChange={(e) => handleSportCourtChange('availableCourts', e.target.value)} 
                    required
                  />
                </div>
                <Button type="button" onClick={addSportCourt}>
                  {editingSportCourtId ? 'Spremi promjene' : 'Dodaj sportski teren'}
                </Button>
              </div>
            ) : (
              <Button type="button" onClick={() => setShowSportCourtForm(true)} className="mt-2 bg-[#228be6] hover:bg-[#1e7bbf] text-white">
                Dodaj sportski teren
              </Button>
            )}
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Odustani
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-[#228be6] hover:bg-[#1e7bbf] text-white">
              {isLoading ? 'Spremanje...' : (initialData ? 'Spremi promjene' : 'Dodaj sportski objekt')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}