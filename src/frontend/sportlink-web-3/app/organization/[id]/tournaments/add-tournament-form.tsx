'use client'

import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tournament } from "../../../../types/tournaments"
import { LocationInput } from '@/components/location-input'
import { SportService } from '@/lib/services/api'
import { Sport, getSportsResponse } from '@/types/sport'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Check, ChevronDown } from 'lucide-react'

interface AddTournamentFormProps {
    onClose: () => void;
    onSubmit: (newTournament: Tournament) => void;
    initialData?: Tournament;
    loading : boolean;
}

export default function AddTournamentForm({ onClose, onSubmit, initialData, loading  }: AddTournamentFormProps) {
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

    const [formData, setFormData] = useState<Tournament>(
        initialData || {
            id: 0,
            name: '',
            description: '',
            timeFrom: '',
            timeTo: '',
            entryFee: 0,
            location: '',
            organizationId: 0,
            sportName: '',
            sportId: 0,
        }
    );

    const handleLocationChange = (value: string) => {
        setFormData(prevData => ({ ...prevData, location: value }));
    };

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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (name === "entryFee") {
            const numericValue = value.replace(/[^0-9]/g, ''); 
            let sanitizedValue = numericValue.replace(/^0+/, '');
            if (sanitizedValue === "") sanitizedValue = "0"; 
            
            setFormData(prevData => ({
                ...prevData,
                [name]: Number(sanitizedValue), 
            }));
        } else {
            setFormData(prevData => ({
                ...prevData,
                [name]: name === "organizationId" ? Number(value) : value, 
            }));
        }
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.sportId) {
            alert("Molimo odaberite sport prije dodavanja natjecanja");
            return;
        }
    
        const formatToISOString = (date: string) => {
            const parsedDate = new Date(date);
            return parsedDate.toISOString(); 
        };
    
        const sanitizedFormData = {
            ...formData,
            timeFrom: formatToISOString(formData.timeFrom),
            timeTo: formatToISOString(formData.timeTo),
            entryFee: Number(formData.entryFee),
            organizationId: Number(formData.organizationId),
        };
    
        onSubmit(sanitizedFormData);
    };
    
    

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
                <Input id="entryFee" type="text" name="entryFee" value={formData.entryFee} onChange={handleChange} required />
            </div>
            
            <div>
                <LocationInput value={formData.location} onChange={handleLocationChange} />
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
            
            <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                <Button type="submit" className="bg-[#228be6] hover:bg-[#1e7bbf] text-white" disabled={loading}>{loading ? "Submitting..." : "Submit"}</Button>
            </div>
        </form>
    );
}

