'use client'

import { useState } from 'react'
import publicApiClient from '@/lib/publicApiClient'
import { PublicTicket } from '@/lib/types'

interface SubmitTicketPayload {
  organization_id: string
  content: string
  customer_email?: string
}

export interface SubmitTicketResult {
  ticket: PublicTicket
  wasAutoAnswered: boolean
  message: string
}

export function useSubmitTicket() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submit = async (payload: SubmitTicketPayload): Promise<SubmitTicketResult | null> => {
    setLoading(true)
    setError(null)
    try {
      const res = await publicApiClient.post<{ success: boolean; data: SubmitTicketResult }>(
        '/tickets',
        payload,
      )
      return res.data.data
    } catch {
      setError('Failed to submit your ticket. Please try again.')
      return null
    } finally {
      setLoading(false)
    }
  }

  return { submit, loading, error }
}
