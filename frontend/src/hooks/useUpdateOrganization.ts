'use client'

import { useState, useCallback } from 'react'
import apiClient from '@/lib/axios'
import type { Organization } from '@/lib/types'

export interface UpdateOrgPayload {
  name?: string
  website?: string
  industry?: string
  primary_language?: string
  team_size?: string
  monthly_tickets?: string
  support_page_headline?: string
  brand_color?: string
  logo_url?: string
}

export function useUpdateOrganization() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const update = useCallback(async (payload: UpdateOrgPayload): Promise<Organization> => {
    setLoading(true)
    setError(null)
    try {
      const res = await apiClient.patch<{ success: boolean; data: Organization }>(
        '/organizations/me',
        payload,
      )
      return res.data.data
    } catch {
      const msg = 'Failed to update organization'
      setError(msg)
      throw new Error(msg)
    } finally {
      setLoading(false)
    }
  }, [])

  return { update, loading, error }
}
