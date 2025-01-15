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
import Link from 'next/link'

type Booking = {
  id: string;
  title: string;
  price: number;
  date: string;
  sex: string;
  age: number;
}

export default function BookingsSearch() {
  const [searchTerm, setSearchTerm] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [sex, setSex] = useState('')
  const [minAge, setMinAge] = useState('')
  const [maxAge, setMaxAge] = useState('')
  const [useMaxPrice, setUseMaxPrice] = useState(false)
  const [useDateRange, setUseDateRange] = useState(false)
  const [useSex, setUseSex] = useState(false)
  const [useAgeRange, setUseAgeRange] = useState(false)
  const [searchResults, setSearchResults] = useState<Booking[]>([])

  const handleSearch = () => {
    setSearchResults([
      { id: '1', title: 'Booking 1', price: 100, date: '2023-06-15', sex: 'Male', age: 25 },
      { id: '2', title: 'Booking 2', price: 150, date: '2023-06-16', sex: 'Female', age: 30 },
      { id: '3', title: 'Booking 3', price: 200, date: '2023-06-17', sex: 'Male', age: 35 },
    ])
  }

  const clearFilters = () => {
    setMaxPrice('')
    setStartDate(undefined)
    setEndDate(undefined)
    setSex('')
    setMinAge('')
    setMaxAge('')
    setUseMaxPrice(false)
    setUseDateRange(false)
    setUseSex(false)
    setUseAgeRange(false)
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
                    <Checkbox checked={useDateRange} onCheckedChange={(checked) => setUseDateRange(checked as boolean)} />
                    <span>Raspon datuma</span>
                </Label>
                <div className="flex space-x-2">
                    <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline" className={`w-[140px] justify-start text-left font-normal ${!useDateRange && 'opacity-50'}`} disabled={!useDateRange}>
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, "PPP") : <span>Početak</span>}
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
                        {endDate ? format(endDate, "PPP") : <span>Kraj</span>}
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

                {/* <div>
                <Label className="flex items-center space-x-2">
                    <Checkbox checked={useSex} onCheckedChange={(checked) => setUseSex(checked as boolean)} />
                    <span>Sex</span>
                </Label>
                <select
                    value={sex}
                    onChange={(e) => setSex(e.target.value)}
                    className="w-full p-2 border rounded"
                    disabled={!useSex}
                >
                    <option value="">Spol</option>
                    <option value="male">Muško</option>
                    <option value="female">Žensko</option>
                </select>
                </div>

                <div>
                <Label className="flex items-center space-x-2">
                    <Checkbox checked={useAgeRange} onCheckedChange={(checked) => setUseAgeRange(checked as boolean)} />
                    <span>Uzrast</span>
                </Label>
                <div className="flex space-x-2">
                    <Input
                    type="number"
                    placeholder="Min age"
                    value={minAge}
                    onChange={(e) => setMinAge(e.target.value)}
                    disabled={!useAgeRange}
                    />
                    <Input
                    type="number"
                    placeholder="Max age"
                    value={maxAge}
                    onChange={(e) => setMaxAge(e.target.value)}
                    disabled={!useAgeRange}
                    />
                </div>
                </div> */}
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
            {searchResults.map((booking) => (
            <Link href={`/booking/${booking.id}`} key={booking.id}>
                <Card className="cursor-pointer hover:shadow-md transition-shadow my-4">
                <CardContent className="p-4">
                    <h3 className="text-lg font-semibold">{booking.title}</h3>
                    <p>Price: ${booking.price}</p>
                    <p>Date: {booking.date}</p>
                    <p>Sex: {booking.sex}</p>
                    <p>Age: {booking.age}</p>
                </CardContent>
                </Card>
            </Link>
            ))}
        </div>
        </div>
    )
    }
