export type TicketStatus = 'processing' | 'auto_answered' | 'pending_agent' | 'resolved'

export interface PublicTicket {
  id: string
  content: string
  status: TicketStatus
  ai_response: string | null
  agent_response: string | null
  created_at: string
}

export interface Ticket {
  id: string
  organization_id: string
  content: string
  ai_response: string | null
  agent_response: string | null
  confidence: number | null
  status: TicketStatus
  customer_email: string | null
  assigned_to: string | null
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
  email_on_new_ticket: boolean
  email_on_low_confidence: boolean
  widget_accent_color: string
  widget_position: 'bottom-right' | 'bottom-left'
  widget_placeholder_text: string
  widget_button_text: string
  role: string
  created_at: string
}

export interface WidgetSettings {
  accent_color: string
  position: 'bottom-right' | 'bottom-left'
  placeholder_text: string
  button_text: string
}

export interface OrgPreferences {
  email_on_new_ticket: boolean
  email_on_low_confidence: boolean
}

export type MemberRole = 'owner' | 'admin' | 'agent'

export interface OrgMember {
  id: string
  user_id: string
  role: MemberRole
  email: string | null
  full_name: string | null
  created_at: string
}

export interface OrgPendingInvite {
  id: string
  email: string
  role: 'admin' | 'agent'
  status: 'pending'
  created_at: string
}

export interface Knowledge {
  id: string
  organization_id: string
  content: string
  created_at: string
}

export interface UserProfile {
  id: string
  email: string
  full_name: string
  provider: string
  avatar_url: string | null
  created_at: string
  ticket_count: number
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

export interface TicketNote {
  id: string
  ticket_id: string
  organization_id: string
  author_id: string
  author_name: string
  content: string
  created_at: string
}
