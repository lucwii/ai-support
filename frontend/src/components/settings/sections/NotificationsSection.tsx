'use client'

import { useState, useEffect } from 'react'
import { Loader2, Save } from 'lucide-react'
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

function confidenceLabel(value: number): { text: string; color: string } {
  if (value >= 90) return { text: 'Conservative', color: 'text-blue-400' }
  if (value >= 70) return { text: 'Balanced', color: 'text-green-400' }
  if (value >= 50) return { text: 'Aggressive', color: 'text-yellow-400' }
  return { text: 'Very aggressive', color: 'text-red-400' }
}

interface ThresholdSliderProps {
  initialValue: number
  saving: boolean
  onSave: (value: number) => void
}

function ThresholdSlider({ initialValue, saving, onSave }: ThresholdSliderProps) {
  const [value, setValue] = useState(initialValue)
  const isDirty = value !== initialValue
  const { text, color } = confidenceLabel(value)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  return (
    <div className="py-4">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <p className="text-sm font-medium text-[#F1F5F9]">AI auto-answer threshold</p>
          <p className="text-xs text-[#475569] mt-0.5">
            AI automatically resolves tickets only when its confidence exceeds this value.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className={`text-xs font-medium ${color}`}>{text}</span>
          <span className="text-sm font-semibold text-[#F1F5F9] w-10 text-right">{value}%</span>
        </div>
      </div>

      <div className="relative">
        <input
          type="range"
          min={0}
          max={100}
          step={1}
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
          className="w-full h-1.5 rounded-full appearance-none cursor-pointer
            bg-white/10
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-4
            [&::-webkit-slider-thumb]:h-4
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-[#6366F1]
            [&::-webkit-slider-thumb]:shadow-[0_0_0_3px_rgba(99,102,241,0.2)]
            [&::-webkit-slider-thumb]:transition-shadow
            [&::-webkit-slider-thumb]:hover:shadow-[0_0_0_5px_rgba(99,102,241,0.25)]
            [&::-moz-range-thumb]:w-4
            [&::-moz-range-thumb]:h-4
            [&::-moz-range-thumb]:rounded-full
            [&::-moz-range-thumb]:bg-[#6366F1]
            [&::-moz-range-thumb]:border-0"
          style={{
            background: `linear-gradient(to right, #6366F1 ${value}%, rgba(255,255,255,0.1) ${value}%)`,
          }}
        />
        <div className="flex justify-between mt-1.5">
          <span className="text-[10px] text-[#475569]">0% — always routes to agent</span>
          <span className="text-[10px] text-[#475569]">100% — never auto-answers</span>
        </div>
      </div>

      {isDirty && (
        <div className="mt-4 flex justify-end">
          <button
            onClick={() => onSave(value)}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium
              bg-[#6366F1] hover:bg-[#5558e8] text-white transition-colors
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Save className="w-3.5 h-3.5" />
            )}
            Save
          </button>
        </div>
      )}
    </div>
  )
}

export default function NotificationsSection() {
  const { preferences, loading, error, update } = usePreferences()
  const [savingThreshold, setSavingThreshold] = useState(false)

  const toggle = async (key: keyof Pick<OrgPreferences, 'email_on_new_ticket' | 'email_on_low_confidence'>) => {
    if (!preferences) return
    try {
      await update({ [key]: !preferences[key] })
    } catch {
      // silent — preference state won't update on failure
    }
  }

  const saveThreshold = async (value: number) => {
    if (!preferences) return
    setSavingThreshold(true)
    try {
      await update({ ai_confidence_threshold: value })
    } catch {
      // silent
    } finally {
      setSavingThreshold(false)
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
          <div className="border-t border-white/[0.06] mt-2 pt-2">
            <ThresholdSlider
              initialValue={preferences.ai_confidence_threshold ?? 90}
              saving={savingThreshold}
              onSave={saveThreshold}
            />
          </div>
        </>
      )}
    </div>
  )
}
