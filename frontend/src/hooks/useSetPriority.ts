'use client'

import { useState } from 'react'
import apiClient from '@/lib/axios'
import type { Ticket, TicketPriority } from '@/lib/types'

export function useSetPriority() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const setPriority = async (ticketId: string, priority: TicketPriority): Promise<Ticket | null> => {
    setLoading(true)
    setError(null)
    try {
      const res = await apiClient.patch<{ success: boolean; data: Ticket }>(
        `/tickets/${ticketId}/priority`,
        { priority },
      )
      return res.data.data
    } catch {
      setError('Failed to set priority')
      return null
    } finally {
      setLoading(false)
    }
  }

  return { setPriority, loading, error }
}
