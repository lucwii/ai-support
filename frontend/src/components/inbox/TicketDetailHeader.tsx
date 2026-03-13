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
    <div className="flex items-center justify-between mb-6 gap-4">
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/inbox"
          className="flex items-center gap-1.5 text-sm text-[#475569] hover:text-[#94A3B8] transition-colors duration-150"
        >
          <ArrowLeft className="w-4 h-4" />
          Inbox
        </Link>

        <span className="text-[#1E293B]">/</span>

        <p className="text-sm text-[#475569] font-mono hidden sm:block">
          #{ticket.id.slice(0, 8)}
        </p>
      </div>

      <StatusBadge status={ticket.status} />
    </div>
  )
}
