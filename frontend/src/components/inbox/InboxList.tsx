import { Inbox } from 'lucide-react'
import { Ticket } from '@/lib/types'
import EmptyState from '@/components/ui/EmptyState'
import InboxRow from '@/components/inbox/InboxRow'

interface InboxListProps {
  tickets: Ticket[]
}

export default function InboxList({ tickets }: InboxListProps) {
  if (tickets.length === 0) {
    return (
      <EmptyState
        icon={Inbox}
        title="No tickets here"
        description="All caught up! New tickets will appear as they come in."
      />
    )
  }

  return (
    <div>
      {tickets.map((ticket) => (
        <InboxRow key={ticket.id} ticket={ticket} />
      ))}
    </div>
  )
}
