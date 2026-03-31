'use client'

import { useRouter } from 'next/navigation'
import { formatDistanceToNow } from 'date-fns'
import { Mail, User } from 'lucide-react'
import { Ticket } from '@/lib/types'
import StatusBadge from '@/components/ui/StatusBadge'

interface InboxRowProps {
  ticket: Ticket
}

const PREVIEW_LENGTH = 90

export default function InboxRow({ ticket }: InboxRowProps) {
  const router = useRouter()

  const preview =
    ticket.content.length > PREVIEW_LENGTH
      ? ticket.content.slice(0, PREVIEW_LENGTH) + '…'
      : ticket.content

  const isPending = ticket.status === 'pending_agent'

  return (
    <div
      data-testid="inbox-row"
      onClick={() => router.push(`/dashboard/inbox/${ticket.id}`)}
      className={`flex items-center gap-4 px-5 py-4 border-b border-white/[0.04] last:border-0 cursor-pointer transition-colors duration-100 group ${
        isPending ? 'hover:bg-indigo-500/[0.04]' : 'hover:bg-white/[0.02]'
      }`}
    >
      {/* Unread indicator */}
      <div className="flex-shrink-0 w-2 flex items-center justify-center">
        {isPending && <span className="w-2 h-2 rounded-full bg-[#6366F1]" />}
      </div>

      {/* Avatar */}
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
          ticket.customer_email
            ? 'bg-indigo-500/15'
            : 'bg-white/[0.05]'
        }`}
      >
        {ticket.customer_email ? (
          <Mail className="w-3.5 h-3.5 text-indigo-400" />
        ) : (
          <User className="w-3.5 h-3.5 text-[#475569]" />
        )}
      </div>

      {/* Sender */}
      <div className="w-44 flex-shrink-0 hidden sm:block">
        <p
          className={`text-sm truncate ${
            isPending ? 'font-semibold text-[#F1F5F9]' : 'font-normal text-[#94A3B8]'
          }`}
        >
          {ticket.customer_email ?? 'Anonymous'}
        </p>
      </div>

      {/* Preview */}
      <p
        className={`flex-1 text-sm truncate min-w-0 ${
          isPending ? 'text-[#CBD5E1]' : 'text-[#475569]'
        }`}
      >
        {preview}
      </p>

      {/* Status + time */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <StatusBadge status={ticket.status} size="sm" />
        <span className="text-xs text-[#334155] w-16 text-right hidden md:block">
          {formatDistanceToNow(new Date(ticket.created_at), { addSuffix: false })}
        </span>
      </div>
    </div>
  )
}
