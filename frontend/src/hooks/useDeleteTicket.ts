'use client'

import { useState } from 'react'
import apiClient from '@/lib/axios'

export function useDeleteTicket() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const deleteTicket = async (ticketId: string): Promise<boolean> => {
    setLoading(true)
    setError(null)
    try {
      await apiClient.delete(`/tickets/${ticketId}`)
      return true
    } catch {
      setError('Failed to delete ticket')
      return false
    } finally {
      setLoading(false)
    }
  }

  return { deleteTicket, loading, error }
}
