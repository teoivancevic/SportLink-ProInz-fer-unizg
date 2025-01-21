'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { SearchIcon, XIcon } from 'lucide-react'
import { Select, SelectTrigger, SelectValue, SelectItem, SelectContent } from "@/components/ui/select"
import Link from 'next/link'
import { Tournament } from '@/types/tournaments'
import { Sport } from '@/types/sport'
import { SportService, tournamentService } from '@/lib/services/api'
 

export default function CompetitionSearch() {
const [searchTerm, setSearchTerm] = useState('')
const [maxPrice, setMaxPrice] = useState<number>(0)
const [sportsList, setSportsList] = useState<Sport[]>([])
const [startDate, setStartDate] = useState<string>('')
const [endDate, setEndDate] = useState<string>('')
const [selectedSports, setSelectedSports] = useState<number[]>([])

const [useDateRange, setUseDateRange] = useState(false)
const [useMaxPrice, setUseMaxPrice] = useState(false)

const [searchResults, setSearchResults] = useState<Tournament[]>([])

useEffect(() => {
  const fetchData = async () => {
    try {
      const [sportsListResponse] = await Promise.all([
        SportService.getSports(),
      ]);
      setSportsList(sportsListResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  fetchData();
}, []);

const handleSearch = async () => {
  try {
    console.log(startDate + ' ' + endDate + ' ' + searchTerm + ' ' + selectedSports)
    const searchTournamentsResponse = await tournamentService.
    searchTournaments(
      useDateRange ? startDate : '',
      useDateRange ? endDate : '',
      searchTerm,
      selectedSports,
      useMaxPrice ? maxPrice : undefined
    );

    console.log("Success! Retrieved data:", searchTournamentsResponse.data);
    setSearchResults(searchTournamentsResponse.data);
  } catch (error) {
    console.error("Error during search:", error);
  }
};

const handleSportSelection = (sportId: number) => {
  setSelectedSports(prev => 
    prev.includes(sportId) ? prev.filter(id => id !== sportId) : [...prev, sportId]
  )
  console.log(selectedSports)
}

const clearFilters = () => {
  setMaxPrice(0)
  setStartDate("")
  setEndDate("")
  setSelectedSports([])
  setUseMaxPrice(false)
  setUseDateRange(false)
}

return (
      <div className="w-full max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Natjecanja</h2>
      <Card className="w-full max-w p-4">
          <div className="mb-4">
              <div className="relative">
              <Input
                  placeholder="Pretraži po imenu..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
              />
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
          </div>
          <div className="py-4">
              <span>Odaberite filtere za pretraživanje (opcionalno):</span>
          </div>

          <div className="grid grid-cols-1 gap-4 mb-4">
          <div>
              <Label className="flex items-center space-x-2">
                  <Checkbox checked={useMaxPrice} onCheckedChange={(checked) => setUseMaxPrice(checked as boolean)} />
                  <span>Maksimalna cijena (Euro)</span>
              </Label>
              <Input
                  type="number"
                  placeholder="Najskuplja cijena"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))} //check this cast
                  disabled={!useMaxPrice}
              />
              </div>

            <div>
              <Label className="flex items-center space-x-2">
                <Checkbox checked={useDateRange} onCheckedChange={(checked) => setUseDateRange(checked as boolean)} />
                <span>Raspon datuma</span>
              </Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div>
                  <Label htmlFor="startDate">Početak natjecanja</Label>
                  <Input
                    type="date"
                    id="startDate"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    disabled={!useDateRange}
                  />
                </div>
                <div>
                  <Label htmlFor="endDate">Kraj natjecanja</Label>
                  <Input
                    type="date"
                    id="endDate"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    disabled={!useDateRange}
                  />
                </div>
              </div>
            </div>

                <div>
                <Label>Sportovi</Label>
                <Select onValueChange={(value) => handleSportSelection(Number(value))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Odaberi sportove" />
                  </SelectTrigger>
                  <SelectContent>
                    {sportsList.map((sport) => (
                      <SelectItem key={sport.id} value={sport.id.toString()}>
                        {sport.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="mt-2 flex flex-wrap gap-2">
                  {selectedSports.map((sportId) => {
                    const sport = sportsList.find((s) => s.id === sportId)
                    return sport ? (
                      <span
                        key={sport.id}
                        className="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded"
                      >
                        {sport.name}
                        <button
                          onClick={() => handleSportSelection(sport.id)}
                          className="ml-1 text-blue-600 hover:text-blue-800"
                        >
                          ×
                        </button>
                      </span>
                    ) : null
                  })}
                </div>
              </div>
            </div>


          <div className="flex justify-between mb-4">
              <Button onClick={handleSearch}>Traži</Button>
              <Button variant="outline" onClick={clearFilters}>
              <XIcon className="mr-2 h-4 w-4" />
                Ukloni filtere
              </Button>
          </div>
          </Card>

      <div className="space-y-4">
          {searchResults.map((tournament) => (
          <Link href={`/organization/${tournament.organizationId}`}>
            <Card className="cursor-pointer bg-blue-100 hover:bg-blue-200 border border-blue-300 hover:shadow-md transition-shadow my-4">
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold">{tournament.name}</h3>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <p>
                  <strong>Sport:</strong> {tournament.sportName}
                </p>
                <p>
                  <strong>Lokacija:</strong> {tournament.location}
                </p>
                <p>
                  <strong>Početak:</strong> {new Date(tournament.timeFrom).toLocaleString()}
                </p>
                <p>
                  <strong>Kraj:</strong> {new Date(tournament.timeTo).toLocaleString()}
                </p>
                <p>
                  <strong>Kotizacija:</strong> €{tournament.entryFee.toFixed(2)}
                </p>
              </div>
            </CardContent>
          </Card>
          </Link>
          ))}
      </div>
      </div>
  )
  }
