'use client'

import { useState, useEffect } from 'react'
import apiClient from '@/lib/axios'
import { Organization } from '@/lib/types'

export function useOrganization() {
  const [organization, setOrganization] = useState<Organization | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    apiClient
      .get<{ success: boolean; data: Organization }>('/organizations/me')
      .then((res) => setOrganization(res.data.data))
      .catch(() => setError('Failed to load organization'))
      .finally(() => setLoading(false))
  }, [])

  return { organization, loading, error }
}
