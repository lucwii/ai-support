'use client'

import { Loader2 } from 'lucide-react'
import { usePreferences } from '@/hooks/usePreferences'
import type { OrgPreferences } from '@/lib/types'

interface ToggleRowProps {
  label: string
  description: string
  checked: boolean
  disabled: boolean
  onChange: (value: boolean) => void
}

function ToggleRow({ label, description, checked, disabled, onChange }: ToggleRowProps) {
  return (
    <div className="flex items-start justify-between gap-4 py-4 border-b border-white/[0.06] last:border-0">
      <div>
        <p className="text-sm font-medium text-[#F1F5F9]">{label}</p>
        <p className="text-xs text-[#475569] mt-0.5">{description}</p>
      </div>
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => !disabled && onChange(!checked)}
        disabled={disabled}
        className={`
          relative shrink-0 w-10 h-5.5 rounded-full transition-colors duration-200 focus:outline-none
          ${checked ? 'bg-[#6366F1]' : 'bg-white/10'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        <span className={`
          absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200
          ${checked ? 'translate-x-4.5' : 'translate-x-0'}
        `} />
      </button>
    </div>
  )
}

export default function NotificationsSection() {
  const { preferences, loading, error, update } = usePreferences()

  const toggle = async (key: keyof OrgPreferences) => {
    if (!preferences) return
    try {
      await update({ [key]: !preferences[key] })
    } catch {
      // silent — preference state won't update on failure
    }
  }

  return (
    <div className="bg-[#0F172A] border border-white/[0.06] rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.4)] p-6">
      <h2 className="text-base font-semibold text-[#F1F5F9] mb-1">Notifications</h2>
      <p className="text-sm text-[#475569] mb-5">Choose when you receive email notifications.</p>

      {loading && (
        <div className="flex items-center gap-2 text-[#475569] py-4">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-sm">Loading preferences...</span>
        </div>
      )}

      {error && <p className="text-sm text-red-400 py-4">{error}</p>}

      {preferences && (
        <>
          <ToggleRow
            label="New ticket"
            description="Get notified when a customer submits a new support ticket."
            checked={preferences.email_on_new_ticket}
            disabled={false}
            onChange={() => toggle('email_on_new_ticket')}
          />
          <ToggleRow
            label="Low confidence answer"
            description="Get notified when the AI is unsure and routes a ticket to you."
            checked={preferences.email_on_low_confidence}
            disabled={false}
            onChange={() => toggle('email_on_low_confidence')}
          />
        </>
      )}
    </div>
  )
}
