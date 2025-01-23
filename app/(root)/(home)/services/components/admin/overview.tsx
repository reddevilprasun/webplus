"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

const data = [
  {
    name: "Jan",
    total: 100,
    premium: 40,
  },
  {
    name: "Feb",
    total: 120,
    premium: 50,
  },
  {
    name: "Mar",
    total: 150,
    premium: 70,
  },
  {
    name: "Apr",
    total: 180,
    premium: 90,
  },
  {
    name: "May",
    total: 220,
    premium: 120,
  },
  {
    name: "Jun",
    total: 250,
    premium: 150,
  },
]

export function Overview() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
        <Bar dataKey="total" fill="#adfa1d" radius={[4, 4, 0, 0]} />
        <Bar dataKey="premium" fill="#2563eb" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

