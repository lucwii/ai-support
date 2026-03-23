'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import apiClient from '@/lib/axios'
import type { UserProfile } from '@/lib/types'

export function useProfile() {
  const supabase = createClient()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Pozivamo nas backend umesto Supabase direktno.
    //
    // Pre: supabase.auth.getUser() → vraca samo ono sto je u JWT tokenu
    //      (id, email, user_metadata) — bez created_at, bez ticket_count
    //
    // Sada: apiClient.get('/profile/me') → backend poziva admin.getUserById()
    //       i dodatno queryuje tickets tabelu, pa vraca enriched objekat
    //       sa svim poljima koja nam trebaju za novu stranicu.
    //
    // apiClient automatski dodaje Authorization header sa Supabase JWT tokenom
    // (pogledaj src/lib/axios.ts → request interceptor) pa ne moramo nista rucno.
    apiClient.get<{ data: UserProfile }>('/profile/me')
      .then(({ data: res }) => setProfile(res.data))
      .catch(() => setError('Failed to load profile'))
      .finally(() => setLoading(false))
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
      ...profile!,
      email: res.user.email ?? '',
      full_name: meta?.full_name ?? meta?.name ?? '',
    }
    setProfile(updated)
    return updated
  }, [supabase.auth, profile])

  const updatePassword = useCallback(async (newPassword: string) => {
    const { error: err } = await supabase.auth.updateUser({ password: newPassword })
    if (err) throw new Error(err.message)
  }, [supabase.auth])

  const uploadAvatar = useCallback(async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)

    const { data: res } = await apiClient.post<{ data: { avatar_url: string } }>(
      '/profile/me/avatar',
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    )

    setProfile((prev) => prev ? { ...prev, avatar_url: res.data.avatar_url } : prev)
    return res.data.avatar_url
  }, [])

  const deleteAccount = useCallback(async () => {
    await apiClient.delete('/profile/me')
  }, [])

  return { profile, loading, error, updateProfile, updatePassword, uploadAvatar, deleteAccount }
}
