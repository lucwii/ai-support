'use client'

import { use } from 'react'
import { Zap, AlertCircle } from 'lucide-react'
import { usePublicTicket } from '@/hooks/usePublicTicket'
import PublicTicketStatus from '@/components/public/PublicTicketStatus'
import PublicConversation from '@/components/public/PublicConversation'
import LoadingSkeleton from '@/components/ui/LoadingSkeleton'

interface PageProps {
  params: Promise<{ id: string }>
}

export default function TrackTicketPage({ params }: PageProps) {
  const { id } = use(params)
  const { ticket, loading, error } = usePublicTicket(id)

  return (
    <div className="min-h-screen bg-[#060D1A] flex flex-col items-center px-4 py-16">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="flex items-center gap-2.5 mb-10">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center">
            <Zap className="w-4 h-4 text-indigo-400" />
          </div>
          <span className="text-sm font-semibold text-[#94A3B8]">Support</span>
        </div>

        {/* Card */}
        <div className="bg-[#0F172A] border border-white/[0.06] rounded-2xl shadow-[0_4px_32px_rgba(0,0,0,0.5)] p-8 flex flex-col gap-6">
          {loading && (
            <>
              <LoadingSkeleton type="block" />
              <LoadingSkeleton type="block" />
            </>
          )}

          {!loading && error && (
            <div className="flex items-center gap-3 p-4 bg-red-500/[0.07] border border-red-500/20 rounded-xl">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-red-300">Ticket not found</p>
                <p className="text-xs text-red-400/70 mt-0.5">
                  Check the link and try again.
                </p>
              </div>
            </div>
          )}

          {!loading && ticket && (
            <>
              {/* Status header */}
              <div className="pb-6 border-b border-white/[0.06]">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-[#334155] mb-4">
                  Status
                </p>
                <PublicTicketStatus ticket={ticket} />
              </div>

              {/* Conversation */}
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-widest text-[#334155] mb-4">
                  Conversation
                </p>
                <PublicConversation ticket={ticket} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
