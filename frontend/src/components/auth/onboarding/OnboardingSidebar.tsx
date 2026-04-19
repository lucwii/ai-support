import Link from 'next/link'
import { STEPS } from './constants'

interface Props {
  currentStep: number
}

export default function OnboardingSidebar({ currentStep }: Props) {
  return (
    <div
      className="hidden md:flex w-[240px] shrink-0 flex-col p-8"
      style={{
        background: '#0A0F1E',
        borderRight: '1px solid rgba(255,255,255,0.05)',
      }}
    >
      {/* Logo */}
      <Link href="/" className="inline-flex items-center gap-2.5 mb-10">
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6)' }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
        </div>
        <span className="font-sora font-semibold text-[16px] text-white">Kleo</span>
      </Link>

      {/* Heading */}
      <div className="mb-8">
        <h2 className="font-sora font-bold text-[18px] text-white mb-1">
          Set up your workspace
        </h2>
        <p className="text-[13px]" style={{ color: '#475569' }}>
          Takes less than 2 minutes
        </p>
      </div>

      {/* Steps */}
      <div className="flex flex-col gap-1">
        {STEPS.map((s, i) => {
          const done   = i < currentStep
          const active = i === currentStep

          return (
            <div key={i} className="flex items-start gap-3 py-2.5">
              <div className="mt-0.5 shrink-0">
                {done ? (
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center"
                    style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.4)' }}
                  >
                    <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l3 3 5-5" stroke="#10B981" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                ) : active ? (
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center"
                    style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid #6366F1' }}
                  >
                    <div className="w-2 h-2 rounded-full" style={{ background: '#6366F1' }} />
                  </div>
                ) : (
                  <div
                    className="w-5 h-5 rounded-full"
                    style={{ border: '1px solid rgba(255,255,255,0.1)' }}
                  />
                )}
              </div>

              <div>
                <p
                  className="text-[13px] font-medium leading-tight"
                  style={{ color: done ? '#10B981' : active ? '#F1F5F9' : '#334155' }}
                >
                  {s.title}
                </p>
                <p className="text-[12px] mt-0.5" style={{ color: '#334155' }}>
                  {s.description}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Bottom note */}
      <div className="mt-auto pt-8">
        <div
          className="rounded-xl p-4"
          style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.15)' }}
        >
          <p className="text-[12px] leading-relaxed" style={{ color: '#475569' }}>
            Your AI will use these settings to respond to customers in the right language and tone.
          </p>
        </div>
      </div>
    </div>
  )
}
