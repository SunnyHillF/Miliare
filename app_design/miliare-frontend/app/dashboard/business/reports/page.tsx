'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const EarningsOverviewChart = dynamic(
  () => import('@/components/EarningsOverviewChart'),
  { ssr: false }
)

type DashboardData = typeof import('@/lib/dashboardData')

export default function ReportsPage() {
  const [data, setData] = useState<DashboardData | null>(null)

  useEffect(() => {
    import('@/lib/dashboardData').then(mod => setData(mod))
  }, [])

  if (!data) {
    return <div className="p-6">Loading...</div>
  }

  const { summary, earningsDataYear, chartConfig } = data

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Reports</h1>
      <EarningsOverviewChart data={earningsDataYear} config={chartConfig} />
      <Table className="bg-white rounded-xl overflow-hidden border">
        <TableHeader>
          <TableRow>
            <TableHead>METRIC</TableHead>
            <TableHead>VALUE</TableHead>
            <TableHead>CHANGE</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {summary.map(metric => (
            <TableRow key={metric.label} className="border-t">
              <TableCell>{metric.label}</TableCell>
              <TableCell>{metric.value}</TableCell>
              <TableCell>{metric.change}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
