'use client'

import { useState } from 'react'
import { useOrganization } from '@/hooks/useOrganization'
import { useTickets } from '@/hooks/useTickets'
import { TicketStatus } from '@/lib/types'
import PageHeader from '@/components/ui/PageHeader'
import LoadingSkeleton from '@/components/ui/LoadingSkeleton'
import InboxFilters, { InboxFilter } from '@/components/inbox/InboxFilters'
import InboxList from '@/components/inbox/InboxList'

export default function InboxPage() {
  const [activeFilter, setActiveFilter] = useState<InboxFilter>('all')

  const { organization } = useOrganization()
  const { tickets, loading } = useTickets(organization?.id)

  const pendingCount = tickets.filter((t) => t.status === 'pending_agent').length

  const filtered =
    activeFilter === 'all'
      ? tickets
      : tickets.filter((t) => t.status === (activeFilter as TicketStatus))

  const subtitle =
    pendingCount > 0
      ? `${pendingCount} ticket${pendingCount === 1 ? '' : 's'} need${pendingCount === 1 ? 's' : ''} your attention`
      : 'All caught up!'

  return (
    <div>
      <PageHeader title="Inbox" subtitle={subtitle} />

      <div className="bg-[#0F172A] border border-white/[0.06] rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.4)] overflow-hidden">
        <InboxFilters
          activeFilter={activeFilter}
          onChange={setActiveFilter}
          tickets={tickets}
        />

        {loading ? (
          <div className="p-2">
            <LoadingSkeleton type="table" rows={8} />
          </div>
        ) : (
          <InboxList tickets={filtered} />
        )}
      </div>
    </div>
  )
}
