import SelectCard from '../SelectCard'
import { TEAM_SIZES, MONTHLY_TICKETS } from '../constants'
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

export default function StepTeam({ form, setField }: Props) {
  return (
    <div className="flex flex-col gap-6">
      {/* Team size */}
      <div>
        <label className="block text-[12px] font-semibold uppercase tracking-widest mb-1" style={{ color: '#475569' }}>
          Team size
          <span className="ml-2 normal-case text-[11px] font-normal" style={{ color: '#334155' }}>optional</span>
        </label>
        <SelectCard
          options={TEAM_SIZES}
          value={form.team_size}
          onChange={(v) => setField('team_size', v)}
          columns={2}
        />
      </div>

      {/* Monthly tickets */}
      <div>
        <label className="block text-[12px] font-semibold uppercase tracking-widest mb-1" style={{ color: '#475569' }}>
          Monthly support tickets
          <span className="ml-2 normal-case text-[11px] font-normal" style={{ color: '#334155' }}>optional</span>
        </label>
        <SelectCard
          options={MONTHLY_TICKETS}
          value={form.monthly_tickets}
          onChange={(v) => setField('monthly_tickets', v)}
          columns={2}
        />
      </div>

      {/* Website */}
      <div>
        <label className="block text-[12px] font-semibold uppercase tracking-widest mb-1" style={{ color: '#475569' }}>
          Website
          <span className="ml-2 normal-case text-[11px] font-normal" style={{ color: '#334155' }}>optional</span>
        </label>
        <input
          type="url"
          value={form.website}
          onChange={(e) => setField('website', e.target.value)}
          placeholder="https://yourcompany.com"
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
    </div>
  )
}
