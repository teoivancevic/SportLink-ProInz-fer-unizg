"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SearchIcon, XIcon } from "lucide-react"
import Link from "next/link"
import type { TrainingGroup, TrainingGroupSearchedObject } from "@/types/training-groups"
import { SportService, trainingGroupService } from "@/lib/services/api"
import type { Sport } from "@/types/sport"

export default function GroupSearch() {
  const sexOptions = ["Male", "Female", "Unisex"]
  const [searchTerm, setSearchTerm] = useState("")
  const [maxPrice, setMaxPrice] = useState<number>(0)
  const [useMaxPrice, setUseMaxPrice] = useState(false)
  const [minAge, setMinAge] = useState<number>(0)
  const [maxAge, setMaxAge] = useState<number>(0)
  const [useAgeRange, setUseAgeRange] = useState(false)
  const [selectedSex, setSelectedSex] = useState<string | null>(null)

  const [sportsList, setSportsList] = useState<Sport[]>([])
  const [selectedSports, setSelectedSports] = useState<number[]>([])

  const [searchResults, setSearchResults] = useState<TrainingGroupSearchedObject[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sportsListResponse] = await Promise.all([SportService.getSports()])
        setSportsList(sportsListResponse.data)
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }

    fetchData()
  }, [])

  const handleSearch = async () => {
    try {
      const searchTrainingGroupResponse = await trainingGroupService.searchTrainingGroups(
        selectedSex ? [selectedSex] : [],
        useAgeRange ? minAge : undefined,
        useAgeRange ? maxAge : undefined,
        searchTerm,
        selectedSports,
        useMaxPrice ? maxPrice : undefined,
      )
      setSearchResults(searchTrainingGroupResponse.data)
      console.log("Search successful:", searchTrainingGroupResponse.data)
    } catch (error) {
      console.error("Error during search:", error)
    }
  }

  const clearFilters = () => {
    setMaxPrice(0)
    setMinAge(0)
    setMaxAge(0)
    setUseMaxPrice(false)
    setUseAgeRange(false)
    setSelectedSex('')
    setSelectedSports([])
  }

  const handleSportSelection = (sportId: number) => {
    setSelectedSports(prev => 
      prev.includes(sportId) ? prev.filter(id => id !== sportId) : [...prev, sportId]
    )
    console.log(selectedSports)
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
              onChange={(e) => setMaxPrice(Number(e.target.value))}
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
                onChange={(e) => setMinAge(Math.max(0, Number.parseInt(e.target.value) || 0))}
                disabled={!useAgeRange}
              />
              <Input
                type="number"
                placeholder="Max"
                value={maxAge}
                onChange={(e) => setMaxAge(Math.max(0, Number.parseInt(e.target.value) || 0))}
                disabled={!useAgeRange}
              />
            </div>
          </div>

          <div>
            <Label>Spol</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {sexOptions.map((sex) => (
                <Button
                  key={sex}
                  variant={selectedSex === sex ? "default" : "outline"}
                  onClick={() => setSelectedSex(selectedSex === sex ? null : sex)}
                  className="text-sm"
                >
                  {sex === "Male" ? "Muški" : sex === "Female" ? "Ženski" : "Mješovito"}
                </Button>
              ))}
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

      <div className="space-y-4 mt-4">
        {searchResults.map((group) => (
          <Link href={`/organization/${group.organizationId}/training-groups`} key={group.id}>
            <Card className="cursor-pointer bg-blue-100 hover:bg-blue-200 border border-blue-300 hover:shadow-md transition-shadow my-4">
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold">{group.name}</h3>
                <p>
                  Dob: {group.ageFrom} - {group.ageTo} godina
                </p>
                <p>Spol: {group.sex === "Male" ? "Muški" : group.sex === "Female" ? "Ženski" : "Mješovito"}</p>
                <p>Cijena: €{group.monthlyPrice} mjesečno</p>
                <p>Sport: {group.sportName}</p>
                <div className="mt-2">
                  <h4 className="font-semibold">Raspored treninga:</h4>
                  <ul className="list-disc list-inside">
                    {group.trainingScheduleDtos.map((schedule) => (
                      <li key={schedule.id}>
                        {["Ned", "Pon", "Uto", "Sri", "Čet", "Pet", "Sub"][schedule.dayOfWeek]}:{" "}
                        {schedule.startTime.slice(0, 5)} - {schedule.endTime.slice(0, 5)}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}


