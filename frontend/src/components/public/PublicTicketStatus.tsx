import { Loader2 } from 'lucide-react'
import { PublicTicket } from '@/lib/types'
import StatusBadge from '@/components/ui/StatusBadge'

interface PublicTicketStatusProps {
  ticket: PublicTicket
}

const STATUS_MESSAGES: Record<PublicTicket['status'], string> = {
  processing: 'Our AI is analyzing your question. This usually takes a few seconds.',
  auto_answered: 'Your question was answered automatically by AI.',
  pending_agent: 'Our team is reviewing your ticket and will respond shortly.',
  resolved: 'Your ticket has been resolved.',
}

export default function PublicTicketStatus({ ticket }: PublicTicketStatusProps) {
  const isProcessing = ticket.status === 'processing'

  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2.5">
          {isProcessing && <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />}
          <StatusBadge status={ticket.status} />
        </div>
        <p className="text-sm text-[#475569]">{STATUS_MESSAGES[ticket.status]}</p>
      </div>

      <p className="text-[11px] font-mono text-[#2D3F55] flex-shrink-0">
        #{ticket.id.slice(0, 8)}
      </p>
    </div>
  )
}
