'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { userGrowthData } from "../mockData"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

export default function UserGrowthWidget() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>User Growth</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={userGrowthData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="total" stroke="#8884d8" name="Total Users" />
            <Line type="monotone" dataKey="email" stroke="#82ca9d" name="Email Registrations" />
            <Line type="monotone" dataKey="external" stroke="#ffc658" name="External Registrations" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}