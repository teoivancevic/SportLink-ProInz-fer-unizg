import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tournament } from "./tournament"
import { LocationInput } from '@/components/location-input'

interface AddTournamentFormProps {
    onClose: () => void;
    onSubmit: (newTournament: Omit<Tournament, 'id'>) => void;
    initialData?: Tournament;
  }

export default function AddTournamentForm({ onClose, onSubmit, initialData }: AddTournamentFormProps) {
    const [formData, setFormData] = useState<Omit<Tournament, 'id'>>(
    initialData || {
        name: '',
        description: '',
        timeFrom: '',
        timeTo: '',
        entryFee: '',
        location: '',
        sport: '',
    }
    )

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prevData => ({ ...prevData, [name]: value }))
    }

    const handleLocationChange = (value: string) => {
        setFormData(prevData => ({ ...prevData, location: value }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit(formData)
    }

    return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-card p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">{initialData ? 'Uredi' : 'Dodaj novo'}</h2>
        
        <div>
        <Label htmlFor="name">Ime</Label>
        <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        
        <div>
        <Label htmlFor="description">Opis</Label>
        <Textarea id="description" name="description" value={formData.description} onChange={handleChange} required />
        </div>
        
        <div>
        <Label htmlFor="timeFrom">Početak natjecanja</Label>
        <Input id="timeFrom" name="timeFrom" type="datetime-local" value={formData.timeFrom} onChange={handleChange} required />
        </div>
        
        <div>
        <Label htmlFor="timeTo">Završetak natjecanja</Label>
        <Input id="timeTo" name="timeTo" type="datetime-local" value={formData.timeTo} onChange={handleChange} required />
        </div>
        
        <div>
        <Label htmlFor="entryFee">Kotizacija (€)</Label>
        <Input id="entryFee" name="entryFee" value={formData.entryFee} onChange={handleChange} required />
        </div>
        
        <div>
        <LocationInput
            value={formData.location}
            onChange={handleLocationChange}
        />
        </div>
        
        <div>
        <Label htmlFor="sport">Sport</Label>
        <Input id="sport" name="sport" value={formData.sport} onChange={handleChange} required />
        </div>
        
        <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">{initialData ? 'Uredi' : 'Dodaj novo'}</Button>
        </div>
    </form>
    )
}

