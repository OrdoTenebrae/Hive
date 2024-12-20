"use client"

import { LineChart as Line, BarChart as Bar } from "recharts"

const demoData = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 600 },
  { name: 'Apr', value: 800 },
  { name: 'May', value: 500 }
]

export function LineChart() {
  return (
    <Line
      width={500}
      height={300}
      data={demoData}
      margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
    />
  )
}

export function BarChart() {
  return (
    <Bar
      width={500}
      height={300}
      data={demoData}
      margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
    />
  )
}