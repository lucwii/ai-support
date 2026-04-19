'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import OnboardingSidebar from './OnboardingSidebar'
import StepCompany from './steps/StepCompany'
import StepTeam from './steps/StepTeam'
import { STEPS } from './constants'
import { useOnboardingForm } from './hooks/useOnboardingForm'

export default function OnboardingForm() {
  const { step, form, loading, error, isStep0Valid, setField, goNext, goBack, submit } = useOnboardingForm()
  const [animating, setAnimating] = useState(false)

  useEffect(() => {
    setAnimating(true)
    const t = setTimeout(() => setAnimating(false), 300)
    return () => clearTimeout(t)
  }, [step])

  return (
    <div
      className="flex flex-col md:flex-row w-full md:rounded-2xl overflow-hidden md:max-w-[820px]"
      style={{
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 0 0 1px rgba(99,102,241,0.08), 0 32px 80px rgba(0,0,0,0.7)',
      }}
    >
      {/* Desktop sidebar */}
      <OnboardingSidebar currentStep={step} />

      {/* Right panel */}
      <div className="flex-1 flex flex-col min-w-0" style={{ background: '#0F172A' }}>

        {/* Mobile top bar */}
        <div
          className="flex md:hidden items-center justify-between px-5 py-4"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: '#080C18' }}
        >
          <Link href="/" className="inline-flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6)' }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
            </div>
            <span className="font-sora font-semibold text-[15px] text-white">Kleo</span>
          </Link>

          {/* Step dots */}
          <div className="flex items-center gap-1.5">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === step ? 20 : 6,
                  height: 6,
                  background: i < step
                    ? '#10B981'
                    : i === step
                    ? '#6366F1'
                    : 'rgba(255,255,255,0.1)',
                }}
              />
            ))}
          </div>
        </div>

        {/* Desktop browser bar */}
        <div
          className="hidden md:flex items-center px-6 py-3"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: '#080C18' }}
        >
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full" style={{ background: '#EF4444' }} />
            <div className="w-3 h-3 rounded-full" style={{ background: '#F59E0B' }} />
            <div className="w-3 h-3 rounded-full" style={{ background: '#10B981' }} />
          </div>
          <div
            className="mx-auto py-1 px-4 rounded-md font-jb text-[11px]"
            style={{ background: '#1E293B', color: '#334155' }}
          >
            app.supportai.io/onboarding
          </div>
        </div>

        {/* Step content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-8">
          <div
            className="transition-all duration-300"
            style={{
              opacity: animating ? 0 : 1,
              transform: animating ? 'translateY(8px)' : 'translateY(0)',
            }}
          >
            {/* Step header */}
            <div className="mb-6">
              <p className="text-[11px] font-semibold uppercase tracking-widest mb-1" style={{ color: '#6366F1' }}>
                Step {step + 1} of {STEPS.length}
              </p>
              <h1 className="font-sora font-bold text-[20px] sm:text-[22px] text-white" style={{ letterSpacing: '-0.02em' }}>
                {STEPS[step].title}
              </h1>
              <p className="text-[14px] mt-1" style={{ color: '#475569' }}>
                {STEPS[step].description}
              </p>
            </div>

            {/* Step fields */}
            <div>
              {step === 0 && <StepCompany form={form} setField={setField} />}
              {step === 1 && <StepTeam form={form} setField={setField} />}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div
              className="mt-5 rounded-xl px-4 py-3 text-[13px]"
              style={{
                background: 'rgba(239,68,68,0.08)',
                border: '1px solid rgba(239,68,68,0.2)',
                color: '#FCA5A5',
              }}
            >
              {error}
            </div>
          )}

          {/* Navigation */}
          <div
            className="flex items-center justify-between mt-8 pt-6"
            style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
          >
            {step > 0 ? (
              <button
                type="button"
                onClick={goBack}
                className="text-[13px] font-medium px-5 py-2.5 rounded-xl transition-all duration-150"
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: '#64748B',
                }}
              >
                Back
              </button>
            ) : (
              <div />
            )}

            {step < STEPS.length - 1 ? (
              <button
                type="button"
                disabled={!isStep0Valid}
                onClick={goNext}
                className="text-[13px] font-semibold px-6 py-2.5 rounded-xl text-white transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed"
                style={{
                  background: isStep0Valid ? 'linear-gradient(135deg, #6366F1, #8B5CF6)' : '#1E293B',
                  boxShadow: isStep0Valid ? '0 4px 16px rgba(99,102,241,0.3)' : 'none',
                }}
              >
                Continue
              </button>
            ) : (
              <button
                type="button"
                disabled={loading}
                onClick={submit}
                className="text-[13px] font-semibold px-6 py-2.5 rounded-xl text-white transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: loading ? '#4F46E5' : 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                  boxShadow: '0 4px 16px rgba(99,102,241,0.3)',
                }}
              >
                {loading ? 'Setting up...' : 'Finish setup'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
