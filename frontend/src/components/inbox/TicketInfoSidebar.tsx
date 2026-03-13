import { Mail, Calendar, Clock, Activity } from 'lucide-react'
import { format, formatDistanceToNow } from 'date-fns'
import { Ticket, TicketLog } from '@/lib/types'
import ConfidenceBar from '@/components/ui/ConfidenceBar'

interface TicketInfoSidebarProps {
  ticket: Ticket
  logs: TicketLog[]
}

interface InfoRowProps {
  icon: React.ReactNode
  label: string
  value: string
}

function InfoRow({ icon, label, value }: InfoRowProps) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-7 h-7 rounded-lg bg-white/[0.04] flex items-center justify-center flex-shrink-0 mt-0.5">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-[#334155] mb-0.5">
          {label}
        </p>
        <p className="text-sm text-[#94A3B8] break-words">{value}</p>
      </div>
    </div>
  )
}

const ACTION_LABELS: Record<string, string> = {
  ai_response_generated: 'AI generated a response',
  agent_resolved: 'Agent resolved the ticket',
  ticket_created: 'Ticket created',
}

export default function TicketInfoSidebar({ ticket, logs }: TicketInfoSidebarProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* Ticket info card */}
      <div className="bg-[#0F172A] border border-white/[0.06] rounded-2xl p-5 shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-[#334155] mb-4">
          Ticket Info
        </p>

        <div className="flex flex-col gap-4">
          <InfoRow
            icon={<Mail className="w-3.5 h-3.5 text-[#475569]" />}
            label="Customer"
            value={ticket.customer_email ?? 'Anonymous'}
          />
          <InfoRow
            icon={<Calendar className="w-3.5 h-3.5 text-[#475569]" />}
            label="Created"
            value={format(new Date(ticket.created_at), 'MMM d, yyyy · HH:mm')}
          />
          <InfoRow
            icon={<Clock className="w-3.5 h-3.5 text-[#475569]" />}
            label="Last update"
            value={formatDistanceToNow(new Date(ticket.updated_at), { addSuffix: true })}
          />
        </div>

        {ticket.confidence !== null && (
          <div className="mt-5 pt-4 border-t border-white/[0.06]">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[#334155] mb-2.5">
              AI Confidence
            </p>
            <ConfidenceBar confidence={ticket.confidence} />
          </div>
        )}
      </div>

      {/* Activity log card */}
      {logs.length > 0 && (
        <div className="bg-[#0F172A] border border-white/[0.06] rounded-2xl p-5 shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-3.5 h-3.5 text-[#475569]" />
            <p className="text-[11px] font-semibold uppercase tracking-widest text-[#334155]">
              Activity
            </p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-[7px] top-2 bottom-2 w-px bg-white/[0.06]" />

            <div className="flex flex-col gap-4">
              {logs.map((log) => (
                <div key={log.id} className="flex gap-3 pl-1 relative">
                  <div className="w-3.5 h-3.5 rounded-full bg-[#1E293B] border border-white/[0.12] flex-shrink-0 mt-0.5 z-10" />
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-[#94A3B8] leading-snug">
                      {ACTION_LABELS[log.action] ?? log.action}
                    </p>
                    <p className="text-[11px] text-[#334155] mt-0.5">{log.message}</p>
                    <p className="text-[10px] text-[#1E293B] mt-1">
                      {formatDistanceToNow(new Date(log.created_at), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
