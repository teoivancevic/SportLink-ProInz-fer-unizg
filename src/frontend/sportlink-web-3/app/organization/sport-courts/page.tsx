'use client'

import { useState } from 'react'
import NavMenu from "@/components/nav-org-profile"
import { sportObjects, SportObject, SportCourt } from "./sportObjects"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function SportCourtsContent() {

  const formatWorkTimes = (workTimes: SportObject['workTimes']) => {
    return workTimes.map((wt, index) => (
      <p key={index}>{wt.day}: {wt.from} - {wt.to}</p>
    ))
  }

  const formatPriceRange = (court: SportCourt) => {
    if (court.minHourlyPrice === court.maxHourlyPrice) {
      return `${court.minHourlyPrice} kn/h`
    }
    return `${court.minHourlyPrice} - ${court.maxHourlyPrice} kn/h`
  }

  return (
    <div className="container mx-auto p-4 space-y-4">
      <NavMenu />
      <main className="flex-grow container space-y-4">
        <h1 className="text-3xl font-bold">Sportski Objekti i Tereni</h1>
        <p className="text-xl">Pregledajte naše sportske objekte, dostupne terene i njihove rasporede.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sportObjects.map((object) => (
            <Card key={object.id} className="flex flex-col">
              <CardHeader>
                <CardTitle>{object.name}</CardTitle>
                <CardDescription>{object.location}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4">{object.description}</p>
                <div className="mt-2 text-sm">
                  {formatWorkTimes(object.workTimes)}
                </div>
              </CardContent>
              <CardFooter className="flex-col items-start">
                <h3 className="font-semibold mb-2">Dostupni tereni:</h3>
                <ul className="space-y-2 w-full">
                  {object.sportCourts.map((court) => (
                    <li key={court.id} className="flex justify-between items-center">
                      <span>{court.name} ({court.quantity}x)</span>
                      <div className="text-sm">
                        <span className="bg-gray-200 text-gray-800 px-2 py-1 rounded-full mr-2">
                          {court.sport}
                        </span>
                        <span className="border border-gray-300 text-gray-600 px-2 py-1 rounded-full">
                          {formatPriceRange(court)}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}

