'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Trash2, Loader2 } from 'lucide-react'
import { Ticket } from '@/lib/types'
import StatusBadge from '@/components/ui/StatusBadge'
import { useDeleteTicket } from '@/hooks/useDeleteTicket'

interface TicketDetailHeaderProps {
  ticket: Ticket
}

export default function TicketDetailHeader({ ticket }: TicketDetailHeaderProps) {
  const [confirming, setConfirming] = useState(false)
  const { deleteTicket, loading } = useDeleteTicket()
  const router = useRouter()

  const handleDelete = async () => {
    if (!confirming) {
      setConfirming(true)
      return
    }
    const ok = await deleteTicket(ticket.id)
    if (ok) router.push('/dashboard/inbox')
  }

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

      <div className="flex items-center gap-3 flex-shrink-0">
        <StatusBadge status={ticket.status} />

        {confirming ? (
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#475569]">Delete?</span>
            <button
              data-testid="confirm-delete-ticket-yes"
              onClick={handleDelete}
              disabled={loading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors duration-150 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
              Yes, delete
            </button>
            <button
              data-testid="confirm-delete-ticket-no"
              onClick={() => setConfirming(false)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white/[0.04] border border-white/[0.07] text-[#475569] hover:text-[#94A3B8] transition-colors duration-150"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            data-testid="delete-ticket-button"
            onClick={handleDelete}
            className="flex items-center justify-center w-8 h-8 rounded-xl bg-white/[0.04] border border-white/[0.07] text-[#475569] hover:text-red-400 hover:bg-red-400/10 hover:border-red-400/20 transition-all duration-150"
            title="Delete ticket"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  )
}
