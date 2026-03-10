import ScrollReveal from '@/components/ui/ScrollReveal'

const problems = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    title: 'Hours lost to repetitive questions',
    description: 'Customer support teams spend hours answering the same questions day after day — password resets, shipping status, billing inquiries.',
    color: '#EF4444',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    title: 'Small teams, big ticket volume',
    description: 'Manual ticket handling slows response times and burns out agents — especially when your team is small but your customer base is growing.',
    color: '#F59E0B',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
    title: 'Inconsistent response quality',
    description: 'Different agents give different answers to the same questions. Without a single source of truth, quality and tone drift over time.',
    color: '#8B5CF6',
  },
]

export default function Problem() {
  return (
    <section className="py-[120px]" style={{ background: 'var(--bg-navy)' }}>
      <div className="max-w-[1200px] mx-auto px-6">
        <ScrollReveal className="text-center mb-14">
          <p className="text-[12px] font-semibold tracking-[0.1em] uppercase mb-4" style={{ color: '#EF4444' }}>
            The Problem
          </p>
          <h2
            className="font-sora font-bold mb-5"
            style={{ fontSize: 'clamp(32px, 4vw, 48px)', letterSpacing: '-0.02em', color: '#FFFFFF' }}
          >
            Support teams spend too much time
            <br />
            on repetitive questions
          </h2>
          <p className="text-[17px] max-w-xl mx-auto leading-relaxed" style={{ color: '#94A3B8' }}>
            The bottleneck isn&apos;t your team — it&apos;s the process.
          </p>
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-5">
          {problems.map((item, i) => (
            <ScrollReveal key={item.title} delay={i * 100}>
              <div className="glass-card p-7 h-full">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-5"
                  style={{ background: `${item.color}1A`, color: item.color }}
                >
                  {item.icon}
                </div>
                <h3 className="font-sora font-semibold text-[17px] mb-3" style={{ color: '#FFFFFF' }}>
                  {item.title}
                </h3>
                <p className="text-[14px] leading-[1.75]" style={{ color: '#94A3B8' }}>
                  {item.description}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
