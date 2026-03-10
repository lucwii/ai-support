import Link from 'next/link'

export default function CTA() {
  return (
    <section className="py-[120px] relative overflow-hidden" style={{ background: 'var(--bg-base)' }}>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(99,102,241,0.18) 0%, transparent 60%)' }}
      />
      <div className="relative z-10 max-w-[700px] mx-auto px-6 text-center">
        <h2
          className="font-sora font-extrabold mb-5"
          style={{ fontSize: 'clamp(32px, 4vw, 52px)', letterSpacing: '-0.03em', color: '#FFFFFF', lineHeight: 1.1 }}
        >
          Start saving your team hours every week
        </h2>
        <p className="text-[18px] leading-relaxed mb-10 max-w-lg mx-auto" style={{ color: '#94A3B8' }}>
          Join early access to see how AI can transform your support workflow.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
          <Link
            href="/auth/register"
            className="inline-flex items-center justify-center gap-2 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-200 hover:-translate-y-0.5"
            style={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6)', boxShadow: '0 4px 32px rgba(99,102,241,0.4)', fontSize: '16px' }}
          >
            Get Early Access
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
          <a
            href="mailto:demo@supportai.app"
            className="inline-flex items-center justify-center gap-2 font-semibold px-8 py-4 rounded-xl transition-all duration-200 hover:text-white"
            style={{ color: '#94A3B8', border: '1px solid rgba(255,255,255,0.1)', fontSize: '16px' }}
          >
            Book a Demo
          </a>
        </div>
        <p className="text-[13px]" style={{ color: '#64748B' }}>
          No credit card required · GDPR compliant · Easy to integrate
        </p>
      </div>
    </section>
  )
}
