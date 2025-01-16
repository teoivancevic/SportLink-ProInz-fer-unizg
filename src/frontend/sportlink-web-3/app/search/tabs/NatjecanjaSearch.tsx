'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, SearchIcon, XIcon } from 'lucide-react'
import { Select, SelectTrigger, SelectValue, SelectItem, SelectContent } from "@/components/ui/select"
import Link from 'next/link'

type Competition = {
  id: number,
  name: string,
  startDate: string, //change to date
  enddate: string,
  entryFee: number,
  location: string, //enum
  sportsOrganisation: string
  //sports
}

const sportsList = [
  "Football", "Basketball", "Tennis", "Swimming", "Athletics", "Volleyball", "Handball"
]  


export default function CompetitionSearch() {
const [searchTerm, setSearchTerm] = useState('')
const [maxPrice, setMaxPrice] = useState('')
const [startDate, setStartDate] = useState<Date>()
const [endDate, setEndDate] = useState<Date>()
const [selectedSports, setSelectedSports] = useState<string[]>([])

const [useDateRange, setUseDateRange] = useState(false)
const [useMaxPrice, setUseMaxPrice] = useState(false)

const [searchResults, setSearchResults] = useState<Competition[]>([])

const handleSearch = () => {
  setSearchResults([
    { id: 1, name: 'Natjecanje 1', entryFee: 100, startDate: '2023-06-15', enddate: '2023-06-15', location: 'Osijek', sportsOrganisation: 'Natjecatelji'},
    { id: 2, name: 'Natjecanje 2', entryFee: 150, startDate: '2023-06-16', enddate: '2023-06-16', location: 'Osijek', sportsOrganisation: 'Natjecatelji' },
    { id: 3, name: 'Natjecanje 3', entryFee: 200, startDate: '2023-06-17', enddate: '2023-06-17', location: 'Zagreb',sportsOrganisation: 'Natjecatelji' },
  ])
}

const clearFilters = () => {
  setMaxPrice('')
  setStartDate(undefined)
  setEndDate(undefined)

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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
              <Label className="flex items-center space-x-2">
                  <Checkbox checked={useMaxPrice} onCheckedChange={(checked) => setUseMaxPrice(checked as boolean)} />
                  <span>Maksimalna cijena (Euro)</span>
              </Label>
              <Input
                  type="number"
                  placeholder="Najskuplja cijena"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  disabled={!useMaxPrice}
              />
              </div>

              {/* TODO: add multiselect option with sports, to filter competitions by sports  */}

              <div>
              <Label className="flex items-center space-x-2">
                  <Checkbox checked={useDateRange} onCheckedChange={(checked) => setUseDateRange(checked as boolean)} />
                  <span>Raspon datuma</span>
              </Label>
              <div className="flex space-x-2">
                  <Popover>
                  <PopoverTrigger asChild>
                      <Button variant="outline" className={`w-[140px] justify-start text-left font-normal ${!useDateRange && 'opacity-50'}`} disabled={!useDateRange}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "yyyy-MM-dd") : <span>Početak</span>}
                      </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                      <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                      />
                  </PopoverContent>
                  </Popover>
                  <Popover>
                  <PopoverTrigger asChild>
                      <Button variant="outline" className={`w-[140px] justify-start text-left font-normal ${!useDateRange && 'opacity-50'}`} disabled={!useDateRange}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "yyyy-MM-dd") : <span>Kraj</span>}
                      </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                      <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                      />
                  </PopoverContent>
                  </Popover>
              </div>
              </div>

              <div>
            <Label>Sportovi</Label>
            <Select
              onValueChange={(value) => setSelectedSports(prev => 
                prev.includes(value) ? prev.filter(sport => sport !== value) : [...prev, value]
              )}
            >
              <SelectTrigger>
                <SelectValue placeholder="Odaberi sportove" />
              </SelectTrigger>
              <SelectContent>
                {sportsList.map((sport) => (
                  <SelectItem key={sport} value={sport}>
                    {sport}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="mt-2 flex flex-wrap gap-2">
              {selectedSports.map((sport) => (
                <span key={sport} className="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">
                  {sport}
                </span>
              ))}
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
          {searchResults.map((competition) => (
          <Link href={`/booking/${competition.id}`} key={competition.id}>
              <Card className="cursor-pointer bg-blue-100 hover:bg-blue-200 border border-blue-300 hover:shadow-md transition-shadow my-4">
              <CardContent className="p-4">
                  <h3 className="text-lg font-semibold">{competition.name}</h3>
                  <p>Lokacija: {competition.location}</p>
                  <p>Kotizacija: ${competition.entryFee}</p>
                  <p>Pocetak natjecanja: {competition.startDate}</p>
                  <p>Kraj natjecanja: {competition.enddate}</p>
                  
              </CardContent>
              </Card>
          </Link>
          ))}
      </div>
      </div>
  )
  }
