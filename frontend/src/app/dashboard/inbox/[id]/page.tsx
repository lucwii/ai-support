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

  const [ticket, setTicket] = useState<Ticket | null>(null)
  const displayTicket = ticket ?? initialTicket

  const handleTicketUpdated = (updated: Ticket) => {
    setTicket(updated)
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <LoadingSkeleton type="block" />
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
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
    <div className="flex flex-col gap-5">
      <TicketDetailHeader ticket={displayTicket} />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5 items-start">
        {/* Left: Conversation + Reply + Notes */}
        <div className="flex flex-col gap-4">
          {/* Conversation */}
          <div className="bg-[#0A1628] border border-white/[0.06] rounded-2xl shadow-[0_4px_32px_rgba(0,0,0,0.45)] overflow-hidden">
            <div className="px-5 pt-5 pb-1">
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#2D4060]">
                Conversation
              </p>
            </div>
            <div className="p-5 pt-3">
              <ConversationThread ticket={displayTicket} />
            </div>
          </div>

          {/* Reply + Notes — side by side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
            {/* Agent Reply */}
            <div className="bg-[#0A1628] border border-white/[0.06] rounded-2xl shadow-[0_4px_32px_rgba(0,0,0,0.45)] overflow-hidden">
              <div className="px-5 pt-5 pb-1">
                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#2D4060]">
                  Agent Reply
                </p>
              </div>
              <div className="p-5 pt-3">
                <AgentReplyBox ticket={displayTicket} onUpdated={handleTicketUpdated} />
              </div>
            </div>

            {/* Notes */}
            <NotesCard ticketId={id} />
          </div>
        </div>

        {/* Right sidebar */}
        <div className="lg:sticky lg:top-4">
          <TicketInfoSidebar ticket={displayTicket} logs={logs} />
        </div>
      </div>
    </div>
  )
}
