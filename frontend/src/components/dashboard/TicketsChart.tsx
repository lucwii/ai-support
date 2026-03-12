'use client'

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts'
import { ChartDataPoint } from '@/hooks/useDashboardStats'

interface TicketsChartProps {
  data: ChartDataPoint[]
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[#1E293B] border border-white/[0.08] rounded-xl px-4 py-3 shadow-xl">
      <p className="text-xs text-[#475569] mb-2">{label}</p>
      {payload.map((entry: any) => (
        <div key={entry.name} className="flex items-center gap-2 text-sm">
          <span
            className="w-2 h-2 rounded-full"
            style={{ background: entry.color }}
          />
          <span className="text-[#94A3B8]">{entry.name}:</span>
          <span className="text-[#F1F5F9] font-semibold">{entry.value}</span>
        </div>
      ))}
    </div>
  )
}

export default function TicketsChart({ data }: TicketsChartProps) {
  // Show only every 5th label to avoid crowding
  const tickFormatter = (value: string, index: number) =>
    index % 5 === 0 ? value : ''

  return (
    <div className="bg-[#0F172A] border border-white/[0.06] rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.4)] p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-[#F1F5F9]">Tickets over time</h2>
        <span className="text-xs text-[#475569]">Last 30 days</span>
      </div>

      <div className="mt-6 h-56">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
            <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tick={{ fill: '#475569', fontSize: 11 }}
              axisLine={{ stroke: 'rgba(255,255,255,0.06)' }}
              tickLine={false}
              tickFormatter={tickFormatter}
            />
            <YAxis
              tick={{ fill: '#475569', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: 12, color: '#94A3B8', paddingTop: 16 }}
            />
            <Line
              type="monotone"
              dataKey="autoAnswered"
              name="Auto AI"
              stroke="#6366F1"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: '#6366F1' }}
            />
            <Line
              type="monotone"
              dataKey="agentResolved"
              name="Agent"
              stroke="#34D399"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: '#34D399' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
