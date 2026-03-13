'use client'

import { useState } from 'react'
import apiClient from '@/lib/axios'
import { Ticket, TicketStatus } from '@/lib/types'

interface UpdateTicketPayload {
  status: TicketStatus
  agent_response?: string
}

export function useUpdateTicket() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const update = async (
    ticketId: string,
    payload: UpdateTicketPayload,
  ): Promise<Ticket | null> => {
    setLoading(true)
    setError(null)
    try {
      const res = await apiClient.patch<{ success: boolean; data: Ticket }>(
        `/tickets/${ticketId}`,
        payload,
      )
      return res.data.data
    } catch {
      setError('Failed to update ticket')
      return null
    } finally {
      setLoading(false)
    }
  }

  return { update, loading, error }
}
