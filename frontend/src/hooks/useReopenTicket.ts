'use client'

import { useState } from 'react'
import apiClient from '@/lib/axios'
import { Ticket } from '@/lib/types'

export function useReopenTicket() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const reopen = async (ticketId: string): Promise<Ticket | null> => {
    setLoading(true)
    setError(null)
    try {
      const res = await apiClient.patch<{ success: boolean; data: Ticket }>(
        `/tickets/${ticketId}/reopen`,
      )
      return res.data.data
    } catch {
      setError('Failed to reopen ticket')
      return null
    } finally {
      setLoading(false)
    }
  }

  return { reopen, loading, error }
}
