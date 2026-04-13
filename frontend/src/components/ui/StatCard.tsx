import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  subtitleColor?: string
  icon: LucideIcon
  iconColor: string
  iconBg: string
  accentTop?: boolean
  trend?: { value: string; positive: boolean }
  testId?: string
}

export default function StatCard({
  title,
  value,
  subtitle,
  subtitleColor,
  icon: Icon,
  iconColor,
  iconBg,
  accentTop,
  trend,
  testId,
}: StatCardProps) {
  return (
    <div
      data-testid={testId}
      className={`bg-[#0F172A] border border-white/[0.06] rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.4)] p-6 ${
        accentTop ? 'border-t-2 border-t-[#6366F1]' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div
          className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center`}
        >
          <Icon className={`w-[18px] h-[18px] ${iconColor}`} />
        </div>
        {trend && (
          <span
            className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${
              trend.positive
                ? 'text-emerald-400 bg-emerald-500/10'
                : 'text-red-400 bg-red-500/10'
            }`}
          >
            {trend.positive ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            {trend.value}
          </span>
        )}
      </div>
      <p data-testid={testId ? `${testId}-value` : undefined} className="text-3xl font-bold text-[#F1F5F9] mt-4">{value}</p>
      <p className="text-sm text-[#94A3B8] mt-1">{title}</p>
      {subtitle && (
        <p className={`text-xs mt-0.5 ${subtitleColor ?? 'text-[#475569]'}`}>
          {subtitle}
        </p>
      )}
    </div>
  )
}
