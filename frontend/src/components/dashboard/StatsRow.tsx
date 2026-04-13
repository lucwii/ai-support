import { MessageSquare, Zap, Clock, Timer } from 'lucide-react'
import StatCard from '@/components/ui/StatCard'
import { DashboardStats } from '@/hooks/useDashboardStats'

interface StatsRowProps {
  stats: DashboardStats
}

export default function StatsRow({ stats }: StatsRowProps) {
  const { todayTotal, todayAuto, todayAutoPct, pendingTotal, yesterdayTotal } = stats

  const todayTrend =
    yesterdayTotal > 0
      ? {
          value: `${Math.abs(Math.round(((todayTotal - yesterdayTotal) / yesterdayTotal) * 100))}%`,
          positive: todayTotal >= yesterdayTotal,
        }
      : undefined

  return (
    <div data-testid="stats-row" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        testId="stat-tickets-today"
        title="Tickets today"
        value={todayTotal}
        icon={MessageSquare}
        iconColor="text-indigo-400"
        iconBg="bg-indigo-500/10"
        trend={todayTrend}
      />
      <StatCard
        testId="stat-auto-resolved"
        title="Auto-resolved"
        value={todayAuto}
        subtitle={todayTotal > 0 ? `${todayAutoPct}% of today's tickets` : 'No tickets today'}
        subtitleColor="text-emerald-400"
        icon={Zap}
        iconColor="text-emerald-400"
        iconBg="bg-emerald-500/10"
      />
      <StatCard
        testId="stat-pending-review"
        title="Pending review"
        value={pendingTotal}
        subtitle={pendingTotal > 0 ? 'Needs attention' : 'All clear'}
        subtitleColor={pendingTotal > 0 ? 'text-amber-400' : 'text-emerald-400'}
        icon={Clock}
        iconColor="text-amber-400"
        iconBg="bg-amber-500/10"
        accentTop={pendingTotal > 0}
      />
      <StatCard
        testId="stat-avg-response"
        title="Avg. AI response"
        value="< 2s"
        subtitle="Real-time"
        subtitleColor="text-cyan-400"
        icon={Timer}
        iconColor="text-cyan-400"
        iconBg="bg-cyan-500/10"
      />
    </div>
  )
}
