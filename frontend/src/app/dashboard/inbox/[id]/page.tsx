'use client'

import { useState } from 'react'
import { use } from 'react'
import { AlertCircle } from 'lucide-react'
import { useOrganization } from '@/hooks/useOrganization'
import { useTicket } from '@/hooks/useTicket'
import { Ticket } from '@/lib/types'
import LoadingSkeleton from '@/components/ui/LoadingSkeleton'
import TicketDetailHeader from '@/components/inbox/TicketDetailHeader'
import ConversationThread from '@/components/inbox/ConversationThread'
import AgentReplyBox from '@/components/inbox/AgentReplyBox'
import TicketInfoSidebar from '@/components/inbox/TicketInfoSidebar'
import NotesCard from '@/components/inbox/NotesCard'

interface PageProps {
  params: Promise<{ id: string }>
}

export default function TicketDetailPage({ params }: PageProps) {
  const { id } = use(params)
  const { organization } = useOrganization()
  const { ticket: initialTicket, logs, loading, error } = useTicket(id, organization?.id)

  // Local ticket state so UI updates instantly after agent action
  const [ticket, setTicket] = useState<Ticket | null>(null)
  const displayTicket = ticket ?? initialTicket

  const handleTicketUpdated = (updated: Ticket) => {
    setTicket(updated)
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <LoadingSkeleton type="block" />
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
          <LoadingSkeleton type="block" />
          <LoadingSkeleton type="block" />
        </div>
      </div>
    )
  }

  if (error || !displayTicket) {
    return (
      <div className="flex items-center gap-3 p-5 bg-red-500/[0.07] border border-red-500/20 rounded-2xl">
        <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
        <div>
          <p className="text-sm font-medium text-red-300">Failed to load ticket</p>
          <p className="text-xs text-red-400/70 mt-0.5">{error ?? 'Ticket not found'}</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <TicketDetailHeader ticket={displayTicket} />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 items-start">
        {/* Left: Conversation + Reply box */}
        <div className="flex flex-col gap-4">
          <div className="bg-[#0F172A] border border-white/[0.06] rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.4)] p-6">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-[#334155] mb-5">
              Conversation
            </p>
            <ConversationThread ticket={displayTicket} />
          </div>


          <div className="bg-[#0F172A] border border-white/[0.06] rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.4)] p-5">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-[#334155] mb-4">
              Agent Reply
            </p>
            <AgentReplyBox ticket={displayTicket} onUpdated={handleTicketUpdated} />
          </div>
          <NotesCard ticketId={id} />
        </div>

        {/* Right: Info + Activity */}
        <div className="lg:sticky lg:top-4">
          <TicketInfoSidebar ticket={displayTicket} logs={logs} />
        </div>
      </div>
    </div>
  )
}
