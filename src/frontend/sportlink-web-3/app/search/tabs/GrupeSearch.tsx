'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, SearchIcon, XIcon } from 'lucide-react'
import Link from 'next/link'

type Group = {
  id: number;
  name: string;
  price: number;
  location: string;
  sex: string;
  age: number;
  sports: string[];
}

const sportsList = [
  "Football", "Basketball", "Tennis", "Swimming", "Athletics", "Volleyball", "Handball"
]

export default function GroupSearch() {
  const [searchTerm, setSearchTerm] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [useMaxPrice, setUseMaxPrice] = useState(false)
  const [minAge, setMinAge] = useState('')
  const [maxAge, setMaxAge] = useState('')
  const [useAgeRange, setUseAgeRange] = useState(false)
  const [selectedSex, setSelectedSex] = useState<string[]>([])
  const [selectedSports, setSelectedSports] = useState<string[]>([])

  const [searchResults, setSearchResults] = useState<Group[]>([])

  const handleSearch = () => {
    setSearchResults([
      { id: 1, name: 'Grupa 1', price: 100, location: 'Osijek', sex: 'Male', age: 15, sports: ['Football', 'Basketball'] },
      { id: 2, name: 'Grupa 2', price: 150, location: 'Zagreb', sex: 'Female', age: 18, sports: ['Swimming', 'Athletics'] },
      { id: 3, name: 'Grupa 3', price: 200, location: 'Split', sex: 'Mixed', age: 12, sports: ['Tennis', 'Volleyball'] },
    ])
  }

  const clearFilters = () => {
    setMaxPrice('')
    setMinAge('')
    setMaxAge('')
    setUseMaxPrice(false)
    setUseAgeRange(false)
    setSelectedSex([])
    setSelectedSports([])
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Grupe</h2>
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

          <div>
            <Label className="flex items-center space-x-2">
              <Checkbox checked={useAgeRange} onCheckedChange={(checked) => setUseAgeRange(checked as boolean)} />
              <span>Raspon godina</span>
            </Label>
            <div className="flex space-x-2">
              <Input
                type="number"
                placeholder="Min"
                value={minAge}
                onChange={(e) => setMinAge(Math.max(0, parseInt(e.target.value) || 0).toString())}
                disabled={!useAgeRange}
              />
              <Input
                type="number"
                placeholder="Max"
                value={maxAge}
                onChange={(e) => setMaxAge(Math.max(0, parseInt(e.target.value) || 0).toString())}
                disabled={!useAgeRange}
              />
            </div>
          </div>

          <div>
            <Label>Spol</Label>
            <Select
              onValueChange={(value) => setSelectedSex(value === 'all' ? [] : [value])}
            >
              <SelectTrigger>
                <SelectValue placeholder="Odaberi spol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Svi</SelectItem>
                <SelectItem value="Male">Muški</SelectItem>
                <SelectItem value="Female">Ženski</SelectItem>
                <SelectItem value="Mixed">Mješovito</SelectItem>
              </SelectContent>
            </Select>
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
        {searchResults.map((group) => (
          <Link href={`/group/${group.id}`} key={group.id}>
            <Card className="cursor-pointer bg-blue-100 hover:bg-blue-200 border border-blue-300 hover:shadow-md transition-shadow my-4">
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold">{group.name}</h3>
                <p>Lokacija: {group.location}</p>
                <p>Cijena: €{group.price}</p>
                <p>Spol: {group.sex}</p>
                <p>Dob: {group.age}</p>
                <p>Sportovi: {group.sports.join(', ')}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

