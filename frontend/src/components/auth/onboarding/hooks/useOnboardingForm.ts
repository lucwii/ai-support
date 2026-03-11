'use client'

import { useState } from 'react'
import apiClient from '@/lib/axios'
import type { OnboardingFormData, Industry, PrimaryLanguage, TeamSize, MonthlyTickets } from '../types'

const INITIAL_FORM: OnboardingFormData = {
  name: '',
  industry: '',
  primary_language: '',
  team_size: '',
  monthly_tickets: '',
  website: '',
}

export function useOnboardingForm() {
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState<OnboardingFormData>(INITIAL_FORM)

  function setField<K extends keyof OnboardingFormData>(key: K, value: OnboardingFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const isStep0Valid =
    form.name.trim().length >= 2 &&
    form.industry !== '' &&
    form.primary_language !== ''

  function goNext() {
    if (!isStep0Valid) return
    setStep((s) => s + 1)
  }

  function goBack() {
    if (step > 0) setStep((s) => s - 1)
  }

  async function submit() {
    if (!isStep0Valid) return

    setLoading(true)
    setError(null)

    try {
      const payload: Record<string, string> = {
        name: form.name.trim(),
        industry: form.industry as Industry,
        primary_language: form.primary_language as PrimaryLanguage,
      }
      if (form.team_size)       payload.team_size       = form.team_size as TeamSize
      if (form.monthly_tickets) payload.monthly_tickets = form.monthly_tickets as MonthlyTickets
      if (form.website.trim())  payload.website         = form.website.trim()

      await apiClient.post('/organizations', payload)
      // Hard redirect — osigurava svježe kolačiće i middleware dobija ažuran token
      window.location.href = '/dashboard'
    } catch (err: any) {
      const status = err?.response?.status
      const raw    = err?.response?.data?.message

      // Org već postoji (vjerovatno od ranijeg submita) — samo idi na dashboard
      if (status === 409) {
        window.location.href = '/dashboard'
        return
      }

      // NestJS vraća message kao array za validation greške
      const message = Array.isArray(raw) ? raw[0] : (raw ?? 'Something went wrong. Please try again.')
      setError(message)
      setLoading(false)
    }
  }

  return { step, form, loading, error, isStep0Valid, setField, goNext, goBack, submit }
}
