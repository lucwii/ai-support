import { TicketStatus } from '@/lib/types'

const config: Record<
  TicketStatus,
  { label: string; classes: string }
> = {
  auto_answered: {
    label: 'Auto AI',
    classes:
      'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20',
  },
  pending_agent: {
    label: 'Pending review',
    classes: 'text-amber-400 bg-amber-500/10 border border-amber-500/20',
  },
  processing: {
    label: 'Processing',
    classes: 'text-blue-400 bg-blue-500/10 border border-blue-500/20',
  },
  resolved: {
    label: 'Resolved',
    classes: 'text-slate-500 bg-white/[0.04] border border-white/[0.08]',
  },
}

interface StatusBadgeProps {
  status: TicketStatus
  size?: 'sm' | 'md'
}

export default function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const { label, classes } = config[status]
  const sizeClasses = size === 'sm' ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-1'

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-lg font-semibold ${sizeClasses} ${classes}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {label}
    </span>
  )
}
