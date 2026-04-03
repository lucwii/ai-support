'use client'

import { useState, useEffect, useCallback } from 'react'
import apiClient from '@/lib/axios'
import { TicketNote } from '@/lib/types'

export function useTicketNotes(ticketId: string) {
  const [notes, setNotes] = useState<TicketNote[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchNotes = useCallback(async () => {
    try {
      const res = await apiClient.get<{ success: boolean; data: TicketNote[] }>(
        `/notes/${ticketId}`,
      )
      setNotes(res.data.data)
    } catch {
      setError('Failed to load notes')
    } finally {
      setLoading(false)
    }
  }, [ticketId])

  useEffect(() => {
    fetchNotes()
  }, [fetchNotes])

  const addNote = async (content: string): Promise<boolean> => {
    setSubmitting(true)
    setError(null)
    try {
      const res = await apiClient.post<{ success: boolean; data: TicketNote }>(
        `/notes/${ticketId}`,
        { content },
      )
      setNotes((prev) => [...prev, res.data.data])
      return true
    } catch {
      setError('Failed to add note')
      return false
    } finally {
      setSubmitting(false)
    }
  }

  const deleteNote = async (noteId: string): Promise<boolean> => {
    setError(null)
    try {
      await apiClient.delete(`/notes/${ticketId}/${noteId}`)
      setNotes((prev) => prev.filter((n) => n.id !== noteId))
      return true
    } catch {
      setError('Failed to delete note')
      return false
    }
  }

  return { notes, loading, submitting, error, addNote, deleteNote }
}
