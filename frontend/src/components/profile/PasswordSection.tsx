'use client'

import { useState } from 'react'
import { KeyRound, Loader2, Eye, EyeOff } from 'lucide-react'

interface Props {
  onUpdatePassword: (newPassword: string) => Promise<void>
}

export default function PasswordSection({ onUpdatePassword }: Props) {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const validationError =
    password.length > 0 && password.length < 8
      ? 'Password must be at least 8 characters'
      : confirm.length > 0 && password !== confirm
      ? 'Passwords do not match'
      : null

  const canSave = password.length >= 8 && password === confirm && !loading

  const handleSave = async () => {
    setError(null)
    setSuccess(false)
    setLoading(true)
    try {
      await onUpdatePassword(password)
      setPassword('')
      setConfirm('')
      setSuccess(true)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-[#0F172A] border border-white/[0.06] rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.4)] p-6">
      <div className="flex items-center gap-2.5 mb-5">
        <KeyRound className="w-4 h-4 text-[#475569]" />
        <h2 className="text-base font-semibold text-[#F1F5F9]">Change Password</h2>
      </div>

      <div className="flex flex-col gap-5">
        <Field label="New password">
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => { setPassword(e.target.value); setSuccess(false); setError(null) }}
              placeholder="Min. 8 characters"
              className={inputClass}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#334155] hover:text-[#64748B] transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </Field>

        <Field label="Confirm new password">
          <input
            type={showPassword ? 'text' : 'password'}
            value={confirm}
            onChange={(e) => { setConfirm(e.target.value); setSuccess(false); setError(null) }}
            placeholder="Repeat password"
            className={inputClass}
          />
        </Field>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-6 pt-5 border-t border-white/[0.06]">
        <div>
          {(error || validationError) && (
            <p className="text-sm text-red-400">{error ?? validationError}</p>
          )}
          {success && <p className="text-sm text-emerald-400">Password updated successfully</p>}
        </div>
        <button
          onClick={handleSave}
          disabled={!canSave}
          className="inline-flex items-center justify-center gap-2 bg-[#6366F1] hover:bg-[#4F46E5] disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium px-4 py-2 rounded-xl transition-all duration-150 hover:-translate-y-px disabled:hover:translate-y-0 w-full sm:w-auto"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
          Update password
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
