import Link from 'next/link'
import ScrollReveal from '@/components/ui/ScrollReveal'

export default function FinalCTA() {
  return (
    <section className="py-[140px] relative overflow-hidden" style={{ background: 'var(--bg-base)' }}>
      {/* Radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, rgba(99,102,241,0.2) 0%, transparent 60%)',
        }}
      />
      {/* Grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(ellipse at center, black 0%, transparent 65%)',
        }}
      />

      <div className="relative z-10 max-w-[700px] mx-auto px-6 text-center">
        <ScrollReveal>
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
              className="inline-flex items-center justify-center gap-2 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-200 hover:-translate-y-0.5"
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
        </ScrollReveal>
      </div>
    </section>
  )
}
