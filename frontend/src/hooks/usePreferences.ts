'use client'

import { useState, useEffect, useCallback } from 'react'
import apiClient from '@/lib/axios'
import type { OrgPreferences } from '@/lib/types'

export function usePreferences() {
  const [preferences, setPreferences] = useState<OrgPreferences | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    apiClient
      .get<{ success: boolean; data: OrgPreferences }>('/organizations/me/preferences')
      .then((res) => setPreferences(res.data.data))
      .catch(() => setError('Failed to load preferences'))
      .finally(() => setLoading(false))
  }, [])

  const update = useCallback(async (patch: Partial<OrgPreferences>): Promise<OrgPreferences> => {
    const res = await apiClient.patch<{ success: boolean; data: OrgPreferences }>(
      '/organizations/me/preferences',
      patch,
    )
    setPreferences(res.data.data)
    return res.data.data
  }, [])

  return { preferences, loading, error, update }
}
