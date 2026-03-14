'use client'

import { useState, useEffect, useCallback } from 'react'
import publicApiClient from '@/lib/publicApiClient'
import { PublicTicket } from '@/lib/types'

const POLL_INTERVAL_MS = 5_000

export function usePublicTicket(ticketId: string) {
  const [ticket, setTicket] = useState<PublicTicket | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTicket = useCallback(async () => {
    try {
      const res = await publicApiClient.get<{ success: boolean; data: PublicTicket }>(
        `/tickets/public/${ticketId}`,
      )
      setTicket(res.data.data)
      setError(null)
    } catch {
      setError('Ticket not found')
    } finally {
      setLoading(false)
    }
  }, [ticketId])

  useEffect(() => {
    fetchTicket()
  }, [fetchTicket])

  // Poll while AI is still processing
  useEffect(() => {
    if (!ticket || ticket.status !== 'processing') return
    const interval = setInterval(fetchTicket, POLL_INTERVAL_MS)
    return () => clearInterval(interval)
  }, [ticket, fetchTicket])

  return { ticket, loading, error }
}
