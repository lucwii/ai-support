'use client'

import { useState, useEffect, useCallback } from 'react'
import apiClient from '@/lib/axios'
import { Ticket, TicketLog } from '@/lib/types'

interface TicketDetail {
  ticket: Ticket
  logs: TicketLog[]
}

export function useTicket(ticketId: string, organizationId: string | null | undefined) {
  const [ticket, setTicket] = useState<Ticket | null>(null)
  const [logs, setLogs] = useState<TicketLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetch = useCallback(async () => {
    if (!ticketId || !organizationId) return
    try {
      const res = await apiClient.get<{ success: boolean; data: TicketDetail }>(
        `/tickets/${ticketId}?organization_id=${organizationId}`,
      )
      setTicket(res.data.data.ticket)
      setLogs(res.data.data.logs)
      setError(null)
    } catch {
      setError('Failed to load ticket')
    } finally {
      setLoading(false)
    }
  }, [ticketId, organizationId])

  useEffect(() => {
    if (!ticketId || !organizationId) return
    setLoading(true)
    fetch()
  }, [ticketId, organizationId, fetch])

  return { ticket, logs, loading, error, refetch: fetch }
}
