'use client'

import { useState, useEffect, useCallback } from 'react'
import apiClient from '@/lib/axios'
import { Ticket } from '@/lib/types'

export function useTickets(organizationId: string | null | undefined) {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetch = useCallback(async () => {
    if (!organizationId) return
    try {
      const res = await apiClient.get<{ success: boolean; data: Ticket[] }>(
        `/tickets?organization_id=${organizationId}`,
      )
      setTickets(res.data.data)
      setError(null)
    } catch {
      setError('Failed to load tickets')
    } finally {
      setLoading(false)
    }
  }, [organizationId])

  useEffect(() => {
    if (!organizationId) return
    setLoading(true)
    fetch()
    const interval = setInterval(fetch, 30_000)
    return () => clearInterval(interval)
  }, [organizationId, fetch])

  return { tickets, loading, error, refetch: fetch }
}
