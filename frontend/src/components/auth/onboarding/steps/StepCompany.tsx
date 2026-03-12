import SelectCard from '../SelectCard'
import { INDUSTRIES, LANGUAGES } from '../constants'
import type { OnboardingFormData } from '../types'

interface Props {
  form: OnboardingFormData
  setField: <K extends keyof OnboardingFormData>(key: K, value: OnboardingFormData[K]) => void
}

const inputStyle = {
  background: '#0A0F1E',
  border: '1px solid rgba(255,255,255,0.06)',
  color: '#F1F5F9',
}

export default function StepCompany({ form, setField }: Props) {
  return (
    <div className="flex flex-col gap-6">
      {/* Company name */}
      <div>
        <label className="block text-[12px] font-semibold uppercase tracking-widest mb-2" style={{ color: '#475569' }}>
          Company name <span style={{ color: '#6366F1' }}>*</span>
        </label>
        <input
          type="text"
          required
          autoFocus
          value={form.name}
          onChange={(e) => setField('name', e.target.value)}
          placeholder="Acme Inc."
          className="w-full rounded-xl px-4 py-3 text-[14px] outline-none transition-all duration-150"
          style={inputStyle}
          onFocus={(e) => {
            e.target.style.border = '1px solid #6366F1'
            e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.12)'
          }}
          onBlur={(e) => {
            e.target.style.border = '1px solid rgba(255,255,255,0.06)'
            e.target.style.boxShadow = 'none'
          }}
        />
      </div>

      {/* Industry */}
      <div>
        <label className="block text-[12px] font-semibold uppercase tracking-widest mb-2" style={{ color: '#475569' }}>
          Industry <span style={{ color: '#6366F1' }}>*</span>
        </label>
        <SelectCard
          options={INDUSTRIES}
          value={form.industry}
          onChange={(v) => setField('industry', v)}
          columns={3}
        />
      </div>

      {/* Support language */}
      <div>
        <label className="block text-[12px] font-semibold uppercase tracking-widest mb-1" style={{ color: '#475569' }}>
          Support language <span style={{ color: '#6366F1' }}>*</span>
        </label>
        <p className="text-[12px] mb-2" style={{ color: '#475569' }}>
          AI will respond to your customers in this language
        </p>
        <SelectCard
          options={LANGUAGES}
          value={form.primary_language}
          onChange={(v) => setField('primary_language', v)}
          columns={2}
        />
      </div>
    </div>
  )
}
