'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectTrigger, SelectValue, SelectItem, SelectContent } from "@/components/ui/select"
import { SearchIcon, XIcon } from 'lucide-react'
import Link from 'next/link'
import { SportService, sportsObjectService } from '@/lib/services/api'
import { Sport } from '@/types/sport'
import { SportsObject } from '@/types/sportObject'

export default function BookingsSearch() {
  const [searchTerm, setSearchTerm] = useState('')
  const [maxPrice, setMaxPrice] = useState<number>(0)
  const [sportsList, setSportsList] = useState<Sport[]>([])
  const [selectedSports, setSelectedSports] = useState<number[]>([])
  const [useMaxPrice, setUseMaxPrice] = useState(false)
  const [searchResults, setSearchResults] = useState<SportsObject[]>([])
  const [noSearchResults, setNoSearchresults] = useState(false)

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
      setNoSearchresults(false)
      console.log("SEARCHHH");
      console.log(searchTerm + ' ' + selectedSports)
      const searchSportsObjectsresponse = await sportsObjectService.searchSportsObjects(
        searchTerm, 
        selectedSports, 
        useMaxPrice ? maxPrice : undefined
      );
      setSearchResults(searchSportsObjectsresponse.data);
      if(searchSportsObjectsresponse.data.length === 0){
        setNoSearchresults(true)
      }
      console.log("Search successful:", searchSportsObjectsresponse.data);
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
    setUseMaxPrice(false)
    setSelectedSports([])
    setNoSearchresults(false)
  }

  return (
        <div className="w-full max-w-4xl mx-auto p-4">
        <h2 className="text-2xl font-semibold mb-4">Termini</h2>
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
              {searchResults.map((sportsObject) => (
                <Link href={`/organization/${sportsObject.organizationId}/sport-courts`} key={sportsObject.id}>
                  <Card className="cursor-pointer bg-blue-100 hover:bg-blue-200 border border-blue-300 hover:shadow-md transition-shadow my-4">
                    <CardContent className="p-4">
                      <h3 className="text-lg font-semibold">{sportsObject.name}</h3>
                      <p className="text-sm text-gray-600">Ime organizacije: {sportsObject.organizationName}</p>
                      <p className="text-sm text-gray-600">Lokacija: {sportsObject.location}</p>
                      <div className="mt-2">
                        <h4 className="text-md font-medium">Dostupni tereni:</h4>
                        <ul className="list-disc list-inside">
                          {sportsObject.sportCourtDtos.map((court) => (
                            <li key={court.id} className="text-sm">
                              {court.sportName} ({court.availableCourts} {court.availableCourts === 1 ? "teren" : "terena"})
                              <span className="ml-2">
                                Cijena: €{court.minHourlyPrice.toFixed(2)} - €{court.maxHourlyPrice.toFixed(2)}/sat
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            {noSearchResults &&
            <Card className="bg-yellow-100 border border-yellow-300 mt-4">
              <CardContent className="p-4">
                <p className="text-center text-yellow-800">
                  Ne postoje termini za uneseno pretraživanje. Pokušajte ponovo s drugim filterima.
                </p>
              </CardContent>
            </Card>}
        </div>
    )
    }
