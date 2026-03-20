'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { UserProfile } from '@/lib/types'

export function useProfile() {
  const supabase = createClient()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user }, error: err }) => {
      if (err || !user) {
        setError('Failed to load profile')
      } else {
        const meta = user.user_metadata
        setProfile({
          id: user.id,
          email: user.email ?? '',
          full_name: meta?.full_name ?? meta?.name ?? '',
          provider: user.app_metadata?.provider ?? 'email',
        })
      }
      setLoading(false)
    })
  }, [])

  const updateProfile = useCallback(async (data: { full_name?: string; email?: string }) => {
    setError(null)
    const payload: Parameters<typeof supabase.auth.updateUser>[0] = {}
    if (data.email) payload.email = data.email
    if (data.full_name !== undefined) payload.data = { full_name: data.full_name }

    const { data: res, error: err } = await supabase.auth.updateUser(payload)
    if (err) throw new Error(err.message)

    const meta = res.user.user_metadata
    const updated: UserProfile = {
      id: res.user.id,
      email: res.user.email ?? '',
      full_name: meta?.full_name ?? meta?.name ?? '',
      provider: res.user.app_metadata?.provider ?? 'email',
    }
    setProfile(updated)
    return updated
  }, [supabase.auth])

  const updatePassword = useCallback(async (newPassword: string) => {
    const { error: err } = await supabase.auth.updateUser({ password: newPassword })
    if (err) throw new Error(err.message)
  }, [supabase.auth])

  return { profile, loading, error, updateProfile, updatePassword }
}
