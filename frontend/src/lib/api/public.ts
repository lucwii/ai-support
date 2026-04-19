const API_URL = process.env.NEXT_PUBLIC_API_URL

export interface SubmitTicketPayload {
  organization_id: string
  content: string
  customer_email?: string
}

export interface SubmitTicketResult {
  id: string
  status: 'auto_answered' | 'pending_agent' | 'processing'
  ai_response: string | null
  confidence: number | null
}

export async function submitTicket(payload: SubmitTicketPayload): Promise<SubmitTicketResult> {
  const response = await fetch(`${API_URL}/tickets`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error((error as any).message ?? 'Failed to submit ticket')
  }

  const json = await response.json()
  const ticket = json.data?.ticket ?? json.data ?? json
  return {
    id: ticket.id,
    status: ticket.status,
    ai_response: ticket.ai_response ?? null,
    confidence: ticket.confidence ?? null,
  }
}
