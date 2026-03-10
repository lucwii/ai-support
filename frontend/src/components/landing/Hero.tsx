import Link from 'next/link'

function FloatingCards() {
  return (
    <div className="relative w-full max-w-[400px] mx-auto" style={{ height: '360px' }}>
      {/* Card A — Customer message */}
      <div
        className="glass-card animate-float absolute left-0 top-0 w-[280px] p-5 z-10"
      >
        {/* Card header */}
        <div className="flex items-center gap-2.5 mb-4">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
            style={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6)' }}
          >
            JL
          </div>
          <div>
            <p className="text-[13px] font-semibold text-white">Jamie L.</p>
            <p className="text-[11px]" style={{ color: '#64748B' }}>Customer Message</p>
          </div>
          <span className="ml-auto text-[11px]" style={{ color: '#64748B' }}>2 min ago</span>
        </div>
        <p className="text-[13px] leading-relaxed mb-4" style={{ color: '#CBD5E1' }}>
          Hi, I placed an order 5 days ago and it still hasn&apos;t arrived. The tracking hasn&apos;t updated either. Can you help?
        </p>
        {/* Typing indicator */}
        <div className="flex items-center gap-1.5">
          <span className="text-[11px]" style={{ color: '#64748B' }}>SupportAI is responding</span>
          <span className="w-1.5 h-1.5 rounded-full animate-typing" style={{ background: '#6366F1', display: 'inline-block' }} />
          <span className="w-1.5 h-1.5 rounded-full animate-typing-2" style={{ background: '#6366F1', display: 'inline-block' }} />
          <span className="w-1.5 h-1.5 rounded-full animate-typing-3" style={{ background: '#6366F1', display: 'inline-block' }} />
        </div>
      </div>

      {/* Card B — AI Response */}
      <div
        className="glass-card animate-float-delay absolute right-0 bottom-0 w-[300px] p-5 z-20"
        style={{ boxShadow: '0 8px 48px rgba(0,0,0,0.5), 0 0 40px rgba(99,102,241,0.12)' }}
      >
        {/* AI badge */}
        <div className="flex items-center justify-between mb-3">
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold"
            style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)', color: '#10B981' }}
          >
            <span className="w-1.5 h-1.5 rounded-full animate-pulse-dot" style={{ background: '#10B981', display: 'inline-block' }} />
            SupportAI resolved this
          </div>
          <span className="text-[11px]" style={{ color: '#64748B' }}>&lt; 2 seconds</span>
        </div>

        {/* Confidence */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-medium" style={{ color: '#64748B' }}>Confidence</span>
            <span className="text-[12px] font-bold" style={{ color: '#10B981' }}>96%</span>
          </div>
          <div className="h-1.5 rounded-full" style={{ background: '#1E293B' }}>
            <div
              className="h-1.5 rounded-full"
              style={{ width: '96%', background: 'linear-gradient(90deg, #10B981, #06B6D4)' }}
            />
          </div>
        </div>

        <p className="text-[13px] leading-relaxed" style={{ color: '#CBD5E1' }}>
          Hi! I&apos;m sorry to hear about the delay. Based on your order date, your package is expected to arrive within 2 more business days. I&apos;ve flagged your order for priority tracking...
        </p>

        {/* Status badge */}
        <div className="mt-3 pt-3 flex items-center gap-2" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <span
            className="text-[11px] font-semibold uppercase px-2.5 py-0.5 rounded-md"
            style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)', color: '#10B981' }}
          >
            auto_answered
          </span>
          <span className="text-[11px]" style={{ color: '#64748B' }}>No agent needed</span>
        </div>
      </div>
    </div>
  )
}

export default function Hero() {
  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ background: 'var(--bg-base)' }}
    >
      {/* Gradient orbs */}
      <div
        className="animate-orb absolute pointer-events-none"
        style={{
          top: '-10%', left: '-10%',
          width: 700, height: 700,
          background: 'radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 65%)',
          filter: 'blur(60px)',
        }}
      />
      <div
        className="animate-orb-slow absolute pointer-events-none"
        style={{
          bottom: '-20%', right: '-10%',
          width: 600, height: 600,
          background: 'radial-gradient(circle, rgba(139,92,246,0.14) 0%, transparent 65%)',
          filter: 'blur(80px)',
        }}
      />

      {/* Dot grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px)',
          backgroundSize: '36px 36px',
          maskImage: 'radial-gradient(ellipse at center, black 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 max-w-[1200px] mx-auto px-6 py-32 w-full grid md:grid-cols-[55%_45%] gap-12 items-center">
        {/* Left — copy */}
        <div>
          {/* Badge */}
          <div
            className="animate-fade-up inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-7 text-[12px] font-semibold tracking-[0.08em] uppercase"
            style={{
              background: 'rgba(99,102,241,0.1)',
              border: '1px solid rgba(99,102,241,0.3)',
              color: '#818CF8',
              animationDelay: '0ms',
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full animate-pulse-dot" style={{ background: '#6366F1', display: 'inline-block' }} />
            ✦ AI-Powered Customer Support
          </div>

          {/* Headline */}
          <h1
            className="animate-fade-up font-sora font-extrabold leading-[1.08] mb-6"
            style={{
              fontSize: 'clamp(40px, 5.5vw, 72px)',
              letterSpacing: '-0.03em',
              animationDelay: '80ms',
            }}
          >
            Resolve 90% of
            <br />
            support tickets{' '}
            <span className="gradient-text">automatically.</span>
          </h1>

          {/* Sub */}
          <p
            className="animate-fade-up text-[18px] leading-[1.75] mb-9 max-w-[480px]"
            style={{ color: '#CBD5E1', animationDelay: '160ms' }}
          >
            SupportAI learns from your documentation and answers customer questions instantly —
            with confidence scores your team can trust.
          </p>

          {/* CTAs */}
          <div className="animate-fade-up flex flex-col sm:flex-row gap-3 mb-6" style={{ animationDelay: '240ms' }}>
            <Link
              href="/auth/register"
              className="hero-cta group inline-flex items-center justify-center gap-2 text-white font-semibold px-7 py-3.5 rounded-xl transition-all duration-200 hover:-translate-y-0.5"
              style={{
                background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                boxShadow: '0 4px 24px rgba(99,102,241,0.35)',
                fontSize: '15px',
              }}
            >
              Start Free Trial
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="transition-transform group-hover:translate-x-0.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center gap-1.5 font-medium px-7 py-3.5 rounded-xl transition-all duration-200 hover:text-white group"
              style={{ color: '#94A3B8', fontSize: '15px' }}
            >
              See how it works
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="transition-transform group-hover:translate-x-0.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          </div>

          {/* Trust line */}
          <p
            className="animate-fade-up text-[13px]"
            style={{ color: '#64748B', animationDelay: '320ms' }}
          >
            <span style={{ color: '#F59E0B' }}>★★★★★</span>
            {'  '}Trusted by 200+ businesses
            {'  '}•{'  '}No credit card required
          </p>
        </div>

        {/* Right — floating cards */}
        <div className="animate-fade-up hidden md:flex justify-center" style={{ animationDelay: '200ms' }}>
          <FloatingCards />
        </div>
      </div>
    </section>
  )
}
