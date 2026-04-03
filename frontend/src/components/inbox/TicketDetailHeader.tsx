'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Ticket } from '@/lib/types'
import StatusBadge from '@/components/ui/StatusBadge'

interface TicketDetailHeaderProps {
  ticket: Ticket
}

export default function TicketDetailHeader({ ticket }: TicketDetailHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 min-w-0">
        <Link
          href="/dashboard/inbox"
          className="flex items-center justify-center w-8 h-8 rounded-xl bg-white/[0.04] border border-white/[0.07] text-[#475569] hover:text-[#94A3B8] hover:bg-white/[0.07] transition-all duration-150 flex-shrink-0"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
        </Link>

        <div className="h-5 w-px bg-white/[0.07]" />

        <div className="flex items-baseline gap-2.5 min-w-0">
          <span className="text-[11px] font-mono text-[#2D4060] tracking-wide flex-shrink-0">
            #{ticket.id.slice(0, 8)}
          </span>
          {ticket.customer_email && (
            <>
              <span className="text-[#1A2D45]">·</span>
              <span className="text-[13px] text-[#475569] truncate">{ticket.customer_email}</span>
            </>
          )}
        </div>
      </div>

      <StatusBadge status={ticket.status} />
    </div>
  )
}
