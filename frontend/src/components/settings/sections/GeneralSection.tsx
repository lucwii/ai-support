'use client'

import { useState, useEffect } from 'react'
import { Save, Loader2 } from 'lucide-react'
import { useUpdateOrganization } from '@/hooks/useUpdateOrganization'
import type { Organization } from '@/lib/types'

const INDUSTRIES = [
  { value: 'saas',       label: 'SaaS' },
  { value: 'ecommerce',  label: 'E-commerce' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'fintech',    label: 'Fintech' },
  { value: 'education',  label: 'Education' },
  { value: 'other',      label: 'Other' },
]

const LANGUAGES = [
  { value: 'english', label: 'English' },
  { value: 'bschr',   label: 'Bosnian / Serbian / Croatian' },
  { value: 'german',  label: 'German' },
  { value: 'french',  label: 'French' },
  { value: 'spanish', label: 'Spanish' },
  { value: 'other',   label: 'Other' },
]

const TEAM_SIZES = [
  { value: '1-10',    label: '1–10 people' },
  { value: '11-50',   label: '11–50 people' },
  { value: '51-200',  label: '51–200 people' },
  { value: '201-500', label: '201–500 people' },
  { value: '500+',    label: '500+ people' },
]

interface FormState {
  name: string
  website: string
  industry: string
  primary_language: string
  team_size: string
}

function toForm(org: Organization): FormState {
  return {
    name: org.name ?? '',
    website: org.website ?? '',
    industry: org.industry ?? '',
    primary_language: org.primary_language ?? '',
    team_size: org.team_size ?? '',
  }
}

function isDirty(a: FormState, b: FormState) {
  return (Object.keys(a) as (keyof FormState)[]).some((k) => a[k] !== b[k])
}

interface Props {
  organization: Organization
  onUpdated: (org: Organization) => void
}

export default function GeneralSection({ organization, onUpdated }: Props) {
  const [form, setForm] = useState<FormState>(() => toForm(organization))
  const [initial, setInitial] = useState<FormState>(() => toForm(organization))
  const [success, setSuccess] = useState(false)
  const { update, loading, error } = useUpdateOrganization()

  useEffect(() => {
    const base = toForm(organization)
    setForm(base)
    setInitial(base)
  }, [organization])

  const setField = (key: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    setSuccess(false)
  }

  const handleSave = async () => {
    try {
      const updated = await update({
        name: form.name,
        website: form.website || undefined,
        industry: form.industry || undefined,
        primary_language: form.primary_language || undefined,
        team_size: form.team_size || undefined,
      })
      setInitial(toForm(updated))
      onUpdated(updated)
      setSuccess(true)
    } catch {
      // error is shown via hook state
    }
  }

  const dirty = isDirty(form, initial)

  return (
    <div className="bg-[#0F172A] border border-white/[0.06] rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.4)] p-6">
      <h2 className="text-base font-semibold text-[#F1F5F9] mb-5">Organization Profile</h2>

      <div className="flex flex-col gap-5">
        {/* Name */}
        <Field label="Company name" required>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setField('name', e.target.value)}
            placeholder="Acme Inc."
            className={inputClass}
          />
        </Field>

        {/* Website */}
        <Field label="Website">
          <input
            type="url"
            value={form.website}
            onChange={(e) => setField('website', e.target.value)}
            placeholder="https://acme.com"
            className={inputClass}
          />
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Industry */}
          <Field label="Industry">
            <select
              value={form.industry}
              onChange={(e) => setField('industry', e.target.value)}
              className={selectClass}
            >
              <option value="">Select industry</option>
              {INDUSTRIES.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </Field>

          {/* Language */}
          <Field label="Support language">
            <select
              value={form.primary_language}
              onChange={(e) => setField('primary_language', e.target.value)}
              className={selectClass}
            >
              <option value="">Select language</option>
              {LANGUAGES.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </Field>

          {/* Team size */}
          <Field label="Team size">
            <select
              value={form.team_size}
              onChange={(e) => setField('team_size', e.target.value)}
              className={selectClass}
            >
              <option value="">Select team size</option>
              {TEAM_SIZES.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </Field>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-6 pt-5 border-t border-white/[0.06]">
        <div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          {success && !dirty && <p className="text-sm text-emerald-400">Changes saved</p>}
        </div>
        <button
          onClick={handleSave}
          disabled={!dirty || loading}
          className="inline-flex items-center gap-2 bg-[#6366F1] hover:bg-[#4F46E5] disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium px-4 py-2 rounded-xl transition-all duration-150 hover:-translate-y-px disabled:hover:translate-y-0"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save changes
        </button>
      </div>
    </div>
  )
}

// ── Shared sub-components ──────────────────────────────────────────────────

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[11px] font-semibold uppercase tracking-widest text-[#475569] mb-1.5">
        {label}
        {required && <span className="text-[#6366F1] ml-1">*</span>}
      </label>
      {children}
    </div>
  )
}

const inputClass =
  'w-full bg-[#060D1A] border border-white/[0.06] rounded-xl text-sm text-[#F1F5F9] placeholder-[#334155] px-4 py-2.5 focus:outline-none focus:border-[#6366F1]/50 transition-colors duration-150'

const selectClass =
  'w-full bg-[#060D1A] border border-white/[0.06] rounded-xl text-sm text-[#F1F5F9] px-4 py-2.5 focus:outline-none focus:border-[#6366F1]/50 transition-colors duration-150 appearance-none cursor-pointer'
