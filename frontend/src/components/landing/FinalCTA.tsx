import Link from 'next/link'
import ScrollReveal from '@/components/ui/ScrollReveal'

export default function FinalCTA() {
  return (
    <section className="py-[140px] relative overflow-hidden" style={{ background: 'var(--bg-base)' }}>
      {/* Outer radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, rgba(99,102,241,0.18) 0%, transparent 65%)',
        }}
      />

      <div className="relative z-10 max-w-[760px] mx-auto px-6">
        <ScrollReveal>
          {/* Glowing card */}
          <div
            className="relative rounded-3xl px-10 py-16 sm:px-16 text-center overflow-hidden"
            style={{
              background: 'rgba(10, 15, 30, 0.8)',
              border: '1px solid rgba(99,102,241,0.25)',
              boxShadow: '0 0 80px rgba(99,102,241,0.18), 0 32px 80px rgba(0,0,0,0.5), inset 0 0 80px rgba(99,102,241,0.03)',
            }}
          >
            {/* Top glow line */}
            <div
              className="absolute top-0 left-1/4 right-1/4 h-px"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.9), transparent)' }}
            />
            {/* Bottom glow line */}
            <div
              className="absolute bottom-0 left-1/3 right-1/3 h-px"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.5), transparent)' }}
            />
            {/* Corner orbs */}
            <div
              className="absolute -top-20 -left-20 w-48 h-48 rounded-full pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)' }}
            />
            <div
              className="absolute -bottom-20 -right-20 w-48 h-48 rounded-full pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)' }}
            />

            {/* Content */}
            <p className="text-[12px] font-semibold tracking-[0.1em] uppercase mb-5" style={{ color: '#6366F1' }}>
              Get Started Today
            </p>

            <h2
              className="font-sora font-extrabold mb-5"
              style={{ fontSize: 'clamp(36px, 5vw, 60px)', letterSpacing: '-0.03em', color: '#FFFFFF', lineHeight: 1.1 }}
            >
              Your AI support agent{' '}
              <span className="gradient-text">is ready.</span>
            </h2>

            <p className="text-[18px] leading-relaxed mb-10 max-w-lg mx-auto" style={{ color: '#94A3B8' }}>
              Join 200+ businesses resolving support tickets automatically.
              Start free, no credit card required.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link
                href="/auth/register"
                className="hero-cta inline-flex items-center justify-center gap-2 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-200 hover:-translate-y-0.5"
                style={{
                  background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                  boxShadow: '0 4px 32px rgba(99,102,241,0.4)',
                  fontSize: '16px',
                }}
              >
                Start Free Trial →
              </Link>
              <a
                href="mailto:sales@supportai.app"
                className="inline-flex items-center justify-center gap-2 font-semibold px-8 py-4 rounded-xl transition-all duration-200 hover:text-white hover:border-indigo-500"
                style={{ color: '#94A3B8', border: '1px solid rgba(255,255,255,0.1)', fontSize: '16px' }}
              >
                Talk to sales
              </a>
            </div>

            <p className="text-[13px]" style={{ color: '#64748B' }}>
              🔒 SOC 2 Compliant &nbsp;•&nbsp; Cancel anytime &nbsp;•&nbsp; Setup in 20 minutes
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
