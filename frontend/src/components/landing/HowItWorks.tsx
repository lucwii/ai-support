import ScrollReveal from '@/components/ui/ScrollReveal'

const steps = [
  {
    number: '01',
    title: 'Upload your docs',
    body: 'Paste your FAQs, policies, product documentation, or any text. Kleo automatically splits and indexes everything instantly.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" y1="3" x2="12" y2="15" />
      </svg>
    ),
    color: '#6366F1',
    detail: (
      <div className="mt-4 rounded-lg p-3 font-jb text-[11px] leading-relaxed" style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.15)', color: '#818CF8' }}>
        <span style={{ color: '#475569' }}>// Pasting knowledge base...</span>
        <br />
        <span>Indexing: <span style={{ color: '#10B981' }}>✓ 142 chunks</span></span>
        <br />
        <span>Status: <span style={{ color: '#10B981' }}>Ready</span></span>
      </div>
    ),
  },
  {
    number: '02',
    title: 'AI learns your business',
    body: 'Our RAG engine creates semantic embeddings from your content. The AI now knows your products, policies, and tone — instantly.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a10 10 0 0 1 10 10 10 10 0 0 1-10 10A10 10 0 0 1 2 12 10 10 0 0 1 12 2z" />
        <path d="M12 6v6l4 2" />
      </svg>
    ),
    color: '#8B5CF6',
    detail: (
      <div className="mt-4 flex items-center gap-3 flex-wrap">
        {['product-faq', 'shipping-policy', 'return-process', 'pricing'].map((doc) => (
          <span
            key={doc}
            className="text-[11px] font-medium px-2.5 py-1 rounded-md"
            style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)', color: '#A78BFA' }}
          >
            {doc}
          </span>
        ))}
      </div>
    ),
  },
  {
    number: '03',
    title: 'Tickets resolve themselves',
    body: 'Customer sends a question. AI finds the right answer from your docs and responds instantly — with a confidence score your team can trust.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
    color: '#06B6D4',
    detail: (
      <div className="mt-4 flex items-center gap-2">
        <span
          className="text-[11px] font-semibold uppercase px-2.5 py-1 rounded-md animate-pulse-dot"
          style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)', color: '#10B981' }}
        >
          ✓ Auto Resolved
        </span>
        <span className="text-[12px] font-bold" style={{ color: '#06B6D4' }}>96% confidence</span>
      </div>
    ),
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16 md:py-[120px]" style={{ background: 'var(--bg-navy)' }}>
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Header */}
        <ScrollReveal className="text-center mb-16">
          <p className="text-[12px] font-semibold tracking-[0.1em] uppercase mb-4" style={{ color: '#6366F1' }}>
            Get Started in Minutes
          </p>
          <h2
            className="font-sora font-bold mb-5"
            style={{ fontSize: 'clamp(32px, 4vw, 48px)', letterSpacing: '-0.02em', color: '#FFFFFF' }}
          >
            From docs to AI support agent
            <br />
            <span className="gradient-text">in 3 steps</span>
          </h2>
          <p className="text-[17px] max-w-xl mx-auto leading-relaxed" style={{ color: '#94A3B8' }}>
            No complex integrations. No coding required. Just paste your docs and go.
          </p>
        </ScrollReveal>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-5 relative">
          {/* Connector SVG — desktop only */}
          <div className="hidden md:block absolute top-12 left-[33%] right-[33%] pointer-events-none z-0" style={{ height: '2px' }}>
            <svg width="100%" height="2" viewBox="0 0 100 2" preserveAspectRatio="none">
              <line
                x1="0" y1="1" x2="100" y2="1"
                stroke="rgba(99,102,241,0.3)"
                strokeWidth="1"
                strokeDasharray="5 4"
                className="animate-dash"
                style={{ strokeDashoffset: 0 }}
              />
            </svg>
          </div>

          {steps.map((step, i) => (
            <ScrollReveal key={step.number} delay={i * 120}>
              <div
                className="glass-card p-7 relative z-10 h-full transition-all duration-200"
              >
                {/* Number + icon */}
                <div className="flex items-center justify-between mb-5">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center"
                    style={{ background: `${step.color}1A`, color: step.color }}
                  >
                    {step.icon}
                  </div>
                  <span
                    className="text-[40px] font-sora font-extrabold leading-none"
                    style={{ color: 'rgba(255,255,255,0.05)', letterSpacing: '-0.03em' }}
                  >
                    {step.number}
                  </span>
                </div>

                <h3
                  className="font-sora font-semibold text-[18px] mb-3"
                  style={{ color: '#FFFFFF' }}
                >
                  {step.title}
                </h3>
                <p className="text-[14px] leading-[1.75]" style={{ color: '#94A3B8' }}>
                  {step.body}
                </p>
                {step.detail}
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
