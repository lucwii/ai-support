'use client'

import { useState, useEffect, useCallback } from 'react'
import apiClient from '@/lib/axios'
import type { OrgMember, OrgPendingInvite } from '@/lib/types'

interface MembersResponse {
  members: OrgMember[]
  pending_invites: OrgPendingInvite[]
}

export function useMembers() {
  const [members, setMembers] = useState<OrgMember[]>([])
  const [pendingInvites, setPendingInvites] = useState<OrgPendingInvite[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetch = useCallback(async () => {
    try {
      const res = await apiClient.get<{ success: boolean; data: MembersResponse }>(
        '/organizations/me/members',
      )
      setMembers(res.data.data.members)
      setPendingInvites(res.data.data.pending_invites)
      setError(null)
    } catch {
      setError('Failed to load team members')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetch() }, [fetch])

  const invite = useCallback(
    async (email: string, role: 'agent' | 'admin') => {
      await apiClient.post('/organizations/me/members/invite', { email, role })
      await fetch()
    },
    [fetch],
  )

  const remove = useCallback(async (userId: string) => {
    await apiClient.delete(`/organizations/me/members/${userId}`)
    setMembers((prev) => prev.filter((m) => m.user_id !== userId))
  }, [])

  return { members, pendingInvites, loading, error, invite, remove }
}
