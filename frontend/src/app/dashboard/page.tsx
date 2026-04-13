'use client'

import { format } from 'date-fns'
import PageHeader from '@/components/ui/PageHeader'
import LoadingSkeleton from '@/components/ui/LoadingSkeleton'
import StatsRow from '@/components/dashboard/StatsRow'
import TicketsChart from '@/components/dashboard/TicketsChart'
import RecentTicketsTable from '@/components/dashboard/RecentTicketsTable'
import { useOrganization } from '@/hooks/useOrganization'
import { useTickets } from '@/hooks/useTickets'
import { useDashboardStats } from '@/hooks/useDashboardStats'

export default function DashboardPage() {
  const { organization, loading: orgLoading } = useOrganization()
  const { tickets, loading: ticketsLoading } = useTickets(organization?.id)
  const stats = useDashboardStats(tickets)

  const dateLabel = format(new Date(), 'EEEE, MMMM d, yyyy')

  return (
    <div data-testid="dashboard-page">
      <PageHeader title="Dashboard" subtitle={dateLabel} />

      {/* Stats */}
      {orgLoading || ticketsLoading ? (
        <LoadingSkeleton type="stat" />
      ) : (
        <StatsRow stats={stats} />
      )}

      {/* Chart + Recent tickets */}
      <div className="flex flex-col gap-6 mt-6">
        <TicketsChart tickets={tickets} />

        {organization && (
          <RecentTicketsTable
            tickets={tickets}
            loading={ticketsLoading}
            organizationId={organization.id}
          />
        )}
      </div>
    </div>
  )
}
