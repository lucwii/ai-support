import { Mail, Calendar, RefreshCw, Zap, Activity } from 'lucide-react'
import { format, formatDistanceToNow } from 'date-fns'
import { Ticket, TicketLog } from '@/lib/types'
import ConfidenceBar from '@/components/ui/ConfidenceBar'

interface TicketInfoSidebarProps {
  ticket: Ticket
  logs: TicketLog[]
}

const ACTION_LABELS: Record<string, { label: string; color: string }> = {
  ai_response_generated: { label: 'AI generated a response', color: 'bg-indigo-500' },
  agent_resolved: { label: 'Agent resolved', color: 'bg-emerald-500' },
  ticket_created: { label: 'Ticket created', color: 'bg-blue-500' },
}

export default function TicketInfoSidebar({ ticket, logs }: TicketInfoSidebarProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* Ticket info card */}
      <div className="bg-[#0A1628] border border-white/[0.06] rounded-2xl shadow-[0_4px_32px_rgba(0,0,0,0.45)] overflow-hidden">
        <div className="px-5 pt-5 pb-3 border-b border-white/[0.04]">
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#2D4060]">
            Ticket Info
          </p>
        </div>

        <div className="p-5 flex flex-col gap-4">
          {/* Customer email */}
          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center flex-shrink-0 mt-0.5">
              <Mail className="w-3 h-3 text-[#3D5570]" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-[#2D4060] mb-0.5">
                Customer
              </p>
              <p className="text-sm text-[#7A95B0] break-words leading-snug">
                {ticket.customer_email ?? 'Anonymous'}
              </p>
            </div>
          </div>

          {/* Created */}
          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center flex-shrink-0 mt-0.5">
              <Calendar className="w-3 h-3 text-[#3D5570]" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-[#2D4060] mb-0.5">
                Created
              </p>
              <p className="text-sm text-[#7A95B0]">
                {format(new Date(ticket.created_at), 'MMM d, yyyy')}
              </p>
              <p className="text-[11px] text-[#3D5570] mt-0.5">
                {format(new Date(ticket.created_at), 'HH:mm')}
              </p>
            </div>
          </div>

          {/* Last update */}
          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center flex-shrink-0 mt-0.5">
              <RefreshCw className="w-3 h-3 text-[#3D5570]" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-[#2D4060] mb-0.5">
                Last Update
              </p>
              <p className="text-sm text-[#7A95B0]">
                {formatDistanceToNow(new Date(ticket.updated_at), { addSuffix: true })}
              </p>
            </div>
          </div>

          {/* AI Confidence */}
          {ticket.confidence !== null && (
            <div className="pt-3 border-t border-white/[0.04]">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-indigo-500/[0.08] border border-indigo-500/[0.12] flex items-center justify-center flex-shrink-0">
                  <Zap className="w-3 h-3 text-indigo-400/60" />
                </div>
                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#2D4060]">
                  AI Confidence
                </p>
              </div>
              <ConfidenceBar confidence={ticket.confidence} />
            </div>
          )}
        </div>
      </div>

      {/* Activity log */}
      {logs.length > 0 && (
        <div className="bg-[#0A1628] border border-white/[0.06] rounded-2xl shadow-[0_4px_32px_rgba(0,0,0,0.45)] overflow-hidden">
          <div className="px-5 pt-5 pb-3 border-b border-white/[0.04] flex items-center gap-2">
            <Activity className="w-3 h-3 text-[#2D4060]" />
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#2D4060]">
              Activity
            </p>
          </div>

          <div className="p-5">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-[9px] top-2 bottom-2 w-px bg-white/[0.05]" />

              <div className="flex flex-col gap-5">
                {logs.map((log) => {
                  const config = ACTION_LABELS[log.action]
                  return (
                    <div key={log.id} className="flex gap-3.5 relative">
                      {/* Dot */}
                      <div className="flex-shrink-0 mt-0.5 z-10">
                        <div className={`w-[7px] h-[7px] rounded-full mt-1 ml-[3px] ${config?.color ?? 'bg-[#2D4060]'} shadow-[0_0_6px_currentColor] opacity-70`} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium text-[#7A95B0] leading-snug">
                          {config?.label ?? log.action}
                        </p>
                        <p className="text-[11px] text-[#3D5570] mt-0.5 leading-relaxed">
                          {log.message}
                        </p>
                        <p className="text-[10px] text-[#2D4060] mt-1.5">
                          {formatDistanceToNow(new Date(log.created_at), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
