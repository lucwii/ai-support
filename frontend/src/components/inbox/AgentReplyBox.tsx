'use client'

import { useState } from 'react'
import { CheckCircle, Send, Loader2 } from 'lucide-react'
import { Ticket } from '@/lib/types'
import { useUpdateTicket } from '@/hooks/useUpdateTicket'

interface AgentReplyBoxProps {
  ticket: Ticket
  onUpdated: (updated: Ticket) => void
}

export default function AgentReplyBox({ ticket, onUpdated }: AgentReplyBoxProps) {
  const [customReply, setCustomReply] = useState('')
  const { update, loading, error } = useUpdateTicket()

  const isResolved = ticket.status === 'resolved'

  const handleResolveWithAI = async () => {
    const updated = await update(ticket.id, { status: 'resolved' })
    if (updated) onUpdated(updated)
  }

  const handleSendCustom = async () => {
    if (!customReply.trim()) return
    const updated = await update(ticket.id, {
      status: 'resolved',
      agent_response: customReply.trim(),
    })
    if (updated) {
      onUpdated(updated)
      setCustomReply('')
    }
  }

  if (isResolved) {
    return (
      <div className="flex items-center gap-2.5 px-4 py-3.5 bg-emerald-500/[0.07] border border-emerald-500/20 rounded-xl">
        <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
        <p className="text-sm text-emerald-300 font-medium">This ticket has been resolved.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="relative">
        <textarea
          value={customReply}
          onChange={(e) => setCustomReply(e.target.value)}
          placeholder="Write a custom response to send to the customer..."
          rows={4}
          className="w-full bg-white/[0.03] border border-white/[0.08] hover:border-white/[0.12] focus:border-[#6366F1]/50 focus:outline-none focus:ring-1 focus:ring-[#6366F1]/30 rounded-xl px-4 py-3 text-sm text-[#CBD5E1] placeholder:text-[#334155] resize-none transition-colors duration-150"
        />
      </div>

      {error && (
        <p className="text-xs text-red-400">{error}</p>
      )}

      <div className="flex items-center gap-2.5 justify-end">
        <button
          onClick={handleResolveWithAI}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-white/[0.04] border border-white/[0.08] text-[#94A3B8] hover:bg-white/[0.07] hover:text-[#F1F5F9] transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <CheckCircle className="w-4 h-4" />
          )}
          Resolve with AI response
        </button>

        <button
          onClick={handleSendCustom}
          disabled={loading || !customReply.trim()}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-[#6366F1] hover:bg-[#4F46E5] text-white transition-all duration-150 hover:-translate-y-px disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
          Send custom response
        </button>
      </div>
    </div>
  )
}
