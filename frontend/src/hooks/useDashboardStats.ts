'use client'

import { useMemo } from 'react'
import { Ticket } from '@/lib/types'
import { startOfDay, isAfter, subDays, format } from 'date-fns'

export interface ChartDataPoint {
  date: string
  autoAnswered: number
  agentResolved: number
}

export interface DashboardStats {
  todayTotal: number
  todayAuto: number
  todayAutoPct: number
  pendingTotal: number
  yesterdayTotal: number
  chartData: ChartDataPoint[]
}

export function useDashboardStats(tickets: Ticket[]): DashboardStats {
  return useMemo(() => {
    const now = new Date()
    const todayStart = startOfDay(now)
    const yesterdayStart = startOfDay(subDays(now, 1))

    const todayTickets = tickets.filter((t) =>
      isAfter(new Date(t.created_at), todayStart),
    )
    const yesterdayTickets = tickets.filter((t) => {
      const d = new Date(t.created_at)
      return isAfter(d, yesterdayStart) && !isAfter(d, todayStart)
    })

    const todayTotal = todayTickets.length
    const todayAuto = todayTickets.filter((t) => t.status === 'auto_answered').length
    const todayAutoPct = todayTotal ? Math.round((todayAuto / todayTotal) * 100) : 0
    const pendingTotal = tickets.filter((t) => t.status === 'pending_agent').length
    const yesterdayTotal = yesterdayTickets.length

    // Build last 30 days chart data
    const chartData: ChartDataPoint[] = []
    for (let i = 29; i >= 0; i--) {
      const day = startOfDay(subDays(now, i))
      const nextDay = startOfDay(subDays(now, i - 1))
      const dayTickets = tickets.filter((t) => {
        const d = new Date(t.created_at)
        return isAfter(d, day) && !isAfter(d, nextDay)
      })
      chartData.push({
        date: format(day, 'MMM d'),
        autoAnswered: dayTickets.filter((t) => t.status === 'auto_answered').length,
        agentResolved: dayTickets.filter(
          (t) => t.status === 'resolved' || t.status === 'pending_agent',
        ).length,
      })
    }

    return { todayTotal, todayAuto, todayAutoPct, pendingTotal, yesterdayTotal, chartData }
  }, [tickets])
}
