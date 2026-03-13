'use client'

import { Ticket, TicketStatus } from '@/lib/types'

export type InboxFilter = 'all' | TicketStatus

interface Tab {
  key: InboxFilter
  label: string
  dotClass: string
}

const TABS: Tab[] = [
  { key: 'all', label: 'All', dotClass: '' },
  { key: 'pending_agent', label: 'Pending', dotClass: 'bg-amber-400' },
  { key: 'auto_answered', label: 'Auto-answered', dotClass: 'bg-emerald-400' },
  { key: 'resolved', label: 'Resolved', dotClass: 'bg-slate-500' },
  { key: 'processing', label: 'Processing', dotClass: 'bg-blue-400' },
]

interface InboxFiltersProps {
  activeFilter: InboxFilter
  onChange: (filter: InboxFilter) => void
  tickets: Ticket[]
}

function countByStatus(tickets: Ticket[], status: TicketStatus): number {
  return tickets.filter((t) => t.status === status).length
}

function getCount(tickets: Ticket[], key: InboxFilter): number {
  if (key === 'all') return tickets.length
  return countByStatus(tickets, key)
}

export default function InboxFilters({ activeFilter, onChange, tickets }: InboxFiltersProps) {
  return (
    <div className="flex items-center gap-1 px-4 pt-4 pb-0 border-b border-white/[0.06] overflow-x-auto">
      {TABS.map((tab) => {
        const count = getCount(tickets, tab.key)
        const isActive = activeFilter === tab.key

        return (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            className={`relative flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium whitespace-nowrap transition-colors duration-150 rounded-t-lg ${
              isActive
                ? 'text-[#F1F5F9]'
                : 'text-[#475569] hover:text-[#94A3B8]'
            }`}
          >
            {tab.dotClass && (
              <span className={`w-1.5 h-1.5 rounded-full ${tab.dotClass}`} />
            )}
            {tab.label}
            <span
              className={`text-xs px-1.5 py-0.5 rounded-md font-semibold ${
                isActive
                  ? 'bg-white/[0.08] text-[#94A3B8]'
                  : 'bg-white/[0.04] text-[#334155]'
              }`}
            >
              {count}
            </span>
            {isActive && (
              <span className="absolute bottom-0 left-0 right-0 h-px bg-[#6366F1]" />
            )}
          </button>
        )
      })}
    </div>
  )
}
