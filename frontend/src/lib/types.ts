export type TicketStatus = 'processing' | 'auto_answered' | 'pending_agent' | 'resolved'

export interface Ticket {
  id: string
  organization_id: string
  content: string
  ai_response: string | null
  confidence: number | null
  status: TicketStatus
  customer_email: string | null
  created_at: string
  updated_at: string
}

export interface Organization {
  id: string
  name: string
  industry: string | null
  primary_language: string | null
  team_size: string | null
  monthly_tickets: string | null
  website: string | null
  owner_id: string
  created_at: string
}

export interface TicketLog {
  id: string
  ticket_id: string
  organization_id: string
  action: string
  message: string
  metadata: Record<string, unknown>
  created_at: string
}
