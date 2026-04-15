'use client'

import { useState, useEffect } from 'react'
import { Save, Loader2, Mail } from 'lucide-react'
import type { UserProfile } from '@/lib/types'

interface FormState {
  full_name: string
  email: string
}

function isDirty(a: FormState, b: FormState) {
  return a.full_name !== b.full_name || a.email !== b.email
}

interface Props {
  profile: UserProfile
  onUpdate: (data: { full_name?: string; email?: string }) => Promise<UserProfile>
}

export default function PersonalInfoSection({ profile, onUpdate }: Props) {
  const [form, setForm] = useState<FormState>({ full_name: profile.full_name ?? '', email: profile.email ?? '' })
  const [initial, setInitial] = useState<FormState>({ full_name: profile.full_name ?? '', email: profile.email ?? '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [emailConfirmSent, setEmailConfirmSent] = useState(false)

  useEffect(() => {
    const base = { full_name: profile.full_name ?? '', email: profile.email ?? '' }
    setForm(base)
    setInitial(base)
  }, [profile])

  const setField = (key: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    setSuccess(false)
    setEmailConfirmSent(false)
    setError(null)
  }

  const handleSave = async () => {
    setLoading(true)
    setError(null)
    try {
      const payload: { full_name?: string; email?: string } = {}
      if (form.full_name !== initial.full_name) payload.full_name = form.full_name
      if (form.email !== initial.email) payload.email = form.email

      const updated = await onUpdate(payload)
      setInitial({ full_name: updated.full_name ?? '', email: updated.email ?? '' })

      if (form.email !== initial.email) {
        setEmailConfirmSent(true)
      } else {
        setSuccess(true)
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const dirty = isDirty(form, initial)

  return (
    <div className="bg-[#0F172A] border border-white/[0.06] rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.4)] p-6">
      <h2 className="text-base font-semibold text-[#F1F5F9] mb-5">Personal Information</h2>

      <div className="flex flex-col gap-5">
        <Field label="Full name">
          <input
            type="text"
            value={form.full_name}
            onChange={(e) => setField('full_name', e.target.value)}
            placeholder="Your name"
            className={inputClass}
          />
        </Field>

        <Field label="Email address">
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#334155] pointer-events-none" />
            <input
              type="email"
              value={form.email}
              onChange={(e) => setField('email', e.target.value)}
              placeholder="you@example.com"
              className={`${inputClass} pl-10`}
            />
          </div>
          <p className="text-xs text-[#334155] mt-1.5">
            Changing your email will send a confirmation to the new address.
          </p>
        </Field>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-6 pt-5 border-t border-white/[0.06]">
        <div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          {success && !dirty && <p className="text-sm text-emerald-400">Changes saved</p>}
          {emailConfirmSent && (
            <p className="text-sm text-amber-400">Confirmation email sent — check your inbox.</p>
          )}
        </div>
        <button
          onClick={handleSave}
          disabled={!dirty || loading}
          className="inline-flex items-center justify-center gap-2 bg-[#6366F1] hover:bg-[#4F46E5] disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium px-4 py-2 rounded-xl transition-all duration-150 hover:-translate-y-px disabled:hover:translate-y-0 w-full sm:w-auto"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save changes
        </button>
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[11px] font-semibold uppercase tracking-widest text-[#475569] mb-1.5">
        {label}
      </label>
      {children}
    </div>
  )
}

const inputClass =
  'w-full bg-[#060D1A] border border-white/[0.06] rounded-xl text-sm text-[#F1F5F9] placeholder-[#334155] px-4 py-2.5 focus:outline-none focus:border-[#6366F1]/50 transition-colors duration-150'
