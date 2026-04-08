'use client'

import { useState } from 'react'
import { useOrganization } from '@/hooks/useOrganization'
import { useTickets } from '@/hooks/useTickets'
import { useProfile } from '@/hooks/useProfile'
import { TicketStatus } from '@/lib/types'
import PageHeader from '@/components/ui/PageHeader'
import LoadingSkeleton from '@/components/ui/LoadingSkeleton'
import InboxFilters, { InboxFilter } from '@/components/inbox/InboxFilters'
import InboxSearch from '@/components/inbox/InboxSearch'
import InboxList from '@/components/inbox/InboxList'

export default function InboxPage() {
  const [activeFilter, setActiveFilter] = useState<InboxFilter>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const { organization } = useOrganization()
  const { tickets, loading } = useTickets(organization?.id)
  const { profile } = useProfile()

  const pendingCount = tickets.filter((t) => t.status === 'pending_agent').length

  const filtered =
    activeFilter === 'all'
      ? tickets
      : activeFilter === 'assigned_to_me'
      ? tickets.filter((t) => t.assigned_to === profile?.id)
      : tickets.filter((t) => t.status === (activeFilter as TicketStatus))

  const lowerQuery = searchQuery.trim().toLowerCase()
  const searched =
    lowerQuery === ''
      ? filtered
      : filtered.filter(
          (t) =>
            t.content.toLowerCase().includes(lowerQuery) ||
            (t.customer_email?.toLowerCase().includes(lowerQuery) ?? false),
        )

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

        <InboxSearch value={searchQuery} onChange={setSearchQuery} />

        {loading ? (
          <div className="p-2">
            <LoadingSkeleton type="table" rows={8} />
          </div>
        ) : (
          <InboxList
            tickets={searched}
            emptyTitle={lowerQuery ? 'No tickets match your search' : undefined}
            emptyDescription={lowerQuery ? 'Try a different keyword or email address.' : undefined}
          />
        )}
      </div>
    </div>
  )
}
