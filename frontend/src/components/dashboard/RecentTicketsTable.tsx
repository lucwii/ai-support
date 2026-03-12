'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Inbox } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { Ticket } from '@/lib/types'
import StatusBadge from '@/components/ui/StatusBadge'
import EmptyState from '@/components/ui/EmptyState'
import LoadingSkeleton from '@/components/ui/LoadingSkeleton'

interface RecentTicketsTableProps {
  tickets: Ticket[]
  loading: boolean
  organizationId: string
}

export default function RecentTicketsTable({
  tickets,
  loading,
  organizationId,
}: RecentTicketsTableProps) {
  const router = useRouter()
  const recent = tickets.slice(0, 10)

  return (
    <div className="bg-[#0F172A] border border-white/[0.06] rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.4)] p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-[#F1F5F9]">Recent tickets</h2>
        <Link
          href="/dashboard/tickets"
          className="text-sm text-[#818CF8] hover:text-indigo-300 transition-colors duration-150"
        >
          View all →
        </Link>
      </div>

      {loading ? (
        <LoadingSkeleton type="table" rows={5} />
      ) : recent.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title="No tickets yet"
          description="Tickets will appear here as they come in."
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[480px]">
            <thead>
              <tr className="bg-white/[0.02] border-b border-white/[0.06]">
                <th className="text-[11px] font-semibold uppercase tracking-widest text-[#475569] py-3 px-4 text-left">
                  Question
                </th>
                <th className="text-[11px] font-semibold uppercase tracking-widest text-[#475569] py-3 px-4 text-left w-40">
                  Status
                </th>
                <th className="text-[11px] font-semibold uppercase tracking-widest text-[#475569] py-3 px-4 text-left w-32 hidden sm:table-cell">
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {recent.map((ticket) => (
                <tr
                  key={ticket.id}
                  onClick={() =>
                    router.push(
                      `/dashboard/tickets/${ticket.id}?organization_id=${organizationId}`,
                    )
                  }
                  className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.03] cursor-pointer transition-colors duration-100"
                >
                  <td className="py-3.5 px-4 text-sm text-[#CBD5E1]">
                    {ticket.content.length > 75
                      ? ticket.content.slice(0, 75) + '…'
                      : ticket.content}
                  </td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={ticket.status} />
                  </td>
                  <td className="py-3.5 px-4 text-xs text-[#475569] hidden sm:table-cell">
                    {formatDistanceToNow(new Date(ticket.created_at), { addSuffix: true })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
