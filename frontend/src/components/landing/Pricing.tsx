'use client'

import { useState } from 'react'
import Link from 'next/link'
import ScrollReveal from '@/components/ui/ScrollReveal'

const tiers = [
  {
    name: 'Starter',
    monthly: 0,
    annual: 0,
    subtitle: 'For teams just getting started',
    features: ['100 tickets / month', '1 knowledge base', '1 agent seat', 'Email support', 'Basic analytics'],
    cta: 'Start Free',
    ctaHref: '/auth/register',
    featured: false,
  },
  {
    name: 'Growth',
    monthly: 49,
    annual: 39,
    subtitle: 'For growing support teams',
    badge: 'Most Popular',
    features: ['2,000 tickets / month', 'Unlimited knowledge bases', '5 agent seats', 'Priority support', 'Advanced analytics', 'AI confidence tuning'],
    cta: 'Start Free Trial',
    ctaHref: '/auth/register',
    featured: true,
  },
  {
    name: 'Scale',
    monthly: 149,
    annual: 119,
    subtitle: 'For high-volume operations',
    features: ['Unlimited tickets', 'Unlimited knowledge bases', 'Unlimited seats', 'Dedicated support', 'Custom AI tuning', '99.9% SLA'],
    cta: 'Contact Sales',
    ctaHref: 'mailto:sales@supportai.app',
    featured: false,
  },
]

const trustBadges = ['SOC 2 Type II', 'GDPR Compliant', '99.9% Uptime SLA']

export default function Pricing() {
  const [annual, setAnnual] = useState(false)

  return (
    <section id="pricing" className="py-[120px]" style={{ background: 'var(--bg-base)' }}>
      <div className="max-w-[1200px] mx-auto px-6">
        <ScrollReveal className="text-center mb-14">
          <p className="text-[12px] font-semibold tracking-[0.1em] uppercase mb-4" style={{ color: '#6366F1' }}>Pricing</p>
          <h2
            className="font-sora font-bold mb-4"
            style={{ fontSize: 'clamp(32px, 4vw, 48px)', letterSpacing: '-0.02em', color: '#FFFFFF' }}
          >
            Simple pricing. No surprises.
          </h2>
          <p className="text-[17px] mb-8" style={{ color: '#94A3B8' }}>
            Start free, scale as you grow. Cancel anytime.
          </p>

          {/* Toggle */}
          <div className="inline-flex items-center gap-3">
            <span className="text-[14px] font-medium" style={{ color: annual ? '#64748B' : '#F1F5F9' }}>Monthly</span>
            <button
              onClick={() => setAnnual(!annual)}
              className="relative rounded-full transition-all duration-300 focus:outline-none"
              style={{
                width: 48,
                height: 26,
                background: annual
                  ? 'linear-gradient(135deg, #6366F1, #8B5CF6)'
                  : 'transparent',
                border: annual ? 'none' : '2px solid #334155',
                boxShadow: annual ? '0 0 12px rgba(99,102,241,0.4)' : 'none',
              }}
              aria-label="Toggle billing period"
            >
              <span
                className="absolute rounded-full transition-all duration-300"
                style={{
                  width: 18,
                  height: 18,
                  top: annual ? 4 : 2,
                  left: annual ? 26 : 2,
                  background: annual ? '#FFFFFF' : '#64748B',
                  boxShadow: annual ? '0 1px 4px rgba(0,0,0,0.3)' : 'none',
                }}
              />
            </button>
            <span className="text-[14px] font-medium" style={{ color: annual ? '#F1F5F9' : '#64748B' }}>
              Annual
              <span
                className="ml-2 text-[11px] font-semibold px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(16,185,129,0.15)', color: '#10B981', border: '1px solid rgba(16,185,129,0.3)' }}
              >
                Save 20%
              </span>
            </span>
          </div>
        </ScrollReveal>

        {/* Tiers */}
        <div className="grid md:grid-cols-3 gap-5 mb-10">
          {tiers.map((tier, i) => (
            <ScrollReveal key={tier.name} delay={i * 100}>
              <div
                className="relative rounded-2xl p-8 h-full flex flex-col transition-all duration-200"
                style={{
                  background: tier.featured ? 'rgba(15,23,42,0.9)' : 'rgba(15,23,42,0.5)',
                  border: tier.featured
                    ? '1px solid rgba(99,102,241,0.5)'
                    : '1px solid rgba(255,255,255,0.06)',
                  boxShadow: tier.featured
                    ? '0 0 40px rgba(99,102,241,0.15), 0 8px 48px rgba(0,0,0,0.4)'
                    : '0 4px 32px rgba(0,0,0,0.3)',
                  transform: tier.featured ? 'translateY(-6px)' : 'none',
                }}
              >
                {/* Top gradient border for featured */}
                {tier.featured && (
                  <div
                    className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl"
                    style={{ background: 'linear-gradient(90deg, #6366F1, #8B5CF6)' }}
                  />
                )}

                {/* Badge */}
                {tier.badge && (
                  <div
                    className="inline-flex self-start mb-4 text-[11px] font-bold uppercase tracking-wide px-3 py-1 rounded-full"
                    style={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6)', color: '#FFFFFF' }}
                  >
                    {tier.badge}
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="font-sora font-bold text-[20px] mb-1" style={{ color: '#FFFFFF' }}>{tier.name}</h3>
                  <p className="text-[13px]" style={{ color: '#64748B' }}>{tier.subtitle}</p>
                </div>

                {/* Price */}
                <div className="mb-7">
                  <div className="flex items-end gap-1 mb-1">
                    <span className="font-sora font-extrabold" style={{ fontSize: '48px', lineHeight: 1, color: '#FFFFFF', letterSpacing: '-0.03em' }}>
                      ${annual ? tier.annual : tier.monthly}
                    </span>
                    <span className="text-[15px] mb-2" style={{ color: '#64748B' }}>/mo</span>
                  </div>
                  {annual && tier.annual !== tier.monthly && (
                    <p className="text-[12px]" style={{ color: '#64748B' }}>
                      Billed ${tier.annual * 12}/year
                    </p>
                  )}
                </div>

                {/* Features */}
                <ul className="flex flex-col gap-3 mb-8 flex-1">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-[14px]" style={{ color: '#CBD5E1' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link
                  href={tier.ctaHref}
                  className="block text-center text-[14px] font-semibold py-3 rounded-xl transition-all duration-150"
                  style={{
                    background: tier.featured ? 'linear-gradient(135deg, #6366F1, #8B5CF6)' : 'transparent',
                    color: tier.featured ? '#FFFFFF' : '#94A3B8',
                    border: tier.featured ? 'none' : '1px solid rgba(255,255,255,0.1)',
                  }}
                  onMouseEnter={(e) => {
                    if (!tier.featured) (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(99,102,241,0.4)'
                  }}
                  onMouseLeave={(e) => {
                    if (!tier.featured) (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.1)'
                  }}
                >
                  {tier.cta}
                </Link>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Trust badges */}
        <ScrollReveal className="flex items-center justify-center gap-6 flex-wrap">
          {trustBadges.map((badge) => (
            <div key={badge} className="flex items-center gap-2 text-[13px] font-medium" style={{ color: '#64748B' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="2">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              {badge}
            </div>
          ))}
        </ScrollReveal>
      </div>
    </section>
  )
}
