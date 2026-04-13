'use client'

import { useMemo, useState } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import { TrendingUp, TrendingDown, Zap, UserCheck } from 'lucide-react'
import { startOfDay, subDays, isAfter, format } from 'date-fns'
import { Ticket } from '@/lib/types'

interface Props {
  tickets: Ticket[]
}

const PERIODS = [
  { key: '7d',  label: '7 days',  days: 7  },
  { key: '14d', label: '14 days', days: 14 },
  { key: '30d', label: '30 days', days: 30 },
] as const

type PeriodKey = typeof PERIODS[number]['key']

function buildChartData(tickets: Ticket[], days: number) {
  const now = new Date()
  return Array.from({ length: days }, (_, i) => {
    const day = startOfDay(subDays(now, days - 1 - i))
    const nextDay = startOfDay(subDays(now, days - 2 - i))
    const dayTickets = tickets.filter((t) => {
      const d = new Date(t.created_at)
      return isAfter(d, day) && !isAfter(d, nextDay)
    })
    return {
      date: format(day, days <= 7 ? 'EEE' : 'MMM d'),
      autoAnswered: dayTickets.filter((t) => t.status === 'auto_answered').length,
      agentResolved: dayTickets.filter((t) => t.status === 'resolved' || t.status === 'pending_agent').length,
    }
  })
}

interface TooltipProps {
  active?: boolean
  payload?: Array<{ dataKey: string; value: number; color: string }>
  label?: string
}

function CustomTooltip({ active, payload, label }: TooltipProps) {
  if (!active || !payload?.length) return null
  return (
    <div
      className="rounded-xl px-4 py-3 shadow-xl min-w-[160px]"
      style={{
        background: '#1E293B',
        border: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <p className="text-xs text-[#475569] mb-2.5">{label}</p>
      <div className="flex flex-col gap-1.5">
        {payload.map((entry) => (
          <div key={entry.dataKey} className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ background: entry.color }} />
              <span className="text-xs text-[#94A3B8]">
                {entry.dataKey === 'autoAnswered' ? 'Auto AI' : 'Agent'}
              </span>
            </div>
            <span className="text-sm font-semibold text-[#F1F5F9]">{entry.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function TicketsChart({ tickets }: Props) {
  const [period, setPeriod] = useState<PeriodKey>('30d')
  const days = PERIODS.find((p) => p.key === period)!.days

  const chartData = useMemo(() => buildChartData(tickets, days), [tickets, days])

  const totalAuto = useMemo(() => chartData.reduce((s, d) => s + d.autoAnswered, 0), [chartData])
  const totalAgent = useMemo(() => chartData.reduce((s, d) => s + d.agentResolved, 0), [chartData])

  // Compare to previous period
  const prevAuto = useMemo(() => tickets.filter((t) => {
    const d = new Date(t.created_at)
    const cutoff = startOfDay(subDays(new Date(), days * 2))
    const start = startOfDay(subDays(new Date(), days))
    return isAfter(d, cutoff) && !isAfter(d, start) && t.status === 'auto_answered'
  }).length, [tickets, days])

  const prevAgent = useMemo(() => tickets.filter((t) => {
    const d = new Date(t.created_at)
    const cutoff = startOfDay(subDays(new Date(), days * 2))
    const start = startOfDay(subDays(new Date(), days))
    return isAfter(d, cutoff) && !isAfter(d, start) && (t.status === 'resolved' || t.status === 'pending_agent')
  }).length, [tickets, days])

  const autoChange = prevAuto > 0 ? Math.round(((totalAuto - prevAuto) / prevAuto) * 100) : null
  const agentChange = prevAgent > 0 ? Math.round(((totalAgent - prevAgent) / prevAgent) * 100) : null

  const showEvery = days <= 7 ? 1 : days <= 14 ? 2 : 5

  return (
    <div
      data-testid="tickets-chart"
      className="rounded-2xl p-6"
      style={{
        background: '#0F172A',
        border: '1px solid rgba(255,255,255,0.06)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-base font-semibold text-[#F1F5F9]">Tickets over time</h2>

        {/* Period selector */}
        <div
          className="flex items-center rounded-lg p-0.5 gap-0.5"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          {PERIODS.map((p) => (
            <button
              key={p.key}
              data-testid={`chart-period-${p.key}`}
              onClick={() => setPeriod(p.key)}
              className="px-3 py-1 rounded-md text-xs font-medium transition-all duration-150"
              style={
                period === p.key
                  ? { background: 'rgba(99,102,241,0.15)', color: '#818CF8', border: '1px solid rgba(99,102,241,0.3)' }
                  : { color: '#475569', border: '1px solid transparent' }
              }
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <StatItem
          label="Auto AI"
          value={totalAuto}
          change={autoChange}
          icon={<Zap className="w-4 h-4 text-[#6366F1]" />}
          color="#6366F1"
        />
        <StatItem
          label="Agent Resolved"
          value={totalAgent}
          change={agentChange}
          icon={<UserCheck className="w-4 h-4 text-[#34D399]" />}
          color="#34D399"
        />
      </div>

      {/* Chart */}
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
            <defs>
              <linearGradient id="gradAuto" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#6366F1" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#6366F1" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="gradAgent" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#34D399" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#34D399" stopOpacity={0.02} />
              </linearGradient>
            </defs>

            <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="3 3" vertical={false} />

            <XAxis
              dataKey="date"
              tick={{ fill: '#475569', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(val, i) => (i % showEvery === 0 ? val : '')}
            />
            <YAxis
              tick={{ fill: '#475569', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />

            <Tooltip
              content={<CustomTooltip />}
              cursor={{ stroke: 'rgba(99,102,241,0.4)', strokeDasharray: '4 4', strokeWidth: 1 }}
            />

            <Area
              type="natural"
              dataKey="agentResolved"
              stroke="#34D399"
              strokeWidth={2}
              fill="url(#gradAgent)"
              dot={false}
              activeDot={{ r: 4, fill: '#34D399', stroke: '#0F172A', strokeWidth: 2 }}
              stackId="a"
            />
            <Area
              type="natural"
              dataKey="autoAnswered"
              stroke="#6366F1"
              strokeWidth={2}
              fill="url(#gradAuto)"
              dot={false}
              activeDot={{ r: 4, fill: '#6366F1', stroke: '#0F172A', strokeWidth: 2 }}
              stackId="a"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

function StatItem({
  label,
  value,
  change,
  icon,
  color,
}: {
  label: string
  value: number
  change: number | null
  icon: React.ReactNode
  color: string
}) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="w-0.5 self-stretch rounded-full"
        style={{ background: color, opacity: 0.5 }}
      />
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-1.5">
          {icon}
          <span className="text-sm text-[#64748B]">{label}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-semibold text-[#F1F5F9] leading-none">{value}</span>
          {change !== null && (
            <span
              className="flex items-center gap-0.5 text-xs font-medium"
              style={{ color: change >= 0 ? '#34D399' : '#F87171' }}
            >
              {change >= 0
                ? <TrendingUp className="w-3.5 h-3.5" />
                : <TrendingDown className="w-3.5 h-3.5" />
              }
              {Math.abs(change)}%
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
