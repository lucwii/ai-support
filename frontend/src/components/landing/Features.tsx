import ScrollReveal from '@/components/ui/ScrollReveal'

const features = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" /><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
      </svg>
    ),
    title: 'Answers from your data, not the internet',
    body: 'Unlike generic AI chatbots, Kleo only answers from your uploaded knowledge base. No hallucination. No off-brand responses.',
    featured: true,
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    title: "AI that knows what it doesn't know",
    body: 'Every response comes with a confidence score. High confidence? Auto-resolved. Low confidence? Routed to your team with the AI draft ready.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" /><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
      </svg>
    ),
    title: 'Update your AI in seconds',
    body: 'Changed your return policy? Launched a new product? Paste the new docs and your AI support agent knows immediately. No retraining.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
    title: 'Full visibility for your team',
    body: 'Agents see every ticket, AI response, confidence score, and source document. One-click approve or edit. Complete audit trail.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
    title: 'Your knowledge base stays yours',
    body: "Each organization's data is completely isolated. Your knowledge base is never used to train other customers' AI agents.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    title: 'Support that never sleeps',
    body: 'Your AI agent is online at 3am, on weekends, on holidays. Customers in every timezone get instant answers without waiting.',
  },
]

export default function Features() {
  return (
    <section id="features" className="py-16 md:py-[120px]" style={{ background: 'var(--bg-base)' }}>
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Header */}
        <ScrollReveal className="text-center mb-16">
          <p className="text-[12px] font-semibold tracking-[0.1em] uppercase mb-4" style={{ color: '#6366F1' }}>
            Features
          </p>
          <h2
            className="font-sora font-bold mb-5"
            style={{ fontSize: 'clamp(32px, 4vw, 48px)', letterSpacing: '-0.02em', color: '#FFFFFF' }}
          >
            Everything your support team needs.
            <br />
            <span style={{ color: '#64748B' }}>Nothing they don&apos;t.</span>
          </h2>
        </ScrollReveal>

        {/* Grid */}
        <div className="grid md:grid-cols-3 gap-4 auto-rows-fr">
          {features.map((f, i) => (
            <ScrollReveal key={f.title} delay={i * 80} className={f.featured ? 'md:col-span-2' : ''}>
              <div
                className="glass-card p-7 h-full group cursor-default transition-all duration-200 hover:-translate-y-1 relative overflow-hidden"
              >
                {/* Top gradient border for featured */}
                {f.featured && (
                  <div
                    className="absolute top-0 left-0 right-0 h-[2px]"
                    style={{ background: 'linear-gradient(90deg, #6366F1, #8B5CF6, #06B6D4)' }}
                  />
                )}

                <div className="flex items-start gap-5">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 transition-colors duration-200 group-hover:bg-[rgba(99,102,241,0.25)]"
                    style={{ background: 'rgba(99,102,241,0.15)', color: '#818CF8' }}
                  >
                    {f.icon}
                  </div>
                  <div className="flex-1">
                    <h3
                      className="font-sora font-semibold text-[17px] mb-2.5"
                      style={{ color: '#FFFFFF' }}
                    >
                      {f.title}
                    </h3>
                    <p className="text-[14px] leading-[1.75]" style={{ color: '#94A3B8' }}>
                      {f.body}
                    </p>

                    {/* Featured extra visual */}
                    {f.featured && (
                      <div className="mt-4 flex gap-2 flex-wrap">
                        {['RAG Pipeline', 'Vector Search', 'Zero Hallucination', 'Your Data Only'].map((tag) => (
                          <span
                            key={tag}
                            className="text-[11px] font-medium px-2.5 py-1 rounded-md"
                            style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', color: '#818CF8' }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
