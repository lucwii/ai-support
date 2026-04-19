import ScrollReveal from '@/components/ui/ScrollReveal'

const benefits = [
  {
    title: 'Agents stay in control',
    description: 'Edit and approve every AI-suggested response before it goes out. You decide what gets sent.',
  },
  {
    title: 'AI learns continuously',
    description: 'Every ticket improves future suggestions. The more you use it, the smarter it gets.',
  },
  {
    title: 'Reduce response times',
    description: 'Resolve 30–50% of tickets automatically with high-confidence AI responses.',
  },
  {
    title: 'Grounded in your knowledge base',
    description: 'No hallucinations — answers are always based on your own documents and data.',
  },
]

export default function Solution() {
  return (
    <section id="solution" className="py-[120px]" style={{ background: 'var(--bg-base)' }}>
      <div className="max-w-[1200px] mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
        {/* Left — copy */}
        <ScrollReveal>
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 text-[12px] font-semibold tracking-[0.08em] uppercase"
            style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.3)', color: '#818CF8' }}
          >
            The Solution
          </div>
          <h2
            className="font-sora font-bold mb-5"
            style={{ fontSize: 'clamp(30px, 3.5vw, 44px)', letterSpacing: '-0.02em', color: '#FFFFFF' }}
          >
            Automate routine tickets with AI
          </h2>
          <p className="text-[17px] leading-relaxed mb-8" style={{ color: '#94A3B8' }}>
            Kleo uses your company&apos;s own knowledge base to generate accurate response suggestions — keeping your team in control while cutting response times dramatically.
          </p>
          <ul className="flex flex-col gap-4">
            {benefits.map((b) => (
              <li key={b.title} className="flex items-start gap-3">
                <div
                  className="mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6)' }}
                >
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-[14px] mb-0.5" style={{ color: '#F1F5F9' }}>{b.title}</p>
                  <p className="text-[14px] leading-relaxed" style={{ color: '#94A3B8' }}>{b.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </ScrollReveal>

        {/* Right — visual */}
        <ScrollReveal delay={120}>
          <div className="glass-card p-6 flex flex-col gap-4">
            {/* Knowledge base card */}
            <div className="rounded-xl p-4" style={{ background: '#0A0F1E', border: '1px solid rgba(255,255,255,0.06)' }}>
              <p className="text-[11px] font-semibold uppercase tracking-widest mb-3" style={{ color: '#475569' }}>Knowledge Base</p>
              <div className="flex flex-col gap-2">
                {['product-faq.pdf', 'shipping-policy.txt', 'return-process.csv'].map((file) => (
                  <div key={file} className="flex items-center gap-3 rounded-lg px-3 py-2" style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.12)' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                    <span className="text-[12px] font-medium" style={{ color: '#CBD5E1' }}>{file}</span>
                    <span className="ml-auto text-[11px] font-semibold" style={{ color: '#10B981' }}>Indexed</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Arrow */}
            <div className="flex justify-center">
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6)' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                  <path d="M12 5v14M5 12l7 7 7-7" />
                </svg>
              </div>
            </div>

            {/* AI response card */}
            <div className="rounded-xl p-4" style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.2)' }}>
              <p className="text-[11px] font-semibold uppercase tracking-widest mb-3" style={{ color: '#6366F1' }}>AI Response Generated</p>
              <p className="text-[13px] leading-relaxed mb-3" style={{ color: '#CBD5E1' }}>
                &quot;Our return policy allows returns within 30 days of purchase. To initiate a return, visit your order history and click &apos;Return Item&apos;.&quot;
              </p>
              <div className="flex items-center justify-between">
                <span className="text-[11px]" style={{ color: '#64748B' }}>Sources: return-process.csv</span>
                <span
                  className="text-[11px] font-bold px-2 py-0.5 rounded-full"
                  style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)', color: '#10B981' }}
                >
                  97% confidence
                </span>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
