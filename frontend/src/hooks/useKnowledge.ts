'use client'

import { useState, useEffect, useCallback } from 'react'
import apiClient from '@/lib/axios'
import { Knowledge } from '@/lib/types'

export function useKnowledge(organizationId: string | null | undefined) {
  const [knowledge, setKnowledge] = useState<Knowledge[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetch = useCallback(async () => {
    if (!organizationId) return
    try {
      const res = await apiClient.get<{ success: boolean; data: Knowledge[] }>(
        `/knowledge?organization_id=${organizationId}`,
      )
      setKnowledge(res.data.data)
      setError(null)
    } catch {
      setError('Failed to load knowledge base')
    } finally {
      setLoading(false)
    }
  }, [organizationId])

  useEffect(() => {
    if (!organizationId) return
    setLoading(true)
    fetch()
  }, [organizationId, fetch])

  const upload = useCallback(
    async (content: string): Promise<{ totalChunks: number; savedChunks: number }> => {
      const res = await apiClient.post<{
        success: boolean
        data: { totalChunks: number; savedChunks: number }
      }>('/knowledge', { organization_id: organizationId, content })
      await fetch()
      return res.data.data
    },
    [organizationId, fetch],
  )

  const remove = useCallback(
    async (id: string) => {
      await apiClient.delete(`/knowledge/${id}?organization_id=${organizationId}`)
      setKnowledge((prev) => prev.filter((k) => k.id !== id))
    },
    [organizationId],
  )

  return { knowledge, loading, error, upload, remove, refetch: fetch }
}
